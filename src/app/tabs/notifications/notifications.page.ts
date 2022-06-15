import { Component, OnInit } from '@angular/core';
import { GetNotificationsResult, Notification, PropagandaService } from 'src/app/services/propaganda.service';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit {

  isLoading = false;
  notifications: Notification[] = [];

  constructor(
    private propaganda: PropagandaService
  ) {}

  ngOnInit(): void {
      console.log("notification started");

      this.isLoading = true;
      this.propaganda.getNotifications().subscribe((notifications: Notification[]) => {
        this.notifications = notifications;
        console.log(this.notifications);
        this.isLoading = false;
      })
  }

  onClick(notification: Notification) {

  }

}
