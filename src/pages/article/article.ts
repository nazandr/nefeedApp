import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ItemSliding } from 'ionic-angular/components/item/item-sliding';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the ArticlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

let apiUrl = 'https://www.nefeed.ga/article/';
let url = 'https://www.nefeed.ga/'

@IonicPage()
@Component({
  selector: 'page-article',
  templateUrl: 'article.html',
})
export class ArticlePage {
  article: any;
  pageError: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HTTP, private nativeStorage: NativeStorage, 
    public loadingCtrl: LoadingController, private toastCtrl: ToastController, private socialSharing: SocialSharing) {
      let articleId = this.navParams.get('id');
      this.articleLoad(articleId);
  }

  articleLoad(id) {
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
      this.http.get(apiUrl+id, {}, headers)
        .then(
          data => {
            setTimeout(() => {
              this.article = JSON.parse(data.data)
              console.log(this.article)
              this.pageError = '0';          // Результат - успешно
              loadingPopup.dismiss();         // Убираем окно загрузки
            }, 1000);
          },
          err => {
            console.log('feed error', err)
            loadingPopup.dismiss();           // Убираем окно загрузки
            this.pageError = '1';            // Результат - ошибка
          }
      );},
      error => console.error(error)
    )
  }
  like(id, item: ItemSliding) {
    let toast = this.toastCtrl.create({
      message: 'Новость добавлена как понравившаяся',
      duration: 3000
    });
    
    this.nativeStorage.getItem('token').then(
      data => {
      let headers ={
        'auth': data['token'] 
      }
      this.http.post(url+'ratelike/' + id, {}, headers)
        .then(
          data => {
            setTimeout(() => {
              toast.present();
            }, 1000);
          },
          err => {
            console.log('like error', err)
          }
      );},
      error => console.error(error)
    )
    item.close();
  }

  dislike(id, item: ItemSliding) {
    let toast = this.toastCtrl.create({
      message: 'Новость добавлена как непонравившаяся',
      duration: 3000
    });
    
    this.nativeStorage.getItem('token').then(
      data => {
      let headers ={
        'auth': data['token'] 
      }
      this.http.post(url+'ratedislike/' + id, {}, headers)
        .then(
          data => {
            setTimeout(() => {
              toast.present();
            }, 1000);
          },
          err => {
            console.log('dislike error', err)
          }
      );},
      error => console.error(error)
    )
    item.close();
  }
  share(link, item: ItemSliding) {
    this.socialSharing.share(null, null, null, link)
    item.close();
  }

}
