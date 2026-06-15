# Project Articles and Admin Panel Plan

## Tujuan

Mengubah detail project dari modal singkat menjadi halaman artikel yang lengkap, SEO-friendly, dan mudah dikelola lewat admin panel.

Target akhirnya:

- Card project di homepage tetap dipakai untuk preview singkat.
- Saat project diklik, user diarahkan ke `/projects/[slug]`.
- Halaman detail berisi hero image, gallery, cerita project, stack, hasil, metrik, link GitHub, link demo, dokumentasi, dan related projects.
- Admin panel memiliki CRUD project article dengan editor bergaya Notion.
- Upload gambar otomatis diproses menjadi WebP/AVIF, dikompresi, dan dibuat beberapa ukuran.
- Area admin dilindungi dengan auth kuat, MFA, allowlist, rate limit, audit log, dan database policy.

## Keputusan Utama

Rekomendasi utama: gunakan pendekatan free-first.

Tahap sekarang:

- Public project article memakai data lokal di repository.
- Admin CRUD dibuat sebagai sandbox lokal memakai `localStorage` browser.
- Tidak ada dependency atau layanan berbayar yang dipaksa di tahap awal.

Tahap production gratis:

- Gunakan Supabase free tier untuk Auth, Postgres, Row Level Security, dan Storage.
- Gunakan middleware IP allowlist jika IP stabil.
- Gunakan MFA bawaan Supabase.
- Cloudflare Access, Tailscale, atau VPN menjadi opsi tambahan, bukan syarat awal.

Rekomendasi database production: gunakan Supabase free tier.

Alasannya:

- Portfolio ini Next.js, jadi Supabase cocok untuk auth, Postgres, storage, dan server-side API.
- Data project sebenarnya terstruktur: title, slug, status, tags, links, image, published_at, content blocks. Postgres lebih nyaman untuk query, indexing, sorting, dan filtering.
- Untuk editor seperti Notion, isi artikel bisa disimpan sebagai `jsonb` block content di Postgres.
- Supabase punya Row Level Security, Storage policy, Auth, MFA, dan bucket image dalam satu platform.
- Untuk project kecil-personal, beban operasional lebih rendah daripada merangkai MongoDB + auth + file storage + policy sendiri.

MongoDB tetap masuk akal kalau:

- Ingin semua konten murni document-based tanpa relasi.
- Sudah punya Atlas cluster aktif.
- Ingin fleksibilitas schema bebas dan tidak butuh policy SQL/RLS.

Namun untuk kebutuhan ini, Supabase lebih praktis dan lebih aman secara default jika RLS dikonfigurasi benar.

## Catatan Tentang IP dan MAC Whitelist

MAC address tidak bisa dijadikan whitelist untuk website publik.

Alasannya:

- MAC address hanya terlihat di jaringan lokal yang sama.
- Browser tidak memberi akses MAC address ke website karena alasan privasi dan keamanan.
- Server di internet hanya melihat IP publik/proxy, bukan MAC perangkat asli.

Alternatif yang realistis:

- IP allowlist di middleware untuk `/admin`.
- Cloudflare Access atau VPN kecil seperti Tailscale/WireGuard untuk layer tambahan.
- Supabase Auth dengan email admin tertentu.
- MFA wajib untuk admin.
- RLS dan server-side authorization tetap wajib walaupun IP sudah benar.

Rekomendasi paling aman:

1. Cloudflare Access atau Tailscale untuk gate luar.
2. Supabase Auth dengan email admin allowlist.
3. MFA TOTP wajib.
4. Next.js middleware untuk IP allowlist jika IP kamu stabil.
5. RLS di database agar API/browser tidak bisa menulis sembarangan.
6. Semua operasi write lewat server action/API route yang memvalidasi role admin.

## Arsitektur Route

```txt
/
  Homepage portfolio.
  Project cards hanya preview.

/projects
  Optional index semua project.

/projects/[slug]
  Public article page per project.

/admin/login
  Login admin.

/admin
  Admin dashboard ringkas.

/admin/projects
  List, search, filter, publish/unpublish project.

/admin/projects/new
  Create project article.

/admin/projects/[id]/edit
  Edit project article.

/api/admin/projects
  Server-side CRUD endpoint atau server action boundary.

/api/admin/uploads
  Upload image, convert, compress, save metadata.
```

