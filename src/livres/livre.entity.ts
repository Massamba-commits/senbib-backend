import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('livres')
export class Livre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column()
  auteur: string;

  @Column()
  genre: string;

  @Column()
  annee: number;

  @Column({ default: 3 })
  stock: number;

  @Column({ default: true })
  disponible: boolean;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;
}
