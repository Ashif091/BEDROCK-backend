import {IMailer} from "../interfaces/IMailer"
import nodemailer from "nodemailer"
export class Mailer implements IMailer {
  async SendEmail(to: string, data: any) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "bedrocklive091@gmail.com",
        pass: process.env.SMTP_KEY,
      },
    })
    async function main() {
      let res = await transporter.sendMail({
        from: "BEDROCK<bedrocklive091@gmail.com>",
        to: `${to}`,
        subject: "Email for verification",
        html: data,
      })
      console.log("Message sent:", res);
    }
    main().catch(console.error)
    return true
  }
}
