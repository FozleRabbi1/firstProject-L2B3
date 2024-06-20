import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587, // ======================================>>>>>>   this is SMTP Port
    secure: config.NODE_ENV === 'production', // ============>>> sending  ( true / false )
    auth: {
      user: 'fozlerabbishuvo@gmail.com', //=================>>>>  sender email
      pass: 'qhdg kwxf pwgp dbho', //========================>>>>>  gmail App Password
    },
  });

  await transporter.sendMail({
    from: 'fozlerabbishuvo@gmail.com', // sender address ( email, যদি কোন service কে থাকতো , তাইলে সেটি set হতো এখানে )
    to, //=====================>>>>>>  list of receivers ( dynamic email address )
    subject: 'Reset your password withen 10m', // Subject line
    text: '', // plain text body
    html, //=====================>>>>>> html body
  });
};
