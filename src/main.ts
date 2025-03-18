import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatComponent } from './app/component/chat/chat.component';
import { LoginComponent } from './app/component/login/login.component';

const routes = [
  { path: '', component: LoginComponent }, // экран входа
  { path: 'chat', component: ChatComponent } // чат
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FormsModule)
  ]
}).catch(err => console.error(err));
