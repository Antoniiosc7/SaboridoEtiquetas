import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  message: string = '';
  show: boolean = false;

  showNotification(message: string): void {
    this.message = message;
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 3000);
  }
}
