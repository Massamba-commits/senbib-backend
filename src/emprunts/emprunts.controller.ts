import {
  Controller, Get, Post, Patch,
  Param, Body, UseGuards, Request
} from '@nestjs/common';
import { EmpruntsService } from './emprunts.service';
import { CreateEmpruntDto } from './dto/create-emprunt.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Emprunts')
@Controller('emprunts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmpruntsController {
  constructor(private empruntsService: EmpruntsService) {}

  // ── Emprunter un livre ──
  @Post()
  @ApiOperation({ summary: 'Emprunter un livre' })
  create(@Body() dto: CreateEmpruntDto, @Request() req) {
    return this.empruntsService.create(dto, req.user.id);
  }

  // ── Mes emprunts ──
  @Get('mes-emprunts')
  @ApiOperation({ summary: 'Voir mes emprunts' })
  mesEmprunts(@Request() req) {
    return this.empruntsService.findMesEmprunts(req.user.id);
  }

  // ── Retourner un livre ──
  @Patch(':id/retourner')
  @ApiOperation({ summary: 'Retourner un livre' })
  retourner(@Param('id') id: string, @Request() req) {
    return this.empruntsService.retourner(+id, req.user.id);
  }

  // ── Tous les emprunts (admin) ──
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Tous les emprunts (admin)' })
  findAll() {
    return this.empruntsService.findAll();
  }
}