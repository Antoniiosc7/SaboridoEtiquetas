// src/app/pages/bodega/bodega.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ApiService } from '../../services/api.service';
import { Bodega } from '../../models/bodega';
import {MatCard, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from "@angular/material/card";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-bodega',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatTableModule,
    MatPaginatorModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardImage,
    MatCardTitle
  ],
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent implements OnInit {
  bodega: Bodega | undefined;
  etiquetas: any[] = [];
  codBodega: string | null = null;
  displayedColumns: string[] = ['imgUrl'];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.codBodega = this.route.snapshot.paramMap.get('id');
    if (this.codBodega) {
      this.apiService.getBodegasByCod(this.codBodega).subscribe(data => {
        this.bodega = data;
        this.titleService.setTitle(`${data.nombre} - Saborido Etiquetas`);

      });
      this.apiService.actualizaContador(this.codBodega).subscribe();
    }

    this.etiquetas = [
      { nombre: 'Etiqueta 1', imgUrl: 'assets/etiqueta1.jpg' },
      { nombre: 'Etiqueta 2', imgUrl: 'assets/etiqueta2.jpg' },
      // Add more etiquetas as needed
    ];
  }
}
