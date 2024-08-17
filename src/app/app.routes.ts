import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {BodegaComponent} from "./pages/bodega/bodega.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'bodega/:id',
    component: BodegaComponent
  }
];

