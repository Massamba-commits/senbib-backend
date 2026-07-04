import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  // Stockage temporaire des tokens (en prod : utiliser Redis ou DB)
  private resetTokens = new Map<string, { email: string; expires: Date }>()

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email déjà utilisé');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      nom: dto.nom, email: dto.email, password: hash, role: dto.role,
    });

    // Email de bienvenue
   try {
  await this.mailService.sendWelcome(user.email, user.nom);
} catch (e: Error | unknown) {
  console.error('Email bienvenue non envoyé:', (e as Error)?.message);
}

    const { password, ...userSansPassword } = user;
    return { message: 'Compte créé avec succès', user: userSansPassword };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token   = this.jwtService.sign(payload);
    const { password, ...userSansPassword } = user;
    return { access_token: token, user: userSansPassword };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Aucun compte associé à cet email');

    // Générer un token sécurisé
    const token   = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    this.resetTokens.set(token, { email, expires });

    // Envoyer l'email
    await this.mailService.sendResetPassword(email, user.nom, token);

    return { message: 'Email de réinitialisation envoyé' };
  }

  async resetPassword(token: string, newPassword: string) {
    const data = this.resetTokens.get(token);
    if (!data || data.expires < new Date()) {
      throw new UnauthorizedException('Lien expiré ou invalide');
    }

    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const hash = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, hash);
    this.resetTokens.delete(token);

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}