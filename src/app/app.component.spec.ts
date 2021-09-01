import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AppComponent } from './app.component'
import { importsConversor } from './app.module'

import './app.module'

/** Imports extras tomados de @NgModule */
describe('Tests de AppComponent', () => {
  let appComponent: ComponentFixture<AppComponent>
  let componente: { conversor: { millas: number } }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ declarations: [AppComponent], imports: importsConversor }).compileComponents()
    appComponent = TestBed.createComponent(AppComponent)
    componente = appComponent.debugElement.componentInstance
  }))

  it('debe crear correctamente la aplicación', waitForAsync(() => {
    expect(componente).toBeTruthy()
  }))

  it('conversión de millas a kilómetros exitosa con 3 decimales', waitForAsync(() => {
    appComponent.detectChanges()
    appComponent.whenStable().then(() => {
      ingresarValor(100)
      convertir()
      const resultado = buscarElemento('kilometros')
      expect(resultado.textContent).toContain('160,934')
    })
  }))
  
  it('conversión de millas a kilómetros con valor cero', waitForAsync(() => {
    appComponent.detectChanges()
    appComponent.whenStable().then(() => {
      ingresarValor(0)
      convertir()
      const resultado = buscarElemento('kilometros')
      expect(resultado.textContent).toContain('0,000')
    })
  }))

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
    appComponent.detectChanges()
  }
})
