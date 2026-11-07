const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

test.describe('Inventory & Cart', () => {
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
  });

  test('TC-INV-001: products page shows 6 products', async () => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('TC-INV-002: sorting by price low to high orders products correctly', async () => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('TC-INV-003: sorting by name Z to A orders products correctly', async () => {
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.itemNames.allTextContents();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('TC-CART-001: adding products updates the cart badge', async () => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.addToCart('sauce-labs-bike-light');
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('TC-CART-002: removing a product updates the cart badge', async () => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.removeFromCart('sauce-labs-backpack');

    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });
});