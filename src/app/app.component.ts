import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponent} from "./components/footer/footer.component";
import {HeaderComponent} from "./components/header/header.component";
import {CookiePolicyComponent} from "./components/cookie-policy/cookie-policy.component";
import {NgIf} from "@angular/common";
import {PlatformService} from "./services/platform.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, CookiePolicyComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  cookiesAccepted: boolean = false;

  constructor(private platformService: PlatformService) {}

  ngOnInit() {
    if (this.platformService.isBrowser()) {
      this.cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';
    }
  }
}
