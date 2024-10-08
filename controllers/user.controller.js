// Sección de panel de administración.
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const update = async (req, res) => {
  const { password, newPassword } = req.body;
  console.log(newPassword);

  try {
    const { id } = req.params;
    const idParse = parseInt(id, 10);

    const user = await prisma.user.findUnique({ where: { id: idParse } });
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Password incorrect" });

    const newHashedPassword = bcrypt.hashSync(newPassword, 10);

    await prisma.user.update({
      where: {
        id: idParse,
      },
      data: {
        password: newHashedPassword,
      },
    });

    return res.json({ ok: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const desactivate = async (req, res) => {
  const { id } = req.params;
  const idParse = parseInt(id, 10);

  try {
    const user = await prisma.user.findUnique({ where: { id: idParse } });
    await prisma.user.update({
      where: {
        id: idParse,
      },
      data: {
        isActive: false,
      },
    });

    return res.json({ ok: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const activate = async (req, res) => {
  const { id } = req.params;
  const idParse = parseInt(id, 10);

  try {
    const user = await prisma.user.findUnique({ where: { id: idParse } });
    await prisma.user.update({
      where: {
        id: idParse,
      },
      data: {
        isActive: true,
      },
    });

    return res.json({ ok: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    // Obtener los parámetros de paginación desde la consulta o usar valores predeterminados
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
    const limit = parseInt(req.query.limit) || 10; // Límite de usuarios por página, por defecto 10

    // Calcular cuántos registros omitir basado en la página actual
    const skip = (page - 1) * limit;

    // Consulta Prisma con paginación
    const users = await prisma.user.findMany({
      where: {
        UserRoles: {
          some: {
            roleId: 2, // Filtrar usuarios que tengan roleId igual a 2
          },
        },
      },
      skip: skip, // Omitir el número de registros calculados
      take: limit, // Traer solo el número de registros indicados en "limit"
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        verified: true,
      },
    });

    // Contar el número total de usuarios con el roleId 2
    const totalUsers = await prisma.user.count({
      where: {
        UserRoles: {
          some: {
            roleId: 2, // Filtrar usuarios que tengan roleId igual a 2
          },
        },
      },
    });

    // Calcular el número total de páginas
    const totalPages = Math.ceil(totalUsers / limit);

    // Devolver los usuarios junto con la información de paginación
    res.json({
      users: users,
      page: page,
      limit: limit,
      totalPages: totalPages,
      totalUsers: totalUsers,
    });
  } catch (error) {
    console.error("Error al obtener los usuarios con roleId 2:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
