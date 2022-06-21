import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PropagandaService {

  private loggedIn = false;
  private profile: Profile;
  public language = Language.En;
  public selectedEnigma = 0;
  profileCallback = new BehaviorSubject<Profile>(null);
  
  private devTest = "";//"?dev-test=true";
  
  // private readonly filenameRegister = "register.php";
  private readonly filenameCheckLogin = "checklogin.php";
  private readonly filenameLogout = "logout.php";
  // private readonly filenameCreatePost = "post.php";
  private readonly filenameCreateComment = "comment.php";
  private readonly filenameDelete = "delete.php";
  private readonly filenameGetPosts = "getposts.php";
  private readonly filenameGetComments = "getcomments.php";
  private readonly filenameLike = "like.php";
  // private readonly filenameAddLikes = "addlikes.php";
  private readonly filenameFollow = "follow.php";
  private readonly filenameProfile = "getprofile.php";
  // private readonly filenameEditProfile = "editprofile.php";
  private readonly filenameSearch = "search.php";
  private readonly filenameGetNotifications = "getnotifications.php";
  private readonly filenameDeleteNotification = "deletenotification.php";
  private readonly filenameReport = "report.php";
  // private readonly filenameEnigma = "enigma.php";
  // private readonly filenameDownload = "download.php";
  // private readonly filenameGetVariables = "getvariables.php";

  private readonly baseAddress1 = "https://mirrorlayers.com/api/"; 
  // private readonly baseAddress2 = "https://mirrorlayers.altervista.org/api/";

  constructor(
    private http: HttpClient,
    private nav: NavController,
    private router: Router) { }

  public isLogged(){
    return this.loggedIn;
  }

  getAvatar(index: number): string {
    return "https://mirrorlayers.com/propaganda/avatars/" + index + ".png"
  }
 
  private generateSteamUrl() {
    
    const paramChar = window.location.href.includes("?") ? "&" : "?";
    const redirectParams = new HttpParams({ fromObject: {
      redirect: encodeURIComponent(window.location.href),
      fail_redirect: encodeURIComponent(window.location.href + paramChar + "failed=true"),
    }}).toString();
    
	  const steamUrl = 'https://steamcommunity.com/openid/login';
    const realm = "https://mirrorlayers.com/";
		const returnTo = "https://mirrorlayers.com/api/webauth.php?" + redirectParams;
		
		const params = { 
			'openid.ns': 'http://specs.openid.net/auth/2.0',
			'openid.mode': 'checkid_setup',
			'openid.return_to': returnTo,
			'openid.realm': realm,
			'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
			'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    };
    const queryParamsString = new HttpParams({ fromObject: params }).toString();
	 
		return steamUrl + '?' + queryParamsString;
  }

  public checkLogin() {
    return this.http
    .post<SuccessResult>(
      this.baseAddress1 + this.filenameCheckLogin, 
      null,
      {withCredentials: true, })
    .pipe(
      take(1),
      map(
        (data:SuccessResult) : boolean => { 
          this.loggedIn = data.success;
          if(!data.success) { 
            return false;
          }

          this.refreshProfile(data.id);

          this.loggedIn = true; 
          return this.loggedIn;
        }
      )
    );
  }

  public refreshProfile(id) {
    this.getProfile(id).subscribe((response) => {
      this.profile = response.profile;
      this.profileCallback.next(this.profile);
    });
  }
  
  public login ()  
  {
    const url = this.generateSteamUrl();
    window.location.href = url;
  }

  public logout ()  
  {
    return this.http
    .post<LogoutResult>(
      this.baseAddress1 + this.filenameLogout + this.devTest, 
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
      this.baseAddress1 + this.filenameGetPosts + this.devTest, 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      tap(
        (data) => {
          if(!data.success) {
            console.log(data.errors);
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
      this.baseAddress1 + this.filenameGetComments + this.devTest, 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      tap(
        (data) => {
          if(!data.success) {
            console.log(data.errors);
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
      this.baseAddress1 + this.filenameCreateComment + this.devTest, 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      map(
        (data) : number  => {
          console.log(data);
          if(!data.success) {
            console.log(data.errors);
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
      this.baseAddress1 + this.filenameLike + this.devTest, 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      map(
        (data) : boolean => { 
          if(!data.success) {
            console.log(data.errors);
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
      this.baseAddress1 + this.filenameProfile + this.devTest, 
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
      this.baseAddress1 + this.filenameDelete + this.devTest, 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      map(
        (data) : boolean => {
          console.log(data);
          if(!data.success) {
            console.log(data.errors);
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
      this.baseAddress1 + this.filenameGetNotifications + this.devTest, 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      map(
        (data) : Notification[] => {
          console.log(data);
          if(!data.success) {
            console.log(data.errors);
            return null;
          }
          return data.notifications;
        }
      )
    );
  }  

  
  deleteNotification(postId: number) {
  const jsonData : DeleteNotificationInfo = {
    "postid": postId,
  };
  const formData = new FormData();
  formData.append("data", JSON.stringify(jsonData));

    return this.http
    .post<Result>(
      this.baseAddress1 + this.filenameDeleteNotification + this.devTest, 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1),
      map((data: Result) : boolean => {
          console.log(data);
          if(!data.success) {
            console.log(data.errors); 
            return false;
          }
          return true;
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
      this.baseAddress1 + this.filenameSearch + this.devTest, 
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
      this.baseAddress1 + this.filenameFollow + this.devTest, 
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

  report(target: number, type: ReportType, motivation: ReportMotivation) {
  const jsonData : ReportInfo = {
    target: target,
    type: type,
    motivation: motivation 
  };
  const formData = new FormData();
  formData.append("data", JSON.stringify(jsonData));

    return this.http
    .post<Result>(
      this.baseAddress1 + this.filenameReport + this.devTest, 
      formData, 
      {withCredentials: true, })
    .pipe(
      take(1)
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
  //     this.baseAddress1 + this.filename + this.devTest, 
  //     formData, 
  //     {withCredentials: true, })
  //   .pipe(
  //     take(1),
  //     map(
  //       (data) : boolean => {
  //         console.log(data);
  //         if(!data.success) {
  //           console.log(data.errors);
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

export interface SuccessResult {
  success: boolean;
  id: number;
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
  type: ReportType;
  motivation: ReportMotivation;
}

export interface DownloadInfo {
  filename: string;
}

export interface SetEnigmaInfo {
  enigma: number;
  section: number;
}

export enum NotificationType {
  Comment = "0",
  Like = "1",
  Progress = "2",
}

export enum ReportType { Post = 1, Comment = 2, Profile = 3 };
export enum ReportMotivation { Inappropriate = 1, Spoiler = 2 };