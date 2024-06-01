import { Routes } from '@angular/router'
import { ConversorTemplateComponent } from './conversor-template/conversor-template.component'
import { ConversorSignalsComponent } from './conversor-signals/conversor-signals.component'

export const routes: Routes = [
  { path: 'signals', component: ConversorSignalsComponent },
  { path: '**', component: ConversorTemplateComponent },
]
