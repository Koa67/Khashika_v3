#!/usr/bin/env python3
import os, json, re, time, ssl
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

IN_JSON  = Path("lib/data/products-ultimate-MERGED.json")
OUT_JSON = Path("lib/data/products-ultimate-FINAL.json")
REPORT   = Path("lib/data/products-ultimate-SCRAPE-REPORT.txt")

TEST_MODE = os.getenv("KHASHIKA_TEST", "1") == "1"
TEST_N    = int(os.getenv("KHASHIKA_TEST_N", "5"))
DELAY     = float(os.getenv("KHASHIKA_DELAY", "0.50"))

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
}

META_ITEMPROP_PRICE_RE = re.compile(r'<meta[^>]+itemprop=["\']price["\'][^>]+content=["\']([^"\']+)["\']', re.I)
META_OG_PRICE_RE       = re.compile(r'<meta[^>]+property=["\'](?:product:price:amount|og:price:amount)["\'][^>]+content=["\']([^"\']+)["\']', re.I)
LDJSON_RE              = re.compile(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', re.I | re.S)
WOO_AMOUNT_RE          = re.compile(r'woocommerce-Price-amount[^>]*>\s*([0-9]{1,6}(?:[.,][0-9]{1,2})?)', re.I)

def _to_float(num_str: str):
    s = (num_str or "").strip().replace("\xa0", "").replace(" ", "")
    s = s.replace(",", ".")
    try:
        return float(s)
    except:
        return None

def _ssl_ctx():
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        return ssl.create_default_context()

SSL_CTX = _ssl_ctx()

def fetch(url: str, timeout=25) -> str:
    req = Request(url, headers=HEADERS)
    with urlopen(req, timeout=timeout, context=SSL_CTX) as r:
        return r.read().decode("utf-8", errors="ignore")

def parse_price(html: str):
    html = html or ""

    # 1) Schema.org meta itemprop="price"
    m = META_ITEMPROP_PRICE_RE.search(html)
    if m:
        v = _to_float(m.group(1))
        if v is not None and v > 0:
            return v

    # 2) OG / product meta
    m = META_OG_PRICE_RE.search(html)
    if m:
        v = _to_float(m.group(1))
        if v is not None and v > 0:
            return v

    # 3) JSON-LD (Yoast often uses @graph)
    for blob in LDJSON_RE.findall(html):
        blob = blob.strip()
        if not blob:
            continue
        try:
            data = json.loads(blob)
        except:
            continue

        nodes = []
        if isinstance(data, dict) and "@graph" in data:
            nodes = data.get("@graph") or []
        elif isinstance(data, list):
            nodes = data
        elif isinstance(data, dict):
            nodes = [data]

        for node in nodes:
            if not isinstance(node, dict):
                continue
            if node.get("@type") != "Product":
                continue

            offers = node.get("offers")
            offers_list = offers if isinstance(offers, list) else [offers]
            for off in offers_list:
                if isinstance(off, dict) and "price" in off:
                    v = _to_float(str(off.get("price")))
                    if v is not None and v > 0:
                        return v

    # 4) Woo fallback span
    m = WOO_AMOUNT_RE.search(html)
    if m:
        v = _to_float(m.group(1))
        if v is not None and v > 0:
            return v

    return None

def main():
    data = json.loads(IN_JSON.read_text(encoding="utf-8"))
    total = len(data)

    updated = 0
    missing_url = 0
    fetch_fail = 0
    parse_fail = 0

    first_sample_written = False

    limit = TEST_N if TEST_MODE else total

    for i, p in enumerate(data[:limit]):
        if not isinstance(p, dict):
            continue

        url = (p.get("source_url") or "").strip()
        if not url:
            missing_url += 1
            continue

        try:
            html = fetch(url)

            if not first_sample_written:
                Path("/tmp/khashika_scrape_sample.html").write_text(html, encoding="utf-8")
                first_sample_written = True
                print("Wrote /tmp/khashika_scrape_sample.html")

            price = parse_price(html)
            if price is None:
                parse_fail += 1
            else:
                # maman veut pas de centimes -> on force l'euro entier
                p["price"] = int(round(price))
                updated += 1

        except (HTTPError, URLError, TimeoutError, ssl.SSLError):
            fetch_fail += 1

        time.sleep(DELAY)

        if (i + 1) % 50 == 0 or TEST_MODE:
            print(f"[{i+1}] updated={updated} fetch_fail={fetch_fail} parse_fail={parse_fail} missing_url={missing_url}")

    # write output (test writes only first N updated entries into a full copy)
    if TEST_MODE:
        full = json.loads(IN_JSON.read_text(encoding="utf-8"))
        full[:limit] = data[:limit]
        OUT_JSON.write_text(json.dumps(full, ensure_ascii=False, indent=2), encoding="utf-8")
    else:
        OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    REPORT.write_text(
        "\n".join([
            "KHASHIKA PRICE SCRAPE REPORT",
            f"Mode: {'TEST(' + str(TEST_N) + ')' if TEST_MODE else 'FULL'}",
            f"Input products: {total}",
            f"Updated prices: {updated}",
            f"Missing source_url: {missing_url}",
            f"Fetch failures: {fetch_fail}",
            f"Parse failures: {parse_fail}",
            f"Output: {OUT_JSON}",
        ]) + "\n",
        encoding="utf-8"
    )
    print("DONE.")

if __name__ == "__main__":
    main()
