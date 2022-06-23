import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  notificationsCount: number;

  constructor(
    private notif: NotificationsService
  ) {}

  ngOnInit(): void {}

  unreadNotifications() {
    return this.notif.getUnreadCount();
  }

}
