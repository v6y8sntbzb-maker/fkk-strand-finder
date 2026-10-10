v58.28: Die Zeile „Sortieren nach / Nächste zuerst“ wurde aus der Suchoberfläche entfernt. „Filter zurücksetzen“ bleibt verfügbar.

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


Version v58.17 – graue Schrift auf den meerblauen Kacheln auf Weiß umgestellt; helle Schrift im dunklen Modus beibehalten.


v58.18: Verbesserte Suche versteht Suchanfragen wie „FKK bei Hannover“, „FKK See“ und „FKK Strand“. Ortsnamen werden von FKK-/Kategoriebegriffen getrennt; See- und Strandwünsche grenzen die Ergebnisse entsprechend ein.


Version v58.20: Entfernungen werden klar als Luftlinie gekennzeichnet. In Ergebnis-Kacheln wird erklärt, dass die Fahrzeit in den Ortsdetails über eine Routing-Datenquelle berechnet wird.


Version v58.20 – Favoriten, Datenqualität und iPhone-Optimierung
- Favoritenansicht heißt jetzt „Meine FKK-Orte“ und erklärt, was „Offiziell bestätigt“ bedeutet.
- Größere Touchflächen für Navigation, Favoriten und wichtige Aktionen auf dem iPhone.
- App-Symbol ergänzt und in Web-App-Manifest sowie Service-Worker aufgenommen.
- Favoriten bleiben lokal im Browser gespeichert; keine Synchronisierung zwischen Geräten.


Version v58.21: Alle Abschnitte in den Ortsdetails (Informationen, Belegte Hinweise, Datenqualität, Quelle und Zugangshinweise) haben jetzt abgerundete, meerblaue Kacheln passend zur Fahrzeit-Kachel.


Version v58.22: Ortsprofile zeigen Wetterdaten vor Ort, sofern online verfügbar; ergänzen einen vorsichtigen Öffnungszeiten-/Saisonhinweis nur aus vorhandenen Statusangaben und bieten eine Teilen-Schaltfläche für einzelne FKK-Orte. Keine Öffnungszeiten werden erfunden.


Version v58.23 – Datenqualität transparenter
- „Offiziell“ wird nur angezeigt, wenn der Datensatz ausdrücklich eine offizielle/amtliche Quelle kennzeichnet.
- Andere belegte Einträge werden als Verzeichnis-/Karteneintrag bezeichnet und nicht als amtlich bestätigt ausgegeben.
- Fehlende Quellen oder Hinweise auf Unsicherheit lösen den Hinweis „Bitte vor Ort prüfen“ aus.
- Das Datum wird als Datenstand der Zusammenstellung bezeichnet, nicht als individuelle Prüfung jedes Orts.
- Quellenlink und bisherige Ortsangaben bleiben erhalten; lokale Regeln und aktuelle Beschilderung vor Ort haben Vorrang.


Version v58.24 – Suchfilter verbessert
- Suchergebnisse können nach Entfernung, Name A–Z oder offizieller Kennzeichnung sortiert werden.
- Filter lassen sich mit „Filter zurücksetzen“ gemeinsam zurücksetzen.
- Der Standard bleibt „Nächste zuerst“; offizielle Quellen werden nicht automatisch behauptet, sondern anhand der hinterlegten Kennzeichnung sortiert.


Version v58.25 – Wetter vor Ort verbessert
- Wetterprofil zeigt Temperatur, Wetterlage, Windgeschwindigkeit und Windrichtung.
- Ergänzt die maximale Regenwahrscheinlichkeit für den heutigen Tag, getrennt von der aktuell gemessenen Niederschlagsmenge.
- Zeigt den Zeitstand der Wetterdaten, sofern vom Wetterdienst geliefert.
- Wetterdaten werden vom externen Dienst Open-Meteo abgerufen und benötigen Internet.


