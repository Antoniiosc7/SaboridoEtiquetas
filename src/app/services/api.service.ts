// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config';
import { Bodega } from '../models/bodega';
import { Etiquetas } from '../models/etiqueta';
import {ContactForm} from "../models/contact-form.model";
import {Comentario} from "../models/comentarios.model";
import {AuthResponseDTO, LoginDto} from "../models/auth-response.dto";

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
  submitComment(comment: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.apiUrl}comentarios/submit`, comment);
  }

  getCommentsByCodBodega(codBodega: string): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.apiUrl}comentarios/bodega/${codBodega}`);
  }
  sendContactForm(data: ContactForm): Observable<any> {
    let params = new HttpParams()
      .set('name', data.nombre)
      .set('email', data.email)
      .set('message', data.mensaje);
    return this.http.get(this.apiUrl + 'contact/submit', { params: params });
  }

  //BLOG
  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}blogs`);
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}blogs/${id}`);
  }

  createBlog(blog: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}blogs`, blog);
  }


  loginAsAdmin(loginDto: LoginDto): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}auth/login/admin`, loginDto);
  }
}
