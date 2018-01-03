import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let apiUrl = 'https://www.nefeed.ga/';
// let apiUrl = 'http://localhost:12345/'

@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http) {}
    login(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        var params = 'email=' + data.email + '&password='+ data.password;
        console.log(data);
        this.http.post(apiUrl+'login', params , {headers: headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
      });
  }

  singnup(data) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        var params = 'email=' + data.email + '&password='+ data.password + '&gender=' + data.gender + '&age=' + data.age;
        data.theme.forEach(element => {
          if (element.value = true) {
            params = params + '&tags=' + element.name;
          };
        });
        this.http.post(apiUrl+'signup', params , {headers: headers})
        .subscribe(res => {
          resolve(res.headers.get('token'));
        }, (err) => {
          reject(err);
        });
      });
        };

  logout(){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('X-Auth-Token', localStorage.getItem('token'));

        this.http.post(apiUrl+'logout', {}, {headers: headers})
          .subscribe(res => {
            localStorage.clear();
          }, (err) => {
            reject(err);
          });
    });
  }

}
