import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'

/** Registramos el locale ES para formatear números */
import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es'

registerLocaleData(localeEs)
/** Fin registración ES */

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
