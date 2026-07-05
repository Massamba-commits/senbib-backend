import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

class ForgotPasswordDto {
  @IsEmail()
  email: string = ''
}

class ResetPasswordDto {
  @IsString()
  token: string = ''

  @IsString()
  @MinLength(6)
  newPassword: string = ''
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un compte' })
  register(@Body() dto: RegisterDto) { return this.authService.register(dto) }

  @Post('login')
  @ApiOperation({ summary: 'Se connecter' })
  login(@Body() dto: LoginDto) { return this.authService.login(dto) }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Demander une réinitialisation' })
  forgotPassword(@Body() dto: ForgotPasswordDto) { return this.authService.forgotPassword(dto.email) }

  @Post('reset-password')
  @ApiOperation({ summary: 'Réinitialiser le mot de passe' })
  resetPassword(@Body() dto: ResetPasswordDto) { return this.authService.resetPassword(dto.token, dto.newPassword) }
}