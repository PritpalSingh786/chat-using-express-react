// src/entities/User.ts
import { Entity, Column, OneToMany } from "typeorm";
import { CommonEntity } from "./CommonEntity";
import { PostEntity } from "./PostEntity";

@Entity()
export class User extends CommonEntity {
  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isLogin: boolean;

  @Column({ nullable: true })
  connectionId: string;

  // Reverse relation to posts
  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];
}
