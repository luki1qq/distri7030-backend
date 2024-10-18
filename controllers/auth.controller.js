import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../libs/jwt.js";
import { generatePassword } from "../utils/generateRamdonPassword.js";
import { sendEmail } from "../utils/transporterNodeMailer.js";
import { getEmailByToken } from "../utils/getEmailByToken.js";
import { JWT_SECRET } from "../utils/secrets.js";
import { RoleTable } from "./roles.js";
import { getIdByToken } from "../utils/getIdByToken.js";

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
  console.log(email, password);
  const userFound = await prisma.user.findUnique({
    where: { email },
    include: {
      UserRoles: {
        include: {
          RoleTable: true,
        },
      },
    },
  });
  if (!userFound) {
    return res.status(400).json(["las credenciales no son validas"]);
  }
  if (!userFound.isActive) {
    return res.status(400).json(["El usuario no esta activo"]);
  }
  console.log(userFound);
  const isMatch = await bcrypt.compare(password, userFound.password);
  if (!isMatch) {
    return res.status(400).json(["las credenciales no son validas"]);
  }
  const isAdmin = userFound.UserRoles.some(
    (userRole) => userRole.RoleTable.name === RoleTable.ADMIN
  );
  const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https"; // Verificar si la solicitud es HTTPS
  console.log(isSecure);
  const token = await createAccessToken({ id: userFound.id });
  console.log(token);
  res.cookie("token", token, {
    httpOnly: false, // No accesible desde JavaScript del frontend
    secure: isSecure, // Solo enviar en HTTPS en producción
    sameSite: isSecure ? "None" : "Lax", // 'None' si está en HTTPS, de lo contrario 'Lax' (para desarrollo HTTP)
  });
  res.json({
    id: userFound.id,
    firstName: userFound.firstName,
    lastName: userFound.lastName,
    email: userFound.email,
    isAdmin: isAdmin,
    verified: userFound.verified,
    isActive: userFound.isActive,
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
          isActive: true, // suponiendo que cuando se pasa un rol no es cliente
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

export const createClient = async (req, res) => {
  const { email, firstName, lastName } = req.body;
  const password = generatePassword();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "El cliente ya fue creado." });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const userSaved = await prisma.user.create({
      data: {
        password: passwordHash,
        email,
        firstName,
        lastName,
      },
    });
    await prisma.userRoles.create({
      data: {
        userId: userSaved.id,
        roleId: 2, // User default (Puede ser 1 si es admin)
      },
    });

    sendEmailActivate(email, { email, password, id: userSaved.id });
    res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const confirm = async (req, res) => {
  try {
    const email = getEmailByToken(req.params.token);
    // console.log("confrim", email);
    // const updatedUser = await prisma.user.update({
    //   where: {
    //     email,
    //   },
    //   data: {
    //     verified: true,
    //   },
    // });
    // const email = getEmailByToken(req.params.token)
    res.status(200).render("setPassword");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error confirming email" });
  }
};

export const reSendEmailClient = async (req, res) => {
  const { email } = req.body;
  const password = generatePassword();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User no exits" });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: passwordHash,
        verified: true,
      },
    });

    const id = user.id;
    sendEmailActivate(email, { email, password, id });

    return res.status(200).send({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al enviar el mail", ok: false });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await prisma.user.findUnique({ where: { email } });
    if (!oldUser) {
      return res.status(404).json({ message: "User no exists" });
    }

    const secret = process.env.JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
      expiresIn: "1d",
    });
    const link = `${process.env.APIGATEWAY_URL}/api/auth/reset-password/${oldUser.id}/${token}`;

    // Enviar el email con la plantilla mejorada
    sendEmail(
      email,
      "Resetea tu Contraseña",
      `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Resetear Contraseña</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #333;
              border-radius: 8px;
            }
            .header {
              text-align: center;
              padding: 10px 0;
              background-color: #ff6f00;
              color: white;
              border-radius: 8px 8px 0 0;
            }
            .content {
              padding: 20px;
              background-color: #fff;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: block;
              width: 100%;
              max-width: 250px;
              margin: 20px auto;
              padding: 15px;
              background-color: #ff6f00;
              color: white !important;
              text-align: center;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              font-size: 16px;
              cursor: pointer;
            }
            .button:hover {
              background-color: #e65d00; /* Hacer más oscuro al pasar el cursor */
            }
            .content p{
              color: #000 !important;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Resetear tu Contraseña</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Has solicitado un reseteo de contraseña para tu cuenta. Por favor, haz clic en el botón de abajo para restablecer tu contraseña.</p>
              <a href="${link}" class="button" target="_blank">RESETEAR CONTRASEÑA</a>
              <p>Si no solicitaste un reseteo de contraseña, simplemente ignora este correo.</p>
              <p>Gracias,</p>
              <p>El equipo de Distri7030</p>
            </div>
            <div class="footer">
              <p>© 2024 Distri7030. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
      `
    );

    res.status(200).send({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ ok: false, message: "Ocurrió un error." });
  }
};

