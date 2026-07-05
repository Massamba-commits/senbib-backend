import { Entity,PrimaryGeneratedColumn,Column } from "typeorm";

@Entity('reset_tokens')
export class ResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  email: string;

    @Column()
    expires: Date;

    @Column()
    used: boolean;
}