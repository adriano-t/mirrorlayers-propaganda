import { Injectable, OnInit } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService  {

  private preferences;
  private loaded = false;

  constructor(
    private storage: StorageService
  ){
    
    this.load();
  }



  onLoad(): Promise<void> {
    return new Promise<void> ((resolve, reject) => {
      if(this.loaded)
        resolve();
      const interval = setInterval(() => {
        if(this.loaded) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  get(key: string, defaultValue = null) {
    if(this.preferences[key]) {
      return this.preferences[key];
    } else {
      return defaultValue;
    }
  }

  set(key: string, value: any) {
    this.preferences[key] = value;
    this.save();
  }

  save() {
    this.storage.set("preferences", this.preferences);
  }

  load() {
    this.storage.get("preferences").then(preferences => {
      this.preferences = preferences || {};
      this.loaded = true;
    })
  }

}
