#!/bin/bash

echo "=== Förbereder AffärsRadar för GitHub och Vercel ==="

# Kontrollera att git är installerat
if ! command -v git &> /dev/null; then
    echo "Git är inte installerat. Installera git och försök igen."
    exit 1
fi

# Kontrollera att node/npm är installerade
if ! command -v npm &> /dev/null; then
    echo "Node.js/npm är inte installerat. Installera Node.js och försök igen."
    exit 1
fi

echo "✅ Git och Node.js är installerade"

# Kontrollera att vi har rätt struktur
if [ ! -d "src/client" ] || [ ! -d "src/server" ]; then
    echo "❌ Felaktig projektstruktur. Säkerställ att du har mappar för 'src/client' och 'src/server'."
    exit 1
fi

echo "✅ Projektstrukturen ser korrekt ut"

# Säkerställ att vercel.json finns
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json saknas. Detta behövs för Vercel-deployment."
    exit 1
fi

echo "✅ vercel.json finns"

# Kontrollera att .env.example finns för både root och client
if [ ! -f ".env.example" ]; then
    echo "⚠️ .env.example saknas i rotmappen. Detta rekommenderas för dokumentation."
    echo "SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
CLAUDE_API_KEY=your-claude-api-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000" > .env.example
    echo "✅ Skapade .env.example i rotmappen"
fi

if [ ! -f "src/client/.env.example" ]; then
    echo "⚠️ .env.example saknas i client-mappen. Detta rekommenderas för dokumentation."
    echo "REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key" > src/client/.env.example
    echo "✅ Skapade .env.example i client-mappen"
fi

# Kontrollera att .gitignore finns
if [ ! -f ".gitignore" ]; then
    echo "⚠️ .gitignore saknas. Detta är viktigt för att undvika att känsliga filer checkas in."
    echo "# Node.js
node_modules/
npm-debug.log
yarn-error.log
yarn-debug.log

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build directories
dist/
build/

# IDEs and editors
.idea/
.vscode/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db" > .gitignore
    echo "✅ Skapade .gitignore"
fi

# Kör npm install för att säkerställa att alla beroenden är installerade
echo "📦 Installerar beroenden i rotmappen..."
npm install

echo "📦 Installerar beroenden i client-mappen..."
cd src/client && npm install && cd ../..

# Kör tester för att säkerställa att allt fungerar
echo "🧪 Kör tester för att säkerställa att allt fungerar..."
npm test || { echo "⚠️ Testerna misslyckades, men fortsätter ändå..."; }

echo "
=== SAMMANFATTNING ===
✅ Projektet är nu förberett för GitHub och Vercel!

Nästa steg:
1. Starta ett Git-repo om du inte redan har ett: git init
2. Lägg till filerna: git add .
3. Skapa en commit: git commit -m \"Initial commit för AffärsRadar\"
4. Koppla till ditt GitHub-repo: git remote add origin https://github.com/username/affarsradar.git
5. Pusha koden: git push -u origin main

För Vercel-deployment, följ instruktionerna i GITHUB-VERCEL.md och VERCEL.md
"

echo "Lycka till! 🚀" 