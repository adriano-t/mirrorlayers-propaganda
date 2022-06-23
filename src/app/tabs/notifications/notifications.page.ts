import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController, NavController } from '@ionic/angular';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Notification, NotificationType, PropagandaService } from 'src/app/services/propaganda.service';

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
    private actionSheetController: ActionSheetController,
    private notifService: NotificationsService,
    private nav: NavController,
    private propaganda: PropagandaService,
    private loading: LoadingController
  ) {}

  ngOnInit(): void {
      console.log("notification service started");
      this.isLoading = true;
      this.notifService.callback.subscribe((notifications: Notification[]) => {
        this.notifications = notifications;
        this.isLoading = false;
      });
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

  isUnread(notification: Notification){
    return this.notifService.isUnread(notification);
  }
  
  onClick(notification: Notification) {
    if(notification.type == NotificationType.Comment) {
      this.nav.navigateForward(["/post/", notification.postid]);
    }
    this.notifService.setUnread(notification);
  }

  onClickDelete(notification: Notification) {
    const buttons = [
    {
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => { 
        this.loading.create({
          message: "Deleting..."
        }).then((elem) => {
          elem.present();
          this.notifService.deleteNotification(notification).subscribe((success)=>{
            elem.dismiss();
          });
        })
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
