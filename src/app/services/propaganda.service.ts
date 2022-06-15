import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, Subject } from 'rxjs';
import { take, map, tap} from 'rxjs/operators'



@Injectable({
  providedIn: 'root'
})
export class PropagandaService {

  private loggedIn = false;
  private profile: Profile;

  profileCallback = new BehaviorSubject<Profile>(null);

  constructor(
    private http: HttpClient,
    private nav: NavController) { }

  private readonly filenameRegister = "register.php";
  private readonly filenameLogin = "login.php";
  private readonly filenameLogout = "logout.php";
  private readonly filenameCreatePost = "post.php";
  private readonly filenameCreateComment = "comment.php";
  private readonly filenameDelete = "delete.php";
  private readonly filenameGetPosts = "getposts.php";
  private readonly filenameGetComments = "getcomments.php";
  private readonly filenameLike = "like.php";
  private readonly filenameAddLikes = "addlikes.php";
  private readonly filenameFollow = "follow.php";
  private readonly filenameProfile = "getprofile.php";
  private readonly filenameEditProfile = "editprofile.php";
  private readonly filenameSearch = "search.php";
  private readonly filenameGetNotifications = "getnotifications.php";
  private readonly filenameDeleteNotification = "deletenotification.php";
  private readonly filenameReport = "report.php";
  private readonly filenameEnigma = "enigma.php";
  private readonly filenameDownload = "download.php";
  private readonly filenameGetVariables = "getvariables.php";

  private readonly baseAddress1 = "https://mirrorlayers.com/api/"; 
  private readonly baseAddress2 = "https://mirrorlayers.altervista.org/api/";

  public isLogged(){
    return this.loggedIn;
  }

  getAvatar(index: number): string {
    return "https://mirrorlayers.com/propaganda/avatars/" + index + ".png"
  }
 
  public login ()  
  {
    const formData = new FormData();
    formData.append("data", JSON.stringify({
        "id": "612",
        "password" : "ShgrxxEbogxFFcXbJJSp"
    }));

    return this.http
    .post<LoginResult>(
      this.baseAddress1 + this.filenameLogin + "?dev-test=true", 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      map(
        (data:LoginResult) : boolean => { 
          if(!data.success) {
            if(data.errors && data.errors[0] === "ERROR_ALREADY_LOGGED_IN"){
              this.loggedIn = true; 
              
              console.log(data.errors)
              this.getProfile(612).subscribe((response) => {
                this.profile = response.profile;
                this.profileCallback.next(this.profile);
              });

              return true;
            };
            return false;
          }

          this.loggedIn = true;
          this.profile = {
            avatar: data.avatar,
            creationDate: data.creation_date,
            enigma: data.enigma,
            gender: data.gender,
            id: data.id,
            info: data.info,
            lastLogin: null,
            likes: data.likes,
            likes_given: 0,
            likes_received: 0,
            name: data.name,
            section: data.section
          };
          console.log("emitting");
          this.profileCallback.next(this.profile);
          return true;
        }
      )
    );
  }

  public logout ()  
  {
    return this.http
    .post<LogoutResult>(
      this.baseAddress1 + this.filenameLogout + "?dev-test=true", 
      null,
      {withCredentials: true, })
    .pipe(
      take(1),
      map(
        (data:LogoutResult) : boolean => {
          this.loggedIn = false;
          this.profile = null;
          return data.success;
        }
      )
    
    );
  }

  getPosts (mode: GetMode, id: number, page: number, enigma: number, author: number, author_followed: boolean, language: Language, sortMode: SortMode)
  {
    const requestData: GetPostsInfo = {
        "id": id,
        "page": page,
        "author": author,
        "author_followed": author_followed,
        "enigma": enigma,
        "mode": mode,
        "language": language,
        "sort_mode": sortMode
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(requestData));

    return this.http
    .post<GetPostsResult>(
      this.baseAddress1 + this.filenameGetPosts + "?dev-test=true", 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      tap(
        (data) => {
          if(!data.success) {
            console.log(data.errors)
            this.nav.navigateRoot(['/auth']);
            return;
          } 
 
        }
      )
    );
  }
 

