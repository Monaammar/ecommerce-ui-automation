const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

test.describe('Checkout', () => {
  let cartPage, checkoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
  });

  test('TC-CHK-001: cart shows the added product', async () => {
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.itemNames.first()).toHaveText('Sauce Labs Backpack');
  });

  test('TC-CHK-002: user can complete a purchase end-to-end', async ({ page }) => {
    await cartPage.checkout();
    await checkoutPage.fillInformation('Mona', 'Test', '11511');

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutPage.subtotalLabel).toContainText('$29.99');

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('TC-CHK-003: error is shown when first name is missing', async () => {
    await cartPage.checkout();
    await checkoutPage.fillInformation('', 'Test', '11511');

    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('TC-CHK-004: error is shown when postal code is missing', async () => {
    await cartPage.checkout();
    await checkoutPage.fillInformation('Mona', 'Test', '');

    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });
});