import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [],
  templateUrl: './privacidad.component.html',
  styleUrl: './privacidad.component.css'
})
export class PrivacidadComponent implements OnInit{
  constructor(
    private titleService: Title
  ) { }

  ngOnInit(): void {
      this.titleService.setTitle(`Privacidad y Cookies - Saborido Etiquetas`);
  }
}
