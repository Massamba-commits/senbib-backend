import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }


  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }
  
  async delete(id: number): Promise<void> {
  await this.usersRepo.delete(id);
}

// Ajouter cette méthode
sanitize(user: User) {
  const { password, ...rest } = user;
  return rest;
}



}