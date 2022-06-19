import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    
      return this.propaganda.deleteNotification(notification.postid)
      .pipe(
        tap((success) => {
          this.notifications = this.notifications.filter(notif => notif.postid != notification.postid);
          this.emit();
        })
      );
  }

  emit() {
    this.callback.next([...this.notifications]); 
  }
}
