class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.items = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  // productId example: "sauce-labs-backpack"
  async addToCart(productId) {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async removeFromCart(productId) {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  // option: "az" | "za" | "lohi" | "hilo"
  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
  }

  async getPrices() {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async openCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };