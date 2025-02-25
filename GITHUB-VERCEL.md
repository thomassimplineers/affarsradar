# GitHub och Vercel Integration Guide

Detta dokument beskriver stegen för att pusha projektet till GitHub och konfigurera det för Vercel-integration.

## 1. Push till GitHub

### Förberedelser
- Öppna terminalen i projektets rotmapp
- Om du inte redan har ett Git-repo, skapa ett:
  ```bash
  git init
  ```

### Konfigurera Git
```bash
# Konfigurera användaruppgifter om du inte redan gjort det
git config --global user.name "Ditt Namn"
git config --global user.email "din.email@exempel.com"

# Lägg till alla filer till Git
git add .

# Gör en första commit
git commit -m "Initial commit för AffärsRadar"
```

### Koppla till GitHub
```bash
# Ersätt URL:en med länken till ditt eget GitHub-repo
git remote add origin https://github.com/användare/affarsradar.git

# Pusha till GitHub
git push -u origin main  # eller 'master' beroende på vilken branch du använder
```

## 2. Konfigurera Vercel-integration

### Via GitHub
1. Logga in på [Vercel](https://vercel.com/)
2. Klicka på "Add New..." -> "Project"
3. Välj ditt GitHub-repo från listan
4. Konfigurera bygginställningar:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `src/client/build`
5. Lägg till miljövariabler (alla från din `.env`-fil)
6. Klicka på "Deploy"

### Kontinuerlig Deployment
När du pushar ändringar till GitHub kommer Vercel automatiskt att bygga och deploya dina ändringar.

## 3. Domänkonfiguration (valfritt)

1. Gå till ditt projekt på Vercel dashboard
2. Klicka på "Domains"
3. Lägg till din egen domän och följ instruktionerna

## 4. Rekommenderade GitHub Workflows

### Branch-strategi
- `main` - Produktionsversion
- `develop` - Utvecklingsversion
- Skapa feature branches för nya funktioner

### Pull Requests
1. Skapa en feature branch från `develop`
2. Gör ändringar och pusha till GitHub
3. Skapa en Pull Request från feature branch till `develop`
4. När PR godkänns, merge till `develop`
5. För releaser, merge `develop` till `main`

## 5. GitHub Actions (valfritt)

Du kan skapa en workflow-fil för att köra tester automatiskt:

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18.x'
    - run: npm ci
    - run: npm test
```

## Tips

- Använd [Vercel CLI](https://vercel.com/docs/cli) för lokal testning: `npm i -g vercel`
- För lokal preview, kör: `vercel dev`
- För att testa bygget: `vercel build` 