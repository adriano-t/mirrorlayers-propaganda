import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
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
      
    if(this.propaganda.isLogged())
      return true;
    else {  
      return this.router.createUrlTree(['/auth'], {queryParams: {
        redirect: state.url
      }}) ;
    }
  }
  
}
