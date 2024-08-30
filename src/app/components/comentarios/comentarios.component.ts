// src/app/components/comentarios/comentarios.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Comentario } from '../../models/comentarios.model';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {
  @Input() codBodega: string = '';
  comments: Comentario[] = [];
  comment: Comentario = { nombre: '', email: '', mensaje: '', codBodega: '' };
  reply: Comentario = { nombre: '', email: '', mensaje: '', codBodega: '' };
  replyingTo: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getCommentsByCodBodega(this.codBodega);
  }

  submitComment() {
    this.comment.codBodega = this.codBodega;
    this.apiService.submitComment(this.comment).subscribe(response => {
      this.comments.push(response);
      this.comment = { nombre: '', email: '', mensaje: '', codBodega: '' }; // Reset the form
    });
  }

  submitReply() {
    this.reply.codBodega = this.codBodega;
    this.reply.idPadre = this.replyingTo;
    this.apiService.submitComment(this.reply).subscribe(response => {
      const parentComment = this.comments.find(comment => comment.id === this.replyingTo);
      if (parentComment) {
        parentComment.replies = parentComment.replies || [];
        parentComment.replies.push(response);
      }
      this.reply = { nombre: '', email: '', mensaje: '', codBodega: '' }; // Reset the form
      this.replyingTo = null;
    });
  }

  getCommentsByCodBodega(codBodega: string) {
    this.apiService.getCommentsByCodBodega(codBodega).subscribe(data => {
      this.comments = this.buildCommentTree(data);
    });
  }

  buildCommentTree(comments: Comentario[]): Comentario[] {
    const map = new Map<number, Comentario>();
    const roots: Comentario[] = [];

    comments.forEach(comment => {
      comment.replies = [];
      map.set(comment.id!, comment);
    });

    comments.forEach(comment => {
      if (comment.idPadre) {
        const parent = map.get(comment.idPadre);
        parent?.replies?.push(comment);
      } else {
        roots.push(comment);
      }
    });

    return roots;
  }

  replyToComment(commentId: number | undefined) {
    if (commentId !== undefined) {
      this.replyingTo = commentId;
    }
  }
}
