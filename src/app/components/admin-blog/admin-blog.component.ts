import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-admin-blog',
  standalone: true,
  imports: [
    FormsModule,
    QuillEditorComponent
  ],
  templateUrl: './admin-blog.component.html',
  styleUrls: ['./admin-blog.component.css']
})
export class AdminBlogComponent {
  blog = {
    title: '',
    codBlog: '',
    imageUrl: '',
    description: '',
    content: ''
  };

  constructor(private blogService: ApiService) {}

  onSubmit(): void {
    this.blogService.createBlog(this.blog).subscribe(response => {
      // Handle response
    });
  }
}
