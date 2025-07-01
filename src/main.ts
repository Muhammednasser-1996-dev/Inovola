import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { TranslateService } from '@ngx-translate/core';

bootstrapApplication(AppComponent, appConfig)
  .then((ref) => {
    const injector = ref.injector;
    const translate = injector.get(TranslateService);
    translate.addLangs(['en', 'ar']);
    const savedLang = localStorage.getItem('lang') || 'en';
    translate.setDefaultLang('en');
    translate.use(savedLang).subscribe(() => {
      console.log('Translations loaded for', savedLang);
    });
    setDir(savedLang);
    translate.onLangChange.subscribe(event => setDir(event.lang));
    function setDir(lang: string) {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  })
  .catch((err) => console.error(err));
