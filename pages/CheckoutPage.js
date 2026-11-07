const { expect } = require('@playwright/test');
class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.completeHeader = page.locator('.complete-header');
  }

   // Retry filling until the value sticks (WebKit sometimes clears inputs on re-render)
  async fillField(locator, value) {
    await expect(async () => {
      await locator.fill(value);
      await expect(locator).toHaveValue(value, { timeout: 1000 });
    }).toPass({ timeout: 10000 });
  }

  async fillInformation(firstName, lastName, postalCode) {
    await this.fillField(this.firstNameInput, firstName);
    await this.fillField(this.lastNameInput, lastName);
    await this.fillField(this.postalCodeInput, postalCode);
    await this.continueButton.click();
  }
  async finish() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };