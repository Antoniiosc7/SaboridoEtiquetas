// src/app/pages/contacto/contacto.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  contactForm: FormGroup;
  showPopup: boolean = false;
  popupMessage: string = '';
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.apiService.sendContactForm(this.contactForm.value).subscribe(
        response => {
          this.isLoading = false;
          this.showPopupMessage('Mensaje enviado con éxito');
        },
        error => {
          this.isLoading = false;
          console.error('Error submitting form', error);
        }
      );
    }
  }

  showPopupMessage(message: string): void {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }
}
