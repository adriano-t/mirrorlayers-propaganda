 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post.component';
import { IonicModule } from '@ionic/angular';
import { AvatarPipe } from '../avatar.pipe';
import { CommentComponent } from '../comment/comment.component';
@NgModule({
  imports: [
    CommonModule, 
    IonicModule
  ],
  declarations: [
    PostComponent, 
    CommentComponent,
    AvatarPipe
  ],
  exports: [
    PostComponent, 
    CommentComponent,
    AvatarPipe,
  ]
})
export class SharedModule {}
