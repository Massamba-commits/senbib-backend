import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from '../users/user.entity';
import { Livre } from '../livres/livre.entity';

export enum StatutEmprunt {
  EN_COURS = 'en_cours',
  EN_RETARD = 'en_retard',
  RETOURNE = 'retourne',
}

@Entity('emprunts')
export class Emprunt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Livre, { eager: true })
  @JoinColumn({ name: 'livreId' })
  livre: Livre;

  @CreateDateColumn()
  dateEmprunt: Date;

  @Column()
  dateRetourPrevue: Date;

  @Column({ nullable: true })
  dateRetourEffective: Date;

  @Column({
    type: 'enum',
    enum: StatutEmprunt,
    default: StatutEmprunt.EN_COURS,
  })
  statut: StatutEmprunt;
}