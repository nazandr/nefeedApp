import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { NativeStorage } from '@ionic-native/native-storage';
import { HTTP } from '@ionic-native/http';
import { AccountPage } from '../account/account';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ItemSliding } from 'ionic-angular/components/item/item-sliding';

/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

let apiUrl = 'https://www.nefeed.ga/feed/';
// let apiUrl = 'http://localhost:12345/feed/'

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  asd = 'asdf';
  loading: any;
  postlists: any = [];            // данные со списком публикаций, полученные из запроса
  postlists_new: any = [];        // данные СЛЕДУЮЩЕГО списка публикаций, которые получаются при пролистывании списка к последнему элементу
  pages: any;
  countElement: number = 0;       // кол-во элементов, которые мы получаем из запроса
  post_error: string;             // результат выполнения запроса 0-успешно, 1-ошибка
  token: any;
  lastCount: any;
  
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public navParams: NavParams, 
    public alertCtrl: AlertController, private nativeStorage: NativeStorage, private http: HTTP,
    private socialSharing: SocialSharing) {
	this.loadData(0);
  }

  loadData(nPage) {
      this.pages = parseInt(nPage);
      // Создаем окно загрузки
      let loadingPopup = this.loadingCtrl.create({
        content: ''
      });

      // Показываем окно загрузки
      loadingPopup.present();	
      this.nativeStorage.getItem('token').then(
        data => {
        let headers ={
          'auth': data['token'] 
        }
        this.http.get(apiUrl+nPage, {}, headers)
          .then(
            data => {
              setTimeout(() => {
                this.postlists = JSON.parse(data.data)
                this.countElement += this.postlists.length;
                this.lastCount = this.postlists.length;
                this.post_error = '0';          // Результат - успешно
                loadingPopup.dismiss();         // Убираем окно загрузки
              }, 1000);
            },
            err => {
              console.log('feed error', err)
              loadingPopup.dismiss();           // Убираем окно загрузки
              this.post_error = '1';            // Результат - ошибка
            }
        );},
        error => console.error(error)
      )
  }

  // Выполняется при пролистывании к последнему элементу списка
  doInfinite(infiniteScroll) {
  if (this.lastCount == 10){
    // this.loadData();
  let n = parseInt(this.pages) + 1 ;
    // Get the data
    this.nativeStorage.getItem('token').then(
      data => {
      let headers ={
        'auth': data['token'] 
      }
      this.http.get(apiUrl+n, {}, headers)  // Ставим лимит на получение запроса и прерываем запрос через 20 сек.
        .then(
          data => {
            this.pages += 1;
            setTimeout(() => {
              this.postlists_new = JSON.parse(data.data)
              this.countElement += this.postlists_new.length;
              this.lastCount = this.postlists_new.length;
  			      this.post_error = "0";

			  for (let i = 0; i < this.countElement; i++) {
          this.postlists.push(this.postlists_new[i]);  // Добавили новые данные в основной массив публикаций
          ;
			  }
			  
		      infiniteScroll.complete();
            }, 1000);

          },
          err => {
            console.error(err)
      }
      );},
      error => console.error(error)
    )
}else{
  infiniteScroll.complete();
}
  }
  
  // Выполняется при потягивании списка вниз, когда список находится в верхнем положении
  doRefresh(refresher) {
    
	this.loadData(0);
    
	setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  account() {
    this.navCtrl.push(AccountPage);
  }

  like(item: ItemSliding) {
    item.close();
  }

  dislike(item: ItemSliding) {

    item.close();
  }
  share(link, item: ItemSliding) {
    console.log(link)
    this.socialSharing.share(null, null, null, link)
    item.close();
  }
}
