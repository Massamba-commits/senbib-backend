import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livre } from './livre.entity';
import { CreateLivreDto } from './dto/create-livre.dto';
import { UpdateLivreDto } from './dto/update-livre.dto';

@Injectable()
export class LivresService {
  constructor(
    @InjectRepository(Livre)
    private livresRepo: Repository<Livre>,
  ) {}

  async findAll(): Promise<Livre[]> {
    return this.livresRepo.find();
  }

  async findOne(id: number): Promise<Livre> {
    const livre = await this.livresRepo.findOne({ where: { id } });
    if (!livre) throw new NotFoundException('Livre non trouvé');
    return livre;
  }

  async create(dto: CreateLivreDto): Promise<Livre> {
    const livre = this.livresRepo.create({
      ...dto,
      stock: dto.stock ?? 3,
      disponible: (dto.stock ?? 3) > 0,
    });
    return this.livresRepo.save(livre);
  }

  async update(id: number, dto: UpdateLivreDto): Promise<Livre> {
    const livre = await this.findOne(id);
    Object.assign(livre, dto);
    livre.disponible = livre.stock > 0;
    return this.livresRepo.save(livre);
  }

  async remove(id: number): Promise<{ message: string }> {
    const livre = await this.findOne(id);
    await this.livresRepo.remove(livre);
    return { message: 'Livre supprimé avec succès' };
  }

  // ── Décrémente le stock lors d'un emprunt ──
  async decrementerStock(id: number): Promise<Livre> {
    const livre = await this.findOne(id);
    if (livre.stock <= 0) throw new NotFoundException('Livre non disponible');
    livre.stock -= 1;
    livre.disponible = livre.stock > 0;
    return this.livresRepo.save(livre);
  }

  // ── Incrémente le stock lors d'un retour ──
  async incrementerStock(id: number): Promise<Livre> {
    const livre = await this.findOne(id);
    livre.stock += 1;
    livre.disponible = livre.stock > 0;
    return this.livresRepo.save(livre);
  }
}