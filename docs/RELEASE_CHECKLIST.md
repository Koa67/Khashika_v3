# BRICKMODE Release Checklist

## Pre-merge (required)
- [ ] ./scripts/brickmode-sanity.sh passes locally
- [ ] BRICKMODE CI is green on PR
- [ ] PR template filled (MODE/GOAL/FILES/TESTS/DONE WHEN)

## Pages (smoke tests)
### Home
- [ ] Loads fast, no layout shift
- [ ] Navbar/Footer OK
- [ ] Language switch OK (fr/en)

### Boutique
- [ ] Filters work + reflected in URL
- [ ] Pagination/infinite scroll doesn’t render all products
- [ ] Product cards images load (no broken images)

### Product page
- [ ] Gallery works (zoom if enabled)
- [ ] Add to cart / wishlist works

### Checkout
- [ ] Stripe secrets server-only
- [ ] Webhook signature verified
- [ ] Success path works
- [ ] E2E checkout spec passes (or skipped when Stripe not configured)

## Post-merge
- [ ] Monitor CI run on main
- [ ] Tag release (optional)