export const GETresetPassword = async (req, res) => {
  const { id, token } = req.params;
  const idParse = parseInt(id, 10);
  const oldUser = await prisma.user.findUnique({ where: { id: idParse } });
  if (!oldUser) {
    console.log("aqi");
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
};

export const POSTresetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const idParse = parseInt(id, 10);

  const oldUser = await prisma.user.findUnique({ where: { id: idParse } });
  if (!oldUser) {
    console.log("aqi 2");

    return res.status(404).json({ message: "User no exits" });
  }
  // const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    // const verify = jwt.verify(token, secret);
    console.log(req.body);
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: idParse,
      },
      data: {
        password: passwordHash,

        verified: true,
      },
    });

    res.render("redirect");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, message: "Ocurrió un error." });
  }
};

// const sendEmailActivate = (email, user) => {
//   var token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2d" });
//   const urlConfirm = `${process.env.APIGATEWAY_URL}/api/auth/confirm/${token}`;

// }

export const GETSetPassword = async (req, res) => {
  const { id, token } = req.params;
  const idParse = parseInt(id, 10);
  const oldUser = await prisma.user.findUnique({ where: { id: idParse } });
  if (!oldUser) {
    return res.status(404).json({ message: "User no exits" });
  }
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("setPassword");
  } catch (error) {
    console.log(error);
    res.status(404).send("Link inválido");
  }
};

export const POSTSetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const id = parseInt(getIdByToken(token));
  console.log(id);
  const oldUser = await prisma.user.findUnique({ where: { id: id } });
  if (!oldUser) {
    return res.status(404).json({ message: "User no exits" });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: passwordHash,
      },
    });

    res.render("redirect");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, message: "Ocurrió un error." });
  }
};

const sendEmailActivate = (email, user) => {
  let id = user.id;
  var token = jwt.sign({ email, id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
  const urlConfirm = `${process.env.APIGATEWAY_URL}/api/auth/confirm/${token}`;

  let message = `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Confirma tu cuenta</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #ff6f00;
          text-align: center;
        }
        p {
          font-size: 16px;
          line-height: 1.5;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 15px 30px;
          background-color: #ff6f00;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          text-align: center;
        }
        .button:hover {
          background-color: #e65c00;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Confirma tu cuenta en Distri7030</h1>
        <p>Hola,</p>
        <p>Tu cuenta ha sido creada exitosamente. Para activarla, confirma tu correo electrónico haciendo clic en el botón de abajo. Además, tendrás la opción de establecer una contraseña.</p>
        
        <p>Detalles de tu cuenta:</p>
        <ul>
          <li><strong>Correo electrónico:</strong> ${user.email}</li>
        </ul>

        <a href="${urlConfirm}" class="button">CONFIRMAR EMAIL</a>

        <p><small>Este enlace es válido por 3 días.</small></p>

        <div class="footer">
          <p>© 2024 Distri7030. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
  </html>
  `;

  sendEmail(email, "CONFIRMA TU CUENTA EN DISTRI7030", message);
};

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
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userFound = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        UserRoles: {
          include: {
            RoleTable: true,
          },
        },
      },
    });
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }
    const isAdmin = userFound.UserRoles.some(
      (userRole) => userRole.RoleTable.name === RoleTable.ADMIN
    );
    res.json({
      id: userFound.id,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      email: userFound.email,
      isAdmin: isAdmin,
    });
  });
};
