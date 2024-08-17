import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-bodega',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})

export class BodegaComponent {
  bodega: any;
  etiquetas: any[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // Aquí cargaríamos los datos de la bodega y etiquetas de un servicio
    this.bodega = {
      id: id,
      nombre: 'Bodega A',
      descripcion: 'Descripción de la Bodega A',
    };

    this.etiquetas = [
      { nombre: 'Etiqueta 1', imgUrl: 'assets/etiqueta1.jpg' },
      { nombre: 'Etiqueta 2', imgUrl: 'assets/etiqueta2.jpg' },
    ];
  }
}
