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
