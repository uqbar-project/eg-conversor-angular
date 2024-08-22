# Ejemplo Conversor - Signals Angular

En este ejemplo se muestra como crear un conversor de millas a kilómetros en la que podemos aplicar los `signals` de Angular.

## ZoneJS

Anteriormente a la version 16, siempre se utilizaba `zonejs` para detectar los cambios en los componentes.

Cualquier cambio en la aplicación es detectado por zonejs y se activa la detección de cambios en los componentes. En ese momento Angular recorre el árbol de componentes y verifica si hay cambios en los estados de los mismos que afectan a la vista, si los hay, se actualizan en la vista.

## Problema

El problema que tiene esta forma de detección de cambios es que se recorren todos los componentes del árbol, sin importar si hay cambios o no en los mismos. Ésto genera un consumo de recursos innecesario. Por lo que viene **super signals** a solucionar este problema.


## Signals al rescate

> Los signals permiten la creación de relaciones reactivas entre datos: cuando un valor cambia, los valores que dependen de él son notificados y se actualizan automáticamente.

Los signals se basan en el concepto de `Producers` y `Consumers`. Los producers son los que emiten los cambios y los consumers son los que reciben los cambios sin la necesidad de recorrer todo el árbol.

### Creación de un signal

El proceso de crear un signal es muy simple. Solo debemos asignar a una variable el resultado de la función `signal` y pasarle como parámetro el valor inicial del mismo.

``` typescript
millas = signal(0)
```

### Consumir un signal

La forma de obtener el valor de un signal tambien es muy sencilla, solamente hay que llamar a millas como si fuera un getter.

``` typescript
millas()
```

Por ejemplo, podemos utilizarlo en el HTML de la siguiente forma:

```html
<div class="unidad">millas()</div>
```

Desde aquí vamos a poder manejarlo de la misma manera que hacíamos con otros parámetros de los componentes. Por ejemplo aplicándoles pipes o transformaciones.

```html
<div class="unidad">{{millas() | number: '1.1-2':locale}}</div>
```

### Emitir un signal (Producers)

Para emitir un _signal_, debemos hacer un cambio en el valor del mismo. Para esto tenemos 2 opciones diferentes:

### Set

Para setear un valor _x_ en el signal, debemos llamar a la funcion `set` del mismo y pasarle como parametro el nuevo valor.

``` typescript
millas.set(53);
```

### Update

Para actualizar un valor _x_ en el signal, debemos llamar a la funcion `update` del mismo y pasarle como parametro una funcion que recibe como parametro el valor actual del signal y retorna el nuevo valor.

```ts
millas.update((millas) => millas + 1);
```


## Consumir un signal (Consumers)

Además del `getter` que se utiliza en los signals para consumirlos, existen otras dos formas diferentes de consumir un cambio emitido con alguno de los métodos anteriores.

### Computed

La funcion `computed` nos permite crear un signal que depende de otros signals. Es decir, que cuando alguno de los signals que dependen de él cambia, el signal `computed` también cambia.

```ts
kilometros = computed(() => millas() * 1.60934)
```

En este caso, cuando cambie el signal de millas, también va a cambiar el signal de kilómetros utilizando el getter de millas y aplicándole la fórmula de conversión.

Podemos hacer cualquier tipo de operación que nos devuelva un valor dentro de la función _computed_. Lo más importante de todo ésto es que podemos utilizar un _computed_ como condicional donde solamente vamos a obtener una emisión de su valor cuando esa condición cambie, por ejemplo:

```ts
valido = computed(() => millas() > 0)
```

En este caso estamos haciendo una validación que el valor de millas sea mayor a 0. Si esto se cumple, el signal `valido` va a emitir un valor `true`, en caso contrario va a emitir un valor `false`. Pero mientras no se cumpla, aunque pasemos por los valores -5, -4, -3, -2 y -1, habiendo cambiado el valor 4 veces, el signal no va a emitir un cambio hasta que el valor de millas sea mayor a 0, recién ahí vamos a obtener un cambio en el signal `valido` y lo vamos a poder consumir. Esto tiene un alto potencial.


## Conclusión

A simple vista el `signal` no cambia nada en la interfaz gráfica. Pero hace que la misma sea mucho mas eficiente en la detección de cambios, lo que se traduce en un mejor rendimiento de la aplicación en comparación con `ZoneJS`.

Anteriormente existía la posibilidad de hacer algo parecido con `BehaviorSubject` de `RxJS`, pero no era tan sencillo de implementar como lo es con los `signals`, además de que utiliza observables, lo que nos obliga a ser cuidadosos con las suscripciones y desuscripciones de los mismos.

En este ejemplo se ven todos los casos de uso posibles de signals:

![signals](./images/conversor-signals.png)


## Ejemplo original

- [Conversor con signals en Angular 16 - por Nico Villamonte - 2023](https://github.com/uqbar-project/eg-conversor-signals-angular)