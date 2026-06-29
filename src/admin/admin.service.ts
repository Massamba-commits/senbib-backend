import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmpruntsService } from '../emprunts/emprunts.service';
import { LivresService } from '../livres/livres.service';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private empruntsService: EmpruntsService,
    private livresService: LivresService,
  ) {}

  // ── Tous les utilisateurs ──
  async getAllUsers() {
    const users = await this.usersService.findAll();
    // Cacher les mots de passe
    return users.map(({ password, ...user }) => user);
  }

  // ── Supprimer un utilisateur ──
  async deleteUser(id: number) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    await this.usersService.delete(id);
    return { message: 'Utilisateur supprimé avec succès' };
  }

  // ── Tous les emprunts ──
  async getAllEmprunts() {
    return this.empruntsService.findAll();
  }

  // ── Stats globales ──
  async getStats() {
    const users    = await this.usersService.findAll();
    const livres   = await this.livresService.findAll();
    const emprunts = await this.empruntsService.findAll();

    return {
      totalUsers:       users.length,
      totalLivres:      livres.length,
      livresDisponibles: livres.filter(l => l.disponible).length,
      livresEmpruntes:  livres.filter(l => !l.disponible).length,
      totalEmprunts:    emprunts.length,
      empruntsEnCours:  emprunts.filter(e => e.statut === 'en_cours').length,
      empruntsEnRetard: emprunts.filter(e => e.statut === 'en_retard').length,
      empruntsRetournes: emprunts.filter(e => e.statut === 'retourne').length,
    };
  }
}