import { appEventEmitter } from '@eventemitters/index';
import { AuthEventNames } from '@auth/eventemitters/enums/events.enums';
import { sendEmails } from '@utils/email';
import { sendBulkSms } from '@utils/sms';

appEventEmitter.on(AuthEventNames.SEND_EMAILS, (payload) => {
  console.log('SEND EMAILS EVENT PAYLOAD:  =>  ' + JSON.stringify(payload));
  sendEmails(payload.recipients, payload.subject, payload.text, payload.html);
});

appEventEmitter.on(AuthEventNames.SEND_SMS, (payload) => {
  console.log('SEND BULK SMS EVENT PAYLOAD:  =>  ' + JSON.stringify(payload));
  sendBulkSms(payload.recipients, payload.body);
});
