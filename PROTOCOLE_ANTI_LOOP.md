# PROTOCOLE ANTI-LOOP INFINI — KHASHIKA

> À garder dans le repo pour éviter les sessions de debug sans fin
> Dernière mise à jour: 2026-01-03

---

## 🚨 RÈGLE D'OR

**3 tentatives MAX, puis STOP et PIVOT.**

Aucune exception. Si pas résolu en 3 essais, tu fais fausse route.

---

## 📋 STRATÉGIE PAR OUTIL

### Avec CLAUDE (moi)
```
Tentative 1 : Fix direct
Tentative 2 : Fichier complet téléchargeable
Tentative 3 : STOP → Envoie vers Cursor Agent
```

**JAMAIS** de sed/bash pour TypeScript après échec #1.

### Avec CURSOR AGENT
```
Tentative 1 : "Fix le build error"
Tentative 2 : "Regarde TOUT le fichier et corrige"
Tentative 3 : STOP → Reviens vers Claude avec fichier cassé
```

---

## 🔴 DÉTECTION DE LOOP (checklist)

❌ **Tu es en loop si :**
- Même erreur 2× de suite
- Erreur se déplace (ligne 80 → 150 → 230)
- 5+ aller-retours terminal
- L'erreur devient "plus étrange" à chaque fix
- Nouveau fichier casse ce qui marchait avant

✅ **Action immédiate :**
```bash
git stash  # Rollback total
```

Puis envoie à Claude :
> "Loop détectée. Voici le fichier original [paste] et l'erreur [paste]. Génère version COMPLÈTE qui build."

---

## ✅ WORKFLOW OPTIMAL

```
ERREUR BUILD
    ↓
Claude génère fichier COMPLET (pas sed/bash)
    ↓
Télécharge + remplace dans le projet
    ↓
pnpm build
    ↓
    ├─ ✅ OK → git commit -m "fix: [description]"
    └─ ❌ KO après 1 essai → Cursor Agent
            ↓
            ├─ ✅ OK → git commit
            └─ ❌ KO après 1 essai → Retour Claude avec fichier cassé complet
                    ↓
                    ├─ ✅ OK → git commit
                    └─ ❌ KO → STOP. GitHub issue ou pause.
```

**Maximum 3 itérations totales.**

---

## 🚫 RÈGLES STRICTES

### 1. JAMAIS de bash/sed pour TypeScript
```bash
# ❌ INTERDIT
sed -i '' '231,233d' components/file.ts
cat > /tmp/fix.txt << 'EOF'

# ✅ OBLIGATOIRE
# Télécharge fichier .ts complet de Claude
# Copie dans le projet
# Build
```

### 2. Timeout après 10 minutes
Si pas résolu en 10min sur le même fichier → STOP, git stash, demande stratégie différente.

### 3. Git stash systématique AVANT modification
```bash
# Alias recommandés dans ~/.zshrc
alias cbak='git stash push -u -m "Claude modif $(date +%H%M)"'
alias cundo='git stash pop'
alias cok='git stash drop'
```

Usage :
```bash
cbak              # Backup avant Claude
# ... télécharge fichier Claude, remplace ...
pnpm build
# Si OK → cok
# Si KO → cundo (rollback instantané)
```

---

## 💬 PROMPT MAGIQUE POUR CLAUDE

Copie-colle ça quand y'a une erreur build :

```
ERREUR BUILD CI-DESSOUS.

Règles :
1. Génère fichier COMPLET via present_files (pas sed/bash)
2. Si ton fichier build pas, DIS-LE et propose Cursor Agent
3. Ne tente JAMAIS de corriger 2× le même fichier

[paste erreur complète]
```

---

## 🎯 PROMPT MAGIQUE POUR CURSOR AGENT

```
Build error ci-dessous. Analyse TOUT le fichier [nom], pas juste la ligne d'erreur.
Génère la version corrigée COMPLÈTE.

[paste erreur]
```

