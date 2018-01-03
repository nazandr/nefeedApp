import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/welcome/welcome';
import { FeedPage } from '../pages/feed/feed';
import { NativeStorage } from '@ionic-native/native-storage';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = null;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, nativeStorage: NativeStorage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    //   if(!localStorage.getItem( 'token' )) {
    //     this.rootPage = FeedPage; 
    // }else{
    //     this.rootPage = WelcomePage;
    // }
      nativeStorage.getItem('token').then(
        data => {
          if (data) {
            this.rootPage = FeedPage
          } else {
            this.rootPage = WelcomePage
          }
        },
        error => {
          console.log('app.component err', error)
          this.rootPage = WelcomePage
        }
      );
    });
  }
}

