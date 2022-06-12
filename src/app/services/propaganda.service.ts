import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, map, tap} from 'rxjs/operators'



@Injectable({
  providedIn: 'root'
})
export class PropagandaService {

  private loggedIn = false;
  private userData: LoginResult;

  constructor(private http: HttpClient) { }

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
              return true;
            };
            console.log(data.errors)
            return false;
          }

          this.loggedIn = true;
          this.userData = data;
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
          this.userData = null;
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
            return;
          } 
 
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
            console.log(data.errors)
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
  //     this.baseAddress1 + this.filenameLogin + "?dev-test=true", 
  //     formData, 
  //     {withCredentials: true, })
  //   .pipe(
  //     take(1),
  //     map(
  //       (data) : boolean => {
  //         console.log(data);
  //         if(!data.success) {
  //           console.log(data.errors)
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
  type: string;
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

export interface LikeResult extends Result {

}

export interface AddLikesResult extends Result {
  likes: number;
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
  type: string;
}

export interface GetPostsInfo {
  id: number;
  page: number;
  author: number;
  author_followed: boolean;
  enigma: number;
  mode: string;
  language: string;
  sort_mode: number;
}

export interface GetCommentsInfo {
  id: number;
  author: number;
  postid: number;
  mode: string;
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
  id: number;
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

