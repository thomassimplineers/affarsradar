# Deployment på Vercel

Det här dokumentet beskriver hur du deployar AffärsRadar på Vercel.

## Förberedelser

1. Skapa ett konto på [Vercel](https://vercel.com/) om du inte redan har ett
2. Installera Vercel CLI (valfritt för lokala tester):
   ```
   npm i -g vercel
   ```

## Steg för deployment

### 1. Förbered ditt projekt

Kontrollera att följande filer finns i ditt projekt:
- `vercel.json` - Konfigurationsfil för Vercel
- Uppdaterad `package.json` med Vercel-specifika skript

### 2. Konfigurera miljövariabler i Vercel

Du behöver konfigurera följande miljövariabler i Vercel-projektet:

1. `REACT_APP_SUPABASE_URL` - Supabase URL
2. `REACT_APP_SUPABASE_ANON_KEY` - Supabase anon nyckel
3. `SUPABASE_URL` - Samma som ovan
4. `SUPABASE_KEY` - Samma som anon nyckel eller service role key för admin-åtgärder
5. `CLAUDE_API_KEY` - Din Claude API-nyckel
6. `FRONTEND_URL` - URL till din frontend (kommer att vara Vercel-domänens URL)
7. `PORT` - Valfri, Vercel hanterar detta automatiskt

Du kan konfigurera dessa via Vercel-dashboarden:
1. Gå till projektinställningar
2. Gå till "Environment Variables"
3. Lägg till alla variabler

### 3. Deploy via Vercel Dashboard

Det enklaste sättet att deploya är direkt via Vercel-dashboard:

1. Gå till [vercel.com/new](https://vercel.com/new)
2. Importera ditt GitHub-repo
3. Konfigurera projekt enligt inställningarna
4. Klicka på "Deploy"

### 4. Deploy via Vercel CLI (alternativ)

Om du föredrar att deploya från kommandoraden:

1. Logga in på Vercel:
   ```
   vercel login
   ```

2. Deploya projektet:
   ```
   vercel
   ```

3. Följ instruktionerna i CLI-verktyget. Du kommer att bli frågad om projektnamn, inställningar osv.

### 5. Konfigurera Supabase Row Level Security

För att lösa Row Level Security-fel behöver du göra följande:

1. Gå till Supabase Dashboard för ditt projekt
2. Gå till "Table Editor" -> "profiles" -> "Policies"
3. Klicka på "New Policy" och lägg till följande policyer:
   
   - **INSERT-policy**: `(auth.uid() = id)`
   - **SELECT-policy**: `(auth.uid() = id)`
   - **UPDATE-policy**: `(auth.uid() = id)`

## Felsökning

Om du får problem med deployment, kontrollera följande:

1. Se till att alla miljövariabler är korrekt konfigurerade
2. Kolla build-loggarna i Vercel dashboard för specifika fel
3. Kontrollera att ditt projekt fungerar lokalt innan deployment

För RLS-fel, se till att du har konfigurerat de policyer som beskrivs ovan. 