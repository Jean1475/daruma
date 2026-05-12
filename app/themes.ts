interface Theme {
  mode: string;
  display: string; body: string; mono: string;
  bg: string; fg: string; muted: string; line: string;
  accent: string; accentFg: string; secondary?: string;
  cardBg: string; cardBorder: string; cardRadius: number;
  chipTrack: string; chipOnBg: string; chipOnFg: string;
  tagBg: string; tagFg: string;
  dateBg: string; dateFg: string;
  badgeBg: string; badgeFg: string; badgeBorder: string;
  ctaBg: string; ctaFg: string;
  eventsBg?: string;
}

const FONT_DISPLAY = 'var(--font-display), "Helvetica Neue", system-ui, sans-serif';
const FONT_BODY    = 'var(--font-sans), "Helvetica Neue", system-ui, sans-serif';
const FONT_MONO    = 'var(--font-mono), ui-monospace, "SF Mono", monospace';

const DARUMA_BLUE  = 'var(--color-daruma-blue)';
const DARUMA_GOLD  = 'var(--color-daruma-gold)';
const DARUMA_INK   = 'var(--color-daruma-ink)';
const DARUMA_CREAM = 'var(--color-daruma-cream)';

export const THEMES: Record<string, Theme> = {
  // V1 — Editorial claro (responds to the tweak)
  v1_claro: {
    mode: 'light',
    display: FONT_DISPLAY, body: FONT_BODY, mono: FONT_MONO,
    bg: '#f8f6f1', fg: '#1a1614', muted: 'rgba(26,22,20,0.58)',
    line: 'rgba(26,22,20,0.10)',
    accent: DARUMA_BLUE, accentFg: '#f8f6f1',
    cardBg: '#ffffff', cardBorder: 'rgba(26,22,20,0.08)', cardRadius: 6,
    chipTrack: 'rgba(26,22,20,0.05)', chipOnBg: '#1a1614', chipOnFg: '#f8f6f1',
    tagBg: 'rgba(26,22,20,0.06)', tagFg: '#1a1614',
    dateBg: '#f4efe6', dateFg: '#1a1614',
    badgeBg: 'transparent', badgeFg: '#1a1614', badgeBorder: 'rgba(26,22,20,0.15)',
    ctaBg: '#1a1614', ctaFg: '#f8f6f1',
  },
  v1_crema: {
    mode: 'light',
    display: FONT_DISPLAY, body: FONT_BODY, mono: FONT_MONO,
    bg: '#f0e8d8', fg: '#2a1e16', muted: 'rgba(42,30,22,0.60)',
    line: 'rgba(42,30,22,0.12)',
    accent: DARUMA_BLUE, accentFg: '#f0e8d8',
    cardBg: '#f6efe2', cardBorder: 'rgba(42,30,22,0.10)', cardRadius: 6,
    chipTrack: 'rgba(42,30,22,0.06)', chipOnBg: '#2a1e16', chipOnFg: '#f0e8d8',
    tagBg: 'rgba(42,30,22,0.08)', tagFg: '#2a1e16',
    dateBg: '#e8dec8', dateFg: '#2a1e16',
    badgeBg: 'transparent', badgeFg: '#2a1e16', badgeBorder: 'rgba(42,30,22,0.20)',
    ctaBg: '#2a1e16', ctaFg: '#f0e8d8',
  },
  v1_oscuro: {
    mode: 'dark',
    display: FONT_DISPLAY, body: FONT_BODY, mono: FONT_MONO,
    bg: '#13100f', fg: '#f4efe6', muted: 'rgba(244,239,230,0.55)',
    line: 'rgba(244,239,230,0.12)',
    accent: DARUMA_GOLD, accentFg: '#13100f',
    cardBg: '#1c1816', cardBorder: 'rgba(244,239,230,0.08)', cardRadius: 6,
    chipTrack: 'rgba(244,239,230,0.06)', chipOnBg: '#f4efe6', chipOnFg: '#13100f',
    tagBg: 'rgba(244,239,230,0.08)', tagFg: '#f4efe6',
    dateBg: '#1c1816', dateFg: '#f4efe6',
    badgeBg: 'transparent', badgeFg: '#f4efe6', badgeBorder: 'rgba(244,239,230,0.20)',
    ctaBg: '#f4efe6', ctaFg: '#13100f',
  },

  // V2 — Azul Daruma protagonista (cobalto inmersivo + crema cálida)
  v2: {
    mode: 'light',
    display: FONT_DISPLAY, body: FONT_BODY, mono: FONT_MONO,
    bg: DARUMA_CREAM, fg: DARUMA_INK, muted: 'rgba(14,21,56,0.58)',
    line: 'rgba(14,21,56,0.10)',
    accent: DARUMA_BLUE, accentFg: DARUMA_CREAM,
    secondary: DARUMA_GOLD,
    cardBg: '#ffffff', cardBorder: 'rgba(14,21,56,0.08)', cardRadius: 4,
    chipTrack: 'rgba(14,21,56,0.05)', chipOnBg: DARUMA_BLUE, chipOnFg: DARUMA_CREAM,
    tagBg: DARUMA_BLUE, tagFg: DARUMA_CREAM,
    dateBg: DARUMA_BLUE, dateFg: DARUMA_CREAM,
    badgeBg: DARUMA_GOLD, badgeFg: DARUMA_INK, badgeBorder: 'transparent',
    ctaBg: DARUMA_BLUE, ctaFg: DARUMA_CREAM,
  },

  // V3 — Vitrina oscura, galería de coleccionista
  v3: {
    mode: 'dark',
    display: FONT_DISPLAY, body: FONT_BODY, mono: FONT_MONO,
    bg: '#0d0a0c', fg: '#f4efe6', muted: 'rgba(244,239,230,0.48)',
    line: 'rgba(244,239,230,0.10)',
    accent: DARUMA_GOLD, accentFg: '#0d0a0c',
    cardBg: '#15121280', cardBorder: 'rgba(244,239,230,0.10)', cardRadius: 2,
    chipTrack: 'rgba(244,239,230,0.04)', chipOnBg: DARUMA_GOLD, chipOnFg: '#0d0a0c',
    tagBg: 'rgba(212,167,58,0.15)', tagFg: DARUMA_GOLD,
    dateBg: '#1c1818', dateFg: DARUMA_GOLD,
    badgeBg: 'transparent', badgeFg: DARUMA_GOLD, badgeBorder: 'rgba(212,167,58,0.40)',
    ctaBg: DARUMA_GOLD, ctaFg: '#0d0a0c',
  },
};
