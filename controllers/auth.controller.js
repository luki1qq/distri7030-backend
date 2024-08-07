import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

import { createAccessToken } from "../libs/jwt.js";
import { generatePassword } from "../utils/generateRamdonPassword.js";
import { sendEmail } from "../utils/transporterNodeMailer.js";
import { getEmailByToken } from "../utils/getEmailByToken.js";
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

export const createClient = async (req,res)=>{
  const { email, firstName, lastName } = req.body
    const password = generatePassword();

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        return res.status(400).json({ messsage: "User already exists" });
      }
      const passwordHash = await bcrypt.hash(password, 10);

      const userSaved = await prisma.user.create({
        data: {
          password: passwordHash,
          email,
          firstName,
          lastName
        },
      });
      await prisma.userRoles.create({
        data: {
          userId: userSaved.id,
          roleId: 2, // User default (Puede ser 1 si es admin)
        },

      });
      
      sendEmailActivate(email, { email, password })
      res.status(200).send("ok")

    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Error creating user" });

    }

}

export const confirm = async (req, res) => {
  try {
    const email = getEmailByToken(req.params.token)
    console.log("confrim", email)
    const updatedUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        verified: true,
      },
    });
    res.status(200).render("verified");

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error confirming email' })

  }
}

export const reSendEmailClient = async (req, res) => {
  const { email } = req.body
  const password = generatePassword()

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User no exits" });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: passwordHash,
      },
    });

    sendEmailActivate(email, { email, password })
    return res.status(200).send({ ok: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error al enviar el mail', ok: false })

  }

}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await prisma.user.findUnique({ where: { email } });
    if (!oldUser) {
      return res.status(404).json({ message: "User no exits" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
      expiresIn: "10m",
    });
    const link = `${process.env.APIGATEWAY_URL}/api/auth/reset-password/${oldUser.id}/${token}`;

    sendEmail(email, 'RESETEA TU CONSTRASEÑA', `<p>Resetea tu contraseña haciendo click en el boton verde. Si no solicitaste un reseteo ignora este mail. </p> 
            <a href="${link}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">RESETEAR CONTRASEÑA</a>`)

    res.status(200).send({ ok: true })
  } catch (error) {
    console.log(error)
    return res.status(404).json({ ok: false, message: 'Ocurrió un error.' })

  }
}

export const GETresetPassword = async (req, res) => {
  const { id, token } = req.params;
  const idParse = parseInt(id, 10);
  const oldUser = await prisma.user.findUnique({ where: { id: idParse } });
  if (!oldUser) {
    return res.status(404).json({ message: "User no exits" });
  }
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email });
  } catch (error) {
    console.log(error);
    res.status(404).send("Link inválido");
  }
}

export const POSTresetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const idParse = parseInt(id, 10);

  const oldUser = await prisma.user.findUnique({ where: { id:idParse } });
  if (!oldUser) {
    return res.status(404).json({ message: "User no exits" });
  }
  // const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    // const verify = jwt.verify(token, secret);
    console.log(req.body)
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id:idParse,
      },
      data: {
        password: passwordHash,
      },
    });

    res.render("redirect");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, message: 'Ocurrió un error.' })
  }
}










const sendEmailActivate = (email, user) => {

  var token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2d' })
  const urlConfirm = `${process.env.APIGATEWAY_URL}/api/auth/confirm/${token}`
  let 
    message = `<p>Tu cuenta de cliente es: <br>
      CORREO ELECTRONICO: ${user.email}
      CONSTRASEÑA: ${user.password}
      Confirma tu mail haciendo click en el siguiente enlace.
      Luego una vez que inicies sesión, debes cambiar la contraseña. </p> 
            <a href="${urlConfirm}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">CONFIRMAR EMAIL</a>
            <small>Link válido por 3 dias</small>`

  sendEmail(email,  'CONFIRMA TU CUENTA EN DISTRI7030', message)
}

// createEditor = async (req, res) => {
//   const { email } = req.body

//   const result = validateUser(email, password)

//   if (!result.ok) {
//     return res.status(400).json({ message: result.message, ok: false })
//   }

//   try {
//     const existsEmail = await this.userModel.findEmail({ email })
//     if (existsEmail !== undefined) {
//       return res.status(400).json({ message: 'El email ya se encuentra registrado.', ok: false })

//     }

//     const hashedPassword = bcryptjs.hashSync(password, 10)

//     const input = {
//       email,
//       password: hashedPassword
//     }

//     const newUser = await this.userModel.createEditor({ input })
//     this.sendEmailActivate(email, { email, password })
//     res.status(201).json({ "id": newUser.id_user, "email": newUser.email, "rol": newUser.rol, "verified": newUser.verified })
//   } catch (error) {
//     res.status(404).json({ message: error.message, ok: false })
//   }
// }