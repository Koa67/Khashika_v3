import json, re, unicodedata
from pathlib import Path
from difflib import SequenceMatcher
from collections import defaultdict

VIVANT = Path("lib/data/products-ultimate.json")
MORT   = Path("lib/data/products-ultimate-DEAD.json")
OUT    = Path("lib/data/products-ultimate-MERGED.json")
REPORT = Path("lib/data/products-ultimate-MERGE-REPORT.txt")

IMAGE_FIELDS = ["images","image","image_url","imageUrl","mainImage","thumbnail","gallery","media","photos"]

GENERIC_PATTERNS = [
    r"^prod-\d+\.(jpe?g|png|webp)$",
    r"placeholder",
    r"generic",
    r"no-image",
    r"default",
]

def strip_accents(s: str) -> str:
    if not s:
        return ""
    s = unicodedata.normalize("NFKD", s)
    return "".join(c for c in s if not unicodedata.combining(c))

def norm(s: str) -> str:
    s = strip_accents(str(s or "")).lower().strip()
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"[^\w\s-]", "", s)   # keep words, spaces, hyphens
    return s

def slug_norm(s: str) -> str:
    s = strip_accents(str(s or "")).lower().strip()
    s = s.replace("’", "-").replace("'", "-")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s

def is_generic_image(val) -> bool:
    if val in (None, "", []):
        return True
    if isinstance(val, list):
        return all(is_generic_image(x) for x in val)
    s = str(val).strip().lower()
    if not s:
        return True
    name = s.split("/")[-1]
    for pat in GENERIC_PATTERNS:
        if re.search(pat, name):
            return True
    return False

def extract_images(p: dict) -> dict:
    out = {}
    for f in IMAGE_FIELDS:
        if f in p and p.get(f) not in (None, "", []):
            out[f] = p.get(f)
    return out

def apply_images(dst: dict, src: dict) -> int:
    changes = 0
    src_imgs = extract_images(src)
    if not src_imgs:
        return 0

    for f, src_val in src_imgs.items():
        dst_val = dst.get(f)

        # overwrite only if dst missing or generic AND src is non-generic
        if (dst_val in (None, "", []) or is_generic_image(dst_val)) and not is_generic_image(src_val):
            dst[f] = src_val
            changes += 1
        # if field absent entirely, copy even if generic (keeps schema consistent)
        elif f not in dst and src_val not in (None, "", []):
            dst[f] = src_val
            changes += 1
    return changes

def index_dead(dead):
    idx = defaultdict(list)
    for p in dead:
        if not isinstance(p, dict):
            continue
        slug = p.get("slug")
        name = p.get("name") or p.get("title")
        title = p.get("title")
        if slug:
            idx[("slug", slug_norm(slug))].append(p)
        if name:
            idx[("name", norm(name))].append(p)
        if title:
            idx[("title", norm(title))].append(p)
    return idx

def best_fuzzy(target, candidates):
    tn = norm(target)
    best = None
    best_score = 0.0
    for c in candidates:
        n = c.get("name") or c.get("title") or ""
        score = SequenceMatcher(None, tn, norm(n)).ratio()
        if score > best_score:
            best_score = score
            best = c
    return best, best_score

def main():
    vivant = json.loads(VIVANT.read_text(encoding="utf-8"))
    dead   = json.loads(MORT.read_text(encoding="utf-8"))

    idx = index_dead(dead)

    stats = {
        "vivant_count": len(vivant),
        "dead_count": len(dead),
        "match_slug": 0,
        "match_name": 0,
        "match_title": 0,
        "match_fuzzy": 0,
        "unmatched": 0,
        "collisions": 0,
        "image_fields_copied": 0,
    }

    merged = []
    dead_all = [p for p in dead if isinstance(p, dict)]

    for v in vivant:
        out = dict(v)
        matched = None

        vslug = v.get("slug")
        vname = v.get("name") or v.get("title")
        vtitle = v.get("title")

        # 1) exact slug
        if vslug:
            bucket = idx.get(("slug", slug_norm(vslug)), [])
            if bucket:
                matched = bucket[0]
                stats["match_slug"] += 1
                if len(bucket) > 1:
                    stats["collisions"] += 1

        # 2) exact name
        if matched is None and vname:
            bucket = idx.get(("name", norm(vname)), [])
            if bucket:
                matched = bucket[0]
                stats["match_name"] += 1
                if len(bucket) > 1:
                    stats["collisions"] += 1

        # 3) exact title
        if matched is None and vtitle:
            bucket = idx.get(("title", norm(vtitle)), [])
            if bucket:
                matched = bucket[0]
                stats["match_title"] += 1
                if len(bucket) > 1:
                    stats["collisions"] += 1

        # 4) fuzzy fallback (high threshold)
        if matched is None and vname:
            cand, score = best_fuzzy(vname, dead_all)
            if cand and score >= 0.97:
                matched = cand
                stats["match_fuzzy"] += 1

        if matched is None:
            stats["unmatched"] += 1
        else:
            stats["image_fields_copied"] += apply_images(out, matched)
                        # carry over identifiers/metadata from DEAD when available
            for k in ("sku", "source_url", "inStock", "attributes"):
                if k in matched and matched.get(k) not in (None, "", [], {}):
                    out[k] = matched.get(k)


        merged.append(out)

    OUT.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")

    rep = []
    rep.append("KHASHIKA MERGE REPORT (v2)")
    rep.append(f"VIVANT count: {stats['vivant_count']}")
    rep.append(f"DEAD   count: {stats['dead_count']}")
    rep.append("")
    rep.append(f"Matches: slug={stats['match_slug']} name={stats['match_name']} title={stats['match_title']} fuzzy={stats['match_fuzzy']}")
    rep.append(f"Unmatched vivant: {stats['unmatched']}")
    rep.append(f"Dead collisions (non-unique keys): {stats['collisions']}")
    rep.append(f"Image fields copied: {stats['image_fields_copied']}")
    rep.append("")
    rep.append(f"Output: {OUT}")
    REPORT.write_text("\n".join(rep) + "\n", encoding="utf-8")
    print("\n".join(rep))

if __name__ == "__main__":
    main()
