import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LucideAngularModule, icons as lucideIcons } from 'lucide-angular';
import { importProvidersFrom } from '@angular/core';


bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(LucideAngularModule.pick(lucideIcons))
  ]
}).catch(err => console.error(err));
