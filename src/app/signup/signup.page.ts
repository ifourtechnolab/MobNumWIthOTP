import { Component } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { RegisterService } from '../register.service';

export class ConfirmPasswordValidator {
  static matchPassword(control: AbstractControl) {
    const password = control.get('Password').value;
    const confirmPassword = control.get('ConfirmPwd').value;

    if (password === '' || confirmPassword === '') {
      return false;
    }
    if (password !== confirmPassword) {
      control.get('ConfirmPwd').setErrors({ ConfirmPwd: true });
    } else {
      control.get('ConfirmPwd').setErrors(null);
    }
  }
}

export enum OtpType {
  Registration = 1,
  ResetPassword
}
@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
})
export class SignUpPage {

  myForm: FormGroup;
  isOtpVerify = false;
  ddhhmmss = '02:00';
  flagTime = false;
  interval: any;
  isOtp = true;
  isResendotp = false;

  constructor(private formBuilder: FormBuilder, private registerService: RegisterService, private alertController: AlertController) {
    this.formInit();
  }

  formInit() {
    this.myForm = this.formBuilder.group({
      Mobile: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(10)])],
      Otp: ['', Validators.compose([Validators.required, Validators.maxLength(6)])],
      Name: [{ value: '', disabled: true }, Validators.compose([Validators.required, Validators.maxLength(100)])],
      Password: [{ value: '', disabled: true }, Validators.compose([Validators.required, Validators.minLength(8),
      Validators.maxLength(16)])],
      ConfirmPwd: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
    }, { validator: ConfirmPasswordValidator.matchPassword });
  }

  ionViewWillEnter() {
    this.myForm.controls.Otp.disable();
  }

  timer() {
    this.isOtp = false;
    this.isResendotp = false;
    let counter = 120;

    this.interval = setInterval(() => {
      this.toDDHHMMSS(counter);
      counter--;

      if (counter < 0) {
        clearInterval(this.interval);
        this.isResendotp = true;
        this.flagTime = false;
      }
    }, 1000);
  }

  toDDHHMMSS(inputSeconds: number) {
    const minutes = Math.floor(((inputSeconds % (60 * 60 * 24)) % (60 * 60)) / 60);
    const seconds = Math.floor(((inputSeconds % (60 * 60 * 24)) % (60 * 60)) % 60);
    this.ddhhmmss = '';

    if (minutes >= 0) {
      this.ddhhmmss += minutes.toString().length === 1 ? ('0' + minutes + ' : ') : (minutes + ' : ');
    }

    if (seconds >= 0) {
      this.ddhhmmss += seconds.toString().length === 1 ? ('0' + seconds) : seconds;
    }
    return this.ddhhmmss;
  }

  getOtp(flag: boolean) {
    const request = this.registerService.getOtp(this.myForm.controls.Mobile.value, flag, OtpType.Registration);
    request.subscribe(res => {
      if (res.Success) {
        this.flagTime = true;
        this.timer();
        this.myForm.controls.Otp.enable();
      }
      console.log(res.Message);
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

  verifyOtp(e: any) {
    if (e.target.value.length === 6) {
      this.registerService.verifyOtp(this.myForm.controls.Mobile.value, e.target.value, OtpType.Registration).subscribe(res => {
        if (res.Success) {
          clearInterval(this.interval);
          this.ddhhmmss = '02:00';
          this.flagTime = false;
          this.isOtpVerify = true;
          this.myForm.enable();
          this.myForm.controls.Otp.disable();
          this.myForm.controls.Mobile.disable();
        }
        console.log(res.Message);
      });
    } else {
      this.myForm.disable();
      this.myForm.controls.Otp.enable();
      this.myForm.controls.Mobile.enable();
    }
  }

  save() {
    if (this.myForm.invalid) {
      Object.keys(this.myForm.controls).forEach(key => {
        if (this.myForm.controls[key].invalid) {
          this.myForm.controls[key].markAsTouched({ onlySelf: true });
        }
      });
      return;
    }
    this.myForm.enable();
    this.showSuccessAlert();
  }

  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success!',
      message: 'You have successfully register in our app. Please tap on "Ok" to do login with same "Mobile & Password".',
      buttons: [{
        text: 'Ok',
        handler: () => { }
      }]
    });
    await alert.present();
  }
}

