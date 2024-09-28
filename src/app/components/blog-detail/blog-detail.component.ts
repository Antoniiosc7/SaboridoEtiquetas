import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule, Location, DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import { Title } from '@angular/platform-browser';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }, DatePipe],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog: any;
  formattedDate: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location,
    private datePipe: DatePipe,
    private titleService: Title
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit() {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.apiService.getBlogById(blogId).subscribe(data => {
        this.blog = data;
        const date = new Date(this.blog.createdAt); // Ensure the date is a valid Date object
        this.formattedDate = this.datePipe.transform(date, 'd \'de\' MMMM, y', 'es-ES');
        this.titleService.setTitle(this.blog.title); // Set the page title to the blog title
      });
    }
  }
}
