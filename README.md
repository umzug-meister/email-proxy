# Umzugmeister Konfigurator

Ein WordPress-Plugin für die Berechnung von Umzugskosten und Versand von Angeboten per E-Mail.

## Installation

1. `npm run build` ausführen
2. Das ZIP aus `dist/` im WordPress Admin hochladen
3. Plugin aktivieren

## Plugin-Einstellungen (WP Admin > Einstellungen > Konfigurator)

| Option | Beschreibung |
|--------|-------------|
| Google API-Key | Für Google Places Autocomplete und Distance Matrix |
| Standort-Adresse | Firmenstandort für Routenberechnung |
| Standort-ID | Wird automatisch befüllt |
| Danke-Seite | Seite nach erfolgreicher Anfrage |
| Postfach für Angebot Kopie | E-Mail für Angebots-Copy |
| Name im FROM Feld | Absendername |
| FROM E-Mail-Adresse | Absender-E-Mail |

## Angelegte Seiten

Das Plugin erstellt bei Aktivierung automatisch folgende Seiten:

| Slug | Titel | URL |
|------|-------|-----|
| `umzugskosten-berechnen` | Umzugskosten Rechner | `/umzugskosten-berechnen/` |
| `konfigurator-admin` | Konfigurator Admin | `/konfigurator-admin/` |

### Seite: Umzugskosten Rechner
- Frontend-Interface für Kunden
- Vue.js + jQuery UI basiert
- 3-Schritt Konfigurator: Adressen → Umzugsgut → Zusatzleistungen

### Seite: Konfigurator Admin
- Verwaltung von Items, Services, Kategorien
- Geschützter Bereich (Login erforderlich)
- HTML-Theme-Cleanup via `umconf_end_buffering()`

## Custom Post Types

| CPT | Beschreibung | Taxonomie |
|-----|-------------|-----------|
| `items` | Umzugsgut-Positionen | `item-categories` |
| `services` | Zusatzleistungen | `service-categories` |
| `orders` | Bestellungen/Anfragen | - |

## REST API

**Base URL:** `{site_url}/wp-json/um-configurator/v1/`

### Items

#### Alle Items abrufen
```
GET /item/all
```

#### Einzelnes Item abrufen
```
GET /item/{id}
```

#### Item erstellen
```
POST /item/
Content-Type: application/json

{
  "name": "Schreibtisch",
  "categoryRefs": [{"id": 1}],
  "basePrice": 50,
  "volume": 2
}
```

#### Item aktualisieren
```
PUT /item/{id}
Content-Type: application/json

{
  "name": "Schreibtisch",
  "basePrice": 55
}
```

#### Item löschen
```
DELETE /item/{id}
```

---

### Services

#### Alle Services abrufen
```
GET /service/all
```

#### Einzelnen Service abrufen
```
GET /service/{id}
```

#### Service erstellen
```
POST /service/
Content-Type: application/json

{
  "name": "Verpackungsmaterial",
  "price": 100,
  "priceType": "fix"
}
```

#### Service aktualisieren
```
PUT /service/{id}
```

#### Service löschen
```
DELETE /service/{id}
```

---

### Item-Kategorien

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| GET | `/item-category/all` | Alle Kategorien |
| GET | `/item-category/{id}` | Einzelne Kategorie |
| POST | `/item-category/` | Kategorie erstellen |
| PUT | `/item-category/{id}` | Kategorie aktualisieren |
| DELETE | `/item-category/{id}` | Kategorie löschen |

---

### Service-Kategorien

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| GET | `/service-category/all` | Alle Kategorien |
| GET | `/service-category/{id}` | Einzelne Kategorie |
| POST | `/service-category/` | Kategorie erstellen |
| PUT | `/service-category/{id}` | Kategorie aktualisieren |
| DELETE | `/service-category/{id}` | Kategorie löschen |

---

### Orders

#### Alle Orders abrufen
```
GET /order/all
```

#### Einzelne Order abrufen
```
GET /order/{id}
```

#### Order erstellen
```
POST /order/
Content-Type: application/json

{
  "customer": {
    "name": "Max Mustermann",
    "email": "max@example.com",
    "phone": "0123456789"
  },
  "items": [...],
  "services": [...],
  "totalPrice": 1500
}
```

#### Order aktualisieren
```
PUT /order/{id}
```

#### Order löschen
```
DELETE /order/{id}
```

---

### Allgemeine Endpoints

#### Autocomplete (Adressen)
```
GET /autocomplete/{address}
```

#### Optionen
```
GET  /options              → Alle Plugin-Optionen
GET  /options/{option}      → Einzelne Option
PUT  /options/{option}      → Option setzen (Body: { "value": "..." })
```

#### Session-Input
```
GET  /inputinformations → Session-Daten abrufen
PUT  /inputinformations → Session-Daten speichern
```

## Frontend-JavaScript

Das Plugin lädt Vue.js + jQuery UI und sucht nach kompilierten Vue-Dateien in:

```
app-dist/relocationCalculator/
├── main.js
├── runtime.js
└── main.css
```

Diese werden dynamisch geladen (via `enqueue-configurator.php`).

## Shortcodes

Keine Shortcodes vorhanden. Das Plugin fügt den Konfigurator automatisch auf den angelegten Seiten ein.

## Deaktivierung

Bei Deaktivierung werden die Seiten `umzugskosten-berechnen` und `konfigurator-admin` gelöscht.

## Bekannte Probleme

- `simple_html_dom.php` wird für Theme-HTML-Manipulation verwendet
- Authentifizierung via `UM_CONFIG_DO_AUTH` (nur in Production aktiviert)
