# Conversor en Angular

[![Build Status](https://www.travis-ci.org/uqbar-project/eg-conversor-angular.svg?branch=master)](https://www.travis-ci.org/uqbar-project/eg-conversor-angular)

Este proyecto representa el clásico ejemplo del conversor de millas a kilómetros, generado con [Angular CLI](https://github.com/angular/angular-cli) versión 10.0.4, y modificado luego manualmente.

## Cómo probarlo

Desde el raíz del proyecto, en una consola, ejecutar:

```bash
ng serve
```

Y en el navegador cargar la página `http://localhost:4200/`

O bien directamente ejecutar en la terminal:

```bash
ng s -o # serve y open abre directamente el browser
```

## Generación inicial del proyecto

Seguimos los pasos que están en [la página de inicio de Angular](https://angular.io/guide/quickstart)

## Estructura de una aplicación en Angular

Toda aplicación tiene

- módulos, que agrupan funcionalidades
- componentes, que encapsulan una asociación vista (HTML)-modelo (en este caso en TypeScript) y que por defecto vienen acompañados de tests (*.spec, en TypeScript). Opcionalmente también tenemos un archivo de estilos asociado (css)

```bash
(nodo raíz)
 + src
   + app
     - app.component.css       -- estilo
     - app.component.html      -- vista
     - app.component.spec.ts   -- test
     - app.component.ts        -- componente que relaciona vista y su modelo (un objeto de dominio)
     - app.module.ts           -- módulo
   + domain
     - conversor.ts            -- objeto de dominio
```

Como es nuestro primer ejemplo, vamos a modificar el comportamiento de AppModule y AppComponent, que es el elemento inicial de nuestra aplicación en Angular. A futuro vamos a crear nuevos componentes y módulos.

# Conceptos principales

## Binding entre vista y modelo

![image](images/Arquitectura_Overview.png)

El conversor tiene un formulario html que permite ingresar valores. El _binding_ permite
relacionar un elemento visual con su correspondiente modelo de vista. En este caso el modelo de la vista es tan
sencillo que coincide con un objeto de negocio: un Conversor de millas a kilómetros.

El _binding_ puede ser:

- bidireccional, como en el caso de las **millas**, ya que un cambio en la vista puede provocar un cambio en su modelo, o bien un cambio en el modelo puede implicar que se dispare una actualización en la vista. 
- unidireccional, como en el caso de los **kilómetros**, ya que en el formulario HTML solo se visualiza la información (el usuario no ingresa la información en este caso, así que solo el modelo actualiza la vista)

Dado que el binding bidireccional tiene un costo (a medida que incorporamos más controles el sistema de notificaciones crece en complejidad), es importante diferenciar ambos tipos de binding:

```html
<input name="millas" class="form-control" [(ngModel)]="conversor.millas">  <!-- bidireccional-->
```

vs.

```html
<p class="lead">{{conversor.kilometros}}</p>   <!-- unidireccional -->
```

El binding de millas es "conversor.millas" lo que implica que en el modelo debe existir una referencia conversor (con una propiedad millas). Eso es lo que hacemos en la definición de nuestro componente:

```typescript
export class AppComponent {
  title = 'Conversor'
  conversor = new Conversor()
}
```

La implementación del objeto de dominio Conversor no es nada sorprendente:

```typescript
export class Conversor {
 
    millas = 0
    kilometros = 0

    convertir() {
        this.kilometros = this.millas * 1.60934
    }
}
```

## Validaciones

Queremos validar

- que no sea posible convertir un valor de milla nulo
- que el usuario no pueda ingresar valores alfabéticos para la milla

En caso de que alguno de esas condiciones ocurra, queremos mostrar un cartel de error representativo.

Para lograr esto, tenemos que poder referenciar a un control de nuestro form html. El formulario tiene ya un nombre -esto lo hizo Angular cuando le pedimos que creara una aplicación-:

```html
<form name="convertirForm" role="form">
```

Además hay que incorporar una anotación para el control de millas:

```html
<input name="millas" class="form-control" required 
    [(ngModel)]="conversor.millas" 
    #millas="ngModel"
```

Le decimos que el input millas es requerido (_required_) y además definimos una _template variable_ millas, que ahora podemos usar dentro del formulario html para preguntar si el input es válido o tiene errores específicos:

```html
<div *ngIf="millas.invalid && (millas.dirty || millas.touched)">
    <br>
    <div class="alert alert-danger">
    Error:
        <span *ngIf="millas.errors.required">¡Debe ingresar millas!</span>
        <span *ngIf="millas.errors?.pattern">Formato debe ser numérico</span>
    </div>
</div>
```

Además de utilizar esta secuencia de caracteres:

- `[()]` (_banana in a box_) para indicar binding bidireccional 
- y `{{}}` (_moustache_) para indicar binding unidireccional 

Tenemos el asterisco `*ngIf` que es una **directiva** propia de Angular para intercalar funcionalidades al html que es estático. Podemos acceder a la _template variable_ millas que anteriormente definimos, y consultar algunas propiedades:

- invalid: dice si el valor definido en dicho campo es correcto (también existe _valid_)
- dirty: si el usuario modificó el valor (el opuesto es _pristine_)
- touched: si el usuario pasó por ese control y saltó a otro (el opuesto es _untouched_) 

Para más información recomendamos leer [la página de validación de formularios de Angular](https://angular.io/guide/forms).

Entonces el ngIf mostrará el contenedor div de html si la condición encerrada entre las comillas se cumple.

## Pipes

Un concepto similar a los _transformers_ de Arena son los [_pipes_](https://angular.io/guide/pipes) que permiten definir un formato con n decimales con coma, en lugar del punto que por defecto muestra Angular. 

Primero vamos a agregar el paquete [angular localize](https://angular.io/guide/i18n#add-the-localize-package): 

```bash
ng add @angular/localize
```

Luego hay que importar la configuración regional española (también llamado _locale_ es) en el app.module.ts:

```typescript
import '@angular/common/locales/global/es'
``` 

Y ahora sí podemos utilizarlo en la vista, dentro del binding unidireccional para kilómetros:

```html
<p class="lead" *ngIf="!millas.errors">{{conversor.kilometros | number:'1.3-3':'es' }}</p>
```

Este concepto permite dar formato al valor que se encuentra a la izquierda del pipe, en nuestro caso

- el valor es conversor.kilometros
- le aplicamos formato de número
- con un dígito entero como mínimo
- y con 3 dígitos decimales mínimos y máximos

De esa manera el 0 se muestra como "0,000", y la conversión de 100 queda como se ve en la pantalla

![imagen](images/conversor_pipes.png) 

Para más información sobre los pipes que trae Angular pueden ver [esta página](https://angular.io/api?type=pipe)

## Testing

Angular trae un conjunto de tests al crear un proyecto, en este caso en el archivo `app.component.spec.ts`

Podemos ejecutar la prueba automatizada desde una terminal (de línea de comandos o bien la integrada de nuestro IDE):

```bash
> ng test --sourceMap=false --watch
```

- la configuración `watch` es para que levante un browser de Chrome, se ejecuten los tests y luego quede esperando a modificaciones
- el flag `sourceMap=false` permite mostrar mensajes de error expresivos cuando los tests tengan problemas de dependencia. Tenelo en cuenta si a veces te aparece un error críptico como

```bash
Failed to execute 'send' on 'XMLHttpRequest': Failed to load 'ng:///DynamicTestModule/AppComponent.ngfactory.js'
```

Los [source maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) son archivos que en este caso relacionan

- un archivo con definiciones hechas en Typescript
- con el correspondiente [javascript transpilado](https://scotch.io/tutorials/javascript-transpilers-what-they-are-why-we-need-them), que es el que termina ejecutando en el user agent. Ejemplos similares de transpilación: Xtend -> Java, que tiene un archivo .xtend, otro .java y el .xtendbin que funciona como source map.

### Dependencias

Un tema importante a la hora de correr los tests es que lo hacen en forma independiente de la aplicación Angular, por lo tanto debemos inyectar las dependencias que están en el @NgModule (recordemos que en este ejemplo es el archivo _app.module.ts_).

Para esto importamos la constante importsConversor que contiene los módulos BrowserModule y FormsModule.

```typescript
import { importsConversor } from './app.module';
```
- FormsModule lo necesitamos para poder levantar un mock de la pantalla

Además tenemos otros imports que se crean por defecto cuando generamos nuestra aplicación con el comando ng: nuestro componente AppComponent y un _mockeador_ de nuestro componente llamado TestBed que más adelante explicaremos, entre otros.

### Primeras pruebas

Veamos el primer test

```typescript
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
```

En el método beforeEach inicializamos dos variables muy importantes para poder hacer pruebas

- appComponent: un NgModule _mockeado_ por el componente de testing de Angular llamado TestBed
- componente: una referencia a nuestro componente de Angular, también mockeado (fixture.debugElement nos devuelve una representación del modelo DOM de nuestro HTML, apta para hacer pruebas)

El primer test valida que el componente sea un valor posible ([truthy](https://developer.mozilla.org/es/docs/Glossary/Truthy) es un valor diferente de nulo, _undefined_, 0, NaN, "", etc.)

## Tests que aplican sobre elementos del DOM inicial

Los siguientes tests validan

- que la página inicialmente tenga el título "Conversor"
- y que haya dentro de la página devuelta un tag H1 cuyo contenido sea "Conversor Angular"

```typescript
  it(`debe tener como título 'Conversor'`, async(() => {
    expect(componente.title).toEqual('Conversor')
  }))
  it('debe aparecer el título Conversor Angular en un tag h1', async(() => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('h1').textContent).toContain('Conversor Angular')
  }))
```

Es fácil verificar que el título del componente sea "Conversor" porque lo inicializamos en la definición (archivo app.component.ts)

```typescript
export class AppComponent {
  title = 'Conversor'
  conversor = new Conversor()
}
```

En cuanto al test que verifica el tag h1, las variables title y conversor de nuestro AppComponent no son suficientes, tenemos que indagar en el DOM de la página html devuelta, dentro de la variable compiled. Efectivamente nuestro "nativeElement" es una simplificación del DOM que parsea el browser, y dentro de esa jerarquía de elementos visuales que tiene el DOM podemos hacer la consulta [querySelector](https://www.w3schools.com/jsref/met_document_queryselector.asp), por

- un tag específico (en este caso, 'h1')
- por un identificador (anteponiendo un numeral)
- por cualquier elemento que tenga una clase determinada (utilizando como prefijo un punto: '.')
- o bien por cualquier otro atributo, como veremos a continuación

Entonces compiled.querySelector('h1') nos devuelve el elemento h1, y al pedirle su textContent (la propiedad innerHTML) debe coincidir con "Convesor Angular".

> De todas maneras, estos tests no tienen mucho valor, solamente los presentamos por una cuestión didáctica, para introducir diferentes conceptos. A partir de aquí, nos concentraremos en testear la aplicación desde la perspectiva de la interacción del usuario.

## Tests de interacción con el usuario

Por último, ¿qué sucede si ingresamos el valor 100? Nuestro valor esperado es 160,934. Para ello podemos

- modificar el componente de Angular (recordemos que AppComponent tiene como propiedades title y conversor que apunta a un objeto de dominio Conversor)
- o bien simular la interacción de carga de un usuario (donde ingresa el valor "100" como string en el elemento input millas, y luego dispara el botón Convertir)

El resultado se captura del DOM como vimos anteriormente. Mostramos uno de los tests:

```typescript
  it('conversión de millas a kilómetros exitosa con 3 decimales', async(() => {
    componente.conversor.millas = 100

    const convertirButton = appComponent.nativeElement.querySelector('[data-testid="convertir"')
    convertirButton.click()
    appComponent.detectChanges()

    appComponent.whenStable().then(() => {
      const compiled = appComponent.nativeElement
      expect(compiled.querySelector('[data-testid="kilometros"]').textContent).toContain('160,934')
    })
  }))
```

Fíjense esta línea:

```ts
expect(compiled.querySelector('[data-testid="kilometros"]').textContent).toContain('160,934')
```

Para encontrar el valor de los kilómetros, seguimos la recomendación de [esta página](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change), evitamos trabajar con

- un tag html específico (`<p>`)
- o un id dentro de la página
- class
- o cualquier otro tag html que pueda ser utilizado para la vista
- y en cambio definimos un atributo específico `data-testid` de HTML5:

```html
<p class="lead" id="kilometros" *ngIf="!millas.errors" data-testid="kilometros">
```

El prefijo `data-` hace que los navegadores lo ignoren en el render, pero los tests sí lo van a necesitar, y de esa manera no interfieren los atributos propios para mostrar la página vs. los atributos para testearla. Bueno, hay cierta intrusión porque si no tuviéramos tests tendríamos menos tags que leer, pero es un costo lo suficientemente justo.

Lo mismo hemos hecho para disparar el botón que convierte de millas a kilómetros.

El mensaje `fixture.detectChanges()` es necesario para disparar los eventos de actualización de modelo a vista propios de Angular.

Para más información recomendamos leer [la documentación oficial de Angular](https://angular.io/guide/testing)
