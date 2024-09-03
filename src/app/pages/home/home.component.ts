import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {NgForOf} from "@angular/common";
import {ApiService} from "../../services/api.service";
import {Bodega} from "../../models/bodega";
import {Title} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bodegas: Bodega[] = [];
  totalEtiquetas: number = 0;
  searchQuery: string = '';
  filteredBodegas: Bodega[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.apiService.getBodegas().subscribe(data => {
      this.bodegas = data;
      this.filteredBodegas = data; // Initialize filteredBodegas with the full list
      this.titleService.setTitle(`Saborido Etiquetas - Vinos de Jerez`);
      this.totalEtiquetas = this.bodegas.reduce((sum, bodega) => sum + bodega.numEtiquetas, 0);
    });
  }

  goToBodega(id: string) {
    this.router.navigate(['/bodega', id]);
  }

  sortByVisits(): void {
    this.filteredBodegas.sort((a, b) => b.visitas - a.visitas);
  }

  sortByEtiquetas(): void {
    this.filteredBodegas.sort((a, b) => b.numEtiquetas - a.numEtiquetas);
  }

  searchBodegas(): void {
    this.filteredBodegas = this.bodegas.filter(bodega =>
      bodega.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  resetFilters(): void {
    this.searchQuery = '';
    this.filteredBodegas = [...this.bodegas];
  }
}
