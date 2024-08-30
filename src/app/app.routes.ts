// app.routes.ts
import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {BodegaComponent} from "./pages/bodega/bodega.component";
import {ContactoComponent} from "./pages/contacto/contacto.component";
import {PrivacidadComponent} from "./pages/privacidad/privacidad.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'bodega/:id',
    component: BodegaComponent
  },
  { path: 'contacto', component: ContactoComponent },
  { path: 'privacidad', component: PrivacidadComponent },
  { path: '**', component: NotFoundComponent }

];
