import { Component, LOCALE_ID, OnInit, Renderer2 } from '@angular/core';
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
    private titleService: Title,
    private renderer: Renderer2
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
        this.addStructuredData();
      });
    }
  }

  addStructuredData() {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://saboridoetiquetas.es/blog/${this.blog.codBlog}`
      },
      "headline": this.blog.title,
      "image": this.blog.imageUrl,
      "datePublished": this.blog.createdAt,
      "dateModified": this.blog.createdAt,
      "author": {
        "@type": "Person",
        "name": "Antonio Saborido"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Saborido Etiquetas",
        "logo": {
          "@type": "ImageObject",
          "url": "https://saboridoetiquetas.es/assets/logo.png"
        }
      },
      "description": this.blog.description
    };
    script.text = JSON.stringify(jsonLd);
    this.renderer.appendChild(document.head, script);
  }
}
