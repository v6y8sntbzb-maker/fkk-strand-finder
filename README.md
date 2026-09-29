# FKK Strand Finder – Web-Prototyp

## Enthalten
- Mobile-first Oberfläche für iPhone
- OpenStreetMap-Karte
- Standortfreigabe über GPS
- Umkreis 5–100 km
- Marker und Ergebnisliste
- Detailansicht
- Route über Google Maps
- PWA-Grundkonfiguration

## Start
Die Dateien müssen über einen Webserver bereitgestellt werden, weil Browser die Standortfunktion auf normalen `file://`-Dateien blockieren können.

Zum Beispiel:
1. Dateien auf einen Hosting-Dienst hochladen.
2. Die HTTPS-Adresse auf dem iPhone öffnen.
3. Standortfreigabe erlauben.
4. In Safari: Teilen → „Zum Home-Bildschirm“.

## Wichtig
Die drei Strand-Einträge in `app.js` sind reine Beispieldaten.
Für die nächste Version wird eine echte, gepflegte Datenquelle für FKK-Strände benötigt.
