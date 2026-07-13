# Design System — "Control Room" direction

## Brief (self-authored)

Subject: an operations console for people watching physical things move through a network. Audience: operators and managers who live in this screen for hours at a shift, need low-glare readability, and need status to be scannable at a glance without reading every row. Single job of the page: make "what needs attention right now" obvious in under 3 seconds.

Rejected the generic AI-default look (cream background + terracotta accent, or pure black + neon accent) in favor of a dense, low-glare control-room palette that fits long-session monitoring — closer to industrial/logistics tooling than a marketing site.

## Color tokens

| Token | Hex | Use |
|---|---|---|
| `--bg-base` | `#0B1D26` | App background, deep slate-navy |
| `--bg-panel` | `#152A38` | Card/panel surfaces |
| `--bg-panel-raised` | `#1F3A4D` | Hover/active panel state |
| `--text-primary` | `#E8EDF0` | Primary text |
| `--text-muted` | `#8FA3AD` | Secondary text, labels |
| `--accent-signal` | `#F2A93B` | Warnings, delayed status, primary CTA |
| `--accent-critical` | `#E4572E` | Exceptions, destructive actions |
| `--accent-success` | `#4FA8A0` | Delivered status, success states |
| `--border-hairline` | `#24404F` | Dividers, table borders |

## Type

- **Display / headers**: Barlow Condensed, semibold — condensed industrial feel for headers and status labels, used sparingly (h1/h2 and status badges only)
- **Body**: Inter — everything else, sentence case, no filler copy
- **Data / mono**: JetBrains Mono — reference codes, timestamps, IDs, audit log entries. Anything that is a "reading of data" rather than "prose" goes in mono, which also visually separates system-generated text from human-written notes.

Type scale: 12 / 14 / 16 / 20 / 28 / 36px. Body copy sits at 14px given the density of this UI; 16px is reserved for anything meant to be read at a glance from a distance (dashboard metric numbers).

## Spacing

4px base unit: 4 / 8 / 12 / 16 / 24 / 32 / 48. Panels use 16px internal padding, 24px gap between panels.

## Component states

- **Buttons**: default (accent-signal bg) / hover (10% lighter) / disabled (30% opacity, no pointer) / destructive (accent-critical bg, requires confirm)
- **Status badges**: pill-shaped, "manifest ticket" notch on the left edge (signature element — see below), color mapped to status
- **Table rows**: hairline border-bottom only, no zebra striping (reduces visual noise for long monitoring sessions), hover state raises bg to `--bg-panel-raised`
- **Inputs**: border-hairline default, accent-signal border on focus, visible focus ring for keyboard nav (accessibility floor, non-negotiable)

## Signature element

Status badges are rendered as a small "manifest ticket": a rounded pill with a notch cut into the left edge (like a physical shipping tag), rather than a plain colored dot or flat chip. The status timeline on the asset detail page uses the same ticket shape at each step, connected by a line, so the visual language of "this is a physical thing moving through stages" is consistent between the badge and the timeline rather than being two unrelated status representations.

## Motion

Minimal by default. One deliberate moment: the current/active step in the status timeline gets a slow, subtle pulse (opacity 0.85 to 1, 2s ease-in-out loop) to draw the eye to "what's happening now" without animating anything else on the page. Reduced-motion media query disables it in favor of a static highlight.
