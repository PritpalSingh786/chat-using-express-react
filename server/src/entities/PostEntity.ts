// src/entities/PostEntity.ts
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CommonEntity } from "./CommonEntity";
import { User } from "./User";

@Entity()
export class PostEntity extends CommonEntity {
  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  filePath: string[];

  // Foreign key to User
  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string; // This will act as the actual foreign key column
}
