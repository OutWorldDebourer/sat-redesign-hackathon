# src/components/icons

Central icon resolution, decoupling data (string icon names) from lucide-react components and standardizing icon size.

## Files

- `iconFor.tsx` — Maps a semantic key (`"car"`, `"pay"`, ...) to a sized lucide icon; falls back to `ArrowRight`. Exports: `iconFor()`.
