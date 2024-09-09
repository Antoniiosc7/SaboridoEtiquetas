import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgIf } from "@angular/common";
import { NotificationComponent } from "../../../components/notification/notification.component";

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [
    NgIf,
    NotificationComponent
  ],
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent {
  @Input() imageUrl: string | null = null;
  @Input() disablePrev: boolean = false;
  @Input() disableNext: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close.emit();
    } else if (event.key === 'ArrowRight' && !this.disableNext) {
      this.next.emit();
    } else if (event.key === 'ArrowLeft' && !this.disablePrev) {
      this.prev.emit();
    }
  }

  copyLink(notification: NotificationComponent): void {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      notification.showNotification('Enlace copiado al portapapeles');
    });
  }
}
