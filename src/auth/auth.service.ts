import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Vérifier si email existe déjà
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email déjà utilisé');

    // Hasher le mot de passe
    const hash = await bcrypt.hash(dto.password, 10);

    // Créer l'utilisateur
    const user = await this.usersService.create({
      nom: dto.nom,
      email: dto.email,
      password: hash,
      role: dto.role,
    });

    return { message: 'Compte créé avec succès', userId: user.id };
  }

  async login(dto: LoginDto) {
    // Vérifier email
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    // Vérifier mot de passe
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe incorrect');

    // Générer le token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role },
    };
  }
}