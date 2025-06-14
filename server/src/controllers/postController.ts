// src/controllers/PostController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { PostEntity } from "../entities/PostEntity";
import { User } from "../entities/User";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import multer from "multer";
import jwt, { JwtPayload } from "jsonwebtoken";

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uuid = req.params.uuid;
    const dir = path.join(__dirname, "..", "..", "uploads", "post", uuid);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const upload = multer({
  storage,
  limits: { files: 5 },
  fileFilter,
}).array("files", 5);

// Create Post Controller
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const authHeader = req.headers.authorization;
    let uuid: string;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(
          token,
          String(process.env.JWT_SECRET)
        ) as JwtPayload;
        uuid = decoded.uuid;
        console.log("Decoded userId:", uuid);
      } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Validate user existence
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ uuid });
      if (!user) return res.status(404).json({ message: "User not found" });

      const postRepo = AppDataSource.getRepository(PostEntity);

      // Let multer handle file uploads first
      upload(req, res, async (err: any) => {
        if (err instanceof multer.MulterError) {
          return res
            .status(400)
            .json({ message: "Upload error", error: err.message });
        } else if (err) {
          return res.status(400).json({ message: err.message });
        }
        const files = req.files as Express.Multer.File[];
        const filePaths = files.map((file) =>
          path.join("post", uuid, file.filename)
        );

        const post = new PostEntity();
        post.title = title;
        post.description = description;
        post.filePath = filePaths;
        (post.userId = uuid), (post.createdAt = Date.now().toString());
        post.updatedAt = Date.now().toString();
        await postRepo.save(post);
        return res.status(201).json({ message: "Post created", post });
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
