import { appEventEmitter } from '@eventemitters/index';
import { AuthEventNames } from '@auth/eventemitters/enums/events.enums';

export const publishEmailEvent = (payload: {
  recipients: string[];
  subject: string;
  text: string;
  html: string;
}) => {
  appEventEmitter.emit(AuthEventNames.SEND_EMAILS, payload);
};

export const publishSmsEvent = (payload: { recipients: string[]; body: string }) => {
  appEventEmitter.emit(AuthEventNames.SEND_SMS, payload);
};
