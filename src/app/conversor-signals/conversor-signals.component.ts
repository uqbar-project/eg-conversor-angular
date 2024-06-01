import { registerLocaleData, CommonModule } from '@angular/common'
import { Component, Signal, computed, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import localeEsAr from '@angular/common/locales/es-AR'

registerLocaleData(localeEsAr, 'es')

/* Modelo de vista - Controller */
@Component({
  selector: 'app-conversor-signals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversor-signals.component.html',
  styleUrl: './conversor-signals.component.css'
})
export class ConversorSignalsComponent {
  title = 'Conversor'

  // Necesitamos asociar el valor de cada input de la vista
  millasInput = 0

  // Writable signal para manejar el estado
  millas = signal(0)

  // Mutaciones que disparan cambios en el writable signal
  cambiarMillas() {
    this.millas.set(this.millasInput)
  }
  resetear() {
    this.millasInput = 0
    this.cambiarMillas()
  }

  // Computed signal para mostrar kilómetros
  kilometros: Signal<number> = computed(() => this.millas() * 1.60934)
}

// Otras variantes:
// - tener un writable signal de un Conversor y que cada vez que convertimos
//   eso genere un nuevo conversor (rebuscado). El conversor sería inmutable.
// - abstraer una función convertir()
// - cambiarMillas() podría dispararse en el onChange