## Struktur Folder Yang Disarankan

```txt
src/
  app/
    projects/
      page.tsx
      [slug]/
        page.tsx
    admin/
      layout.tsx
      page.tsx
      login/
        page.tsx
      projects/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
    api/
      admin/
        projects/
          route.ts
        uploads/
          route.ts
  components/
    projects/
      ProjectCard.tsx
      ProjectArticle.tsx
      ProjectGallery.tsx
      ProjectLinks.tsx
    admin/
      ProjectEditor.tsx
      BlockEditor.tsx
      ImageBlockControl.tsx
      AdminSidebar.tsx
      AdminTopbar.tsx
  lib/
    supabase/
      client.ts
      server.ts
      admin.ts
    projects/
      queries.ts
      validators.ts
      imagePipeline.ts
      slug.ts
    security/
      adminAuth.ts
      ipAllowlist.ts
      rateLimit.ts
```

## Model Data

### `profiles`

Untuk menyimpan role admin.

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now()
);
```

### `project_articles`

```sql
create table public.project_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_title text not null,
  excerpt text not null,
  category text not null,
  year text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  hero_image_id uuid,
  content jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  github_url text,
  demo_url text,
  case_study_url text,
  meta_title text,
  meta_description text,
  published_at timestamptz,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index project_articles_status_idx on public.project_articles(status);
