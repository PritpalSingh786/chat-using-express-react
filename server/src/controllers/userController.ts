// src/controllers/userController.ts
import { Request, Response } from "express";
import { User } from "../entities/User";
import { AppDataSource } from "../config/data-source";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Not } from "typeorm";

export const signup = async (req: Request, res: Response) => {
  const { userId, email, password } = req.body;

  if (!userId || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    // Check if user already exists by email or userId
    const existingUser = await userRepo.findOneBy([{ email }, { userId }]);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    // const newUser = userRepo.create({
    //   userId,
    //   email,
    //   password: hashedPassword, // Store encrypted password
    //   createdAt:new Date,
    //   updatedAt:new Date,
    // });

    const newUser = new User();
    newUser.createdAt = Date.now().toString();
    newUser.updatedAt = Date.now().toString();
    newUser.userId = userId;
    newUser.password = hashedPassword;
    newUser.email = email;
    await userRepo.save(newUser);
    res
      .status(201)
      .json({ message: "User registered successfully", uuid: newUser.uuid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { userId, password, connectionId } = req.body;

  if (!userId || !password || !connectionId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOneBy({ userId });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    existingUser.isLogin = true;
    existingUser.connectionId = connectionId
    await userRepo.save(existingUser);

    // Create JWT payload
    const payload = {
      uuid: existingUser.uuid,
      userId: existingUser.userId,
    };

    // Sign JWT token (expires in 1 day)
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      // expiresIn: Number(process.env.JWT_EXPIRES_IN),
    });

    res.status(200).json({
      message: "User login successfully",
      uuid: existingUser.uuid,
      userId: existingUser.userId,
      connectionId:existingUser.connectionId,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOneBy({ userId });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }
    existingUser.isLogin = false;
    await userRepo.save(existingUser);
    res.status(200).json({ message: "User logout successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let userId: string;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(
        token,
        String(process.env.JWT_SECRET)
      ) as JwtPayload;
      userId = decoded.userId;
      console.log('Decoded userId:', userId);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Get page and perPage from query params with default values
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 10;

  const skip = (page - 1) * perPage;

  try {
    const userRepo = AppDataSource.getRepository(User);

    // Total count for pagination info
    const total = await userRepo.count({
      where: {
        userId: Not(userId),
      },
    });

    // Paginated user data
    const users = await userRepo.find({
      where: {
        userId: Not(userId),
      },
      select: {
        uuid: true,
        userId: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        connectionId:true
      },
      order: {
        updatedAt: 'DESC',
      },
      skip,
      take: perPage,
    });

    res.status(200).json({
      users,
      pagination: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      message: 'Failed to fetch users',
      error,
    });
  }
};
