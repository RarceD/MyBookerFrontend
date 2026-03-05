
// ─── Surface hierarchy ────────────────────────────────────────────────────────
export const colorBase           = '#0f1117'; // app background (deepest)
export const colorSurface        = '#16181f'; // header / footer / modals
export const colorCard           = '#1e2028'; // cards, list items
export const colorCardElevated   = '#272a35'; // elevated cards, date-selector bg

// ─── Brand accent ─────────────────────────────────────────────────────────────
export const colorLogo           = '#FF8400'; // primary CTA — buttons, active icons
export const colorLogoLight      = '#ffb347'; // hover / light variant of brand orange
export const colorLogoDim        = '#7a3e00'; // muted orange for disabled/past slots

// ─── Text ─────────────────────────────────────────────────────────────────────
export const colorTextPrimary    = '#f0f0f5'; // main text
export const colorTextSecondary  = '#a0a3b1'; // secondary / subtext
export const colorTextMuted      = '#5c6070'; // placeholder, inactive labels
export const colorLetter         = '#a0a3b1'; // alias — inactive icon / tab labels

// ─── Borders / dividers ───────────────────────────────────────────────────────
export const colorBorder         = '#2c2f3e'; // subtle border
export const colorBorderStrong   = '#3d4154'; // stronger border (focus rings, etc.)

// ─── Semantic ─────────────────────────────────────────────────────────────────
export const colorSuccess        = '#22c55e';
export const colorError          = '#ef4444';
export const colorWarning        = '#f59e0b';

// ─── Legacy aliases (kept for backward-compat, map to new tokens) ─────────────
/** @deprecated use colorBase */
export const colorBackground          = colorBase;
/** @deprecated use colorSurface */
export const colorDarkHeaderFooter    = colorSurface;
/** @deprecated use colorCard */
export const colorDarkCard            = colorCard;
/** @deprecated use colorLogoDim */
export const colorNotAbleToBook       = colorLogoDim;
/** @deprecated — unused blue, kept for reference */
export const colorDetails             = '#FAE69E';
export const colorLogoBlue            = '#103979';
