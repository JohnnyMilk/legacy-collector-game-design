# Player Unit Portraits

Place transparent PNG silhouettes / half-body portraits for the four fixed protagonists in this folder.

Required filenames:

- `cangyue.png` — 蒼岳
- `longyue.png` — 朧月
- `astrea.png` — 阿斯特蕾雅
- `seilorn.png` — 賽洛恩

These portraits are character-based, not class-based. A protagonist keeps the same portrait regardless of current class.

Combat UI behavior:

1. The game attempts to load the corresponding PNG.
2. If the image loads, it is displayed inside the existing portrait frame using `object-fit: contain`.
3. If the image is missing or fails to load, the UI falls back to the first character of the unit name.
4. The image never changes the grid-cell size.