---

## 📊 ESCALATION PROTOCOL

| Itération | Qui | Action | Si échec |
|-----------|-----|--------|----------|
| 1 | Claude | Fichier complet téléchargeable | → Itération 2 |
| 2 | Cursor Agent | "Fix build error" sur fichier entier | → Itération 3 |
| 3 | Claude | Analyse fichier cassé + génère version propre | → **STOP** |

**Jamais d'itération 4.**

Si toujours cassé après itération 3 :
1. `git stash` (rollback)
2. Pause 15 minutes
3. GitHub issue OU demande stratégie différente à Gemini

---

## 🔥 EXEMPLE DE LOOP (À ÉVITER)

❌ **Ce qui s'est passé (5 itérations = LOOP) :**
```
Erreur ligne 231 → sed supprime 231-233
Erreur ligne 86  → sed supprime 86-88
Erreur ligne 85  → sed ajoute fix partiel
Erreur ligne 151 → cat > fichier incomplet
Erreur ligne 309 → fichier téléchargeable (ENFIN)
```

✅ **Ce qu'il fallait faire (2 itérations) :**
```
Erreur ligne 231 → "Claude, fichier COMPLET téléchargeable"
    ↓
Télécharge → remplace → build
    ↓
Si erreur encore → Cursor Agent prend le relais DIRECT
```

---

## 🎯 CHECKLIST AVANT DE DEMANDER DE L'AIDE

Avant de poster une erreur, vérifie :

- [ ] `git stash` fait pour pouvoir rollback ?
- [ ] C'est la 1ère, 2ème ou 3ème tentative ?
- [ ] J'ai demandé un fichier COMPLET (pas sed) ?
- [ ] L'erreur est la MÊME que la précédente ?
- [ ] Ça fait plus de 10 minutes sur ce fichier ?

Si OUI à la dernière question → **STOP immédiatement.**

---

## 💡 PHRASES MAGIQUES

### Pour Claude
- "Fichier complet ou Cursor Agent, pas de ping-pong."
- "Si ça build pas du 1er coup, j'arrête et je change d'outil."
- "Génère le fichier via present_files, pas de bash."

### Pour Cursor Agent
- "Analyse TOUT le fichier, pas juste la ligne d'erreur."
- "Génère version COMPLÈTE du fichier."

### Pour toi-même
- "3 essais max, sinon je fais fausse route."
- "10 minutes max sur un fichier."
- "git stash avant toute modif = sécurité gratuite."

---

## 📁 STRUCTURE DE SAUVEGARDE

```bash
# Dans ton projet
.git/               # Git stash stocke ici (automatique)
PROTOCOLE_ANTI_LOOP.md  # Ce fichier (à garder)

# Dans ton shell (~/.zshrc)
alias cbak='git stash push -u -m "Claude modif $(date +%H%M)"'
alias cundo='git stash pop'
alias cok='git stash drop'
```

---

## 🏁 TL;DR (Version Ultra-Courte)

1. **1 erreur = 1 fichier complet téléchargeable** (jamais sed/bash)
2. **2 échecs consécutifs = PIVOT** (change d'outil)
3. **10 minutes = TIMEOUT** (git stash + pause)
4. **git stash AVANT toute modif** (rollback gratuit)
5. **3 tentatives MAX** (Claude → Cursor → Claude → STOP)

---

## 📞 CONTACT EN CAS DE LOOP DÉTECTÉE

Si tu te retrouves en loop malgré ce protocole :

1. `git stash` immédiatement
2. Pause 15 minutes (sérieusement)
3. Reviens avec : fichier original + erreur complète + historique des 3 tentatives
4. Demande "stratégie alternative" (pas un nouveau fix)

---

*Protocole créé suite à la session de debug useShopFilters.ts (2026-01-03)*
*Maintenu par: NKDR + Claude*
