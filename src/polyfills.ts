/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */


import { loadTranslations } from '@angular/localize';

let language = "en";

if (localStorage.getItem(`${environment.localStoragePrefix}language`)) {
    language = localStorage.getItem(`${environment.localStoragePrefix}language`);
}
else {
    language = navigator.language.substring(0, 2);
}

language = language.toLowerCase();

localStorage.setItem(`${environment.localStoragePrefix}language`, language);

if (language == "es") {

    loadTranslations({

        'index.title': 'Mis ganancias Hoy',
        'index.meta_description': 'Calcula cuanto has ganado ya hoy y compara con otros',
        'index.meta_og_description': 'Calcula cuanto has ganado ya hoy y compara con otros',

        'my-earnings.title': 'Vamos a ver cuanto has ganado hoy',
        'my-earnings.calculate': 'Calcular',
        'my-earnings.share-this': 'Compartir',
        'my-earnings.back': 'Atrás',
        'my-earnings.compare': 'Comparar',

        'compare-tool.title': 'Comparar ganancias con otros',
        'compare-tool.add-person': 'Añadir',
        'compare-tool.calculate': 'Calcular',
        'compare-tool.back': 'Atrás',
        'compare-tool.share-this': 'Compartir',
        'compare-tool.person': 'Persona',
        'compare-tool.remove-person-confirmation-text': '¿Quieres eliminar esta persona?',
        'compare-tool.cancel': 'Cancelar',
        'compare-tool.remove': 'Eliminar',

        'my-earnings-details.you-are-off': 'Hoy no trabajas!',
        'my-earnings-details.nothing-yet': 'Nada todavia',
        'my-earnings-details.you-have-already-earned': 'Hoy ya has ganado',
        'my-earnings-details.more-to-go': 'mas para acabar',
        'my-earnings-details.you-earned': 'Hoy ganaste',
        'my-earnings-details.done-for-today': 'Has acabado por hoy!',
        'my-earnings-details.elapsed': '',
        'my-earnings-details.out-of': 'de',

        'compare-tool-details.title': 'Hoy han ganado',
        'compare-tool-details.charts': 'Gráficas',
        'compare-tool-details.details': 'Detalles',
        'compare-tool-details.total-expected': 'Total esperado',
        'compare-tool-details.hours-worked-per': 'Horas trabajadas por',
        'compare-tool-details.already-earned': 'Ya ganado',
        'compare-tool-details.day': 'día',
        'compare-tool-details.week': 'semana',
        'compare-tool-details.month': 'mes',
        'compare-tool-details.year': 'año',
        'compare-tool-details.this-hour': 'esta hora',
        'compare-tool-details.today': 'hoy',
        'compare-tool-details.this-week': 'esta semana',
        'compare-tool-details.this-month': 'este mes',
        'compare-tool-details.this-year': 'este año',

        'tiles.stopwatch': 'Cronómetro',
        'tiles.this-hour': 'Esta hora',
        'tiles.today': 'Hoy',
        'tiles.this-week': 'Esta semana',
        'tiles.this-month': 'Este mes',
        'tiles.this-year': 'Este año',

        'user-selection.what-is-their-name': 'Cuál es su nombre',
        'user-selection.what-is-your-name': 'Cuál es tu nombre',
        'user-selection.how-much-they-earn': 'Cuánto ganan',
        'user-selection.how-much-you-earn': 'Cuánto ganas',
        'user-selection.their-working-week-is': 'Su semana de trabajo es',
        'user-selection.your-working-week-is': 'Tu semana de trabajo es',
        'user-selection.from': 'Desde',
        'user-selection.to': 'Hasta',
        'user-selection.mon': 'Lun',
        'user-selection.tue': 'Tue',
        'user-selection.wed': 'Mie',
        'user-selection.thu': 'Jue',
        'user-selection.fri': 'Vie',
        'user-selection.sat': 'Sab',
        'user-selection.sun': 'Dom',

        'Monday': 'Lunes',
        'Tuesday': 'Martes',
        'Wednesday': 'Miércoles',
        'Thursday': 'Jueves',
        'Friday': 'Viernes',
        'Saturday': 'Sábado ',
        'Sunday': 'Domingo',

        'menu.title': 'Mis ganancias Hoy',
        'menu.my-earnings': 'Mis ganancias',
        'menu.compare': 'Comparar',
        'menu.language': 'Idioma',
        'menu.about': 'Sobre la app',

        'user-validation.title': 'Faltan datos',
        'user-validation.name': 'Escribe un nombre',
        'user-validation.currency': 'Selecciona la divisa',
        'user-validation.period': 'Selecciona el periodo de pago',
        'user-validation.at-least-one-day': 'Selecciona al menos un día de la semana',
        'user-validation.from': 'Desde',
        'user-validation.to': 'Hasta',
        'user-validation.from-greater-than-to': '\'Desde\' debe ser antes que \'Hasta\'',
        'user-validation.at-least-add-one-more': 'Añade al menos una persona más',
        'user-validation.got-it': 'Entendido!',
        'user-validation.type-how-much-they-earn': 'Escribe cuanto gana',
        'user-validation.type-how-much-you-earn': 'Escribe cuanto ganas',

        'about.title': 'Sobre la app',
        'about.calculations': 'Calculos',
        'about.first-paragraph-line-1': 'Esta aplicación te permite calcular cuánto has ganado hoy o durante otros períodos.',
        'about.first-paragraph-line-2': 'Usa la seccion de \'Comparar\' para comparar tus ganancias con otros o contigo mismo si ganases una cantidad diferente.',
        'about.first-paragraph-line-3': 'No almacenamos ningún tipo de datos.',
        'about.first-paragraph-line-4': 'Los datos solo se almacenan en tu dispositivo.',
        'about.second-paragraph-line-1': 'Si tu salario es al mes o al año:',
        'about.second-paragraph-line-2': 'Esto significa que ganas la misma cantidad mensual y anualmente, independientemente de la cantidad de días hábiles en el actual mes o año.',
        'about.second-paragraph-line-3': 'Sin embargo, ganas una cantidad diferente cada hora, día y semana, dependiendo de cuántos días laborables haya en el mes o año actual.',
        'about.second-paragraph-line-4': 'Cuantos menos días hábiles en un mes, más ganas por hora, día y semana durante ese mes.',
        'about.third-paragraph-line-1': 'Si tu salario es por hora, día o semana:',
        'about.third-paragraph-line-2': 'Esto significa que ganas dependiendo de las horas, días o semanas que trabajes.',
        'about.third-paragraph-line-3': 'Por lo tanto, la cantidad ganada mensual y anualmente variará dependiendo del número de días hábiles en el actual mes o año.',

        'share.share-on': 'Comparte en',
        'share.or-copy-link': 'O copia y comparte el link',
        'share.copy-link': 'Copiar link',
        'share.copied': 'Copiado!',

        'frequencies.per-hour': 'a la hora',
        'frequencies.per-day': 'al día',
        'frequencies.per-week': 'a la semana',
        'frequencies.per-month': 'al mes',
        'frequencies.per-year': 'al año',

        'first-user-default-name': 'Tú',

        'second': 'segundo',
        'seconds': 'segundos',
        'minute:': 'minuto',
        'minutes': 'minutos',
        'hour': 'hora',
        'hours': 'horas',

        'user-selection-model.person': 'Persona',
        'user-selection-model.you-start-work-in': 'Empiezas a trabajar en',
        'user-selection-model.you-are-off-until-next': 'Libras hasta el siguiente',
        'user-selection-model.you-start-work-tomorrow-at': 'Trabajas mañana a las',

        'select-language.select': 'Selecciona un idioma',

        'page-not-found.title': '404 - Página no encontrada',
        'page-not-found.back': 'Atrás'
    });

}


/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.

/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags.ts';
 *
 * The flags allowed in zone-flags.ts are listed here.
 *
 * The following flags will work for all browsers.
 *
 * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
 * (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
 *
 *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 *  with the following flag, it will bypass `zone.js` patch for IE/Edge
 *
 *  (window as any).__Zone_enable_cross_context_check = true;
 *
 */

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js/dist/zone';  // Included with Angular CLI.
import { environment } from './environments/environment';


/***************************************************************************************************
 * APPLICATION IMPORTS
 */
