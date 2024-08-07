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

  const userFound = await prisma.user.findUnique({ where: { email } });
  if (!userFound) {
    return res.status(400).json({ message: "El usuario no existe" });
  }
  console.log(userFound);
  const isMatch = bcrypt.compare(password, userFound.password);
  if (!isMatch) {
    return res.status(400).json({ message: "La contraseña es incorrecta." });
  }
  const token = await createAccessToken({ id: userFound.id });
  console.log(token);
  res.cookie("token", token);
  res.json({
    id: userFound.id,
    firstName: userFound.firstName,
    lastName: userFound.lastName,
    email: userFound.email,
  });
};

//toDo - Implementar transacciones si es necesario
export const register = async (req, res) => {
  const { email, firstName, lastName, password, roleId } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ messsage: "User already exists" });
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

export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  res.sendStatus(200);
};

export const profile = async (req, res) => {
  const { id } = req.user;
  const userFound = await prisma.user.findUnique({ where: { id } });

  if (!userFound) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({
    id: userFound.id,
    firstName: userFound.firstName,
    lastName: userFound.lastName,
    email: userFound.email,
  });
};
