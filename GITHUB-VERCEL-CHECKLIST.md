# Checklista för GitHub och Vercel

## Förberedelser för GitHub-push

1. [ ] Se till att alla känsliga uppgifter är i .env-filer och INTE i källkoden
2. [ ] Kontrollera att .gitignore inkluderar alla känsliga filer (.env, etc.)
3. [ ] Se till att all kod är testad och fungerar lokalt
4. [ ] Kör `git status` för att se vilka filer som kommer att inkluderas

## Git-kommandon för push

```bash
# Om du inte redan har ett Git-repo lokalt
git init

# Lägg till alla filer (eller specifika filer om du föredrar)
git add .

# Skapa en commit
git commit -m "Initial commit för Vercel-deployment"

# Lägg till din remote GitHub-repo URL (ersätt med din egen URL)
git remote add origin https://github.com/ditt-användarnamn/affarsradar.git

# Pusha till GitHub
git push -u origin main
# eller om du använder master som huvudgren
# git push -u origin master
```

## Vercel-deployment via GitHub

1. [ ] Gå till [Vercel Dashboard](https://vercel.com/dashboard)
2. [ ] Klicka på "New Project"
3. [ ] Välj ditt GitHub-repo med AffärsRadar
4. [ ] Konfigurera följande miljövariabler i Vercel-projektet:
   - [ ] `REACT_APP_SUPABASE_URL`
   - [ ] `REACT_APP_SUPABASE_ANON_KEY`
   - [ ] `SUPABASE_URL`
   - [ ] `SUPABASE_KEY` (eller `SUPABASE_SERVICE_ROLE_KEY` för admin-åtgärder)
   - [ ] `SUPABASE_ANON_KEY` 
   - [ ] `CLAUDE_API_KEY`
   - [ ] `FRONTEND_URL` (kommer att vara din Vercel-URL)
5. [ ] Klicka på "Deploy"

## Efter deployment

1. [ ] Testa att appen fungerar på den publicerade URL:en
2. [ ] Kontrollera att anslutning till Supabase fungerar
3. [ ] Verifiera att användare kan registrera sig och logga in
4. [ ] Konfigurera anpassad domän i Vercel (valfritt)

## Felsökning

- Kontrollera Vercel logs om något går fel
- Säkerställ att alla miljövariabler är korrekt konfigurerade
- Se till att Supabase RLS-policyer är korrekt inställda enligt VERCEL.md

## Kom ihåg

- Se till att du har konfigurerat "Row Level Security" i Supabase enligt instruktionerna
- Användarprofiler skapas nu via backend API för att kringgå RLS-begränsningar 