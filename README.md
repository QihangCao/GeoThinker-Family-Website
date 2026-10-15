# GeoThinker Family Website

A shared project website for **GeoThinker**, **GeoThinker-F**, and **DynThinker**.

The page presents their common approach to spatial reasoning, with research films first, an expandable method comparison containing three animated model diagrams, and paper figures.

## Website

https://qihangcao.github.io/GeoThinker-Family-Website/

GitHub Pages publishes the root of `main`. Changes pushed to `main` are deployed automatically.

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
- `films.css`, `films.js`: research-film cards and the accessible video dialog.
- `assets/videos/`: final research films, lightweight posters, and optional English captions.
- `assets/`: paper figures, video, and still frames.

The method comparison is collapsed by default. Expand it to see the three model diagrams side by side. Each diagram animates while visible; closing the comparison pauses playback. Scene videos use no preload. Hover or focus to pause and select a step; touch controls are also available. The page supports reduced-motion preferences.

## Credits

The scene video is from [Aria Digital Twin](https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_digital_twin_dataset), sequence `Apartment_release_clean_seq131_M1292` (8–26 seconds). Diagram overlays and displayed answers illustrate the model mechanisms.

GeoThinker figures are from its [project website](https://li-hao-yuan.github.io/GeoThinker/). GeoThinker-F and DynThinker figures are from their respective manuscripts. Refer to the original sources for media licensing and attribution.

## Related code

- [GeoThinker](https://github.com/Li-Hao-yuan/GeoThinker)
- [DynThinker](https://github.com/QihangCao/DynThinker)

## Research films

The film shelf and each corresponding work section open the same in-page player. The MP4 source is assigned only after a play action; the first poster loads with priority and the second loads lazily. There is no automatic film playback/download on page load. The player uses native controls, inline mobile playback and optional English captions. Closing it pauses playback, releases the video source and restores focus. Background mechanism animations pause while any media dialog is open. Direct MP4 links remain available without JavaScript.

- DynThinker: 72.5 s, 1920×1080, 30 fps.
- GeoThinker-F: 83.5 s, 1920×1080, 30 fps.

The uploaded MP4 files are the approved final exports; their audio/video is unchanged. Posters are frames from those films. Credits and settings: DynThinker uses Aria Digital Twin footage; GeoThinker-F uses the existing first-person room-video QA example. Robot races, questions and diagram overlays are illustrative rather than per-case inference recordings. Performance results are from the papers, not new benchmark runs. Narration uses Microsoft synthetic voices; graphics and procedural music are original. Inter and Space Grotesk font licenses apply to the rendered films. Original footage terms continue to apply.
