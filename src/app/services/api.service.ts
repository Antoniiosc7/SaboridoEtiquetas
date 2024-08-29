// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config';
import { Bodega } from '../models/bodega';
import { Etiquetas } from '../models/etiqueta';
import {ContactForm} from "../models/contact-form.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = `${API_URL}/api/`;

  constructor(private http: HttpClient) {}

  getBodegas(): Observable<Bodega[]> {
    return this.http.get<Bodega[]>(this.apiUrl + 'bodegas');
  }

  getBodegasByCod(codBodega: string): Observable<Bodega> {
    return this.http.get<Bodega>(this.apiUrl + `bodegas/${codBodega}`);
  }

  actualizaContador(codBodega: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + `bodegas/${codBodega}/visita`);
  }

  getImagesByCodBodegaAndPage(codBodega: string, page: number): Observable<Etiquetas> {
    return this.http.get<Etiquetas>(this.apiUrl + `bodegas/${codBodega}/images?page=${page}`);
  }

  sendContactForm(data: ContactForm): Observable<any> {
    let params = new HttpParams()
      .set('name', data.nombre)
      .set('email', data.email)
      .set('message', data.mensaje);
    return this.http.get(this.apiUrl + 'contact/submit', { params: params });
  }
}
