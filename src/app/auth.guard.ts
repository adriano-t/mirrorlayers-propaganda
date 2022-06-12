import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PropagandaService } from './services/propaganda.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {

  constructor(private propaganda: PropagandaService,
    private router: Router){}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("propaganda: " + this.propaganda.isLogged())
    if(this.propaganda.isLogged())
      return true;
    else
      return this.router.createUrlTree(['/auth']);
  }
  
}
