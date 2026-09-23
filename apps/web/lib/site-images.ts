// Catalogue of the site's managed images, grouped for the /admin/seo "Image alt tags" tab.
// Each src here renders via <ManagedImage>, so an alt set in admin is applied on the page.

export type SiteImage = { src: string; group: string; note?: string }

export const SITE_IMAGES: SiteImage[] = [
  // Brand & logos
  { src: '/trg-digital-2025-t.png', group: 'Brand & logos', note: 'Nav logo (transparent)' },
  { src: '/trg-digital-footer.png', group: 'Brand & logos', note: 'Footer logo' },

  // Care photography
  { src: '/hero-resident.jpg', group: 'Photography', note: 'Sector hero / pop side image' },
  { src: '/careassura/companionship.jpg', group: 'Photography' },
  { src: '/careassura/physio.jpg', group: 'Photography' },
  { src: '/careassura/respite.jpg', group: 'Photography' },

  // Website mockups / screenshots
  { src: '/mockups/crossways.png', group: 'Mockups', note: 'Website development (desktop)' },
  { src: '/mockups/crossways-mobile.png', group: 'Mockups', note: 'Website development (mobile)' },
  { src: '/mockups/crossways-tablet.png', group: 'Mockups' },
  { src: '/mockups/pop-in-action.jpg', group: 'Mockups', note: 'Care tools, pop in action' },
  { src: '/mockups/haywards-landing.png', group: 'Mockups' },
  { src: '/mockups/haywards-mobile.png', group: 'Mockups' },
  { src: '/mockups/carestream-2026.jpg', group: 'Mockups' },
  { src: '/mockups/carestream-2026-mobile.jpg', group: 'Mockups' },
  { src: '/mockups/carestream-2026-pricing-mobile.jpg', group: 'Mockups' },
  { src: '/mockups/carestream-2026.jpg', group: 'Mockups' },
  { src: '/mockups/careassura.jpg', group: 'Mockups' },
  { src: '/mockups/tools-hub.png', group: 'Mockups' },

  // Product logos
  { src: '/products/carestream-logo.png', group: 'Product logos' },
  { src: '/products/careassura-logo.webp', group: 'Product logos' },

  // Client logos
  { src: '/clients/ascot-grange.png', group: 'Client logos' },
  { src: '/clients/charlotte-house.png', group: 'Client logos' },
  { src: '/clients/crossfields.png', group: 'Client logos' },
  { src: '/clients/crossways-residential.png', group: 'Client logos' },
  { src: '/clients/crossways.png', group: 'Client logos' },
  { src: '/clients/ferndale.png', group: 'Client logos' },
  { src: '/clients/meadow-rose.png', group: 'Client logos' },
  { src: '/clients/nightingale.png', group: 'Client logos' },
  { src: '/clients/riverwell-beck.png', group: 'Client logos' },
]

export const SITE_IMAGE_GROUPS = ['Brand & logos', 'Photography', 'Mockups', 'Product logos', 'Client logos']