  getComments (mode: GetMode, id: number, postId: number, author: number)
  {
    const requestData: GetCommentsInfo = {
        "id": id,
        "author": author,
        "mode": mode, 
        "postid": postId
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(requestData));

    return this.http
    .post<GetCommentsResult>(
      this.baseAddress1 + this.filenameGetComments + "?dev-test=true", 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      tap(
        (data) => {
          if(!data.success) {
            console.log(data.errors);
            this.nav.navigateRoot(['/auth']);
            return;
          } 
 
        }
      )
    );
  }

  
  createComment(postId: number, message: string, spoiler: boolean) {
  const jsonData : CreateCommentInfo = {
    "postID": postId,
    "message": message,
    "spoiler": spoiler,
  };
  const formData = new FormData();
  formData.append("data", JSON.stringify(jsonData));

    return this.http
    .post<CreateCommentResult>(
      this.baseAddress1 + this.filenameCreateComment + "?dev-test=true", 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      map(
        (data) : number  => {
          console.log(data);
          if(!data.success) {
            console.log(data.errors)
            this.nav.navigateRoot(['/auth']);
            return 0;
          }
 
          return data.id;
        }
      )
    );
  }  

  like(id: number, type: LikeType, add: boolean) {
    const jsonData : LikeInfo = {
      "id": id,
      "type": type,
      "add": add,
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(jsonData));

    return this.http
    .post<LikeResult>(
      this.baseAddress1 + this.filenameLike + "?dev-test=true", 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      map(
        (data) : boolean => { 
          if(!data.success) {
            console.log(data.errors);
            this.nav.navigateRoot(['/auth']);
            return false;
          }
 
          return true;
        }
      )
    );
  }  

  
  getProfile(id: number) {
  const jsonData : GetProfileInfo = {
    "id": id,
  };
  const formData = new FormData();
  formData.append("data", JSON.stringify(jsonData));

    return this.http
    .post<GetProfileResult>(
      this.baseAddress1 + this.filenameProfile + "?dev-test=true", 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1)
    );
  }

  
  delete(id: number, type: LikeType) {
  const jsonData : DeleteInfo = {
    "id": id,
    "type": type
  };
  const formData = new FormData();
  formData.append("data", JSON.stringify(jsonData));

    return this.http
    .post<DeleteResult>(
      this.baseAddress1 + this.filenameDelete + "?dev-test=true", 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      map(
        (data) : boolean => {
          console.log(data);
          if(!data.success) {
            console.log(data.errors);
            this.nav.navigateRoot(['/auth']);
            return false;
          }
 
          return true;
        }
      )
    );
  }  
  
  getNotifications() {
  const jsonData : GetNotificationsInfo = {
     
  };
  const formData = new FormData();
  formData.append("data", JSON.stringify(jsonData));

    return this.http
    .post<GetNotificationsResult>(
      this.baseAddress1 + this.filenameGetNotifications + "?dev-test=true", 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      map(
        (data) : Notification[] => {
          console.log(data);
          if(!data.success) {
            console.log(data.errors);
            this.nav.navigateRoot(['/auth']);
            return null;
          }
          return data.notifications;
        }
      )
    );
  }  
  
  searchProfile(name: string) {
  const jsonData : SearchInfo = {
    "name": name,
  };
  const formData = new FormData();
  formData.append("data", JSON.stringify(jsonData));
  return this.http
    .post<SearchResult>(
      this.baseAddress1 + this.filenameSearch + "?dev-test=true", 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1)
    );
  }  

  
  follow(postId: number, add: boolean) {
  const jsonData : FollowInfo = {
    "id": postId,
    "add": add,
  };
  const formData = new FormData();
  formData.append("data", JSON.stringify(jsonData));

    return this.http
    .post<Result>(
      this.baseAddress1 + this.filenameFollow + "?dev-test=true", 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      map(
        (data) : boolean => {
          console.log(data);
          if(!data.success) {
            console.log(data.errors);
            this.nav.navigateRoot(['/auth']);
            return false;
          }
 
          return true;
        }
      )
    );
  }  


  // FUNCTION_NAME() {
  // const jsonData : DATA_INFO = {
  //   "a": a,
  // };
  // const formData = new FormData();
  // formData.append("data", JSON.stringify(jsonData));

  //   return this.http
  //   .post<RESULT_TYPE>(
  //     this.baseAddress1 + this.filename + "?dev-test=true", 
  //     formData, 
  //     {withCredentials: true, })
  //   .pipe(
  //     take(1),
  //     map(
  //       (data) : boolean => {
  //         console.log(data);
  //         if(!data.success) {
  //           console.log(data.errors);
  //           this.nav.navigateRoot(['/auth']);
  //           return false;
  //         }
 
  //         return true;
  //       }
  //     )
  //   );
  // }  

}

export enum LikeType { 
  Comment = 'comment', 
  Post = 'post'
};

