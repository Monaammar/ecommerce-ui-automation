# E-commerce UI Test Automation (Playwright)

End-to-end UI test automation for the [SauceDemo](https://www.saucedemo.com) e-commerce site, built with **Playwright** and the **Page Object Model**, running automatically on every push via **GitHub Actions**.

## Tech Stack
- Playwright Test (JavaScript)
- Page Object Model (POM)
- GitHub Actions (CI/CD)
- Cross-browser: Chromium, Firefox, WebKit

## Project Structure
```
├── pages/                  # Page Objects (locators + actions)
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/                  # Test specs
│   ├── login.spec.js
│   ├── inventory.spec.js
│   └── checkout.spec.js
├── .github/workflows/      # CI pipeline
└── playwright.config.js
```

## Test Coverage (13 tests × 3 browsers = 39 runs)

| ID | Scenario | Type |
|---|---|---|
| TC-LOGIN-001 | Login with valid credentials | Positive |
| TC-LOGIN-002 | Login with wrong password | Negative |
| TC-LOGIN-003 | Locked-out user cannot log in | Negative |
| TC-LOGIN-004 | Empty username shows error | Negative |
| TC-INV-001 | Products page shows 6 products | Positive |
| TC-INV-002 | Sort by price (low → high) | Positive |
| TC-INV-003 | Sort by name (Z → A) | Positive |
| TC-CART-001 | Adding products updates cart badge | Positive |
| TC-CART-002 | Removing a product updates cart badge | Positive |
| TC-CHK-001 | Cart shows the added product | Positive |
| TC-CHK-002 | Complete purchase end-to-end | Positive (E2E) |
| TC-CHK-003 | Missing first name shows error | Negative |
| TC-CHK-004 | Missing postal code shows error | Negative |

## How to Run
```bash
npm install
npx playwright install
npx playwright test              # run all tests
npx playwright test --ui         # interactive UI mode
npx playwright show-report       # open HTML report
```

## CI/CD
Every push and pull request to `main` triggers the GitHub Actions workflow, which runs the full suite across all browsers and uploads the HTML report as an artifact.

## Challenge Solved: Flaky Test on WebKit
Checkout tests intermittently failed on WebKit only: the first-name input was being cleared after typing, causing a "First Name is required" error.

**Root cause:** a timing issue — the form re-rendered after Playwright had already filled it.

**Fix:** instead of hard-coded waits, the Page Object now waits for the checkout page URL, then fills each field inside an `expect().toPass()` retry block that verifies the value with `toHaveValue()`. Verified stable with `--repeat-each=5` (20/20 passed).