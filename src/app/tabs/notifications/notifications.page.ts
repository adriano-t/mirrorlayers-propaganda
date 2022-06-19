import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Notification, NotificationType } from 'src/app/services/propaganda.service';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit {

  isLoading = false;
  notifications: Notification[] = [];
  maxLength = 30;

  readNotifications = new Set();

  constructor(
    private actionSheetController: ActionSheetController,
    private notifService: NotificationsService,
    private nav: NavController,
  ) {}

  ngOnInit(): void {
      console.log("notification started");
      this.isLoading = true;
      this.notifService.callback.subscribe((notifications: Notification[]) => {
        this.notifications = notifications;
        this.isLoading = false;
      })
  }

  getNotificationId(notification: Notification): string {
    return notification.postid + "-" + notification.commentid + "-" + notification.type;
  }

  isUnread(notification: Notification) {
    
    return !this.readNotifications.has(this.getNotificationId(notification));
  }

  getNotificationMessage(notification: Notification) {
    let message = "New comment on \"" + notification.message;
    if(message.length < this.maxLength)
      return message + "\"";
    else
      return message.slice(0, this.maxLength) + "\"...";
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
    console.log(notification);
    if(notification.type == NotificationType.Comment) {
      this.nav.navigateForward(["/post/", notification.postid]);
    }
    if(this.isUnread(notification))
      this.readNotifications.add(this.getNotificationId(notification));
  }

  onClickDelete(notification: Notification) {
    const buttons = [
    {
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => { 
        console.log("delete notification");
      }
    },
    {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => { }
    }];


    this.actionSheetController.create({
      header: 'Notification options',
      buttons: buttons
    }).then(sheet => {
      sheet.present();
    });
  }

}
