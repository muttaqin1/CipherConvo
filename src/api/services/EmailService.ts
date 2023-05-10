import nodemailer, { Transporter } from 'nodemailer';
import { InternalServerError } from '@helpers/AppError/ApiError';
import { smtp } from '@config/index';
import { injectable } from 'inversify';
import IEmailService from '@interfaces/service/IEmailService';

@injectable()
export default class EmailService implements IEmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtp.email ? smtp.email : '',
        pass: smtp.password ? smtp.password : ''
      },
      port: smtp.port,
      host: smtp.host
    });
  }

  private sendEmail(to: string, subject: string, text: string): void {
    const mailOptions = {
      from: smtp.email ? smtp.email : '',
      to,
      subject,
      text
    };
    this.transporter.sendMail(mailOptions, (error) => {
      if (error) throw new InternalServerError();
    });
  }
}
