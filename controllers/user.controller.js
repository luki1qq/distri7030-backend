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