These assets are from [AsyncTI4/TI4_map_generator_bot](https://github.com/AsyncTI4/TI4_map_generator_bot), used with the project owner's permission, like the existing map and unit artwork.

- `strategy-*.png`: `src/main/resources/strat_cards/base_game_*.png`, with `pok_2.png` and `pok_4.png` for Diplomacy and Construction.
- Planet trait, resource, influence, specialty, and legendary icons: `src/main/resources/planet_cards/pc_*.png`.
- Planet coordinates in `../data/async-planets.json`: `src/main/resources/planets/*.json`.
- Ship damage explosion: `src/main/resources/extra/marker_damage.png`.

The planet card UI follows AsyncTI4's vertical card-strip layout in `src/main/java/ti4/image/playerarea/PlanetCard.java`. It composes names and values with the original icon artwork.

Refresh the selected assets and metadata from the repository root with `node scripts/sync-async-assets.mjs`. The application serves all artwork locally; it does not contact AsyncTI4 at runtime.
