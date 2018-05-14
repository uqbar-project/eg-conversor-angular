import {FormsModule} from '@angular/forms' // necesario agregarlo aqui
import {TestBed, async} from '@angular/core/testing'
import {AppComponent} from './app.component'
import {HttpClient, HttpClientModule} from '@angular/common/http'
/** Registramos el locale ES para formatear números */
import {CommonModule} from '@angular/common';
import {registerLocaleData} from '@angular/common';
import localeEs from '@angular/common/locales/es';
import Conversor from '../domain/conversor';

registerLocaleData(localeEs)

describe('AppComponent', () => {
  let fixture
  let componente
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        // agregar dependencias necesarias
        FormsModule,
        CommonModule
      ]
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
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('h1').textContent).toContain('Conversor Angular')
  }))
  it('al convertir millas a kilómetros desde el modelo debe dejar en un p la conversión en kilómetros y 3 decimales con coma', async(() => {
    const conversor = componente.conversor
    conversor.millas = 100
    conversor.convertir()
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('p').textContent).toContain('160,934')
  }))
  it('al convertir millas a kilómetros desde la vista debe dejar en un p la conversión en kilómetros y 3 decimales con coma', async(() => {
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