create index project_articles_featured_idx on public.project_articles(featured);
create index project_articles_published_at_idx on public.project_articles(published_at desc);
```

### `project_assets`

```sql
create table public.project_assets (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.project_articles(id) on delete cascade,
  bucket text not null default 'project-assets',
  path_original text,
  path_webp text not null,
  path_avif text,
  alt text not null default '',
  width integer,
  height integer,
  size_bytes integer,
  mime_type text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
```

### `admin_audit_logs`

```sql
create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  ip_address text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

## Format Content Block

Simpan artikel sebagai block JSON agar editor fleksibel seperti Notion, tapi tetap bisa dirender aman di frontend.

Contoh:

```json
[
  {
    "id": "block_hero_context",
    "type": "heading",
    "level": 2,
    "text": "Problem"
  },
  {
    "id": "block_intro",
    "type": "paragraph",
    "text": "HEDOM dibuat untuk memantau heart rate dan SpO2 secara real-time."
  },
  {
    "id": "block_image_1",
    "type": "image",
    "assetId": "uuid",
    "align": "center",
    "size": "large",
    "caption": "Prototype HEDOM versi awal."
  },
  {
    "id": "block_links",
    "type": "links",
    "items": [
      { "label": "GitHub", "url": "https://github.com/..." },
      { "label": "Live Demo", "url": "https://..." }
    ]
  }
]
```

Block yang perlu didukung di versi awal:

- Heading
- Paragraph
- Image
- Gallery
- Quote
- Code
- Bullet list
- Numbered list
- Tech stack
- Link buttons
- Metrics
- Divider

Untuk image block:

- `align`: `left`, `center`, `right`, `wide`
- `size`: `small`, `medium`, `large`, `full`
- `caption`: optional
- `alt`: wajib

## Editor Admin

Rekomendasi editor:

- Tiptap jika ingin editor rich text yang matang dan mudah dikembangkan.
- Lexical jika ingin kontrol block editor yang lebih custom.
- Untuk MVP, bisa mulai dari custom block editor sederhana agar ringan.

Fitur admin MVP:

- Create project article.
- Edit title, slug, excerpt, category, year, tags.
- Upload hero image.
- Tambah/edit/hapus/reorder block.
- Image alignment: left, center, right, wide.
- Image size: small, medium, large, full.
- Draft, preview, publish, archive.
- Delete dengan confirmation.
- Audit log setiap create/update/delete/publish.

Fitur lanjutan:

- Autosave draft.
- Version history.
- Duplicate article.
- Scheduled publish.
- Related projects.
- Drag and drop block.
- Slash command seperti Notion: `/image`, `/code`, `/quote`, `/gallery`.

## Pipeline Gambar

Tujuan:

- Semua gambar artikel menjadi WebP utama.
- AVIF bisa dibuat sebagai tambahan.
- Original boleh disimpan private untuk backup, bukan dipakai public.
- Gambar dibuat responsive agar artikel cepat.

Flow upload:

1. Admin upload file JPG/PNG/WebP.
2. Server validasi file:
   - MIME type whitelist.
   - Ukuran maksimal, misalnya 8 MB.
   - Dimensi maksimal, misalnya 4000 px sisi terpanjang.
3. Server proses dengan `sharp`:
   - Strip metadata/EXIF.
   - Resize beberapa ukuran: 480, 960, 1440, 1920.
   - Convert WebP quality 72 sampai 82.
   - Optional AVIF quality 50 sampai 65.
4. Upload hasil ke Supabase Storage bucket `project-assets`.
5. Simpan metadata ke `project_assets`.
6. Render frontend memakai `picture` atau `next/image`.

Quality awal yang disarankan:

```txt
webp: quality 78, effort 5
avif: quality 58, effort 4
max hero width: 1920
max inline image width: 1440
thumbnail width: 480
```

Catatan:

- Jangan proses image di client saja. Client boleh preview, tapi server tetap harus validasi dan proses ulang.
- Jangan pakai nama file asli sebagai path final. Gunakan UUID agar tidak bocor dan tidak tabrakan.
- SVG upload sebaiknya ditolak untuk admin artikel, kecuali sudah ada sanitizer ketat.

## Security Plan

Tidak ada keamanan yang bisa disebut mutlak "super tinggi", tapi desain ini dibuat defense-in-depth.

### Layer 1: Network Gate

Opsi paling kuat:

- Cloudflare Access di depan `/admin/*`, hanya email kamu yang boleh masuk.
- Atau Tailscale/WireGuard dan admin hanya bisa diakses dari private network.

Opsi tambahan:

- IP allowlist di `middleware.ts`.
- Pakai header yang benar dari hosting, misalnya `x-forwarded-for`, dengan parsing hati-hati.
- Jika IP rumah/kampus sering berubah, jangan jadikan IP allowlist sebagai satu-satunya keamanan.

### Layer 2: Authentication

- Supabase Auth.
- Hanya email admin yang masuk allowlist.
- MFA TOTP wajib.
- Session cookie secure, httpOnly, sameSite lax/strict.
- Admin route redirect jika belum login atau belum `aal2`.

### Layer 3: Authorization

- Role admin di `profiles`.
- Semua write action validasi role server-side.
- Client UI bukan sumber kebenaran.
- Service role key hanya boleh dipakai di server dan tidak pernah masuk browser.

### Layer 4: Database RLS

Policy konsep:

- Public hanya bisa `select` artikel yang `status = 'published'`.
- Authenticated admin bisa CRUD.
- Viewer tidak bisa write.
- Asset public hanya untuk file artikel published.
- Draft asset hanya bisa dilihat admin.

Contoh konsep policy:

```sql
alter table public.project_articles enable row level security;

create policy "Public can read published articles"
on public.project_articles
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can manage articles"
on public.project_articles
for all
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);
```

### Layer 5: API Hardening

- Validate payload dengan Zod.
- Rate limit login dan write API.
- CSRF protection untuk mutation jika memakai cookie session.
- Sanitasi rich text dan URL.
- External link harus `https://` atau scheme yang diizinkan.
- Content Security Policy.
- Security headers.
- Audit log setiap mutation.
- No stack trace di production response.

### Layer 6: Storage Hardening

- Bucket original private.
- Bucket optimized public hanya untuk published asset.
- Upload hanya lewat server endpoint.
- File extension tidak dipercaya; MIME dan magic bytes harus dicek.
- Batasi ukuran file.
- Strip metadata.
- Path pakai UUID.

## Middleware Admin

`middleware.ts` bisa melakukan:

- Cek path `/admin`.
- Cek IP allowlist jika `ADMIN_IP_ALLOWLIST` diisi.
- Redirect ke `/admin/login` jika belum ada session.
- Jangan melakukan full database query berat di middleware; role check detail bisa di layout/server action.

Environment contoh:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL_ALLOWLIST=rislan@example.com
ADMIN_IP_ALLOWLIST=103.xxx.xxx.xxx,114.xxx.xxx.xxx
ADMIN_REQUIRE_MFA=true
IMAGE_UPLOAD_MAX_MB=8
```

## Public Article Page

Halaman `/projects/[slug]` harus punya:

- Metadata dinamis: title, description, Open Graph image.
- JSON-LD `CreativeWork` atau `Article`.
- Hero image nyata dari project.
- Sticky project facts di desktop:
  - Year
  - Category
  - Stack
  - Role
  - Links
- Konten utama dari block renderer.
- CTA ke GitHub/demo jika ada.
- Related projects.
- Back to portfolio.

## Migrasi Dari Data Lama

Data lama di `src/components/Projects.tsx` bisa dijadikan seed.

Langkah:

1. Buat schema Supabase.
2. Buat seed dari array `projects`.
3. Pindahkan image path lama ke `project_assets` atau tetap pakai `/public/assets` sementara.
4. Ubah `Projects.tsx` agar mengambil list project dari query public.
5. Ganti `onClick` modal menjadi `Link href={`/projects/${project.slug}`}`.
6. Setelah halaman artikel stabil, hapus modal atau jadikan quick preview opsional.

## Roadmap Implementasi

### Progress Saat Ini

- Data artikel project lokal sudah disiapkan di `src/lib/projects.ts`.
- Homepage project card diarahkan ke `/projects/[slug]`.
- Public article route tersedia di `/projects` dan `/projects/[slug]`.
- Admin foundation tersedia di `/admin` dan `/admin/projects`.
- CRUD admin saat ini adalah sandbox gratis berbasis `localStorage`, belum persistence production.

### Phase 1: Foundation

- Tambah Supabase client/server helper.
- Tambah schema SQL.
- Tambah model validator Zod.
- Tambah route `/projects/[slug]`.
- Ubah card click ke halaman detail.
- Seed data project lama.

### Phase 2: Admin Basic CRUD

- Tambah `/admin/login`.
- Tambah auth guard.
- Tambah `/admin/projects`.
- Tambah create/edit/delete.
- Tambah draft/publish/archive.
- Tambah audit log.

### Phase 3: Editor Artikel

- Tambah block editor MVP.
- Tambah block image dengan alignment dan size.
- Tambah preview render.
- Tambah reorder block.

### Phase 4: Image Pipeline

- Tambah upload endpoint.
- Tambah validasi MIME, size, dan dimensi.
- Tambah `sharp` untuk WebP/AVIF.
- Simpan metadata asset.
- Render responsive image.

### Phase 5: Security Hardening

- MFA enforcement.
- IP allowlist.
- Rate limit.
- CSRF protection.
- CSP/security headers.
- Storage policy.
- RLS review.
- Admin audit screen.

### Phase 6: Polish

- SEO metadata per project.
- Related projects.
- Search/filter admin.
- Autosave.
- Version history.
- Better preview mode.

## Definition of Done

Fitur dianggap siap jika:

- Semua project card mengarah ke halaman detail.
- Project published bisa diakses publik.
- Draft tidak bisa diakses publik.
- Admin hanya bisa diakses oleh akun allowlist.
- MFA admin wajib aktif.
- CRUD berjalan dan tercatat di audit log.
- Upload gambar menghasilkan WebP.
- Gambar artikel bisa diatur kiri, tengah, kanan, wide, dan ukuran.
- Payload artikel divalidasi.
- RLS aktif untuk semua table public.
- Service role key tidak pernah terekspos ke client.
- Build dan lint lolos.

## Referensi Resmi

- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase MFA: https://supabase.com/docs/guides/auth/auth-mfa
- Supabase Storage: https://supabase.com/docs/guides/storage
- MongoDB Atlas IP Access List: https://www.mongodb.com/docs/atlas/security/ip-access-list/
