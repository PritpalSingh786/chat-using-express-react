import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { MessageEntity } from "../entities/MessageEntity";

const messageRepo = AppDataSource.getRepository(MessageEntity);

export const getMessages = async (req: Request, res: Response) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await messageRepo.find({
      where: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
      order: { createdAt: "ASC" },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err });
  }
};