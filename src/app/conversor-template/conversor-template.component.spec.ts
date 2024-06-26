import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ConversorTemplateComponent } from './conversor-template.component'

/** Imports extras tomados de @NgModule */
describe('Tests de AppComponent', () => {
  let appComponent: ComponentFixture<ConversorTemplateComponent>
  let componente: { conversor: { millas: number } }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversorTemplateComponent],
    }).compileComponents()
    appComponent = TestBed.createComponent(ConversorTemplateComponent)
    componente = appComponent.debugElement.componentInstance
    appComponent.detectChanges()
  })

  it('debe crear correctamente la aplicación', () => {
    expect(componente).toBeTruthy()
  })

  it('conversión de millas a kilómetros exitosa con 3 decimales', () => {
    ingresarValor(100)
    convertir()
    appComponent.detectChanges()
    const resultado = buscarElemento('kilometros')
    expect(resultado.textContent).toContain('160,934')
  })

  it('conversión de millas a kilómetros con valor cero', () => {
    ingresarValor(0)
    convertir()
    appComponent.detectChanges()
    const resultado = buscarElemento('kilometros')
    expect(resultado.textContent).toContain('0,000')
  })

  it('al resetear volvemos a tener 0 en los valores', () => {
    ingresarValor(100)
    convertir()
    appComponent.detectChanges()
    buscarElemento('reset').click()
    appComponent.detectChanges()
    const resultado = buscarElemento('kilometros')
    expect(resultado.textContent).toContain('0,000')
  })

  /* Función auxiliar que permite buscar un elemento por data-testid */
  function buscarElemento(testId: string) {
    const compiled = appComponent.debugElement.nativeElement
    return compiled.querySelector(`[data-testid="${testId}"]`)
  }

  function ingresarValor(valor: number) {
    // componente.conversor.millas = valor
    const millasInput = buscarElemento('millas')
    millasInput.value = valor
    millasInput.dispatchEvent(new Event('input'))
  }

  function convertir() {
    // No buscamos un tag html h1, ni un span, ni nada que tenga que ver con cuestiones
    // estéticas, lo que semánticamente es una acción lo podemos buscar mediante un tag
    // específico para testear, el `data-testid` que se llame convertir
    const convertirButton = buscarElemento('convertir')
    convertirButton.click()
  }
})
