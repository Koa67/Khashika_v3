import json, re, time
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

IN_JSON  = Path("lib/data/products-ultimate-MERGED.json")
OUT_JSON = Path("lib/data/products-ultimate-FINAL.json")
REPORT   = Path("lib/data/products-ultimate-SCRAPE-REPORT.txt")

PRICE_RE = re.compile(r'woocommerce-Price-amount[^>]*>\s*([0-9]+(?:[.,][0-9]+)?)', re.I)

def fetch(url: str, timeout=20) -> str:
    req = Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X) KhashikaPriceBot/1.0",
        "Accept": "text/html,application/xhtml+xml",
    })
    with urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", errors="ignore")

def parse_price(html: str):
    # Common Woo markup: <span class="woocommerce-Price-amount amount">19,00&nbsp;<span ...
    m = PRICE_RE.search(html)
    if not m:
        return None
    s = m.group(1).strip().replace(",", ".")
    try:
        v = float(s)
    except:
        return None
    return float(f"{v:.2f}")

def main():
    data = json.loads(IN_JSON.read_text(encoding="utf-8"))
    updated = 0
    missing_url = 0
    failed = 0

    for i, p in enumerate(data):
        if not isinstance(p, dict):
            continue

        url = (p.get("source_url") or "").strip()
        if not url:
            missing_url += 1
            continue

        try:
            html = fetch(url)
            price = parse_price(html)
            if price is None:
                failed += 1
            else:
                p["price"] = price
                updated += 1
        except (HTTPError, URLError, TimeoutError) as e:
            failed += 1

        # be polite (avoid getting rate-limited)
        time.sleep(0.35)

        if (i+1) % 50 == 0:
            print(f"Progress: {i+1}/{len(data)} updated={updated} failed={failed} missing_url={missing_url}")

    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    rep = []
    rep.append("KHASHIKA PRICE SCRAPE REPORT")
    rep.append(f"Input products: {len(data)}")
    rep.append(f"Updated prices: {updated}")
    rep.append(f"Missing source_url: {missing_url}")
    rep.append(f"Failed fetch/parse: {failed}")
    rep.append(f"Output: {OUT_JSON}")
    REPORT.write_text("\n".join(rep) + "\n", encoding="utf-8")
    print("\n".join(rep))

if __name__ == "__main__":
    main()
