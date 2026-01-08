# CLAUDE CODE — Prompts Fréquents

> Copie-colle ces templates pour des interactions efficaces

---

## 🐛 DEBUG

```
Bug: [description]
Symptôme: [ce qui se passe]
Attendu: [ce qui devrait se passer]
Fichiers concernés: [paths]
Ce que j'ai essayé: [tentatives]
```

---

## 🔧 FIX RAPIDE

```
Fix [composant/fichier]: [problème en 1 ligne]
```

---

## ✨ NOUVELLE FEATURE

```
MODE: PATCH
GOAL: [objectif]
SCOPE: [fichiers impactés]
CONSTRAINTS: Max 2 fichiers, pas de nouvelles deps
DONE WHEN:
  - [ ] [critère 1]
  - [ ] [critère 2]
  - [ ] pnpm build OK
```

---

## 📝 REFACTOR

```
Refactor [fichier]: extraire [logique] vers [destination]
Garder: [comportement à préserver]
Ignorer: [ce qui peut changer]
```

---

## 🔍 ANALYSE

```
Analyse [fichier/dossier] et explique:
1. Structure
2. Dépendances
3. Points d'amélioration
```

---

## ❓ QUESTION RAPIDE

```
Dans le contexte Khashika, [question] ?
```

---

## 🚨 ESCALATION (après 2 fails)

```
ITERATION: 3
VERDICT: FAIL — [unchanged/changed]
LAST OUTPUT: [erreur]

Je choisis ESCALATE [A/B/C/D/E]:
A) Minimal repro
B) Revert/Stash  
C) Git bisect
D) UI isolation
E) Data fixture
```

---

## 🧹 CLEANUP

```
Nettoie [fichier]:
- Supprime imports inutilisés
- Supprime code mort
- Formatte selon les règles
```

---

## 📊 AUDIT

```
Audit [dossier/feature]:
- Qualité du code
- Performance
- Accessibilité
- Recommandations
```
