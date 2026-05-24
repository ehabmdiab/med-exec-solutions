# Components — Atomic Design

This codebase is organized using Atomic Design. To keep the existing UI
untouched and avoid breaking imports, the original files stay where they
are and each atomic layer is exposed via a barrel `index.ts` that
re-exports them.

## Layers

- **atoms/** — `Logo`, `NavLink`, `Reveal`
  Smallest presentational primitives (plus shadcn `ui/*` which are also atoms).
- **molecules/** — `ContactForm`, `LogoLoader`, `HeroScene`, `Logo3DScene`, `MetaballHero`
  Small compositions of atoms / scoped widgets.
- **organisms/** — `SiteHeader`, `SiteFooter`, and all page sections
  (`Hero`, `AboutTeaser`, `ServicesGrid`, `ProjectsShowcase`, `WhyAUH`,
  `MissionVision`, `CtaBand`).
- **templates/** — `Layout` (page chrome wrapper).
- **ui/** — shadcn primitives (atoms, kept separate by convention).

## Usage

Prefer the atomic barrels in new code:

```ts
import { Layout } from "@/components/templates";
import { Hero, CtaBand } from "@/components/organisms";
import { Reveal } from "@/components/atoms";
import { ContactForm } from "@/components/molecules";
import { Button } from "@/components/ui/button";
```

Existing direct imports (e.g. `@/components/Layout`) continue to work, so
this refactor is purely additive and cannot affect the rendered UI.