Version v58.27 – Anfahrt verbessert
- Ortsdetails zeigen jetzt zusätzlich zur ungefähren Fahrzeit auch die berechnete Straßenentfernung.
- Straßenentfernung und Luftlinie bleiben klar voneinander getrennt.
- Die vorhandenen Apple-Karten- und Google-Maps-Schaltflächen starten weiterhin die Navigation zum ausgewählten Ort.
- Die Fahrzeit und Straßenentfernung benötigen Internet und sind Schätzungen; Verkehr und Sperrungen können abweichen.


Version 58.30: entfernt die unerwünschte Sortierzeile „Sortieren nach – Nächste zuerst“ und erneuert den Service-Worker-Cache, damit iPhones die aktualisierte Version laden.
\n\nv58.32 – Offline/Stabilität: Offline-Hinweis reagiert auf Netzwechsel; informiert klar, welche Funktionen ohne Internet weiter verfügbar sind. Service-Worker-Cache aktualisiert. Kartenkacheln und neue Such-/Routingabfragen benötigen weiterhin Internet, sofern sie nicht bereits geladen/gespeichert sind.\n

v58.33 – QA-Korrekturen: JavaScript-Syntaxfehler durch versehentliches literales „\\n“ behoben; Script-URL auf v58.33 aktualisiert; doppelter Online-Status-Handler entfernt, damit der Hinweis bei wiederhergestellter Verbindung sichtbar bleibt. Statische Syntax- und Paketprüfungen durchgeführt; iPhone-/Safari-Live-Test steht weiterhin aus.


v58.34 – Punkte 1–3: Laufzeitprüfung auf Koordinaten außerhalb des Deutschland-Bereichs, Hinweise bei nahezu identischen Kartenpunkten und fehlenden Quellen; unplausible Koordinaten werden nicht als Suchtreffer ausgegeben. Radius-/Kartenlogik beibehalten. Ortsdetails zeigen jetzt Koordinaten und einen Link zur Kontrolle in OpenStreetMap; bei leeren Suchergebnissen gibt es einen direkten Filter-zurücksetzen-Button. Keine Behauptung einer externen Vor-Ort-Verifikation.


v58.35 – Punkt 4 Favoriten verbessert: persönliche Notizen pro gespeichertem FKK-Ort, automatische lokale Speicherung auf dem Gerät, Notizen werden beim Teilen der Favoritenliste mit aufgenommen. Bestehende Favoriten, Sterne auf der Karte, Sortierung und Karten-/Navigationsaktionen bleiben erhalten. Keine Kontosynchronisierung; Notizen bleiben im Browser dieses Geräts. Statische Syntax-/Paketprüfung, kein vollständiger iPhone-Live-Test.


Version v58.36 – Punkt 5: Zusätzliche optionale Filter für Parkplatz-, WC/Sanitär- und Eintritt/Gebühren-Hinweise. Diese Filter prüfen nur, ob ein Hinweis im Datenbank-Status hinterlegt ist; sie garantieren keine aktuelle Ausstattung oder Preise. Filter zurücksetzen setzt auch diese Optionen zurück.


Version v58.37 – Die aufklappbare Gruppe „Weitere Filter“ (Parkplatz-, WC/Sanitär- und Eintritt/Gebühren-Hinweise) wurde auf Wunsch entfernt. Die übrigen Suchfilter und „Filter zurücksetzen“ bleiben erhalten.

Version v58.38 – Suche erweitert: zusätzlich zur lokalen Datenbank werden online ausdrücklich mit nudism=yes/designated/permissive markierte OpenStreetMap-Objekte im Suchradius abgefragt. Treffer werden nach Name/Koordinatennähe dedupliziert; OSM-Treffer gelten nicht als amtlich bestätigt. Offline bleibt die lokale Suche verfügbar. Overpass-Verfügbarkeit und Vollständigkeit sind nicht garantiert.


Version v58.39 – Standortfotos
- Ortsdetails versuchen ein Foto aus Wikimedia Commons im Umkreis von 500 m zu finden.
- Foto-Quellseite mit Urheber-/Lizenzangaben ist verlinkt.
- Wenn kein passendes Foto gefunden wird oder offline, wird ein verständlicher Hinweis angezeigt.
- Fotos werden nur beim Öffnen der Ortsdetails geladen; das spart Datenvolumen bei der normalen Suche.
