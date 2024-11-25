import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

const bodegas = [
  { name: 'valdespino', totalPages: 55 },
  { name: 'adolfo-capdepon', totalPages: 1 },
  { name: 'valderrama', totalPages: 7 },
  { name: 'ysasi', totalPages: 2 },
  { name: 'dom-ramos', totalPages: 2 },
  { name: 'nolasco', totalPages: 1 },
  { name: 'rm-romero', totalPages: 1 },
  { name: 'manjon', totalPages: 3 },
  { name: 'espinosa-montero', totalPages: 2 },
  { name: 'zorrilla', totalPages: 1 },
  { name: 'alvaro', totalPages: 2 },
  { name: 'ivison', totalPages: 4 },
  { name: 'findlater', totalPages: 1 },
  { name: 'bofemsa', totalPages: 1 },
  { name: 'otras', totalPages: 7 },
  { name: 'oneale', totalPages: 8 },
  { name: 'mirabal', totalPages: 2 },
  { name: 'orbaneja', totalPages: 8 },
  { name: 'diez-ysasi', totalPages: 1 },
  { name: 'palomino-vergara', totalPages: 11 },
  { name: 'bertemati', totalPages: 2 },
  { name: 'vergara-hermanos', totalPages: 1 },
  { name: 'de-baco', totalPages: 2 },
  { name: 'templar', totalPages: 1 },
  { name: 'perdiz', totalPages: 1 },
  { name: 'ducal-sanlucar', totalPages: 1 },
  { name: 'bella-vista', totalPages: 1 },
  { name: 'b-vergara', totalPages: 4 },
  { name: 'vergara-gordon', totalPages: 4 },
  { name: 'del-horno', totalPages: 3 },
  { name: 'wisdom-warter', totalPages: 14 }
];

const staticUrls = [
  { loc: 'https://saboridoetiquetas.es/', lastmod: '2024-08-30', changefreq: 'monthly', priority: 1.0 },
  { loc: 'https://saboridoetiquetas.es/contacto', lastmod: '2024-08-30', changefreq: 'monthly', priority: 0.8 },
  { loc: 'https://saboridoetiquetas.es/privacidad', lastmod: '2024-08-30', changefreq: 'monthly', priority: 0.8 },
  { loc: 'https://saboridoetiquetas.es/bodegas', lastmod: '2024-09-10', changefreq: 'monthly', priority: 0.8 },
  { loc: 'https://saboridoetiquetas.es/blogs', lastmod: '2024-09-28', changefreq: 'monthly', priority: 0.8 },
  { loc: 'https://saboridoetiquetas.es/blog/historia-xerez-sherry-jerez', lastmod: '2024-11-16', changefreq: 'monthly', priority: 0.7 },
  { loc: 'https://saboridoetiquetas.es/blog/vino-y-futbol-xerez', lastmod: '2024-11-16', changefreq: 'monthly', priority: 0.7 },
  { loc: 'https://saboridoetiquetas.es/blog/consejo-regulador-vino-jerez-etiquetas', lastmod: '2024-11-16', changefreq: 'monthly', priority: 0.7 },
];

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Route to generate sitemap dynamically
  server.get('/sitemap.xml', (req, res) => {
    const baseUrl = 'https://saboridoetiquetas.es';
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    staticUrls.forEach(url => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${url.loc}</loc>\n`;
      sitemap += `    <lastmod>${url.lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>${url.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${url.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    bodegas.forEach(bodega => {
      for (let page = 1; page <= bodega.totalPages; page++) {
        const url = `${baseUrl}/bodega/${bodega.name}${page > 1 ? `?pagina=${page}` : ''}`;
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${url}</loc>\n`;
        sitemap += `    <changefreq>weekly</changefreq>\n`;
        sitemap += `    <priority>0.8</priority>\n`;
        sitemap += `  </url>\n`;
      }
    });

    sitemap += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4001;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
