import '@angular/common/locales/global/es'
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

export const importsConversor = [
  BrowserModule,
  FormsModule
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: importsConversor,
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
