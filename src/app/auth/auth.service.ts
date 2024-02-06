import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }
  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAupsC2dMPoliXDKjZN_o77sHhdb8aF9l0',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(
        catchError(this.handleError)
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAupsC2dMPoliXDKjZN_o77sHhdb8aF9l0',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(
        catchError(this.handleError)
    );

  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Неизвестная ошибка';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Пользователь с таким email уже зарегистрирован';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Пользователь с таким email  не найден';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Указан неверный пароль'
        break;
    }

    return throwError(errorMessage);
  }
}
