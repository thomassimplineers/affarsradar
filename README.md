# AffärsRadar

Ett AI-drivet verktyg för affärsinsikter och rekommendationer.

## Översikt

AffärsRadar är ett kraftfullt verktyg som hjälper företag och säljare att få värdefulla insikter och rekommendationer för att förbättra sina affärsresultat. Med hjälp av Claude 3.7 Sonnet API levererar AffärsRadar veckovisa insikter baserade på aktuella händelser och trender.

## Funktioner

- **Omvärldsöversikt:** Se de viktigaste nyheterna och händelserna som påverkar dina kunder och affärsbekanta.
- **Veckans Affärsmöjligheter:** AI-drivna rekommendationer om vilka kontakter att följa upp och vilka actions du bör prioritera.
- **AI-drivna Insikter med Claude 3.7 Sonnet:** Få djupa insikter baserade på aktuella händelser och upptäck positiva eller negativa trender som påverkar din bransch.
- **Personlig Utveckling:** Veckans mikro-utmaning för att nå nya höjder inom affärsutveckling och skräddarsydda utbildningstips för att förbättra dina säljfärdigheter.
- **Proaktiv Handlingsplan:** Rekommenderade åtgärder och automatiserade påminnelser för att följa upp viktiga möten och kontakter.
- **Användarhantering:** Hantera användare med Supabase autentisering och profiler.

## Teknisk Stack

- **Backend:** Node.js, Express.js
- **Frontend:** React.js, Material UI
- **Databas:** Supabase (PostgreSQL)
- **AI:** Claude 3.7 Sonnet API
- **Autentisering:** Supabase Auth

## Installation

### Förutsättningar

- Node.js (version 14 eller senare)
- npm eller yarn
- Supabase-konto
- Claude API-nyckel

### Steg för steg

1. **Klona repositoriet**

```bash
git clone https://github.com/thomassimplineers/affarsradar.git
cd affarsradar
```

2. **Installera backend-beroenden**

```bash
npm install
```

3. **Installera frontend-beroenden**

```bash
cd src/client
npm install
cd ../..
```

4. **Konfigurera miljövariabler**

Skapa en `.env`-fil i projektets rotmapp baserad på `.env.example`:

```bash
cp .env.example .env
```

Redigera `.env`-filen och lägg till:
- Din Claude API-nyckel
- Dina Supabase-uppgifter (URL och nycklar)

5. **Konfigurera Supabase**

- Skapa ett nytt projekt i Supabase
- Skapa följande tabeller:
  - `profiles` (id, name, email, industry, created_at)
  - `insights` (id, user_id, industry_trends, market_opportunities, weekly_challenge, created_at)
  - `recommendations` (id, user_id, contacts, actions, learning_tip, created_at)
  - `user_settings` (id, user_id, settings, updated_at)
- Aktivera Row Level Security (RLS) och konfigurera lämpliga policies

6. **Starta utvecklingsmiljön**

```bash
# I rotmappen, starta backend-servern
npm run dev

# I ett annat terminalfönster, starta frontend-servern
cd src/client
npm start
```

Applikationen kommer att vara tillgänglig på [http://localhost:3000](http://localhost:3000).

## Driftsättning

För att driftsätta applikationen i produktion:

1. **Bygg frontend**

```bash
cd src/client
npm run build
cd ../..
```

2. **Starta servern i produktionsläge**

```bash
npm start
```

## Licens

MIT
