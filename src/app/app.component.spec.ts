import { async, TestBed } from '@angular/core/testing'

import { AppComponent } from './app.component'
import { importsConversor } from './app.module'

/** Imports extras tomados de @NgModule */
describe('Tests de AppComponent', () => {
  let appComponent
  let componente

  beforeEach(async(() => {
    TestBed.configureTestingModule({ declarations: [AppComponent], imports: importsConversor }).compileComponents()
    appComponent = TestBed.createComponent(AppComponent)
    componente = appComponent.debugElement.componentInstance
  }))

  it('debe crear correctamente la aplicación', async(() => {
    expect(componente).toBeTruthy()
  }))

  it('el título debe ser Conversor Angular', async(() => {
    // No buscamos un tag html h1, ni un span, ni nada que tenga que ver con cuestiones
    // estéticas, lo que semánticamente es un título lo podemos buscar mediante un tag
    // específico para testear, el `data-testid` que se llame título
    expect(buscarElemento('titulo').textContent).toContain('Conversor Angular')
  }))

  it('conversión de millas a kilómetros exitosa con 3 decimales', async(() => {
    componente.conversor.millas = 100

    const convertirButton = buscarElemento('convertir')
    convertirButton.click()
    appComponent.detectChanges()

    appComponent.whenStable().then(() => {
      const resultado = buscarElemento('kilometros')
      expect(resultado.textContent).toContain('160,934')
    })
  }))

  /* Función auxiliar que permite buscar un elemento por data-testid */
  const buscarElemento = (testId: string) => {
    const compiled = appComponent.debugElement.nativeElement
    return compiled.querySelector(`[data-testid="${testId}"]`)
  }
})

