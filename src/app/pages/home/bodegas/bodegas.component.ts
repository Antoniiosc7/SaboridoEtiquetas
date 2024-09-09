import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-bodegas',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './bodegas.component.html',
  styleUrls: ['./bodegas.component.css']
})
export class BodegasComponent implements OnInit {
  bodegas: any[] = [];
  searchQuery: string = '';
  filteredBodegas: any[] = [];
  paginatedBodegas: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  sortOrder: string = 'asc'; // 'asc' or 'desc'
  sortField: string = ''; // 'visitas', 'etiquetas', or 'nombre'
  totalPagesArray: number[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadBodegas();
  }

  loadBodegas() {
    this.apiService.getBodegas().subscribe(data => {
      this.bodegas = data;
      this.filteredBodegas = [...this.bodegas];
      this.updatePagination();
    });
  }

  searchBodegas() {
    this.filteredBodegas = this.bodegas.filter(bodega =>
      bodega.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.updatePagination();
  }

  sortByVisits() {
    this.sortField = 'visitas';
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.filteredBodegas.sort((a, b) => this.sortOrder === 'asc' ? a.visitas - b.visitas : b.visitas - a.visitas);
    this.updatePagination();
  }

  sortByEtiquetas() {
    this.sortField = 'etiquetas';
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.filteredBodegas.sort((a, b) => this.sortOrder === 'asc' ? a.numEtiquetas - b.numEtiquetas : b.numEtiquetas - a.numEtiquetas);
    this.updatePagination();
  }

  sortByName() {
    this.sortField = 'nombre';
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.filteredBodegas.sort((a, b) => this.sortOrder === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre));
    this.updatePagination();
  }

  resetFilters() {
    this.searchQuery = '';
    this.filteredBodegas = [...this.bodegas];
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredBodegas.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginatedBodegas = this.filteredBodegas.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const page = Number(target.value);
    this.currentPage = page;
    this.updatePagination();
  }

  goToBodega(id: string) {
    this.router.navigate(['/bodega', id]);
  }
}
