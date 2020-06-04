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


        'my-earnings-details.you-are-off': 'Hoy libras!',
        'my-earnings-details.nothing-yet': 'Nada todavia',
        'my-earnings-details.you-have-already-earned': 'Hoy ya has ganado',
        'my-earnings-details.more-to-go': 'mas para acabar',
        'my-earnings-details.you-earned': 'Hoy ganaste',
        'my-earnings-details.done-for-today': 'Has acabado por hoy!',
        'my-earnings-details.elapsed': '',
        'my-earnings-details.out-of': 'de',

        'compare-tool-details.title': 'Hoy habeis ganado',
        'compare-tool-details.charts': 'Gráficas',
        'compare-tool-details.details': 'Detalles',
        'compare-tool-details.total-expected': 'Total esperado',
        'compare-tool-details.hours-worked-per': 'Horas trabajadas',

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

        'menu.title': 'Mis ganancias Hoy',
        'menu.my-earnings': 'Mis ganancias',
        'menu.compare': 'Comparar',
        'menu.language': 'Idioma',
        'menu.about': 'Sobre nosotros',

        'share.share-on': 'Comparte en',
        'share.or-copy-link': 'O copia y comparte el link',
        'share.copy-link': 'Copiar link',
        'share.copied': 'Copiado!',

        'select-language.select': 'Selecciona un idioma'
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
