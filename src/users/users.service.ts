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

  sanitize(user: User) {
    const { password, ...rest } = user;
    return rest;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email: email.toLowerCase() } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findAll(): Promise<any[]> {
    const users = await this.usersRepo.find();
    return users.map(u => this.sanitize(u));
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepo.create({
      ...data,
      email: data.email?.toLowerCase(),
    });
    return this.usersRepo.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepo.delete(id);
  }

  async updatePassword(id: number, hash: string): Promise<void> {
    await this.usersRepo.update(id, { password: hash });
  }
}