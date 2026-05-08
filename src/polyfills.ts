import { loadTranslations } from '@angular/localize';
import { BrowserStorage } from './app/shared/utils/browser-storage';
import { LANGUAGE_STORAGE_KEY, LanguageHelper } from './app/shared/utils/language-helper';
import { environment } from './environments/environment';

const languageStorageKey = `${environment.localStoragePrefix}${LANGUAGE_STORAGE_KEY}`;
const storedLanguage = BrowserStorage.getLocalStorageItem(languageStorageKey);
const browserLanguages = navigator.languages.length ? navigator.languages : [navigator.language];
const language = storedLanguage
  ? LanguageHelper.normalizeLanguageCode(storedLanguage)
  : LanguageHelper.getPreferredLanguageCode(browserLanguages);

document.documentElement.lang = language;
BrowserStorage.setLocalStorageItem(languageStorageKey, language);

if (language === 'es') {
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
    'compare-tool.remove-person': 'Eliminar persona',
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

    'compare-tool-details.title': 'Hoy habeis ganado',
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
    'compare-tool-details.total-expected-chart': 'Gráfica de total esperado',
    'compare-tool-details.hours-worked-chart': 'Gráfica de horas trabajadas',

    'tiles.stopwatch': 'Cronómetro',
    'tiles.this-hour': 'Esta hora',
    'tiles.today': 'Hoy',
    'tiles.this-week': 'Esta semana',
    'tiles.this-month': 'Este mes',
    'tiles.this-year': 'Este año',

    'user-selection.what-is-their-name': 'Su nombre',
    'user-selection.what-is-your-name': 'Tu nombre',
    'user-selection.how-much-they-earn': 'Cuánto gana?',
    'user-selection.how-much-you-earn': 'Cuánto ganas?',
    'user-selection.their-working-week-is': 'Su semana de trabajo es',
    'user-selection.your-working-week-is': 'Tu semana de trabajo es',
    'user-selection.from': 'Desde',
    'user-selection.to': 'Hasta',
    'user-selection.mon': 'Lun',
    'user-selection.tue': 'Mar',
    'user-selection.wed': 'Mie',
    'user-selection.thu': 'Jue',
    'user-selection.fri': 'Vie',
    'user-selection.sat': 'Sab',
    'user-selection.sun': 'Dom',

    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado ',
    Sunday: 'Domingo',

    'menu.title': 'Mis ganancias Hoy',
    'menu.my-earnings': 'Mis ganancias',
    'menu.compare': 'Comparar',
    'menu.language': 'Idioma',
    'menu.open-navigation': 'Abrir navegación',
    'menu.about': 'Sobre la app',

    'user-validation.title': 'Faltan datos',
    'user-validation.name': 'Escribe un nombre',
    'user-validation.currency': 'Selecciona la divisa',
    'user-validation.period': 'Selecciona el periodo de pago',
    'user-validation.at-least-one-day': 'Selecciona al menos un día de la semana',
    'user-validation.from': "Selecciona la hora 'Desde'",
    'user-validation.to': "Selecciona la hora 'Hasta'",
    'user-validation.from-greater-than-to': "'Desde' debe ser antes que 'Hasta'",
    'user-validation.at-least-add-one-more': 'Añade al menos una persona más',
    'user-validation.got-it': 'Entendido!',
    'user-validation.type-how-much-they-earn': 'Escribe cuanto gana',
    'user-validation.type-how-much-you-earn': 'Escribe cuanto ganas',

    'about.title': 'Sobre la app',
    'about.calculations': 'Calculos',
    'about.first-paragraph-line-1':
      'Esta aplicación te permite calcular cuánto has ganado hoy o durante otros períodos.',
    'about.first-paragraph-line-2':
      "Usa la seccion de 'Comparar' para comparar tus ganancias con otros o contigo mismo si ganases una cantidad diferente.",
    'about.first-paragraph-line-3': 'No almacenamos ningún tipo de datos.',
    'about.first-paragraph-line-4': 'Los datos solo se almacenan en tu dispositivo.',
    'about.second-paragraph-line-1': 'Si tu salario es al mes o al año:',
    'about.second-paragraph-line-2':
      'Esto significa que ganas la misma cantidad mensual y anualmente, independientemente de la cantidad de días hábiles en el actual mes o año.',
    'about.second-paragraph-line-3':
      'Sin embargo, ganas una cantidad diferente cada hora, día y semana, dependiendo de cuántos días laborables haya en el mes o año actual.',
    'about.second-paragraph-line-4':
      'Cuantos menos días hábiles en un mes, más ganas por hora, día y semana durante ese mes.',
    'about.third-paragraph-line-1': 'Si tu salario es por hora, día o semana:',
    'about.third-paragraph-line-2':
      'Esto significa que ganas dependiendo de las horas, días o semanas que trabajes.',
    'about.third-paragraph-line-3':
      'Por lo tanto, la cantidad ganada mensual y anualmente variará dependiendo del número de días hábiles en el actual mes o año.',

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

    second: 'segundo',
    seconds: 'segundos',
    minute: 'minuto',
    minutes: 'minutos',
    hour: 'hora',
    hours: 'horas',

    person: 'Persona',

    'user-selection-model.person': 'Persona',
    'user-selection-model.you-start-work-in': 'Empiezas a trabajar en',
    'user-selection-model.you-are-off-until-next': 'Libras hasta el',
    'user-selection-model.at': 'a las',
    'user-selection-model.you-start-work-tomorrow-at': 'Trabajas mañana a las',

    'select-language.select': 'Selecciona un idioma',
  });
}
