import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import {NgForOf} from "@angular/common";
import {ApiService} from "../../services/api.service";
import {Bodega} from "../../models/bodega";
import {Title} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {BodegasComponent} from "./bodegas/bodegas.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    BodegasComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bodegas: Bodega[] = [];
  totalEtiquetas: number = 0;
  filteredBodegas: Bodega[] = [];

  constructor(
    private apiService: ApiService,
    private titleService: Title,
    protected router: Router
  ) { }

  ngOnInit(): void {
    this.loadBodegas();
  }

  loadBodegas(): void {
    this.apiService.getBodegas().subscribe(data => {
      this.bodegas = data;
      this.filteredBodegas = data; // Initialize filteredBodegas with the full list
      this.titleService.setTitle(`Saborido Etiquetas - Vinos de Jerez`);
      this.totalEtiquetas = this.bodegas.reduce((sum, bodega) => sum + bodega.numEtiquetas, 0);
    });
  }


}
