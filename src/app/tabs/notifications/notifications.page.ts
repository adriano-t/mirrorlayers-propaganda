import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { GetNotificationsResult, Notification, NotificationType, PropagandaService } from 'src/app/services/propaganda.service';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit {

  isLoading = false;
  notifications: Notification[] = [];
  maxLength = 30;

  constructor(
    private propaganda: PropagandaService,
    private notifService: NotificationsService,
  ) {}

  ngOnInit(): void {
      console.log("notification started");
      this.isLoading = true;
      this.notifService.callback.subscribe((notifications: Notification[]) => {
        this.notifications = notifications;
        this.isLoading = false;
      })
  }

  getNotificationMessage(notification: Notification) {
    if(notification.message.length < this.maxLength)
      return notification.message;
    else
      return notification.message.slice(0, this.maxLength) + "...";
  }

  getNotificationIcon(notification: Notification): string {
    switch(notification.type) {
      case NotificationType.Comment:
        return "chatbox";
      case NotificationType.Like:
        return "heart";
      case NotificationType.Progress:
        return "sparkles";
      default:
        return "notifications-circle";
    }
  }

  onClick(notification: Notification) {
    
  }

  onClickDelete(notification: Notification) {

  }

}
