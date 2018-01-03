import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { LoginPage } from '../login/login';
import { FeedPage } from '../feed/feed';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  loading: any;
  signupData = {
    email: '',
    password: '',
    password2: '',
    age: '',
    gender:'',
    theme: [
        { "title": "Технологии", "name": "it", "value": false },
        { "title": "Наука","name": "popular-science", "value": false },
        { "title": "Космос","name": "space", "value": false },
        { "title": "Программирование","name": "programing", "value": false }]
  };
  age = [
        {"title": "0-18"},
        {"title": "18-30"},
        {"title": "30-45"},
        {"title": "45-65"},
        {"title": "65-99"},
  ];

  data: any;

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider, public loadingCtrl: LoadingController,
     private toastCtrl: ToastController,public alertCtrl: AlertController, private nativeStorage: NativeStorage) { }

  signup() {
    if (this.signupData.email == '' || this.signupData.password == '' || this.signupData.age == '' || this.signupData.gender == '' || !this.signupData.email.includes('@')) {
      let alert = this.alertCtrl.create({
        title: 'Внимание',
        subTitle: 'Вам надо заполнить все поля праваилно',
        buttons: ['OK']
      });
      alert.present();
      return
    }
    let n = 0;
    this.signupData.theme.forEach(element => {
      if (element.value == true){
        n = n + 1;
      }
    });
    if (n == 0) {
      let alert = this.alertCtrl.create({
        title: 'Внимание',
        subTitle: 'Вам надо выбрать хотя бы одну тему',
        buttons: ['OK']
      });
      alert.present();
      return
    }

    if (this.signupData.password != this.signupData.password2) {
      let alert = this.alertCtrl.create({
        title: 'Внимание',
        subTitle: 'Вы не правильно ввели пароль второй раз',
        buttons: ['OK']
      });
      alert.present();
      this.signupData.password = '';
      this.signupData.password2 = '';
      return
    }
    this.showLoader();
    let d = {
      email: '',
      password: '',
      password2: '',
      age: '',
      gender:'',
      theme: [
          { "title": "Технологии", "name": "it", "value": false },
          { "title": "Наука","name": "popular-science", "value": false },
          { "title": "Космос","name": "space", "value": false },
          { "title": "Программирование","name": "programing", "value": false }]
    };;
    d.email = this.signupData.email;
    d.password = this.signupData.password;
    d.password2 = this.signupData.password2;
    d.age = this.signupData.age;
    d.gender = this.signupData.gender;
    for(var i = this.signupData.theme.length - 1; i >= 0; i--) {
      if(this.signupData.theme[i].value == false) {
         d.theme.splice(i, 1);
      }
  }
    this.authService.singnup(d).then((result) => {
      this.loading.dismiss();
      this.data = result;
      this.nativeStorage.setItem('token', this.data)
      console.log(this.nativeStorage.getItem('token'))
      this.navCtrl.setRoot(FeedPage);
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Регистрация...'
    });

    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}