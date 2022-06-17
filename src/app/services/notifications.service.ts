import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification, PropagandaService } from './propaganda.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private notifications: Notification[];

  public callback = new BehaviorSubject<Notification[]>([]);

  constructor(private propaganda: PropagandaService) { 

    this.propaganda.getNotifications().subscribe((notifications: Notification[]) => {
      this.notifications = notifications;
      this.emit();
    })
  }

  setNotifications(notifications: Notification[]) {
    this.notifications = [...notifications];
    this.emit();
  }
  
  addNotification(notification: Notification) {
    this.notifications.push({...notification});
    this.emit();
  }

  deleteNotification(notification: Notification) {
    this.notifications = this.notifications.filter(
      notif => 
      notif.postid != notification.postid &&
      notif.message != notification.message);
    
    //TODO this.propaganda.deleteNotification()
    this.emit();
  }

  emit() {
    this.callback.next([...this.notifications]); 
  }
}
