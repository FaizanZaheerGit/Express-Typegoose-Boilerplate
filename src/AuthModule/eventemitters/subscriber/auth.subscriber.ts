import { appEventEmitter } from '@eventemitters/index';
import { AuthEventNames } from '@auth/eventemitters/enums/events.enums';
import { sendEmails } from '@utils/email';
import { sendBulkSms } from '@utils/sms';

appEventEmitter.on(AuthEventNames.SEND_EMAILS, (payload) => {
  // eslint-disable-next-line no-console
  console.log('SEND EMAILS EVENT PAYLOAD:  =>  ' + JSON.stringify(payload));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  void sendEmails(payload.recipients, payload.subject, payload.text, payload.html); // NOTE: void added to remove floating promises typescript error
});

appEventEmitter.on(AuthEventNames.SEND_SMS, (payload) => {
  // eslint-disable-next-line no-console
  console.log('SEND BULK SMS EVENT PAYLOAD:  =>  ' + JSON.stringify(payload));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  void sendBulkSms(payload.recipients, payload.body); // NOTE: void added to remove floating promises typescript error
});
