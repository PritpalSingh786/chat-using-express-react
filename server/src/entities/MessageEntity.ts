// src/entities/User.ts
import { Entity, Column } from "typeorm";
import { CommonEntity } from "./CommonEntity";

@Entity()
export class MessageEntity extends CommonEntity {
  
  @Column({ nullable: true })
  senderId: string;

  @Column({ nullable: true })
  receiverId: string;
  
  @Column({ type: 'text', nullable: true }) // Specify TEXT type here
  message: string;
}
