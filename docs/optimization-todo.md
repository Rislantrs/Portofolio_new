# Optimization TODO

## Priority 0 - Safety
- Keep every heavy visual behind a low-end/mobile guard.
- Run `npm run lint` before release and fix existing errors outside the touched files.
- Avoid adding new client-only libraries unless they replace heavier code.
- Keep image assets compressed and use Next/Image where layout is stable.

## Priority 1 - Performance
- Use `data-perf-mode="lite"` for small screens, touch devices, reduced motion, low memory, or low CPU.
- Skip custom cursor, smooth scrolling, ink canvas, and blob trail animations in lite mode.
- Reduce GSAP pinned timelines on screens below tablet width.
- Prefer CSS transforms and opacity; avoid animating filters, layout, width, or height.
- Keep mobile card grids static and avoid scroll pinning on small Android/iPhone XS.

## Priority 2 - Responsive
- Test at 320px, 375px, 390px, 414px, 768px, 1024px, and desktop.
- Ensure all headings wrap or shrink without overlapping.
- Keep interactive targets at least 40px tall on mobile.
- Use simpler section layouts for `max-width: 390px`.

## Priority 3 - Maintainability
- Edit shared colors and animation switches from `src/lib/siteConfig.ts`.
- Keep section content in data arrays instead of hard-coded JSX where practical.
- Add short comments only around complex animation or responsive branches.
- Use reusable type styles and CSS variables for colors.

## Priority 4 - Security
- Keep external links using `target="_blank"` paired with `rel="noopener noreferrer"`.
- Do not expose secrets in client components or public env variables.
- Validate admin/API inputs before writing files.
- Keep remote image host allowlist tight in `next.config.ts`.

## Later
- Replace remaining raw `<img>` where layout benefits from `next/image`.
- Generate smaller responsive image variants for large hero/project assets.
- Split very large animated sections into smaller dynamic imports.
- Add a simple Lighthouse/mobile checklist before deploy.
