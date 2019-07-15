import {TestBed, async} from '@angular/core/testing'
import {AppComponent} from './app.component'
import {HttpClient, HttpClientModule} from '@angular/common/http'

/** Imports extras tomados de @NgModule */
/** Registramos el locale ES para formatear números */
import {registerLocaleData} from '@angular/common'
import localeEs from '@angular/common/locales/es'
/** Import a objeto de dominio Conversor */
import { importsConversor } from './app.module';

registerLocaleData(localeEs)

describe('Tests de AppComponent', () => {
  let fixture
  let componente
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: importsConversor
    }).compileComponents()
    fixture = TestBed.createComponent(AppComponent)
    componente = fixture.debugElement.componentInstance
  }))
  it('debe crear correctamente la aplicación', async(() => {
    expect(componente).toBeTruthy()
  }))
  it(`debe tener como título 'Conversor'`, async(() => {
    expect(componente.title).toEqual('Conversor')
  }))
  it('debe aparecer el título Conversor Angular en un tag h1', async(() => {
    // Este test busca un h1 => 
    //   h1 no tiene indicaciones semánticas para la aplicación => no es "el título"
    //   entonces si el cliente nos pide un cambio que involucra pasar de h1 a h2
    //   no solo fallará este test sino todos los que busquen un elemento h1
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('h1').textContent).toContain('Conversor Angular')
  }))
  it('al convertir millas a kilómetros desde el modelo debe dejar en un p la conversión en kilómetros y 3 decimales con coma', async(() => {
    const conversor = componente.conversor
    conversor.millas = 100
    conversor.convertir()
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('#kilometros').textContent).toContain('160,934')
  }))
  it('al convertir millas a kilómetros desde la vista debe mostrar la conversión en kilómetros en 3 decimales con coma', async(() => {
    // Simulo la carga de 100 millas en el input type text (no puedo pasarle un entero, tiene que ser un texto)
    // querySelector permite encontrar un elemento del DOM por css, por id con #, por clase con . y por tipo de elemento sin prefijo
    // como vimos arriba : https://www.w3schools.com/jsref/met_document_queryselector.asp
    
    //const millasInput = fixture.nativeElement.querySelector('#millas')
    //millasInput.value = '100'
    //fixture.nativeElement.dispatchEvent(new Event('input'))
    // Sin esto no se produce
    componente.conversor.millas = 100
    //
    
    const convertirButton = fixture.nativeElement.querySelector('#convertir')
    convertirButton.click()
    fixture.detectChanges()
    
    fixture.whenStable().then(() => {
      const compiled = fixture.nativeElement
      expect(compiled.querySelector('#kilometros').textContent).toContain('160,934')
    })
  }))  
})
