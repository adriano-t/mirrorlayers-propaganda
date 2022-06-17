import { Pipe, PipeTransform } from '@angular/core';
import { PropagandaService } from './services/propaganda.service';

@Pipe({
  name: 'avatar'
})
export class AvatarPipe implements PipeTransform {

  constructor(private propaganda: PropagandaService){}

  transform(value: number): string {
    if(value === null)
      return this.propaganda.getAvatar(1);
      
    return this.propaganda.getAvatar(value);
  }

}
