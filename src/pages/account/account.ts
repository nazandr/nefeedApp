import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { WelcomePage } from '../welcome/welcome';

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let apiUrl = 'https://nefeed.ga/account'
@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  account: any = [];
  pageError; any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HTTP, private nativeStorage: NativeStorage, 
    public loadingCtrl: LoadingController) {
      this.accountData();
    }

  accountData() {
    let loadingPopup = this.loadingCtrl.create({
      content: ''
    });
    loadingPopup.present();	
    this.nativeStorage.getItem('token').then(
      data => {
      let headers ={
        'auth': data['token'] 
      }
      this.http.get(apiUrl, {}, headers) 
        .then(
          data => {
            setTimeout(() => {
              this.account = JSON.parse(data.data)
              this.pageError = '0';          // Результат - успешно
              loadingPopup.dismiss();        // Убираем окно загрузки
            }, 1000);
          },
          err => {
            console.log('error', err)
            loadingPopup.dismiss();          // Убираем окно загрузки
            this.pageError = '1';            // Результат - ошибка
          }
      );	
    },
      error => console.error(error)
    )
  }

  logout() {
    this.nativeStorage.clear();
    this.navCtrl.setRoot(WelcomePage);
  }

  doRefresh(refresher) {
    
    this.accountData();
      
    setTimeout(() => {
        refresher.complete();
      }, 2000);
    }
}
