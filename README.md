# giocko-visualizer

Small music visualizer

## Roadmap
- [x] Tauri setup
- [x] Threejs setup
- [x] Basic scene display option can be changed
- [x] Open MIDI file
- [x] Process MIDI file
    - [x] Get tempo
    - [x] Get instrument layers list
    - [ ] Display MIDI notes
- [ ] Extend display options
    - [ ] Style tracks
        - [ ] Toggle between drum and regular notation (note triggers vs held notes)
        - [ ] Track colors
        - [ ] Order tracks (z-index/depth)
        - [ ] Custom graphics for note hits
        - [ ] Animate note hits
            - [ ] Notes move down a bit when active
            - [ ] Note hit graphics grow and shrink on note start and note end respectively (toggleable)
        - [ ] Postprocessing
            - [ ] Bloom
            - [ ] Vignette
    - [ ] Presets
    - [ ] Color themes/palettes
    - [ ] Save/load themes
- [ ] Scene playback synced with MIDI
- [ ] Open audio file (mp3, WAV, etc.)
- [ ] Generate visuals that react to audio file
- [ ] Toggle MIDI and audio visuals
- [ ] Save/load display options
- [ ] Export video