import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards
} from '@nestjs/common';
import { LivresService } from './livres.service';
import { CreateLivreDto } from './dto/create-livre.dto';
import { UpdateLivreDto } from './dto/update-livre.dto';
import { JwtAuthGuard } from '../auth/jtw-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Livres')
@Controller('livres')
export class LivresController {
  constructor(private livresService: LivresService) {}

  // ── Public ──
  @Get()
  @ApiOperation({ summary: 'Liste tous les livres' })
  findAll() {
    return this.livresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d un livre' })
  findOne(@Param('id') id: string) {
    return this.livresService.findOne(+id);
  }

  // ── Admin uniquement ──
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un livre (admin)' })
  create(@Body() dto: CreateLivreDto) {
    return this.livresService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un livre (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateLivreDto) {
    return this.livresService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un livre (admin)' })
  remove(@Param('id') id: string) {
    return this.livresService.remove(+id);
  }
}