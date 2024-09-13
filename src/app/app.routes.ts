// app.routes.ts
import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {BodegaComponent} from "./pages/bodega/bodega.component";
import {ContactoComponent} from "./pages/contacto/contacto.component";
import {PrivacidadComponent} from "./pages/privacidad/privacidad.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {BodegasComponent} from "./pages/home/bodegas/bodegas.component";
import {AdminBlogComponent} from "./components/admin-blog/admin-blog.component";
import {authGuard} from "./auth.guard";
import {LoginComponent} from "./pages/login/login.component";
import {BlogComponent} from "./components/blog/blog.component";
import {BlogDetailComponent} from "./components/blog-detail/blog-detail.component";

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
  { path: 'bodegas', component: BodegasComponent },
  { path: 'admin/blog', component: AdminBlogComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'blogs', component: BlogComponent },
  { path: 'blog/:id', component: BlogDetailComponent },
  { path: '**', component: NotFoundComponent }

];
