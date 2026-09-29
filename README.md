# FKK Strand Finder v4

Version 4 nutzt OpenStreetMap/Overpass breiter als die vorherige Version.

Die Suche berücksichtigt:
- nudism=* Tags
- FKK/Nacktbade-Hinweise in name und description
- leisure=bathing_place
- leisure=beach
- leisure=beach_resort
- leisure=swimming_area
- natural=beach

Wichtig:
OpenStreetMap ist nicht vollständig. Ein fehlender Treffer beweist nicht, dass es vor Ort keinen FKK-Bereich gibt.

## Installation auf GitHub Pages

Die Dateien `index.html`, `style.css`, `app.js` und `manifest.webmanifest` ins Repository `fkk-strand-finder` hochladen und die bisherigen Versionen ersetzen.

Danach GitHub Pages neu laden und auf "Meinen Standort verwenden" tippen.

## Datenquelle

OpenStreetMap und die Overpass API.


## Version 5 – Fehlerbehebung

Diese Version verwendet für Overpass eine GET-Abfrage statt POST und versucht drei öffentliche Overpass-Server.
Die Abfrage wurde auf echte FKK-/Nudismus-Hinweise beschränkt, damit ein Radius von 100 km nicht unnötig tausende Badestellen laden muss.
