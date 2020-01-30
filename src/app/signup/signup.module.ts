import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SignUpPage } from './signup.page';
import { RegisterService } from '../register.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: SignUpPage
      }
    ]),
    ReactiveFormsModule
  ],
  declarations: [SignUpPage],
  providers: [RegisterService]
})
export class SignUpPageModule {}
