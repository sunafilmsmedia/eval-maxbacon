# Max Bacon — Évaluation « bon moment pour vendre ? » (Sainte-Julie, RE/MAX)

App one-page de qualification de leads pour **Max Bacon**, courtier immobilier
résidentiel RE/MAX à Sainte-Julie (Montérégie). Clonée du template white-label
`VERO-EVAL`. Next.js 15 (App Router, TS) · Tailwind v4 · Framer Motion · Leaflet
· déploiement Vercel. Thème **noir / bleu / rouge / blanc** (RE/MAX), mobile-first,
français (vouvoiement).

## Parcours (machine à états, un seul écran)
`hero → formulaire (9 questions) → chargement (~2 s, IA) → pré-révélation → résultats`
avec court-circuit « je ne veux pas vendre » (aucun envoi CRM).

- Auto-avance sur les choix (~220 ms), barre de progression, bouton Précédent, transitions slide.
- Question secteur = champ de recherche filtrée (insensible aux accents/casse) + saisie libre
  (« Utiliser "…" », jamais de « pas trouvé »). Confirmation « Bien reçu ! » puis analyse après ~1,1 s.
- Pré-révélation : un seul bouton « Voir ma réponse » → formulaire de contact complet
  **obligatoire** (nom, courriel, téléphone, consentement, tous requis) pour débloquer les résultats.
- Scoring déterministe → verdict 3 niveaux (favorable / moyen / défavorable).
- `/api/analyze` : rapport via Claude (repli déterministe sans clé).
- `/api/lead` : webhook CRM (GHL), payload aplati, **uniquement pour leads qualifiés**
  (verdict défavorable = rien envoyé ; « je ne veux pas vendre » = rien envoyé).

## Pour rebrander à nouveau — 4 endroits

1. **`lib/brand.ts`** — LE fichier central : nom, région/ville, textes du hero,
   le courtier (nom, titre, photo, téléphone), logos, centre de la carte.
2. **`lib/regions.ts`** — la liste des secteurs/municipalités couverts (~exhaustif recommandé).
3. **`public/`** — `max-bacon-logo.png` (logo personnel), `remax-logo.jpg` (logo RE/MAX
   générique), `broker-1.svg` (placeholder photo courtier — à remplacer par une vraie photo).
4. **`.env.local`** (voir `.env.local.example`) — clés propres au déploiement :
   `ANTHROPIC_API_KEY`, `CRM_WEBHOOK_URL`, `NEXT_PUBLIC_META_PIXEL_ID`,
   `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_CLARITY_SCANNER_PROJECT`, `NEXT_PUBLIC_SITE_URL`.

Palette : réglable dans `app/globals.css` (bloc `@theme`, variables `--color-brand-*` et
`--color-gold`/`--color-gold-soft` — noms hérités du template, portent maintenant le bleu
et le rouge RE/MAX). Par défaut : noir / bleu / rouge / blanc.

## Développement
```bash
npm install
cp .env.local.example .env.local   # remplir au besoin
npm run dev
```

## Confidentialité (garantie côté serveur)
- Verdict défavorable en mode évaluation → aucun stockage, aucun webhook.
- Court-circuit « je ne veux pas vendre » → aucune capture.
- Clarity Scanner (`window.csTrack`) n'enregistre **jamais** de données personnelles :
  uniquement des libellés d'étape et des choix prédéfinis.
