import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  bodegas = [
    { id: 1, nombre: 'Bodega A', imgUrl: 'assets/bodegaA.jpg' },
    { id: 2, nombre: 'Bodega B', imgUrl: 'assets/bodegaB.jpg' },
    // Datos ejemplo, se deberían cargar desde un servicio
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Aquí cargaríamos las bodegas de un endpoint
  }

  goToBodega(id: number) {
    this.router.navigate(['/bodega', id]);
  }
}
