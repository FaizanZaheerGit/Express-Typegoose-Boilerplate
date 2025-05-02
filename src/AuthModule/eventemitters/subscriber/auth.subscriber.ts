import { appEventEmitter } from '@eventemitters/index';
import { AuthEventNames } from '@auth/eventemitters/enums/events.enums';
import { EmailQueue } from '@queues/email.queue';
import { SmsQueue } from '@queues/sms.queue';

appEventEmitter.on(AuthEventNames.SEND_EMAILS, (payload) => {
  void EmailQueue.add('sendEmail', payload, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    timestamp: Date.now(),
    removeOnComplete: true,
    removeOnFail: 15,
    priority: 1,
  });
});

appEventEmitter.on(AuthEventNames.SEND_SMS, (payload) => {
  void SmsQueue.add('sendSms', payload, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    timestamp: Date.now(),
    removeOnComplete: true,
    removeOnFail: 15,
    priority: 2,
  });
});
