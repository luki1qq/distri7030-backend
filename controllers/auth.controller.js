import { request, response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createAccessToken } from "../libs/jwt.js";
const prisma = new PrismaClient();
export const signupHandler = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  let user = await PrismaClient.user.findUnique({ where: { email } });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashSync(password, 10),
    },
  });
  res.json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "El usuario no existe" });
  }
  if (!compareSync(password, user.password)) {
    return res.status(400).json({ message: "La contraseña es incorrecta." });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ user, token });
};

//toDo - Implementar transacciones si es necesario
export const register = async (req, res) => {
  const { email, firstName, lastName, password, roleId } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // Create user
    const userSaved = await prisma.user.create({
      data: {
        password: passwordHash,
        firstName,
        lastName,
        email,
      },
    });
    if (roleId) {
      await prisma.userRoles.create({
        data: {
          userId: userSaved.id,
          roleId: roleId,
        },
      });
    } else {
      await prisma.userRoles.create({ 
        data: {
          userId: userSaved.id,
          roleId: 2, // User default (Puede ser 1 si es admin)
        },
      });
    }
    // Create token
    const token = await createAccessToken({ id: userSaved.id });
    res.cookie("token", token);
    res.json({
      id: userSaved.id,
      firstName: userSaved.firstName,
      lastName: userSaved.lastName,
      email: userSaved.email,
    });
  } catch (e) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const createRoles = async (req, res) => {
  const { name, description } = req.body;
  try {
    const role = await prisma.roleTable.create({
      data: {
        name: name,
        description: description,
      },
    });
    res.json(role);
  } catch (e) {
    res.status(500).json({ message: "Error creating role" });
  }
};
