# CleanZone Design System

**Tone**: Industrial brutalism meets civic responsibility. Raw, direct, authoritative. Infrastructure-grade UI: hard edges, functional typography, purposeful material references.

## Palette

| Token | OKLCH | Hex | Usage |
|-------|-------|-----|-------|
| Primary (Steel Blue) | `41.5 0.115 258` | `#2D5A84` | Trust, authority, core interactions |
| Accent (Safety Orange) | `70 0.22 44` | `#E85D04` | CTAs, warnings, active states |
| Secondary (Steel Gray) | `50 0.02 260` | `#6B7280` | Supporting elements, navigation |
| Muted (Concrete) | `87 0.02 260` | `#D5D5D5` | Inactive UI, backgrounds |
| Destructive (Raw Red) | `55 0.26 25` | `#C53030` | Errors, warnings, caution |
| Background (Off-White) | `95 0.02 260` | `#F5F5F5` | Page background, neutral space |

## Typography

| Family | Usage | Style |
|--------|-------|-------|
| General Sans | Display, headings, UI labels | Geometric, bold, authoritative |
| DM Sans | Body text, descriptions, content | Clean, legible, structured |
| Geist Mono | Data, metrics, technical content | Technical, fixed-width, precise |

**Type Scale**: 12, 14, 16, 18, 20, 24, 32, 40px. Hierarchy via weight (400/700) and size.

## Structural Zones

| Zone | Background | Border | Elevation | Use |
|------|-----------|--------|-----------|-----|
| Header | Steel gray (`50 0.02 260`) | Steel blue border-b 2px | Elevated | Logo, title, quick actions |
| Navigation | Steel gray (`50 0.02 260`) | Orange accent on active | Elevated | Bottom nav (mobile), side nav (desktop) |
| Card | Off-white (`99 0.01 260`) | Steel blue 2px | `shadow-card` | Content containers, report items |
| Background | Concrete (`95 0.02 260`) | None | Base | Page surface, main content area |
| Input | Light gray (`92 0.02 260`) | Border on focus | Flat | Form fields, search boxes |

## Motion & Interaction

- **Transition**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (smooth deceleration)
- **Button hover**: Primary → orange accent shift; text contrast maintained
- **Active states**: Orange background + steel blue text for nav items
- **Feedback**: Subtle shadow lift on card hover; orange focus rings

## Component Patterns

- **Buttons**: Orange (primary), Steel blue outline (secondary), Gray disabled
- **Cards**: White background, 2px steel blue border, `shadow-card` on hover
- **Forms**: Clean borders, steel blue focus ring, inline validation messages in red
- **Navigation**: Orange active indicator, smooth slide/fade transitions
- **Badge/Tag**: Orange background, steel gray text, minimal radius (2px)

## Spacing Rhythm

Baseline 4px: 4, 8, 12, 16, 24, 32, 48px. Dense on mobile, relaxed on desktop (media queries).

## Signature Detail

**Steel reinforcement borders**: Every card, input, and major container has a 2px steel blue border that references construction site safety barriers. Borders are functional, not decorative. Navigation active state uses safety orange — a direct visual metaphor for "under construction" or "urgent."

## Constraints

- No gradients, blurs, or glow effects. All backgrounds are solid OKLCH colors.
- Radius: 0, 2px, 4px, 6px. No large radius (no `rounded-xl` or `rounded-full` except buttons).
- Shadows are subtle (`shadow-steel`, `shadow-card`) and reference 2–3 colors only.
- All colors must pass WCAG AA contrast on backgrounds and text. Test against both light and dark mode.

## Responsive Strategy

**Mobile-first**: Bottom navigation at `sm` breakpoint. Column-based card layout. Full-width inputs. Typography scales at `md` (18px baseline).

**Desktop** (`lg`+): Side navigation (narrow sidebar), multi-column grids, relaxed spacing, card hover effects enabled.

## Dark Mode

Same palette applied to dark surfaces. Background darkens to `20 0.02 260`. Card darkens to `25 0.02 260`. Orange accent remains constant (high visibility). Text inverts to light gray `92 0.02 260`. No inverted lightness — colors are material-grounded, not inverted.

## Differentiation

CleanZone's UI is instantly recognizable as civic/infrastructure-focused. Every element — border, button, spacing — reinforces the metaphor of "built environment stewardship." This is not generic tech; it is purpose-built infrastructure UI.
