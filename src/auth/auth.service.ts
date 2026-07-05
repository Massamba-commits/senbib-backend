import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';
import { ResetToken } from './Reset-Token.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectRepository(ResetToken)
    private resetTokenRepo: Repository<ResetToken>,
  ) {}

  async register(dto: RegisterDto) {
    const email  = dto.email.toLowerCase()
    const exists = await this.usersService.findByEmail(email)
    if (exists) throw new ConflictException('Email déjà utilisé')

    const hash = await bcrypt.hash(dto.password, 10)
    const user = await this.usersService.create({
      nom: dto.nom, email, password: hash, role: dto.role,
    })

    try {
      await this.mailService.sendWelcome(user.email, user.nom)
    } catch (e) {
      console.error('Email bienvenue non envoyé:', e.message)
    }

    const { password, ...userSansPassword } = user
    return { message: 'Compte créé avec succès', user: userSansPassword }
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase()
    const user  = await this.usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect')

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('Email ou mot de passe incorrect')

    const payload = { sub: user.id, email: user.email, role: user.role }
    const token   = this.jwtService.sign(payload)
    const { password, ...userSansPassword } = user
    return { access_token: token, user: userSansPassword }
  }

  async forgotPassword(email: string) {
    const emailNorm = email.toLowerCase()
    const user = await this.usersService.findByEmail(emailNorm)
    if (!user) throw new NotFoundException('Aucun compte associé à cet email')

    // Supprimer les anciens tokens de cet email
    await this.resetTokenRepo.delete({ email: emailNorm })

    // Créer un nouveau token en base
    const token   = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

    await this.resetTokenRepo.save({
      token, email: emailNorm, expires, used: false,
    })

    await this.mailService.sendResetPassword(emailNorm, user.nom, token)
   return {
  message: 'Email de réinitialisation envoyé',
  debug_token: token,
  debug_url: `http://localhost:5173/Bibliotheque/reset-password?token=${token}`
}
  }

  async resetPassword(token: string, newPassword: string) {
    // Chercher le token en base
    const resetToken = await this.resetTokenRepo.findOne({ where: { token } })

    if (!resetToken) throw new UnauthorizedException('Lien invalide')
    if (resetToken.used) throw new UnauthorizedException('Lien déjà utilisé')
    if (resetToken.expires < new Date()) throw new UnauthorizedException('Lien expiré')

    const user = await this.usersService.findByEmail(resetToken.email)
    if (!user) throw new NotFoundException('Utilisateur non trouvé')

    // Mettre à jour le mot de passe
    const hash = await bcrypt.hash(newPassword, 10)
    await this.usersService.updatePassword(user.id, hash)

    // Marquer le token comme utilisé
    await this.resetTokenRepo.update(resetToken.id, { used: true })

    return { message: 'Mot de passe réinitialisé avec succès' }
  }
}