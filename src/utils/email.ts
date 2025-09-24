import { smtpHost, smtpPort, smtpUser, smtpPassword, smtpFromEmail } from '@config/index';
// import sgMail from '@sendgrid/mail';
import nodeMailer from 'nodemailer';
import logger from '@utils/logger';

// TODO: Replace Send Grid Items with Generic Mailer Items to send e-mail from any SMTP

// sgMail.setApiKey(sendGridApiKey);

export const EmailSubjects = {
  FORGOT_PASSWORD: 'New Reset Password Request',
  SEND_OTP: '6-Digit OTP for Verification',
  VERIFY_OTP: 'OTP Verified',
};

export const EmailBodies = {
  FORGOT_PASSWORD: (userName: string, link: string) =>
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:Arial,sans-serif;font-size:16px"><p><b>Hello ${userName},</b><br><br>We have a recieved a request from you to reset your password.<br><br>Click on the button below to reset your password:<br><br><a href="${link}"><button type="submit" style="width:150px;height:50px;font-size:18px;background-color:#87ceeb;border-radius:20px">Reset Password</button></a><br><br><br>Or Use the link below : -<br>${link}<br><br><br><b>Regards,<br>Support Team</b></p></body></html>`,
  SEND_OTP: (userName: string, token: string) =>
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:Arial,sans-serif;font-size:16px"><p><b>Hello ${userName},</b><br><br>Use the 6-digit OTP below for verification<br><br><br><button type="submit" style="width:150px;height:50px;font-size:18px;background-color:#87ceeb;border-radius:10px;margin-left:120px">${token}</button><br><br><br><b>Regards,<br>Support Team</b></p></body></html>`,
  VERIFY_OTP: (userName: string) =>
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:Arial,sans-serif;font-size:16px"><p><b>Hello ${userName},</b><br><br>Congratulations!<br>Your Signup process has been completed and you have been verified.<br>Welcome Onboard!<br><br><b>Regards,<br>Support Team</b></p></body></html>`,
};

export const emailTransporter = nodeMailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort == 465,
  auth: {
    user: smtpUser,
    pass: smtpPassword
  }
});

// NOTE: Using .then() , .catch() because try-catch with async await was giving typescript error on error.response
export const sendEmails = async (
  recipients: string[],
  subject: string,
  text: string,
  html: string,
): Promise<void> => {
  try {
    const to = recipients.join(',');
    const info = await emailTransporter.sendMail({
      to,
      from: smtpFromEmail,
      subject,
      html,
      text,
    });

    logger.info({ to, from: smtpFromEmail, subject, messageId: info.messageId }, `EMAIL SEND SUCCESSFULLY!`);
  } catch (error) {
    logger.error({}, `ERROR IN SENDING EMAIL:  =>. ${JSON.stringify(error)}`);
  }
  // return sgMail
  //   .send({
  //     from: sendGridFromEmail,
  //     to: recipients,
  //     subject: subject,
  //     text: text,
  //     html: html,
  //   })
  //   .then(
  //     (val) => {
  //       logger.info({}, `E-mail sent successfully!  =>  STATUS:  ${val[0]?.statusCode}`);
  //       return true;
  //     },
  //     (error) => {
  //       logger.error({}, `${error}`);
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //       if (error?.response) {
  //         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //         logger.error({}, `ERROR IN SENDING EMAIL:  =>  ${error?.response?.body}`);
  //       }
  //       return false;
  //     },
  //   );
};
