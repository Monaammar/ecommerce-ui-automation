const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async checkout() {
    await this.checkoutButton.click();
    // Wait until the checkout page is actually loaded
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
  }
}

module.exports = { CartPage };