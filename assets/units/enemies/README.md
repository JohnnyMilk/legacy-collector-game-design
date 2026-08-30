# Enemy Unit Portraits

Place transparent PNG silhouettes / half-body portraits for enemy classes in this folder.

Filename rule:

`<className>.png`

Examples used by Demo 0:

- `荒路獵手.png`
- `斷刃兵.png`
- `灰燼術士.png`
- `石鎧衛.png`

Enemy portraits are class-based because normal enemy units are unnamed. Every enemy of the same class reuses the same portrait unless a future scenario explicitly defines a different portrait key.

Combat UI behavior:

1. The game attempts to load the PNG matching the enemy class name.
2. If the image loads, it is displayed inside the existing portrait frame using `object-fit: contain`.
3. If the image is missing or fails to load, the UI falls back to the first character of the class name.
4. The image never changes the grid-cell size.