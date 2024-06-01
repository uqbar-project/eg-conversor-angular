# Conversor en Angular

[![Build](https://github.com/uqbar-project/eg-conversor-angular/actions/workflows/build.yml/badge.svg)](https://github.com/uqbar-project/eg-conversor-angular/actions/workflows/build.yml) ![Coverage](./badges/eg-conversor-angular/coverage.svg)

Este proyecto representa el clásico ejemplo del conversor de millas a kilómetros, generado con [Angular CLI](https://github.com/angular/angular-cli) versión 16, y modificado luego manualmente.

## Cómo probarlo

Desde el raíz del proyecto, en una consola, ejecutar:

```bash
npm start
```

- ver cómo se implementa el conversor utilizando [binding y template](./docs/binding-template.md) 
- ver cómo se implementa el conversor utilizando [signals](./docs/signals.md)

### Primeras pruebas

Veamos el primer test

```typescript
describe('Tests de AppComponent', () => {
  let appComponent: ComponentFixture<AppComponent>
  let componente: { conversor: { millas: number } }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: importsConversor
    }).compileComponents()
    appComponent = TestBed.createComponent(AppComponent)
    componente = appComponent.debugElement.componentInstance
    appComponent.detectChanges()
  })

  it('debe crear correctamente la aplicación', waitForAsync(() => {
    expect(componente).toBeTruthy()
  }))
```

En el método beforeEach inicializamos dos variables muy importantes para poder hacer pruebas

- appComponent: un NgModule _mockeado_ por el componente de testing de Angular llamado TestBed
- componente: una referencia a nuestro componente de Angular, también mockeado

El primer test valida que el componente sea un valor posible ([truthy](https://developer.mozilla.org/es/docs/Glossary/Truthy), este test tiene sentido como **smoke test** de que cualquier cambio que introduzcamos no rompa el componente. Es un test básico de que la aplicación levanta.

## Tests que aplican sobre elementos del DOM inicial

Si queremos testear la conversión ¿cómo simulamos la carga de un valor? Tenemos que encontrar el input dentro de la página, las opciones son 

- por el tag `<input>`: tiene la desventaja de que el tag HTML tiene un sentido semántico y es visible por el usuario, está sujeto a cambios. Podemos cambiar un span por un div, o un button por un anchor (a href) y eso revela la fragilidad de nuestros tests.
- por un id: si bien soporta mejor el cambio estético, sigue siendo algo que el navegador renderiza en la página.
- por un atributo que tiene el tag, en este caso `data-testid`, será la opción que recomendemos nosotros, basado en [esta página](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change). El prefijo `data-` hace que los navegadores lo ignoren en el render, pero los tests lo pueden utilizar. De esa manera no interfieren los atributos propios para mostrar la página vs. los atributos para testearla. Bueno, hay cierta intrusión porque si no tuviéramos tests tendríamos menos tags que leer, pero es un costo lo suficientemente justo.

Nuestro html queda:

```html
<input data-testid="millas" name="millas" ...
```

Y en los tests tendremos una función de alto nivel para buscar un elemento por `data-testid`:

```ts
const buscarElemento = (testId: string) => {
  const compiled = appComponent.debugElement.nativeElement
  return compiled.querySelector(`[data-testid="${testId}"]`)
}
```

El _nativeElement_ es una simplificación del DOM que parsea el browser, y dentro de esa jerarquía de elementos visuales que tiene el DOM podemos hacer la consulta [querySelector](https://www.w3schools.com/jsref/met_document_queryselector.asp), por

- un tag específico (en este caso, 'h1')
- por un identificador (anteponiendo un numeral)
- por cualquier elemento que tenga una clase determinada (utilizando como prefijo un punto: '.')
- o bien por cualquier otro atributo, como será nuestro caso

Un detalle importante es que la función está definida dentro del contexto de los tests, por eso la referencia appComponent existe. Si la definiéramos afuera tendríamos que recibir `appComponent` como parámetro de la función.

## Tests de interacción con el usuario

Por último, ¿qué sucede si ingresamos el valor 100? Nuestro valor esperado es 160,934. Para ello podemos

- modificar el componente de Angular (recordemos que AppComponent tiene como propiedades title y conversor que apunta a un objeto de dominio Conversor)
- o bien simular la interacción de carga de un usuario (donde ingresa el valor "100" como string en el elemento input millas, y luego dispara el botón Convertir)

El resultado se captura del DOM como vimos anteriormente. Mostramos uno de los tests:

```ts
  it('conversión de millas a kilómetros exitosa con 3 decimales', () => {
    const millasInput = buscarElemento('millas')
    millasInput.value = 100
    millasInput.dispatchEvent(new Event('input'))

    const convertirButton = buscarElemento('convertir')
    convertirButton.click()

    appComponent.detectChanges()
    const resultado = buscarElemento('kilometros')
    expect(resultado.textContent).toContain('160,934')
  })
```

En la solución encontrarás algunas abstracciones adicionales, aquí por motivos didácticos queremos concentrarnos en el flujo de interacciones:

- cargamos un valor en el componente
- luego simulamos que la persona usuaria presiona el botón "Convertir"

Para más información recomendamos leer [la documentación oficial de Angular](https://angular.io/guide/testing)
