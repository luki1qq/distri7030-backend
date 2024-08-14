// Sección de panel de administración.
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const update = async (req, res) => {
  const { password, newPassword } = req.body
  console.log(newPassword)


  try {
    const { id } = req.params
    const idParse = parseInt(id, 10);

    const user = await prisma.user.findUnique({ where: { id:idParse } });
    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) return res.status(400).json({ message: 'Password incorrect' })

    const newHashedPassword = bcrypt.hashSync(newPassword, 10)

     await prisma.user.update({
      where: {
        id:idParse,
      },
      data: {
        password: newHashedPassword,
      },
    });   
   
    return res.json({ ok: true })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const desactivate = async (req, res) => {
  const { id } = req.params
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

    return res.json({ ok: true })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const activate = async (req, res) => {
  const { id } = req.params
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

    return res.json({ ok: true })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        UserRoles: {
          some: {
            roleId: 2, // Filtra usuarios que tengan roleId igual a 2 en la relación UserRoles
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        verified:true
        // UserRoles: {
        //   select: {
        //     roleId: true,
        //   },
        // },
      },
    });
    console.log(users);
    res.json(users)
  } catch (error) {
    console.error('Error al obtener los usuarios con roleId 2:', error);
  }
};