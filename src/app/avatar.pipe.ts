import { Pipe, PipeTransform } from '@angular/core';
import { PropagandaService } from './services/propaganda.service';

@Pipe({
  name: 'avatar'
})
export class AvatarPipe implements PipeTransform {

  constructor(private propaganda: PropagandaService){}

  transform(value: number): string {
    return this.propaganda.getAvatar(value);
  }

}
