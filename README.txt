FKK Strand Finder v57

Basis: v56.5

Neu in v57:
- Ortsdetails direkt beim Antippen eines FKK-Ortes auf der Karte
- Entfernung deutlich hervorgehoben
- FKK-Art und Status im Karten-Popup
- Direkte Apple-Karten/Google-Maps-Navigation im Karten-Popup
- Ergebnis-Karten zeigen Entfernung und Ortsdetails übersichtlicher

Alle bisherigen Funktionen bleiben erhalten, einschließlich Radiuskreis, sanftem Kartenzoom, Favoriten und unterer Navigation.

Hinweis v57.1: Martinsee bei Wolfenbüttel wurde nach Gegenprüfung nicht mehr als aktiver FKK-Badeplatz geführt. FKK wird zwar in Verzeichnissen genannt, zugleich wird fehlende Badefreigabe bzw. fehlende aktuelle Zugangsinformation angegeben.


Audit v57.2: Mehrere zuvor auf die Seemitte gesetzte Koordinaten wurden auf verifizierte FKK-Strand-/FKK-Bereichspunkte korrigiert: Aileswasensee, Arendsee, Talsperre Pöhl/Helmsgrün, Langener Waldsee, Talsperre Bautzen, Großer Müggelsee und Altmühlsee. Nicht eindeutig verifizierte FKK-Punkte wurden bewusst nicht geraten.


v57.7: „In meiner Nähe“ führt direkt zur sortierten Trefferliste; Ergebnis-Karten zeigen Zielpunkt-Typ, Datenstand, Zugangshinweise und eine eigene „Auf Karte zeigen“-Aktion.


v57.8: Favoriten erweitert – Favoriten werden bei vorhandenem Suchstandort nach Entfernung sortiert. Die Favoritenansicht enthält jetzt „Alle auf Karte“ und die Verifizierungskennzeichnung.


v57.9: Bei jedem FKK-Ort gibt es jetzt „⚠️ Fehler melden“. Der Button öffnet ein vorbereitetes GitHub-Issue mit Ort, Koordinaten, Status und Quelle, damit falsche Positionen oder veraltete FKK-Angaben direkt gemeldet werden können.


v58.1: Kartenansicht erweitert mit Schnellwahl für 10/25/50/100 km und „Hier suchen“ nach Verschieben der Karte.

v58.2: Vollständige Ortsprofile ergänzt. Ergebnis-Karten und Karten-Popups bieten jetzt Ortsdetails mit FKK-Status, Zielpunkt, Typ, Hinweisen, Quelle, Datenstand, Favorit, Kartenansicht, Navigation und Fehler melden.


v58.3: Offline-Grundmodus ergänzt. Die App, FKK-Datenbank und Favoriten können nach dem ersten Online-Aufruf weiter geöffnet werden. Bereits geladene Leaflet-/Kartendaten werden nach Möglichkeit zwischengespeichert. Neue Orts-/Adresssuche und nicht bereits geladene Kartenteile benötigen weiterhin Internet.


Hinweis v58.5: Fehler melden wurde zu einem strukturierten Formular erweitert. Die Meldung wird mit Ort, Koordinaten, Status und Quelle als GitHub-Issue vorbereitet; der Nutzer sendet sie selbst ab.

v58.7 Datenschutz: GPS-Koordinaten werden nur während der aktuellen Suche im Arbeitsspeicher verwendet. Favoriten und Favoriten-Sortierung werden lokal im Browser gespeichert. Die eingegebene Ortsbezeichnung kann zur Geocodierung an OpenStreetMap/Nominatim gesendet werden.


v58.11: Ortsprofile erweitert um Datenqualität, belegte Hinweise und klarere Prüfkennzeichnung.


Hinweis v58.13: Ortsprofile zeigen online aktuelle Wetterdaten über Open-Meteo und – wenn ein Suchort festgelegt ist – eine ungefähre Fahrzeit über OSRM. Diese Live-Dienste benötigen eine Internetverbindung.

Version v58.16 – Kartenansicht verbessert
- FKK-Marker werden bei geringer Zoomstufe zu anklickbaren Gruppen zusammengefasst.
- Beim Vergrößern erscheinen einzelne Orte; bei maximaler Nähe lassen sich nahe Marker auffächern.
- Favoriten bleiben als Sterne erkennbar; die Kartenlegende erklärt jetzt auch den Stern.
- Nach dem Verschieben der Karte wird „Hier suchen“ hervorgehoben. Beim Start der Suche gibt es eine kurze Rückmeldung.
- Plus-/Minus-Zoom-Schaltflächen bleiben deaktiviert; Pinch-to-Zoom funktioniert weiterhin.
- Wenn das Cluster-Zusatzmodul nicht geladen werden kann, zeigt die Karte die Marker einzeln an.
