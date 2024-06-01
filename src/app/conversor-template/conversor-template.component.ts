import { registerLocaleData, CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import localeEsAr from '@angular/common/locales/es-AR'

registerLocaleData(localeEsAr, 'es')

/* Modelo de vista - Controller */
@Component({
  selector: 'app-conversor-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversor-template.component.html',
  styleUrl: './conversor-template.component.css'
})
export class ConversorTemplateComponent {
  title = 'Conversor'
  conversor = new Conversor()
}

/* Modelo de dominio */
class Conversor {
  millas = 0
  kilometros = 0

  convertir() {
    this.kilometros = this.millas * 1.60934
  }

  limpiar() {
    this.millas = 0
    this.convertir()
  }
}
