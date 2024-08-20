import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
    imports: [
        RouterLink,

    ],
  templateUrl: './cookie-policy.component.html',
  styleUrl: './cookie-policy.component.css'
})
export class CookiePolicyComponent {
  constructor() { }

  acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    window.location.reload();
  }

  rejectCookies() {
    localStorage.setItem('cookiesAccepted', 'false');
    window.location.reload();
  }
}
