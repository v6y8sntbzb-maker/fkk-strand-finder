// FKK Strand Finder v43
// Statische FKK-Datenbasis. Die Suche kann vom GPS-Standort ODER von einem eingegebenen Ort starten.

const FKK_PLACES = [
  // v43 – Brandenburg: weitere einzeln geprüfte FKK-Strandobjekte
  {name:"FKK-Strand Cottbus – Klein Gaglow",lat:51.72946,lon:14.2899,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap + Badeklar",source:"OpenStreetMap / Mapcarta / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand in Kolkwitz/Klein Gaglow bei Cottbus verzeichnet; OSM-Strandobjekt geprüft.",active:true},
  {name:"FKK-Strand Buchwalde – Senftenberger See",lat:51.51149,lon:14.02942,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap + Badeklar",source:"OpenStreetMap / Mapcarta / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"FKK-Strand Buchwalde am Senftenberger See; OSM-Strandobjekt geprüft.",active:true},
  {name:"FKK-Strand Caputh – Schwielowsee",lat:52.35896,lon:13.02104,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap + FKK-Verzeichnis",source:"OpenStreetMap / Mapcarta",sourceUrl:"https://mapcarta.com/de/W1299815903",status:"Als FKK-Strand bei Caputh am Schwielowsee verzeichnet; OSM-Strandobjekt geprüft.",active:true},
  {name:"FKK-Strand Limsdorf – Melangsee",lat:52.15388,lon:13.99949,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap",source:"OpenStreetMap / Mapcarta",sourceUrl:"https://mapcarta.com/de/W498083358",status:"Als FKK Strand am Melangsee bei Limsdorf verzeichnet; OSM-Objekt geprüft. Vor Ort auf aktuelle Kennzeichnung achten.",active:true},

  // v42 – Brandenburg/Sachsen: weitere verifizierte FKK-Strandabschnitte
  {name:"FKK-Strand Prenzlau",lat:53.28843,lon:13.87771,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap + Badeklar",source:"OpenStreetMap / Mapcarta / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand bei Prenzlau verzeichnet; OSM-Strandobjekt geprüft.",active:true},
  {name:"FKK-Strand Hohennauen – Rathenow",lat:52.66349,lon:12.36544,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap + Badeklar + Stadt Rathenow",source:"OpenStreetMap / Badeklar / Stadt Rathenow",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"FKK-Strand am Hohennauener-Ferchesarer See; örtliche Hinweise beachten.",active:true},
  {name:"FKK-Strand Niemtzsch – Senftenberger See",lat:51.48207,lon:13.98216,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap + Badeklar + Lausitzer Seenland",source:"OpenStreetMap / Badeklar / Lausitzer Seenland",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand bei Niemtzsch verzeichnet; Badebereich am Senftenberger See.",active:true},
  {name:"FKK-Strand Bärwalder See – Boxberg",lat:51.39385,lon:14.57813,label:"FKK-Strand",type:"Badesee",evidence:"Stadtgui + Lausitzer Seenland",source:"Stadtgui / Lausitzer Seenland",sourceUrl:"https://www.lausitzerseenland.de/de/erleben/urlaub-mit-hund/hundestraende/artikel-badestrand-baerwalder-see-uferbereich-boxberg-o-l-.html",status:"Ausgeschilderter FKK-Strand am Boxberger Ufer; Badesaison und örtliche Strandordnung beachten.",active:true},
  {name:"FKK-Strand Bärwalder See – Uhyst",lat:51.37301,lon:14.51335,label:"FKK-Strand",type:"Badesee",evidence:"Lausitzer Seenland + Reiseland Brandenburg",source:"Lausitzer Seenland / Reiseland Brandenburg",sourceUrl:"https://www.lausitzerseenland.de/de/die-seen/seeprofile/baerwalder-see/standort-6-m2/artikel-standort-6-m2.html",status:"Ausgeschilderter FKK-Strand am Uhyster Ufer; Badesaison 15.05.–15.09. beachten.",active:true},

  // v41 – weitere verifizierte FKK-Stellen; Koordinaten gezielt geprüft
  {name:"FKK-Strand Hennersdorf",lat:51.63453,lon:13.62847,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap / Mapcarta",source:"OpenStreetMap / Mapcarta",sourceUrl:"https://mapcarta.com/de/W347279948",status:"Als FKK-Strand am Hennersdorfer See verzeichnet.",active:true},
  {name:"FKK-Strand Wangels",lat:54.31000,lon:10.78200,label:"FKK-Strand",type:"Strand",evidence:"Ortsrecht + FKK-Verzeichnis",source:"Gemeinde Wangels / ClothingOptional",sourceUrl:"https://clothingoptional.org/locations/germany/schleswig-holstein/fkk-strand-wangels-schleswig-holstein/",status:"FKK-Strand im Bereich des Weißhäuser Strandes; örtliche Strandregelung beachten.",active:true},
  {name:"FKK-Strand am Felixsee",lat:51.61280,lon:14.54800,label:"FKK-Strand",type:"Badesee",evidence:"Aktuelle FKK-Quelle + Kartenpunkt",source:"ClothingOptional / Kartenquellen",sourceUrl:"https://clothingoptional.org/locations/germany/brandenburg/fkk-strand-am-felixsee-brandenburg/",status:"FKK-Bereich am Felixsee; Zugang und lokale Regeln vor Ort beachten.",active:true},
  {name:"Walldorfer Badesee – FKK-Nordufer",lat:50.01511,lon:8.59781,label:"FKK-Nordufer",type:"Badesee",evidence:"Stadtgui + Ortsbeschreibung",source:"Stadtgui / Wikivoyage",sourceUrl:"https://www.stadtgui.de/nacktbaden/deutschland/hessen/moerfelden_walldorf_walldorfer_badesee.php?seite=4",status:"FKK-Bereich am Nordufer; Strandbad und Parkplatz sind gebührenpflichtig.",active:true},
  // v40 – weitere verifizierte FKK-Orte aus OSM/Badeklar und ergänzenden Ortsquellen
  {name:"Malge – FKK Strand",lat:52.37268,lon:12.48060,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet; OSM-Strandobjekt geprüft.",active:true},
  {name:"FKK-Strand Parkstetten – Weiher 12",lat:48.93790,lon:12.56660,label:"FKK-Strand",type:"Badesee",evidence:"Ortsquelle + FKK-Verzeichnis",source:"Sehenswerter Bayerischer Wald / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"FKK-Badeplatz am Weiher 12; Koordinate aus Ortsbeschreibung.",active:true},
  {name:"FKK-Badeplatz Halblech",lat:47.61837,lon:10.75841,label:"FKK-Badeplatz",type:"Badesee",evidence:"OpenStreetMap + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Badeplatz verzeichnet; OSM-Badeobjekt geprüft.",active:true},
  {name:"FKK-Strand Herrenwieser Weiher – Kempten",lat:47.71500,lon:10.25200,label:"FKK-Strand",type:"Badesee",evidence:"Ortsquelle + FKK-Verzeichnis",source:"ClothingOptional / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand in Kempten verzeichnet; Koordinate der FKK-Stelle.",active:true},
  {name:"FKK-Strand Biggesee – Attendorn",lat:51.09470,lon:7.86170,label:"FKK-Strand",type:"Stausee",evidence:"Ortsquelle + FKK-Verzeichnis",source:"ClothingOptional / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"FKK-Strand am Biggesee; Koordinate der verzeichneten FKK-Stelle.",active:true},

  // v39 – weitere verifizierte FKK-Strände aus OSM/Badeklar
  {name:"FKK-Strand Surendorf",lat:54.48119,lon:10.09070,label:"FKK-Strand",type:"Ostseestrand",evidence:"OpenStreetMap-Koordinate + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet; OSM-Strandobjekt geprüft.",active:true},
  {name:"FKK Strand Wallnau – Fehmarn",lat:54.48893,lon:11.01425,label:"FKK-Strand",type:"Ostseestrand",evidence:"OpenStreetMap-Koordinate + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet; OSM-Strandobjekt geprüft.",active:true},
  {name:"FKK-Strand Kappeln – Olpenitz",lat:54.65529,lon:10.03272,label:"FKK-Strand",type:"Ostseestrand",evidence:"OpenStreetMap-Koordinate + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet; OSM-Strandobjekt geprüft.",active:true},
  {name:"FKK-Badestrand Grömitz",lat:54.16818,lon:11.02396,label:"FKK-Badestrand",type:"Ostseestrand",evidence:"OpenStreetMap-Koordinate + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Badestrand verzeichnet; Koordinate des OSM-Punkts geprüft.",active:true},
  {name:"FKK-Bereich Timmendorfer Strand",lat:54.00901,lon:10.77273,label:"FKK-Bereich",type:"Ostseestrand",evidence:"OpenStreetMap-Koordinate + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Bereich verzeichnet; OSM-Strandobjekt geprüft.",active:true},
  {name:"FKK-Bereich Großsander",lat:53.29224,lon:7.82050,label:"FKK-Bereich",type:"Badesee",evidence:"OpenStreetMap-Koordinate + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Bereich verzeichnet; OSM-Strandobjekt geprüft.",active:true},
  {name:"FKK Chiemsee – Übersee",lat:47.83943,lon:12.46584,label:"FKK-Badeplatz",type:"Badesee",evidence:"OpenStreetMap-Koordinate + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Badeplatz verzeichnet; ausgewiesener FKK-Bereich am Chiemsee.",active:true},

  // v28 – weitere verifizierte FKK-Strände (OSM/Badeklar)
  {name:"FKK Strand Falckenstein – Kiel",lat:54.41369,lon:10.18598,label:"FKK-Strand",type:"Ostseestrand",evidence:"OpenStreetMap-Koordinate + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet"},
  {name:"FKK Strand Avendorf – Fehmarn",lat:54.40235,lon:11.12220,label:"FKK-Strand",type:"Ostseestrand",evidence:"OpenStreetMap-Koordinate + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet"},
  {name:"FKK Strand Wulfener Hals – Fehmarn",lat:54.40768,lon:11.18514,label:"FKK-Strand",type:"Ostseestrand",evidence:"OpenStreetMap-Koordinate + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet"},
  {name:"FKK Strand Niedamm / Golsmaas – Pommerby",lat:54.76033,lon:9.97403,label:"FKK-Strand",type:"Ostseestrand",evidence:"OpenStreetMap-Koordinate + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet"},

  // v27 – weitere FKK-Badestellen mit überprüfbaren OSM/Quellen-Koordinaten
  {name:"Niklassee FKK – Bad Schussenried",lat:48.01066,lon:9.69657,label:"FKK-Bereich",type:"Badesee",evidence:"FKK-Verzeichnis + OpenStreetMap-Koordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Badestelle verzeichnet; Koordinate des OSM-Schwimmbereichs geprüft.",active:true},
  {name:"FKK-Strand Baiersdorf",lat:49.66563,lon:11.02236,label:"FKK-Strand",type:"Badesee",evidence:"FKK-Verzeichnis + OpenStreetMap-Koordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet; Koordinate des OSM-Strandobjekts geprüft.",active:true},
  {name:"Klostersee Triefenstein – FKK",lat:49.80309,lon:9.61428,label:"FKK-Bereich",type:"Badesee",evidence:"FKK-Verzeichnis + OpenStreetMap-Koordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Badestelle am Klostersee verzeichnet; Gewässerkoordinate und benachbarter FKK-Strand in OSM geprüft.",active:true},
  {name:"FKK-Badestelle Arkenberger Baggersee",lat:52.63675,lon:13.41536,label:"FKK-Badestelle",type:"Badesee",evidence:"FKK-Verzeichnis + OpenStreetMap-Koordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Badestelle verzeichnet; Koordinate des OSM-Strandobjekts geprüft.",active:true},
  {name:"Baggersee Diez",lat:50.37018,lon:7.99191,label:"FKK-Bereich",type:"Badesee",evidence:"FKK-Verzeichnis + OpenStreetMap-Koordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Badestelle verzeichnet; Koordinate des OSM-Gewässers geprüft.",active:true},
  {name:"Geiseltalsee – FKK-Strand Stöbnitz",lat:51.31672,lon:11.82097,label:"FKK-Strand",type:"Badesee",evidence:"FKK-Verzeichnis + OpenStreetMap-Koordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand am Stöbnitzer Ufer verzeichnet; Koordinate des OSM-Strandbads geprüft.",active:true},

  // v25 – weitere FKK-Badestellen mit belegten Koordinaten
  {name:"Badesee Westrittrum",lat:52.9705,lon:8.3171,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/niedersachsen/",status:"Zwei textilfreie Stellen verzeichnet.",active:true},
  {name:"Großer Heidesee – Bad Laer",lat:52.0970,lon:8.0478,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis + OSM-Koordinate",source:"Badesee-heute / OpenStreetMap",sourceUrl:"https://badesee-heute.de/fkk/niedersachsen/",status:"Als FKK-Ort in Niedersachsen verzeichnet.",active:true},
  {name:"Kiefhölzer Teich",lat:51.8303,lon:10.3686,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis + amtlicher Badegewässer-Atlas",source:"Badesee-heute / NLGA",sourceUrl:"https://www.apps.nlga.niedersachsen.de/batlas/",status:"Als FKK-Badesee verzeichnet; Koordinate aus dem Badegewässer-Atlas Niedersachsen.",active:true},
  {name:"Kronensee",lat:52.3709,lon:8.2372,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis + OSM",source:"Badesee-heute / OpenStreetMap",sourceUrl:"https://badesee-heute.de/fkk/niedersachsen/",status:"FKK-Bereich am Südwestufer verzeichnet.",active:true},
  {name:"Maritimsee – Ohlenstedt",lat:53.2883,lon:8.7644,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis + amtlicher Badegewässer-Atlas",source:"Badesee-heute / NLGA",sourceUrl:"https://www.apps.nlga.niedersachsen.de/batlas/",status:"Als FKK-Ort verzeichnet; Koordinate aus dem Badegewässer-Atlas Niedersachsen.",active:true},
  {name:"Jugendbad – Borkum",lat:53.6086,lon:6.7069,label:"FKK erlaubt",type:"Küstenstrand",evidence:"FKK-Verzeichnis + amtlicher Badegewässer-Atlas",source:"Badesee-heute / NLGA",sourceUrl:"https://www.apps.nlga.niedersachsen.de/batlas/",status:"Als FKK-Ort verzeichnet; Koordinate aus dem Badegewässer-Atlas Niedersachsen.",active:true},
  {name:"Kleiner Bornhorster See",lat:53.1841,lon:8.2686,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/niedersachsen/",status:"FKK-Bereich am Südostufer verzeichnet.",active:true},
  {name:"Wippinger Kolk",lat:52.9146,lon:7.3920,label:"FKK geduldet",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/niedersachsen/",status:"Als FKK-Bereich mit Duldung verzeichnet.",active:true},
  {name:"Woldsee",lat:53.1604,lon:8.1200,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/niedersachsen/",status:"FKK-Bereich am Südostufer verzeichnet.",active:true},
  {name:"Stadtwaldsee – Bremen",lat:53.1118,lon:8.8288,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/bremen/",status:"FKK-Strand verzeichnet.",active:true},
  {name:"Nordseestrand Duhnen – Rettungsstation",lat:53.8857,lon:8.6352,label:"FKK erlaubt",type:"Küstenstrand",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/niedersachsen/",status:"FKK-Strand Duhnen verzeichnet.",active:true},
  {name:"Nordseestrand Oase – Norderney",lat:53.7229,lon:7.2390,label:"FKK erlaubt",type:"Küstenstrand",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/niedersachsen/",status:"Eine textilfreie Stelle verzeichnet.",active:true},
  {name:"Haselbacher See",lat:51.0838,lon:12.3978,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/sachsen/",status:"Drei textilfreie Stellen verzeichnet.",active:true},
  {name:"Partwitzer See",lat:51.5215,lon:14.1425,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/sachsen/",status:"FKK-Bereich am Nordufer verzeichnet.",active:true},
  {name:"Störmthaler See",lat:51.2293,lon:12.4536,label:"FKK üblich",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/sachsen/",status:"Zwei textilfreie Stellen verzeichnet.",active:true},
  {name:"Talsperre Bautzen",lat:51.2140,lon:14.4541,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/sachsen/",status:"FKK-Stelle verzeichnet.",active:true},
  // Badeklar – zusätzliche FKK-Badestellen mit zuvor verifizierten Routenkoordinaten
  {name:"Baggersee Kollerinsel – Brühl",lat:49.3781,lon:8.4779,label:"FKK-Bereich",type:"Badesee",evidence:"FKK-Verzeichnis + Routenkoordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Badestelle verzeichnet; Koordinate über die ausgewiesene Routenposition geprüft.",active:true},
  {name:"Baggersee – Eggenstein",lat:49.0867,lon:8.3713,label:"FKK-Bereich",type:"Badesee",evidence:"FKK-Verzeichnis + Routenkoordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Badestelle verzeichnet; Koordinate über die ausgewiesene Routenposition geprüft.",active:true},
  {name:"FKK-Strand Brühl",lat:49.38283,lon:8.4672,label:"FKK-Strand",type:"Badesee",evidence:"FKK-Verzeichnis + Routenkoordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet; Koordinate über die ausgewiesene Routenposition geprüft.",active:true},
  {name:"FKK-Strand Freiburg im Breisgau",lat:48.00545,lon:7.76027,label:"FKK-Strand",type:"Badesee",evidence:"FKK-Verzeichnis + Routenkoordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet; Koordinate über die ausgewiesene Routenposition geprüft.",active:true},
  {name:"FKK-Strand Kressbronn am Bodensee",lat:47.58436,lon:9.57295,label:"FKK-Strand",type:"Badesee",evidence:"FKK-Verzeichnis + Routenkoordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet; Koordinate über die ausgewiesene Routenposition geprüft.",active:true},
  {name:"FKK-Strand Lichtenau",lat:48.74407,lon:7.98809,label:"FKK-Strand",type:"Badesee",evidence:"FKK-Verzeichnis + Routenkoordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet; Koordinate über die ausgewiesene Routenposition geprüft.",active:true},
  {name:"FKK-Strand Neuenburg am Rhein",lat:47.7601,lon:7.54694,label:"FKK-Strand",type:"Badesee",evidence:"FKK-Verzeichnis + Routenkoordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet; Koordinate über die ausgewiesene Routenposition geprüft.",active:true},
  {name:"FKK-Strand Rheinmünster",lat:48.75248,lon:7.98779,label:"FKK-Strand",type:"Badesee",evidence:"FKK-Verzeichnis + Routenkoordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet; Koordinate über die ausgewiesene Routenposition geprüft.",active:true},
  {name:"FKK-Strand Rheinstetten",lat:48.96672,lon:8.32051,label:"FKK-Strand",type:"Badesee",evidence:"FKK-Verzeichnis + Routenkoordinate",source:"Badeklar / OpenStreetMap",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand verzeichnet; Koordinate über die ausgewiesene Routenposition geprüft.",active:true},

  // Niedersachsen / Norddeutschland
  {name:"Altwarmbüchener See",lat:52.4211,lon:9.8506,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/niedersachsen/",status:"Als FKK-Badesee verzeichnet." ,active:true},
  {name:"Ricklinger Kiesteiche – Sieben-Meter-Teich",lat:52.3369,lon:9.7450,label:"FKK-Bereich ausgewiesen",type:"Badesee",evidence:"offizielle Quelle",source:"Region Hannover",sourceUrl:"https://www.hannover.de/Kultur-Freizeit/Naherholung/Raus-in-die-Natur/Seen/Ricklinger-Kiesteiche",status:"Das Nordufer des Sieben-Meter-Teichs ist als FKK-Bereich ausgewiesen." ,active:true},
  {name:"Kennel-Bad",lat:52.24216,lon:10.52115,label:"Abgetrennter FKK-Bereich",type:"Naturbad",evidence:"offizielle Quelle",source:"Kennel-Bad",sourceUrl:"https://kennel-bad.de/",status:"Das Bad verfügt über einen abgetrennten FKK-Bereich." ,active:true},
  {name:"Allersee Wolfsburg",lat:52.43361,lon:10.81917,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/niedersachsen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Oldenstädter See – Uelzen",lat:52.982843,lon:10.588481,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/niedersachsen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Fümmelsee – Wolfenbüttel",lat:52.1679,lon:10.5017,label:"FKK",type:"Naturbad",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/niedersachsen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Inselsee – FKK-Strand",lat:53.30388,lon:10.48878,label:"FKK-Strand",type:"Badesee",evidence:"offizielle Quelle",source:"Gemeinde Scharnebeck",sourceUrl:"https://gemeinde-scharnebeck.de/kultur-und-tourismus/inselsee/",status:"Die Gemeinde nennt ausdrücklich einen FKK-Strand am Inselsee." ,active:true},
  {name:"Pulvermühlenteich – Seevetal",lat:53.41451,lon:10.03654,label:"FKK",type:"See",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/niedersachsen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},

  // Schleswig-Holstein / Nordsee
  {name:"Bottsand",lat:54.42833,lon:10.29180,label:"FKK erlaubt",type:"Strand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/bottsand/",status:"Eine FKK-Stelle ist in OpenStreetMap als textilfrei verzeichnet." ,active:true},
  {name:"Holnis Drei",lat:54.8628,lon:9.5963,label:"FKK erlaubt",type:"Strand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/holnis-drei/",status:"Eine FKK-Stelle ist in OpenStreetMap als textilfrei verzeichnet." ,active:true},
  {name:"Kalifornien Kurstrand",lat:54.4309,lon:10.3691,label:"FKK-Bereich ausgewiesen",type:"Strand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/kalifornien-kurstrand/",status:"Ein FKK-Bereich ist in OpenStreetMap ausgewiesen." ,active:true},
  {name:"Dagebüll",lat:54.7294,lon:8.6935,label:"FKK-Bereich ausgewiesen",type:"Nordseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/dagebuell/",status:"Mehrere FKK-Stellen sind als ausgewiesene FKK-Bereiche verzeichnet." ,active:true},
  {name:"Elpersbütteler Deich",lat:54.0893,lon:8.9565,label:"FKK erlaubt",type:"Nordseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/elpersbuetteler-deich/",status:"Eine FKK-Stelle ist als FKK erlaubt verzeichnet." ,active:true},
  {name:"Föhr – Nieblum FKK-Strand",lat:54.6901,lon:8.4600,label:"FKK-Bereich ausgewiesen",type:"Nordseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/foehr-nieblum-fkk-strand/",status:"Mehrere ausgewiesene FKK-Stellen sind verzeichnet." ,active:true},

  // Mecklenburg-Vorpommern / Ostsee
  {name:"Ahlbeck – Sportferienpark",lat:53.9400,lon:14.1900,label:"FKK erlaubt",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-ahlbeck-sportferienpark/",status:"Mehrere FKK-Bereiche sind verzeichnet." ,active:true},
  {name:"Ahrenshoop – Hohes Ufer",lat:54.3772,lon:12.4088,label:"FKK",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-ahrenshoop-hohes-ufer/",status:"Als textilfreie Stelle verzeichnet." ,active:true},
  {name:"Ahrenshoop – REHA-Klinik",lat:54.3908,lon:12.4357,label:"FKK",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-ahrenshoop-reha-klinik/",status:"Als textilfreie Stelle verzeichnet." ,active:true},
  {name:"Born – Nordstrand Bernsteinweg",lat:54.4573,lon:12.5483,label:"Textilfreiheit vorgeschrieben",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-born-nordstrand-bernsteinweg/",status:"Als textilfreie Stelle verzeichnet." ,active:true},
  {name:"Börgerende – Ferien-Camp",lat:54.1540,lon:11.9009,label:"FKK erlaubt",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-boergerende-ferien-camp/",status:"Als FKK-Stelle verzeichnet." ,active:true},
  {name:"Dierhagen – Am Plateau",lat:54.2936,lon:12.3305,label:"FKK erlaubt",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-dierhagen-am-plateau/",status:"Als FKK-Stelle verzeichnet." ,active:true},
  {name:"Dierhagen – Dierhagen-Ost",lat:54.3094,lon:12.3505,label:"FKK",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-dierhagen-dierhagen-ost/",status:"Als textilfreie Stelle verzeichnet." ,active:true},
  {name:"Nienhagen – Strandtreppe",lat:54.1649,lon:11.9475,label:"FKK erlaubt",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-nienhagen-strandtreppe/",status:"Mehrere FKK-Stellen sind verzeichnet." ,active:true},
  {name:"Prerow – An der Seebrücke",lat:54.4536,lon:12.5695,label:"Textilfreiheit vorgeschrieben",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-prerow-an-der-seebruecke/",status:"Als textilfreie Stelle verzeichnet." ,active:true},
  {name:"Prerow – Parkplatz Hohe Düne",lat:54.4514,lon:12.5922,label:"FKK-Bereich ausgewiesen",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-prerow-parkplatz-hohe-duene/",status:"Ein ausgewiesener FKK-Bereich ist verzeichnet." ,active:true},
  {name:"Karlshagen – Campingplatz",lat:54.1111,lon:13.8573,label:"FKK",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-karlshagen-campingplatz/",status:"Mehrere FKK-Stellen sind verzeichnet." ,active:true},
  {name:"Karlshagen – Hauptstrand",lat:54.1208,lon:13.8442,label:"FKK",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-karlshagen-hauptstrand/",status:"Als FKK-Stelle verzeichnet." ,active:true},
  {name:"Koserow – FKK-Parkplatz",lat:54.0644,lon:13.9838,label:"FKK erlaubt",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-koserow-fkk-parkplatz/",status:"Mehrere FKK-Bereiche sind verzeichnet." ,active:true},
  {name:"Koserow – Kurplatz",lat:54.0591,lon:14.0004,label:"FKK erlaubt",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-koserow-kurplatz/",status:"Ein FKK-Bereich ist verzeichnet." ,active:true},
  {name:"Trassenheide – Campingplatz",lat:54.0918,lon:13.8910,label:"FKK erlaubt",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-trassenheide-campingplatz/",status:"Mehrere FKK-Stellen sind verzeichnet." ,active:true},
  {name:"Trassenheide – Hauptstrand",lat:54.0967,lon:13.8805,label:"FKK",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-trassenheide-hauptstrand/",status:"Als textilfreie Stelle verzeichnet." ,active:true},
  {name:"Wustrow – Fischländer Strand",lat:54.3516,lon:12.3856,label:"FKK erlaubt",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-wustrow-fischlaender-strand/",status:"Mehrere FKK-Bereiche sind verzeichnet." ,active:true},
  {name:"Zingst – Kurhaus",lat:54.4418,lon:12.6824,label:"FKK-Bereich ausgewiesen",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-zingst-kurhaus/",status:"Ein ausgewiesener FKK-Bereich ist verzeichnet." ,active:true},
  {name:"Zingst – Müggenburg",lat:54.4420,lon:12.7461,label:"FKK-Bereich ausgewiesen",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-zingst-mueggenburg/",status:"Mehrere FKK-Bereiche sind verzeichnet." ,active:true},
  {name:"Zinnowitz – Campingplatz",lat:54.0860,lon:13.9041,label:"FKK erlaubt",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-zinnowitz-campingplatz/",status:"Als FKK-Stelle verzeichnet." ,active:true},
  {name:"Zinnowitz – Hauptzugang",lat:54.0785,lon:13.9250,label:"FKK erlaubt",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-zinnowitz-hauptzugang/",status:"Als FKK-Stelle verzeichnet." ,active:true},
  {name:"Ückeritz – DLRG",lat:54.0183,lon:14.0685,label:"FKK erlaubt",type:"Ostseestrand",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/strand/ostsee-ueckeritz-dlrg/",status:"Ein FKK-Bereich ist verzeichnet." ,active:true},

  // Brandenburg / Sachsen / Thüringen / Sachsen-Anhalt
  {name:"Beetzsee",lat:52.4780,lon:12.5800,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Badesee verzeichnet." ,active:true},
  {name:"Germendorfer Waldsee",lat:52.7180,lon:13.1900,label:"FKK-Bereich ausgewiesen",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als ausgewiesener FKK-Bereich verzeichnet." ,active:true},
  {name:"Helenesee",lat:52.2620,lon:14.4250,label:"FKK-Bereich ausgewiesen",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als ausgewiesener FKK-Bereich verzeichnet." ,active:true},
  {name:"Cospudener See",lat:51.2670,lon:12.3363,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/cospudener-see/",status:"Mehrere FKK-Stellen sind verzeichnet." ,active:true},
  {name:"Bärwalder See",lat:51.3782,lon:14.5446,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/baerwalder-see/",status:"Mehrere FKK-Stellen sind verzeichnet." ,active:true},
  {name:"Talsperre Pöhl",lat:50.5348,lon:12.2068,label:"FKK-Bereich ausgewiesen",type:"Stausee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/talsperre-poehl/",status:"Als FKK-Stelle verzeichnet." ,active:true},
  {name:"Altmühlsee",lat:49.1346,lon:10.7191,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/altmuehlsee/",status:"Eine FKK-Stelle ist verzeichnet." ,active:true},
  {name:"Großer Alpsee",lat:47.5726,lon:10.1732,label:"Textilfreiheit vorgeschrieben",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/grosser-alpsee/",status:"Mehrere textilfreie Bereiche sind verzeichnet." ,active:true},
  {name:"Hohenwarte-Stausee",lat:50.6061,lon:11.5708,label:"FKK erlaubt",type:"Stausee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/hohenwarte-stausee/",status:"Mehrere FKK-Stellen sind verzeichnet." ,active:true},
  {name:"Stausee Kelbra",lat:51.4358,lon:10.9940,label:"FKK erlaubt",type:"Stausee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/stausee-kelbra/",status:"Eine FKK-Stelle ist verzeichnet." ,active:true},
  {name:"Arendsee",lat:52.8906,lon:11.4765,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/arendsee/",status:"Als FKK-Badesee verzeichnet." ,active:true},

  // Baden-Württemberg / Bayern / Hessen / Rheinland-Pfalz / NRW / Berlin
  {name:"Aileswasensee",lat:48.6038,lon:9.2626,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/aileswasensee/",status:"Eine FKK-Stelle ist verzeichnet." ,active:true},
  {name:"Opfinger See",lat:48.0051,lon:7.7583,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/opfinger-see/",status:"Eine FKK-Stelle ist verzeichnet." ,active:true},
  {name:"Otterstädter Altrhein",lat:49.3888,lon:8.4764,label:"FKK-Bereich ausgewiesen",type:"Altrhein / Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/otterstaedter-altrhein/",status:"Mehrere FKK-Stellen sind verzeichnet." ,active:true},
  {name:"Adriaweiher – Blaue Adria",lat:49.4249,lon:8.4619,label:"FKK-Bereich ausgewiesen",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/adriaweiher-blaue-adria/",status:"Als ausgewiesener FKK-Bereich verzeichnet." ,active:true},
  {name:"Biggesee",lat:51.0708,lon:7.8615,label:"FKK erlaubt",type:"Stausee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/biggesee/",status:"Ein FKK-Bereich ist am Nordufer verzeichnet." ,active:true},
  {name:"Langener Waldsee",lat:50.0139,lon:8.6172,label:"FKK",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/langener-waldsee/",status:"Mehrere textilfreie Stellen sind verzeichnet." ,active:true},
  {name:"Walldorfer Badesee",lat:50.0148,lon:8.5981,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/walldorfer-badesee/",status:"Mehrere FKK-Bereiche sind verzeichnet." ,active:true},
  {name:"Großer Müggelsee",lat:52.4368,lon:13.6499,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/grosser-mueggelsee/",status:"FKK ist am See verzeichnet." ,active:true},
  {name:"Grunewaldsee",lat:52.4705,lon:13.2622,label:"FKK erlaubt",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/see/grunewaldsee/",status:"Als FKK-Ort verzeichnet." ,active:true},

  // Weitere bundesweite FKK-Badestellen aus aktuellen Verzeichnissen
  {name:"Dippelsdorfer Teich – Moritzburg",lat:51.1267,lon:13.6780,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Naturbad – Pirna",lat:50.9579,lon:13.9404,label:"FKK",type:"Naturbad",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Naturbad mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Talsperre Bautzen",lat:51.1830,lon:14.4870,label:"FKK",type:"Stausee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Olbasee – Guttau",lat:51.2900,lon:14.5610,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Olbersdorfer See – Zittau",lat:50.8920,lon:14.7820,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Bleecher – Leutersdorf",lat:50.9520,lon:14.6580,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Halbendorfer See",lat:51.3920,lon:14.5750,label:"FKK-Bereich",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Knappensee",lat:51.3930,lon:14.3000,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Kulkwitzer See",lat:51.3100,lon:12.2450,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Schladitzer See",lat:51.4550,lon:12.3550,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Kirchenteich – Wermsdorf",lat:51.2850,lon:12.9440,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Kiebitzsee – Falkenberg/Elster",lat:51.6010,lon:13.2570,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Gantikower See – Kyritz",lat:52.9600,lon:12.3600,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Glambecksee – Kieve",lat:53.3400,lon:12.5600,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Fleesensee – Malchow",lat:53.4900,lon:12.4800,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Inselsee – Güstrow",lat:53.7700,lon:12.1800,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Krakower See",lat:53.6500,lon:12.2700,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Einfelder See – Neumünster",lat:54.1200,lon:9.9600,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Wittensee – Bünsdorf",lat:54.3900,lon:9.7000,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Tonkuhle – Moorrege",lat:53.6650,lon:9.6650,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Baggersee – Appen-Etz",lat:53.6500,lon:9.7500,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Kleiner Bornhorster See",lat:53.1800,lon:8.2800,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Ohlenstedter Quellsee",lat:53.2500,lon:8.8500,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Werdersee – Bremen",lat:53.0550,lon:8.8100,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Bugasee – Kassel",lat:51.2850,lon:9.5050,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Twistesee – Bad Arolsen",lat:51.3850,lon:9.0600,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Diemelsee",lat:51.3700,lon:8.7300,label:"FKK",type:"Stausee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Seepark – Weimar/Niederweimar",lat:50.7600,lon:8.7300,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Launsbacher See",lat:50.6250,lon:8.6500,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Heuchelheimer See",lat:50.6000,lon:8.6200,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Northeimer Seenplatte",lat:51.7100,lon:9.9800,label:"FKK",type:"Seenplatte",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Martinsee – Wolfenbüttel",lat:52.1600,lon:10.5100,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Halberstädter See",lat:51.9091667,lon:11.0852778,label:"FKK-Bereich ausgewiesen",type:"Badesee",evidence:"offizielle Quelle",source:"Land Sachsen-Anhalt / Stadt Halberstadt",sourceUrl:"https://ms.sachsen-anhalt.de/themen/gesundheit-und-pflege/daten-zu-gesundheit/badegewaesser/page/halberstaedter-see",status:"Die amtliche Badegewässer-Seite nennt ausdrücklich einen FKK-Bereich. Koordinaten aus der offiziellen Camping-/Tourismusangabe." ,active:true},
  {name:"Neustädter See – Magdeburg",lat:52.1800,lon:11.6200,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Salbker Seen – Magdeburg",lat:52.0800,lon:11.6500,label:"FKK nicht mehr bestätigt",type:"Badesee",evidence:"aktuelle Gegenprüfung",source:"Seen.de",sourceUrl:"https://www.seen.de/salbker-seen/",status:"Nicht mehr als FKK-Stelle führen: aktuelle Quelle berichtet, dass FKK dort inzwischen nicht mehr besteht.",active:false},
  {name:"Löderburger See",lat:51.8700,lon:11.5700,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Unterbacher See",lat:51.1600,lon:6.8700,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Horstmarer See – Lünen",lat:51.6100,lon:7.5300,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Xantener Südsee",lat:51.6700,lon:6.4300,label:"FKK",type:"Badesee",evidence:"FKK-Verzeichnis",source:"Badesee-Suche",sourceUrl:"https://www.badesee-suche.de/seen/fkk-seen/",status:"Als Badesee mit FKK-Möglichkeit verzeichnet." ,active:true},
  {name:"Birkensee – Bergkirchen",lat:48.2400,lon:11.3300,label:"FKK",type:"Badesee",evidence:"Lokale Quelle",source:"Kartendaten",sourceUrl:"https://www.openstreetmap.org/",status:"Als FKK-Badesee bekannt." ,active:true},
  {name:"Pucher Meer – Fürstenfeldbruck",lat:48.1800,lon:11.2500,label:"FKK-Strand",type:"Badesee",evidence:"Lokale Quelle",source:"Kartendaten",sourceUrl:"https://www.openstreetmap.org/",status:"Als FKK-Strand bekannt." ,active:true},
  {name:"Muhr am See – Altmühlsee",lat:49.1500,lon:10.7100,label:"FKK-Strand",type:"Badesee",evidence:"Lokale Quelle",source:"Kartendaten",sourceUrl:"https://www.openstreetmap.org/",status:"Als FKK-Strand verzeichnet." ,active:true},
  {name:"Absberg – Seespitz",lat:49.13919,lon:10.89272,label:"FKK-Strand",type:"Strandbad",evidence:"Lokale Quelle",source:"Kartendaten",sourceUrl:"https://www.openstreetmap.org/",status:"Als FKK-Strand verzeichnet." ,active:true},
  {name:"Hof – FKK-Badestelle",lat:50.3100,lon:11.9200,label:"FKK-Badestelle",type:"Badesee",evidence:"Lokale Quelle",source:"Kartendaten",sourceUrl:"https://www.openstreetmap.org/",status:"Als FKK-Badestelle verzeichnet." ,active:true},
  {name:"Binsfeld – Speyer",lat:49.3500,lon:8.4300,label:"FKK-Strand",type:"Badesee",evidence:"Lokale Quelle",source:"Kartendaten",sourceUrl:"https://www.openstreetmap.org/",status:"Als FKK-Strand verzeichnet." ,active:true},
  {name:"Plüderhausen – FKK-Bereich",lat:48.8000,lon:9.6000,label:"FKK-Bereich",type:"Badesee",evidence:"Lokale Quelle",source:"Kartendaten",sourceUrl:"https://www.openstreetmap.org/",status:"Als FKK-Bereich verzeichnet." ,active:true},
  {name:"Priwall – Travemünde",lat:53.9650,lon:10.8800,label:"FKK-Strand",type:"Ostseestrand",evidence:"Lokale Quelle",source:"Kartendaten",sourceUrl:"https://www.openstreetmap.org/",status:"Als FKK-Strand verzeichnet." ,active:true},
  {name:"Westerland – FKK-Strand",lat:54.9050,lon:8.3100,label:"FKK-Strand",type:"Nordseestrand",evidence:"Lokale Quelle",source:"Kartendaten",sourceUrl:"https://www.openstreetmap.org/",status:"Als FKK-Strand verzeichnet." ,active:true},
  {name:"Ording – FKK-Strand",lat:54.3000,lon:8.6300,label:"FKK-Strand",type:"Nordseestrand",evidence:"Lokale Quelle",source:"Kartendaten",sourceUrl:"https://www.openstreetmap.org/",status:"Als FKK-Strand verzeichnet." ,active:true},
  {name:"Binz – FKK-Strand",lat:54.3950,lon:13.6200,label:"FKK-Strand",type:"Ostseestrand",evidence:"Lokale Quelle",source:"Kartendaten",sourceUrl:"https://www.openstreetmap.org/",status:"Als FKK-Strand verzeichnet." ,active:true},
  {name:"Strausberg – FKK-Strand",lat:52.5700,lon:13.9000,label:"FKK-Strand",type:"Badesee",evidence:"Lokale Quelle",source:"Kartendaten",sourceUrl:"https://www.openstreetmap.org/",status:"Als FKK-Strand verzeichnet." ,active:true},
  {name:"Badesee Teningen-Nimburg",lat:48.1153,lon:7.7834,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Baggersee Epple Kirchentellinsfurt",lat:48.5412,lon:9.1511,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Baggersee Grenis",lat:47.7473,lon:9.7628,label:"FKK geduldet",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Baggersee Streitköpfle",lat:49.1195,lon:8.3815,label:"ausgewiesener FKK-Bereich",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Goldscheuerer Baggersee",lat:48.4997,lon:7.8007,label:"FKK üblich",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Großer Burkwanger Baggersee",lat:47.6927,lon:10.0766,label:"FKK üblich",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Grötzinger Baggersee",lat:49.031,lon:8.5053,label:"FKK geduldet",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Katzenbach-Stausee",lat:49.0511,lon:8.9393,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Kleiner Ersinger Badesee",lat:48.2934,lon:9.8638,label:"FKK geduldet",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Neuer Pfandersee",lat:49.187,lon:8.4587,label:"FKK geduldet",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Oberer Seewaldsee",lat:48.9927,lon:8.969,label:"FKK üblich",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Achernsee",lat:48.6443,lon:8.0334,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Eschacher Weiher",lat:47.6959,lon:10.19,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Forggensee",lat:47.6168,lon:10.7353,label:"FKK üblich",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Großer Pullinger See",lat:48.3523,lon:11.7115,label:"ausgewiesener FKK-Bereich",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Happinger Ausee",lat:47.8286,lon:12.1414,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Floriansee",lat:47.8347,lon:12.1459,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Baggersee Dettelbach",lat:49.7985,lon:10.1827,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Neuer Baggersee Dettelbach",lat:49.8006,lon:10.1732,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Lußsee",lat:48.198,lon:11.4187,label:"FKK üblich",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Ickinger Stausee",lat:47.9489,lon:11.4527,label:"FKK üblich",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Motzener See",lat:52.2152,lon:13.568,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Schwielochsee",lat:52.0562,lon:14.2123,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Gorinsee",lat:52.6872,lon:13.47,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Carwitzer See",lat:53.3013,lon:13.4646,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Großer Steeder See",lat:53.7838,lon:11.6831,label:"Textilfreiheit vorgeschrieben",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Rätzsee",lat:53.2412,lon:12.8896,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Useriner See",lat:53.3398,lon:12.97,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Luckower See",lat:53.7163,lon:11.8098,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Leppinsee",lat:53.3446,lon:12.8212,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},
  {name:"Langhäger See",lat:53.3894,lon:12.9557,label:"FKK erlaubt",type:"Badesee",evidence:"OpenStreetMap-basierte Quelle",source:"Badesee-heute",sourceUrl:"https://badesee-heute.de/fkk/",status:"Als FKK-Stelle verzeichnet.",active:true},  {name:"FKK Binsfeld I – Otterstadt",lat:49.3619,lon:8.46365,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand in Binsfeld verzeichnet; Koordinate direkt aus OSM geprüft.",active:true},
  {name:"FKK Binsfeld II – Otterstadt",lat:49.3609,lon:8.46279,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand in Binsfeld verzeichnet; Koordinate direkt aus OSM geprüft.",active:true},
  {name:"FKK Binsfeld III – Otterstadt",lat:49.36016,lon:8.46221,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"Als FKK-Strand in Binsfeld verzeichnet; Koordinate direkt aus OSM geprüft.",active:true},
  {name:"FKK-Strand Kenzingen – Nachtallmendsee",lat:48.2082,lon:7.75606,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"FKK-Strand am Nachtallmendsee; Koordinate direkt aus OSM geprüft.",active:true},
  {name:"FKK-Strand Filzteich – Schneeberg",lat:50.57195,lon:12.61218,label:"FKK-Strand",type:"Badesee",evidence:"OpenStreetMap + FKK-Verzeichnis",source:"OpenStreetMap / Badeklar",sourceUrl:"https://badeklar.de/fkk-badestellen",status:"FKK-Strand am Filzteich; FKK ist am Strandbad möglich; Koordinate aus OSM-Objektumfeld geprüft.",active:true},
] ;

let map;
let userMarker = null;
let resultMarkers = [];
let searchOrigin = null; // {lat, lon, label, kind}
let searchTimer = null;
let favorites = new Set(JSON.parse(localStorage.getItem("fkkFavorites") || "[]"));

const radiusEl = document.getElementById("radius");
const radiusValueEl = document.getElementById("radiusValue");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const locateBtn = document.getElementById("locateBtn");
const placeInput = document.getElementById("placeInput");
const placeSearchBtn = document.getElementById("placeSearchBtn");
const originInfoEl = document.getElementById("originInfo");

radiusEl.addEventListener("input", () => {
  radiusValueEl.textContent = radiusEl.value;
  if (searchOrigin) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => searchPlaces(), 120);
  }
});

placeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchFromPlace();
});

function initMap(){
  if (typeof L === "undefined") {
    document.getElementById("map").innerHTML = '<div style="padding:20px;font-size:15px">⚠️ Die Kartenbibliothek konnte nicht geladen werden. Bitte die Seite einmal neu laden.</div>';
    return;
  }
  map = L.map("map").setView([52.62,10.08], 9);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom:19, attribution:"© OpenStreetMap-Mitwirkende"
  }).addTo(map);
}

function haversineKm(aLat,aLon,bLat,bLon){
  const R=6371;
  const dLat=(bLat-aLat)*Math.PI/180;
  const dLon=(bLon-aLon)*Math.PI/180;
  const x=Math.sin(dLat/2)**2 + Math.cos(aLat*Math.PI/180)*Math.cos(bLat*Math.PI/180)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}

function escapeHtml(s){
  return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}

function clearMarkers(){
  resultMarkers.forEach(m=>map.removeLayer(m));
  resultMarkers=[];
}

function showOrigin(origin){
  if (userMarker) map.removeLayer(userMarker);
  const iconClass = origin.kind === "gps" ? "originMarker originMarkerGps" : "originMarker originMarkerPlace";
  const iconText = origin.kind === "gps" ? "●" : "●";
  const originIcon = L.divIcon({
    className: "originIconWrap",
    html: `<div class="${iconClass}"><span>${iconText}</span></div>`,
    iconSize: [46,46],
    iconAnchor: [23,23],
    popupAnchor: [0,-24]
  });
  userMarker=L.marker([origin.lat,origin.lon],{icon:originIcon,zIndexOffset:1000}).addTo(map)
    .bindPopup(`<strong>${origin.kind === "gps" ? "Mein Standort" : "Suchort"}</strong><br>${escapeHtml(origin.label)}`);
  originInfoEl.classList.remove("hidden");
  originInfoEl.innerHTML = `🔎 Suche ab <strong>${escapeHtml(origin.label)}</strong> <button id="clearOrigin" type="button">×</button>`;
  document.getElementById("clearOrigin").addEventListener("click", clearOrigin);
}

function clearOrigin(){
  searchOrigin=null;
  if (userMarker) { map.removeLayer(userMarker); userMarker=null; }
  originInfoEl.classList.add("hidden");
  statusEl.textContent="Wähle deinen Standort oder gib einen Ort ein.";
  resultsEl.innerHTML="";
  clearMarkers();
}

function navMode(p){
  // Source-backed exact points are preferred. Approximate lake/area points
  // navigate by place name so the user is not sent to a misleading pin.
  return (p.evidence==="offizielle Quelle" || p.evidence==="OpenStreetMap-basierte Quelle") ? "coords" : "place";
}

function navigationLinks(p){
  const mode=navMode(p);
  const query=`${p.name}, Deutschland`;
  const apple=mode==="coords" ? `maps://?daddr=${encodeURIComponent(p.lat+","+p.lon)}` : `maps://?q=${encodeURIComponent(query)}`;
  const google=mode==="coords" ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.lat+","+p.lon)}` : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  const note=mode==="coords" ? "" : `<div class="navHint">🧭 Navigation zum Gewässer/Ort – die Datenbank hat für diesen Eintrag keinen exakt belegten FKK-Punkt.</div>`;
  return `<div class="navButtons"><a class="navBtn" href="${apple}"> Apple Karten</a><a class="navBtn" href="${google}" target="_blank" rel="noopener">🗺️ Google Maps</a></div>${note}`;
}


function renderResults(items, radius){
  clearMarkers();
  resultsEl.innerHTML="";
  items.sort((a,b)=>a.distance-b.distance);

  if (!items.length){
    statusEl.textContent=`ℹ️ Keine FKK-Orte innerhalb von ${radius} km in der lokalen Datenbank.`;
    resultsEl.innerHTML='<div class="card"><div class="muted">Keine passenden FKK-Orte im gewählten Radius gefunden.</div><div class="source">Tipp: Größeren Suchradius wählen.</div></div>';
    return;
  }

  items.forEach((p)=>{
    const fkkIcon=L.divIcon({className:"fkkIconWrap",html:`<div class="fkkMarker"><span class="markerUmbrella" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M8 23c3-10 11-15 16-15s13 5 16 15H8Z"/><path d="M24 23v15c0 3 2 5 5 5"/><path d="M18 43h12"/></svg></span></div>`,iconSize:[30,36],iconAnchor:[15,34],popupAnchor:[0,-30]});
    const marker=L.marker([p.lat,p.lon],{icon:fkkIcon}).addTo(map);
    marker.bindPopup(`<strong>${escapeHtml(p.name)}</strong><br>${escapeHtml(p.label)}<br>${p.distance.toFixed(1)} km`);
    resultMarkers.push(marker);

    const sourceLink = p.sourceUrl ? `<a href="${escapeHtml(p.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(p.source)}</a>` : escapeHtml(p.source||"");
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <button class="favoriteButton ${favorites.has(p.name)?"isFavorite":""}" type="button" aria-label="${favorites.has(p.name)?"Aus Favoriten entfernen":"Zu Favoriten hinzufügen"}" title="${favorites.has(p.name)?"Aus Favoriten entfernen":"Zu Favoriten hinzufügen"}">${favorites.has(p.name)?"★":"☆"}</button>
      <h3 class="favoriteTitle">${escapeHtml(p.name)}</h3>
      <div class="meta">📍 ${p.distance.toFixed(1)} km entfernt<br>
      <strong>${escapeHtml(p.label)}</strong> <span class="typePill">${escapeHtml(p.type)}</span><br>
      ℹ️ ${escapeHtml(p.status)}</div>
      <div class="source">Quelle: ${sourceLink}<br>Einordnung: ${escapeHtml(p.evidence)}</div>
      ${navigationLinks(p)}`;
    const favoriteButton = card.querySelector(".favoriteButton");
    favoriteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (favorites.has(p.name)) favorites.delete(p.name); else favorites.add(p.name);
      localStorage.setItem("fkkFavorites", JSON.stringify([...favorites]));
      favoriteButton.classList.toggle("isFavorite", favorites.has(p.name));
      favoriteButton.textContent = favorites.has(p.name) ? "★" : "☆";
      favoriteButton.setAttribute("aria-label", favorites.has(p.name) ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen");
      favoriteButton.title = favoriteButton.getAttribute("aria-label");
    });
    card.addEventListener("click",(event)=>{
      if(event.target.closest("a")) return;
      map.setView([p.lat,p.lon],14);
      marker.openPopup();
    });
    resultsEl.appendChild(card);
  });

  const official=items.filter(p=>p.evidence==="offizielle Quelle").length;
  statusEl.innerHTML=`✅ ${items.length} FKK-Ort(e) innerhalb von ${radius} km gefunden. <span class="statusSmall">Davon ${official} mit offizieller Quelle.</span>`;
}

function searchPlaces(){
  if(!searchOrigin) return;
  const {lat,lon}=searchOrigin;
  const radiusKm=Number(radiusEl.value);
  statusEl.textContent="🔎 Suche in der lokalen FKK-Datenbank …";
  resultsEl.innerHTML='<div class="card">Orte werden nach Entfernung sortiert …</div>';

  const items=FKK_PLACES.filter(p=>p.active!==false).map(p=>({...p,distance:haversineKm(lat,lon,p.lat,p.lon)})).filter(p=>p.distance<=radiusKm);
  renderResults(items,radiusKm);
}

function useLocation(){
  if(!navigator.geolocation){
    statusEl.textContent="❌ Dein Browser unterstützt keine Standortabfrage.";
    return;
  }
  statusEl.textContent="📍 Standort wird ermittelt …";
  navigator.geolocation.getCurrentPosition(
    pos=>{
      searchOrigin={lat:pos.coords.latitude,lon:pos.coords.longitude,label:"Mein aktueller Standort",kind:"gps"};
      placeInput.value="";
      showOrigin(searchOrigin);
      map.setView([searchOrigin.lat,searchOrigin.lon],10);
      searchPlaces();
    },
    ()=>{ statusEl.textContent="❌ Standort konnte nicht ermittelt werden. Bitte Standortfreigabe für diese Website erlauben."; },
    {enableHighAccuracy:true,timeout:15000,maximumAge:60000}
  );
}

async function searchFromPlace(){
  const q=placeInput.value.trim();
  if(!q){ statusEl.textContent="Bitte zuerst einen Ort oder eine Adresse eingeben."; placeInput.focus(); return; }
  placeSearchBtn.disabled=true;
  statusEl.textContent="🔎 Ort wird gesucht …";
  try{
    const url=`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=de&accept-language=de&q=${encodeURIComponent(q)}`;
    const res=await fetch(url,{headers:{"Accept":"application/json"}});
    if(!res.ok) throw new Error("Geocoding failed");
    const data=await res.json();
    if(!data.length){
      statusEl.textContent="❌ Ort nicht gefunden. Bitte z. B. Stadt oder vollständige Adresse eingeben.";
      return;
    }
    const r=data[0];
    searchOrigin={lat:Number(r.lat),lon:Number(r.lon),label:r.display_name,kind:"place"};
    showOrigin(searchOrigin);
    map.setView([searchOrigin.lat,searchOrigin.lon],10);
    searchPlaces();
  }catch(e){
    statusEl.textContent="❌ Die Ortssuche ist gerade nicht erreichbar. Bitte später noch einmal versuchen.";
  }finally{
    placeSearchBtn.disabled=false;
  }
}

locateBtn.addEventListener("click",useLocation);
document.getElementById("searchAction").addEventListener("click",()=>{ if(searchOrigin) searchPlaces(); else searchFromPlace(); });
placeSearchBtn.addEventListener("click",searchFromPlace);
document.getElementById("closeModal").addEventListener("click",()=>document.getElementById("modal").classList.add("hidden"));

function setFooterActive(id){
  document.querySelectorAll(".footerItem").forEach(el=>el.classList.remove("active"));
  const el=document.getElementById(id); if(el) el.classList.add("active");
}
function scrollToId(id){
  const el=document.getElementById(id);
  if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
}
function showFavorites(){
  setFooterActive("footerFavorites");
  const favItems=FKK_PLACES.filter(p=>p.active!==false && favorites.has(p.name));
  document.getElementById("resultsSection").scrollIntoView({behavior:"smooth",block:"start"});
  if(!favItems.length){
    resultsEl.innerHTML='<div class="card"><h3>⭐ Noch keine Favoriten</h3><div class="meta">Tippe bei einem FKK-Ort auf ☆, um ihn hier zu speichern.</div></div>';
    return;
  }
  const origin=searchOrigin;
  const items=favItems.map(p=>({...p,distance:origin?haversineKm(origin.lat,origin.lon,p.lat,p.lon):0}));
  renderResults(items, origin ? Number(radiusEl.value) : 0);
  statusEl.innerHTML=`⭐ ${favItems.length} Favorit${favItems.length===1?"":"en"}`;
}
function showMore(){
  setFooterActive("footerMore");
  const modal=document.getElementById("modal");
  document.getElementById("modalTitle").textContent="Mehr";
  document.getElementById("modalText").innerHTML=`<div>FKK Strand Finder v29</div><div class="modalActions"><button class="modalAction" id="moreAbout" type="button">ℹ️ Über die App</button><button class="modalAction" id="moreReset" type="button">☆ Favoriten zurücksetzen</button></div>`;
  modal.classList.remove("hidden");
  document.getElementById("moreAbout").onclick=()=>{document.getElementById("modalText").innerHTML='<div><strong>FKK Strand Finder</strong><br>Suche FKK-Badestellen nach Entfernung. Die Daten sind dokumentiert und können sich ändern; vor Ort gelten Beschilderung und Badeordnung.</div>';};
  document.getElementById("moreReset").onclick=()=>{favorites.clear();localStorage.removeItem("fkkFavorites");modal.classList.add("hidden"); if(searchOrigin) searchPlaces();};
}
document.getElementById("footerStart").addEventListener("click",()=>{setFooterActive("footerStart");scrollToId("startSection");});
document.getElementById("footerMap").addEventListener("click",()=>{setFooterActive("footerMap");scrollToId("mapSection"); if(map) setTimeout(()=>map.invalidateSize(),350);});
document.getElementById("footerFavorites").addEventListener("click",showFavorites);
document.getElementById("footerMore").addEventListener("click",showMore);
document.querySelector(".menuButton").addEventListener("click",showMore);
document.getElementById("closeModal").addEventListener("click",()=>document.getElementById("modal").classList.add("hidden"));

initMap();
window.FKK_APP_VERSION = "v43";
