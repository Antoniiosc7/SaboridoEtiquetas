import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorIntl, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { ApiService } from '../../services/api.service';
import { Bodega } from '../../models/bodega';
import { MatCard, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle } from "@angular/material/card";
import { Title } from "@angular/platform-browser";
import {API_URL} from "../../../config";
import {CustomPaginatorIntl} from "../../services/custom-paginator-intl.service";

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
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent implements OnInit {
  bodega: Bodega | undefined;
  etiquetas: any[] = [];
  codBodega: string | null = null;
  displayedColumns: string[] = ['imgUrl'];
  totalImages: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

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
      this.fetchImages(this.currentPage);
    }
  }

  fetchImages(page: number): void {
    if (this.codBodega) {
      this.apiService.getImagesByCodBodegaAndPage(this.codBodega, page).subscribe(data => {
        this.etiquetas = data.images.map(img => ({ imgUrl: `${API_URL}/api/bodegas/${this.codBodega}/images/${img}` }));
        this.totalImages = data.totalImages;
      });
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.fetchImages(this.currentPage);
  }
}
