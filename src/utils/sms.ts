/* eslint-disable no-console */
import { twilioAccountSid, twilioAuthToken, twilioFromNumber } from '@config/index';
import twilio from 'twilio';

const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

export const SmsBodies = {
  SEND_OTP: (token: string) => `Your 6-digit verification code is: ${token}`,
};

export const sendBulkSms = async (recipients: string[], body: string): Promise<boolean> => {
  try {
    const sendPromises = recipients.map((to) =>
      twilioClient.messages
        .create({
          from: twilioFromNumber,
          to,
          body,
        })
        .then((res) => {
          console.log(`SMS sent to ${to} | SID: ${res.sid}`);
          return true;
        })
        .catch((err) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.error(`Failed to send SMS to ${to} | Error: ${err.message}`);
          return false;
        }),
    );

    const results = await Promise.all(sendPromises);
    const successCount = results.filter((r) => r).length;

    console.log(`${successCount}/${recipients.length} SMS messages sent successfully.`);
    return successCount === recipients.length;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.error(`Unexpected error in sendBulkSms: ${error}`);
    return false;
  }
};