export enum GetMode { 
  Begin = 'begin', 
  Before = 'before', 
  After = 'after', 
  Exact = 'exact', 
  Range = 'range', 
  Page = 'page'
};

export enum SortMode { 
  Enigma = 0, 
  Date = 1
};
export enum Language {
  All = 'all',
  En = 'en',
  It = 'it',
  Es = 'es',
  Fr = 'fr',
  De = 'de',
  Po = 'po',
  Ch = 'ch',
  Ru = 'ru',
}
 

///////////////////////////
// Output
///////////////////////////

export interface Profile {
  id: number;
  name: string;
  info: string;
  gender: number;
  avatar: number;
  enigma: number;
  section: number;
  likes: number;
  likes_received: number;
  likes_given: number;
  lastLogin: string;
  creationDate: string;
}

export interface Post {
  id: number;
  author: number;
  name: string;
  avatar: number;
  message: string;
  time: string;
  filename: string;
  filename_original: string;
  preview: boolean;
  spoiler: boolean;
  enigma: number;
  section: number;
  comments_count: number;
  likes: number;
  liked: boolean;
  followed: boolean;
  hidden: boolean;
}

export interface Comment {
  id: number;
  author: number;
  post: number;
  name: string;
  avatar: number;
  message: string;
  time: string;
  filename: string;
  filename_original: string;
  preview: boolean;
  spoiler: boolean;
  likes: number;
  liked: boolean;
  enigma: number;
  section: number;
}

export interface Profile {
  id: number;
  name: string;
  info: string;
  gender: number;
  avatar: number;
  enigma: number;
  section: number;
  likes: number;
  likes_received: number;
  likes_given: number;
  lastLogin: string;
  creationDate: string;
}

export interface ProfileSearch {
  id: number;
  name: string;
  avatar: number;
}

export interface Notification {
  postid: number;
  commentid: number;
  message: string;
  type: NotificationType;
}

export interface Result {
  success: boolean;
  errors: string[];
}

export interface RegisterResult extends Result {
  id: number;
}

export interface LoginResult extends Result {
  id: number;
  name: string;
  gender: number;
  info: string;
  avatar: number;
  enigma: number;
  section: number;
  likes: number;
  creation_date: string;
  ban: string;
}

export interface SearchResult extends Result {
  profiles: ProfileSearch[]
}

export interface LogoutResult extends Result {

}

export interface CreatePostResult extends Result {
  id: number;
}

export interface CreateCommentResult extends Result {
  id: number;
}

export interface DeleteResult extends Result {

}

export interface GetPostsResult extends Result {
  posts: Post[];
}

export interface GetCommentsResult extends Result {
  comments: Comment[];
}

 
export interface GetProfileResult extends Result
{
    profile: Profile;
}

export interface LikeResult extends Result {

}

export interface AddLikesResult extends Result {
  likes: number;
}

export interface GetNotificationsResult extends Result {
  notifications: Notification[];
}

///////////////////////////
// Input
///////////////////////////
export interface RegisterInfo {
  name: string;
  avatar: number;
  gender: number;
  password: string;
  ml_id: number;
  steam_ticket: string;
}

export interface LoginInfo {
  id: number;
  password: string;
  steam_ticket: string;
}

export interface CreatePostInfo {
  message: string;
  spoiler: boolean;
  language: string;
}

export interface CreateCommentInfo {
  postID: number;
  message: string;
  spoiler: boolean;
}

export interface DeleteInfo {
  id: number;
  type: LikeType;
}

export interface GetPostsInfo {
  id: number;
  page: number;
  author: number;
  author_followed: boolean;
  enigma: number;
  mode: GetMode;
  language: string;
  sort_mode: number;
}

export interface GetCommentsInfo {
  id: number;
  author: number;
  postid: number;
  mode: GetMode;
}

export interface LikeInfo {
  id: number;
  type: string;
  add: boolean;
}

export interface AddLikesInfo {
  amount: number;
}

export interface FollowInfo {
  id: number;
  add: boolean;
}

export interface GetProfileInfo {
  id: number;
}

export interface EditProfileInfo {
  name: string;
  gender: number;
  info: string;
  avatar: number;
}

export interface SearchInfo {
  name: string;
}

export interface GetNotificationsInfo { 
}

export interface DeleteNotificationInfo {
  postid: number;
}

export interface ReportInfo {
  target: number;
  type: number;
  motivation: number;
}

export interface DownloadInfo {
  filename: string;
}

export interface SetEnigmaInfo {
  enigma: number;
  section: number;
}

export enum NotificationType {
  Comment = 0,
  Like = 1,
  Progress = 2,
}