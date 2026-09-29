# FKK Strand Finder v6

Version 6 behebt das Problem, dass ein Ausfall der öffentlichen Overpass-Server zu einer komplett leeren App führt.

Die App:
- ermittelt den iPhone-Standort
- nutzt OpenStreetMap/Overpass für Live-FKK-Daten
- verwendet POST für Overpass
- probiert mehrere Overpass-Server
- zeigt zusätzlich einige recherchierte FKK-Orte als Fallback, wenn Live-Daten nicht erreichbar sind
- filtert nach dem gewählten Radius

Die Zusatzdaten sind:
- Ricklinger Kiesteiche – Sieben-Meter-Teich, Hannover
- Inselsee – FKK-Strand, Scharnebeck
- Kennel-Bad, Braunschweig

OpenStreetMap-Daten können unvollständig sein.
