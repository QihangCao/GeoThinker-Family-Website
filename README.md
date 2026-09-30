# GeoThinker Family Website

A shared project website for **GeoThinker**, **GeoThinker-F**, and **DynThinker**.

The page presents their common approach to spatial reasoning, with three animated model diagrams, a shared scene video, and paper figures.

## Local preview

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/ in your browser. No build step or package installation is required.

## Files

- `index.html`: page content and model sections.
- `style.css`, `story.css`, `polish.css`: layout, model diagrams, and visual styling.
- `story.js`: animated model diagrams and video playback controls.
- `app.js`: figure viewer, navigation, and entrance animations.
- `assets/`: paper figures, video, and still frames.

Each model diagram plays automatically. Hover or focus to pause and select a step; touch controls are also available. The page supports reduced-motion preferences.

## Credits

The scene video is from [Aria Digital Twin](https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_digital_twin_dataset), sequence `Apartment_release_clean_seq131_M1292` (8–26 seconds). Diagram overlays and displayed answers illustrate the model mechanisms.

GeoThinker figures are from its [project website](https://li-hao-yuan.github.io/GeoThinker/). GeoThinker-F and DynThinker figures are from their respective manuscripts. Refer to the original sources for media licensing and attribution.

## Related code

- [GeoThinker](https://github.com/Li-Hao-yuan/GeoThinker)
- [DynThinker](https://github.com/QihangCao/DynThinker)
