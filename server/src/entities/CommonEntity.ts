// src/entities/BaseEntity.ts
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column
} from "typeorm";

export abstract class CommonEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  @Column({ default: false })
  isDeleted: boolean;

  // @CreateDateColumn()
  // createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;
}
