import { TestBed, async } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { HttpClient, HttpClientModule } from '@angular/common/http'

/** Imports extras tomados de @NgModule */
/** Registramos el locale ES para formatear números */
import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es'
/** Import a objeto de dominio Conversor */
import { importsConversor } from './app.module';

registerLocaleData(localeEs)

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
  it('conversión de millas a kilómetros exitosa con 3',
    async(() => {
      const conversor = componente.conversor
      conversor.millas = 100
      conversor.convertir()
      appComponent.detectChanges()
      const compiled = appComponent.debugElement.nativeElement
      expect(compiled.querySelector('[data-testid="kilometros"]').textContent).toContain('160,934')
    }))
  // it('conversión de millas a kilómetros exitosa con 3 decimales', async(() => {
  //   componente.conversor.millas = 100

  //   const convertirButton = fixture
  //     .nativeElement
  //     .querySelector('[data-testid="convertir"]')
  //   convertirButton.click()
  //   fixture.detectChanges()

  //   fixture
  //     .whenStable()
  //     .then(() => {
  //       const compiled = fixture.nativeElement
  //       expect(compiled.querySelector('[data-testid="kilometros"]').textContent).toContain('160,934')
  //     })
  // }))
  // it('conversión de millas a kilómetros fallida - ingresa caracter alfabético', async(() => {
  //   // const millasInput: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="millas"]')
  //   // millasInput.value = 'AAAA'
  //   const conversor = componente.conversor
  //   conversor.millas = 'A'
  //   dispatchEvent(new Event('input'))
  //   fixture.detectChanges()

  //   const convertirButton = fixture
  //     .nativeElement
  //     .querySelector('[data-testid="convertir"]')
  //   convertirButton.click()
  //   dispatchEvent(new Event('input'))
  //   fixture.detectChanges()

  //   fixture
  //     .whenStable()
  //     .then(() => {
  //       const compiled = fixture.nativeElement
  //       expect(compiled.querySelector('[data-testid="errors"]').textContent).toBeTruthy()
  //       expect(compiled.querySelector('[data-testid="kilometros"]').textContent).toContain('0,000')
  //     })
  // }))

})
