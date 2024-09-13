import {Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {isPlatformBrowser, LocationStrategy, NgForOf, NgIf} from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ApiService } from '../../services/api.service';
import { Bodega } from '../../models/bodega';
import { MatCard, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle } from "@angular/material/card";
import { DomSanitizer, SafeHtml, Title } from "@angular/platform-browser";
import {API_URL, COMENTARIOS, WEB_URL} from "../../../config";
import { CustomPaginatorIntl } from "../../services/custom-paginator-intl.service";
import { MatSelectModule } from '@angular/material/select';
import { ComentariosComponent } from "../../components/comentarios/comentarios.component";
import {ImageModalComponent} from "./image-modal/image-modal.component";

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
    MatCardTitle,
    MatSelectModule,
    ComentariosComponent,
    ImageModalComponent
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
  codBodega: string = '';
  displayedColumns: string[] = ['imgUrl1', 'imgUrl2'];
  totalImages: number = 0;
  pageSize: number = 20;
  currentPage: number = 1;
  selectedImage: string | null = null;
  totalPages: number = 0;
  pageOptions: number[] = [];
  comentarios: boolean=false
  disablePrev: boolean = false;
  disableNext: boolean = false;

  @ViewChild('etiquetasTable', { static: false }) etiquetasTable: ElementRef<HTMLDivElement> | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private titleService: Title,
    private sanitizer: DomSanitizer,
    private locationStrategy: LocationStrategy,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.comentarios = COMENTARIOS === 'true';
    const codBodegaParam = this.route.snapshot.paramMap.get('id');
    this.codBodega = codBodegaParam ? codBodegaParam : '';
    const pageParam = this.route.snapshot.queryParamMap.get('pagina');
    this.currentPage = pageParam ? +pageParam : 1;
    this.route.queryParams.subscribe(params => {
      const etiqueta = params['etiqueta'];
      if (etiqueta) {
        this.selectedImage = `${WEB_URL}/assets/bodegas/${this.codBodega}/${etiqueta}`;
      }
    });
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
        const images = data.images.map(img => ({ imgUrl: `${WEB_URL}/assets/bodegas/${this.codBodega}/${img}` }));
        this.etiquetas = [];
        for (let i = 0; i < images.length; i += 2) {
          this.etiquetas.push({
            imgUrl1: images[i]?.imgUrl || null,
            imgUrl2: images[i + 1]?.imgUrl || null
          });
        }
        this.totalImages = data.totalImages;
        this.totalPages = Math.ceil(this.totalImages / this.pageSize);
        this.pageOptions = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.scrollToTop();
      });
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pagina: this.currentPage },
      queryParamsHandling: 'merge'
    });
    this.fetchImages(this.currentPage);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pagina: this.currentPage },
      queryParamsHandling: 'merge'
    });
    this.fetchImages(this.currentPage);
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }  }

  navigateImage(direction: 'prev' | 'next'): void {
    const currentIndex = this.etiquetas.findIndex(etiqueta =>
      etiqueta.imgUrl1 === this.selectedImage || etiqueta.imgUrl2 === this.selectedImage
    );

    if (currentIndex !== -1) {
      let newIndex = currentIndex;
      let newImage: string | null = null;

      if (direction === 'next') {
        if (this.selectedImage === this.etiquetas[currentIndex].imgUrl1 && this.etiquetas[currentIndex].imgUrl2) {
          newImage = this.etiquetas[currentIndex].imgUrl2;
        } else if (currentIndex < this.etiquetas.length - 1) {
          newIndex = currentIndex + 1;
          newImage = this.etiquetas[newIndex].imgUrl1;
        } else {
          this.handleCloseModal(); // Cerrar el modal si es la última imagen
          return;
        }
      } else {
        if (this.selectedImage === this.etiquetas[currentIndex].imgUrl2 && this.etiquetas[currentIndex].imgUrl1) {
          newImage = this.etiquetas[currentIndex].imgUrl1;
        } else if (currentIndex > 0) {
          newIndex = currentIndex - 1;
          newImage = this.etiquetas[newIndex].imgUrl2 || this.etiquetas[newIndex].imgUrl1;
        } else {
          this.handleCloseModal(); // Cerrar el modal si es la primera imagen
          return;
        }
      }

      this.selectedImage = newImage;
      this.updateNavigationButtons(newIndex);

      if (newImage) {
        const imageName = newImage.split('/').pop();
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { etiqueta: imageName },
          queryParamsHandling: 'merge'
        });
      }
    }
  }

  updateNavigationButtons(currentIndex: number): void {
    this.disablePrev = currentIndex === 0 && this.selectedImage === this.etiquetas[0].imgUrl1;
    this.disableNext = false; // No deshabilitar el botón "Siguiente"
  }

  enlargeImage(imgUrl: string) {
    this.selectedImage = imgUrl;
    const currentIndex = this.etiquetas.findIndex(etiqueta =>
      etiqueta.imgUrl1 === imgUrl || etiqueta.imgUrl2 === imgUrl
    );
    this.updateNavigationButtons(currentIndex);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { etiqueta: imgUrl.split('/').pop() },
      queryParamsHandling: 'merge'
    });
  }

  closeImage() {
    this.selectedImage = null;
    this.disablePrev = false;
    this.disableNext = false;
    const url = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: { etiqueta: null },
      queryParamsHandling: 'merge'
    }).toString();
    this.locationStrategy.replaceState({}, '', url, '');
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  getSanitizedDescription(description: string): SafeHtml {
    const formattedDescription = description.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(`<div class="justified-text">${formattedDescription}</div>`);
  }

  handleCloseModal(): void {
    this.closeImage();
  }
}
