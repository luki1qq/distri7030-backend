import nodemailer from 'nodemailer'

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USERNAME,
//     pass: process.env.MAIL_PASSWORD
//   }

// })
export const sendEmail = (email, link, subject, message) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: subject,
    html: message
  }
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    }
    console.log("email sent" + info.response)
  })
}