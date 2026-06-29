import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jtw-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ── Tous les utilisateurs ──
  @Get('users')
  @ApiOperation({ summary: 'Liste tous les utilisateurs (admin)' })
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  // ── Supprimer un utilisateur ──
  @Delete('users/:id')
  @ApiOperation({ summary: 'Supprimer un utilisateur (admin)' })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(+id);
  }

  // ── Tous les emprunts ──
  @Get('emprunts')
  @ApiOperation({ summary: 'Tous les emprunts (admin)' })
  getAllEmprunts() {
    return this.adminService.getAllEmprunts();
  }

  // ── Stats globales ──
  @Get('stats')
  @ApiOperation({ summary: 'Statistiques globales (admin)' })
  getStats() {
    return this.adminService.getStats();
  }
}