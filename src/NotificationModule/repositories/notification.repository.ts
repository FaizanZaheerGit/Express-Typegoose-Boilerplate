import { BaseRespository } from '@database/repositories/base.repository';
import { Notification, NotificationModel } from '@notification/models/notification.model';

export class NotifcationRepository extends BaseRespository<Notification> {
  constructor() {
    super(NotificationModel);
  }
}
