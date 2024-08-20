import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {NgForOf} from "@angular/common";
import {ApiService} from "../../services/api.service";
import {Bodega} from "../../models/bodega";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bodegas: Bodega[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.apiService.getBodegas().subscribe(data => {
      this.bodegas = data;
      this.titleService.setTitle(`Saborido Etiquetas - Vinos de Jerez`);

    });
  }

  goToBodega(id: string) {
    this.router.navigate(['/bodega', id]);
  }
}
