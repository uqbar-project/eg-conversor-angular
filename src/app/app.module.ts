import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import '@angular/common/locales/global/es'

export const importsConversor = [
  CommonModule,
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
