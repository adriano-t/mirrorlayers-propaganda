import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Notification, PropagandaService } from './propaganda.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private notifications: Notification[];
  private readNotifications = new Set<string>();

  public callback = new BehaviorSubject<Notification[]>([]);

  constructor(
    private propaganda: PropagandaService,
    private storage: StorageService,
    ) { 
      
    this.loadReadNotifications();

    setInterval(() => {this.fetchNotifications();}, 10000);

    this.fetchNotifications();
  }

  private fetchNotifications() {
    this.propaganda.getNotifications().subscribe((notifications: Notification[]) => {
      this.notifications = notifications;
      this.emit();
    },(error)=> {
      console.error("getNotifications", error);
    })
  }

  private saveReadNotifications() {
    this.storage.set("readNotifications", Array.from(this.readNotifications.values()));
  }

  private loadReadNotifications() {
    this.storage.get("readNotifications").then((read: string[]) => {
      read?.forEach(element => {
        this.readNotifications.add(element);
      });
    });
  }
  
  getUnreadCount(): number {
    return Math.max(0, this.notifications?.length - this.readNotifications.size);
  }

  getNotificationId(notification: Notification): string {
    return notification.postid + "-" + notification.commentid + "-" + notification.type;
  }

  
  isUnread(notification: Notification) {
    return !this.readNotifications.has(this.getNotificationId(notification));
  }

  setUnread(notification: Notification) {
    if(this.isUnread(notification)) {
      this.readNotifications.add(this.getNotificationId(notification));
      this.saveReadNotifications();
    }
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
