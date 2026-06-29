import {
  Injectable, NotFoundException, BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emprunt, StatutEmprunt } from './emprunt.entity';
import { CreateEmpruntDto } from './dto/create-emprunt.dto';
import { LivresService } from '../livres/livres.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmpruntsService {
  constructor(
    @InjectRepository(Emprunt)
    private empruntsRepo: Repository<Emprunt>,
    private livresService: LivresService,
    private usersService: UsersService,
  ) {}

  // ── Emprunter un livre ──
  async create(dto: CreateEmpruntDto, userId: number): Promise<Emprunt> {
    const livre = await this.livresService.findOne(dto.livreId);
    if (!livre.disponible || livre.stock <= 0)
      throw new BadRequestException('Ce livre n\'est pas disponible');

    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    // Décrémenter le stock
    await this.livresService.decrementerStock(dto.livreId);

    // Date de retour prévue = aujourd'hui + 15 jours
    const dateRetourPrevue = new Date();
    dateRetourPrevue.setDate(dateRetourPrevue.getDate() + 15);

    const emprunt = this.empruntsRepo.create({
      user,
      livre,
      dateRetourPrevue,
      statut: StatutEmprunt.EN_COURS,
    });

    return this.empruntsRepo.save(emprunt);
  }

  // ── Mes emprunts (user connecté) ──
  async findMesEmprunts(userId: number): Promise<Emprunt[]> {
    return this.empruntsRepo.find({
      where: { user: { id: userId } },
      order: { dateEmprunt: 'DESC' },
    });
  }

  // ── Tous les emprunts (admin) ──
  async findAll(): Promise<Emprunt[]> {
    return this.empruntsRepo.find({
      order: { dateEmprunt: 'DESC' },
    });
  }

  // ── Retourner un livre ──
  async retourner(id: number, userId: number): Promise<Emprunt> {
    const emprunt = await this.empruntsRepo.findOne({
      where: { id },
      relations: ['user', 'livre'],
    });

    if (!emprunt) throw new NotFoundException('Emprunt non trouvé');
    if (emprunt.user.id !== userId)
      throw new BadRequestException('Cet emprunt ne vous appartient pas');
    if (emprunt.statut === StatutEmprunt.RETOURNE)
      throw new BadRequestException('Ce livre est déjà retourné');

    // Incrémenter le stock
    await this.livresService.incrementerStock(emprunt.livre.id);

    emprunt.dateRetourEffective = new Date();
    emprunt.statut = StatutEmprunt.RETOURNE;

    return this.empruntsRepo.save(emprunt);
  }

  // ── Mettre à jour les statuts en retard ──
  async updateStatuts(): Promise<void> {
    const emprunts = await this.empruntsRepo.find({
      where: { statut: StatutEmprunt.EN_COURS },
    });

    const now = new Date();
    for (const emprunt of emprunts) {
      if (new Date(emprunt.dateRetourPrevue) < now) {
        emprunt.statut = StatutEmprunt.EN_RETARD;
        await this.empruntsRepo.save(emprunt);
      }
    }
  }
}