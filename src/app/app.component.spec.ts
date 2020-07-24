import { TestBed, async } from '@angular/core/testing'
import { AppComponent } from './app.component'

/** Imports extras tomados de @NgModule */
import { importsConversor } from './app.module';

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
  it(`debe tener como título 'Conversor'`, async(() => {
    expect(componente.title).toEqual('Conversor')
  }))
  it('debe aparecer el título Conversor Angular en un tag h1', async(() => {
    // Este test busca un h1 =>   h1 no tiene indicaciones semánticas para la
    // aplicación => no es "el título"   entonces si el cliente nos pide un cambio
    // que involucra pasar de h1 a h2   no solo fallará este test sino todos los que
    // busquen un elemento h1
    const compiled = appComponent.debugElement.nativeElement
    expect(compiled.querySelector('h1').textContent).toContain('Conversor Angular')
  }))
  it('conversión de millas a kilómetros exitosa con 3 decimales',
    async(() => {
      const conversor = componente.conversor
      conversor.millas = 100
      conversor.convertir()
      appComponent.detectChanges()
      const compiled = appComponent.debugElement.nativeElement
      expect(compiled.querySelector('[data-testid="kilometros"]').textContent).toContain('160,934')
    }))
  // it('conversión de millas a kilómetros fallida - ingresa caracter alfabético', async(() => {
  //   const millasInput: HTMLInputElement = appComponent.nativeElement.querySelector('[data-testid="millas"]')
  //   millasInput.value = 'AAAA'
  //   dispatchEvent(new Event('input'))

  //   const convertirButton = appComponent
  //     .nativeElement
  //     .querySelector('[data-testid="convertir"]')
  //   convertirButton.click()
  //   appComponent.detectChanges()

  //   appComponent
  //     .whenStable()
  //     .then(() => {
  //       console.log(componente.conversor.kilometros)
  //       expect(millasInput.value).toBe('AAAA')
  //     })
  // }))

})
