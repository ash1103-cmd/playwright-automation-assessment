import { Page, Locator, expect } from "@playwright/test";
import PlaywrightHelper from "../helpers/PlaywrightHelper";
import { UILabel } from "../constants/enums";
import "dotenv/config";

export default class JupiterPage {
  readonly page: Page;
  readonly helper: PlaywrightHelper;

  public jupierPageUIElementsMap: any;

  constructor(page: Page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this;

    this.jupierPageUIElementsMap = new Map<string, Locator>([
      [UILabel.Contact_Link, this.page.getByRole("link", { name: "Contact" })],
      [UILabel.Submit, this.page.getByRole("link", { name: "Submit" })],
      [UILabel.Forename, this.page.getByRole("textbox", { name: "Forename" })],
      [UILabel.Email, this.page.getByRole("textbox", { name: "email" })],
      [UILabel.Message, this.page.getByRole("textbox", { name: "message" })],
      [
        UILabel.StartShopping,
        this.page.getByRole("link", { name: "Start Shopping »" }),
      ],
      [
        UILabel.Cart,
        this.page.getByRole("link", { name: "Cart", exact: false }),
      ],
      [UILabel.Checkout, this.page.getByRole("link", { name: "Check Out" })],
    ]);
  }

  async launchApp() {
    const url = process.env.APP_URL;
    if (!url) {
      throw new Error("Application URL is not defined");
    }
    await this.page.goto(url);
    await this.page.waitForLoadState("networkidle");
  }

  async validateErrorMessage() {
    const contactLink = this.jupierPageUIElementsMap.get(UILabel.Contact_Link);

    const submit = this.jupierPageUIElementsMap.get(UILabel.Submit);

    await contactLink.first().click();
    await this.page.waitForLoadState("domcontentloaded");
    await submit.first().click();
    await expect(
      this.page.getByText(
        "but we won't get it unless you complete the form correctly.",
        { exact: false },
      ),
    ).toBeVisible();
    await expect(
      this.page.getByText("Forename is required", { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Email is required", { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Message is required", { exact: true }),
    ).toBeVisible();
  }

  async populateMandatoryFieldsAndVerifyErrorsGone(
    Forename: string,
    Email: string,
    Message: string,
  ) {
    const forename = this.jupierPageUIElementsMap.get(UILabel.Forename);
    const email = this.jupierPageUIElementsMap.get(UILabel.Email);
    const message = this.jupierPageUIElementsMap.get(UILabel.Message);

    await forename.fill(Forename);
    await email.fill(Email);
    await message.fill(Message);
    await expect(
      this.page.getByText(
        "but we won't get it unless you complete the form correctly.",
        { exact: false },
      ),
    ).not.toBeVisible();
    await expect(
      this.page.getByText("Forename is required", { exact: true }),
    ).not.toBeVisible();
    await expect(
      this.page.getByText("Email is required", { exact: true }),
    ).not.toBeVisible();
    await expect(
      this.page.getByText("Message is required", { exact: true }),
    ).not.toBeVisible();
  }

  async populateMandatoryFieldsAndVerifySuccessMessage(
    Forename: string,
    Email: string,
    Message: string,
  ) {
    const forename = this.jupierPageUIElementsMap.get(UILabel.Forename);
    const email = this.jupierPageUIElementsMap.get(UILabel.Email);
    const message = this.jupierPageUIElementsMap.get(UILabel.Message);
    const contactLink = this.jupierPageUIElementsMap.get(UILabel.Contact_Link);

    const submit = this.jupierPageUIElementsMap.get(UILabel.Submit);

    await contactLink.first().click();
    await this.page.waitForLoadState("domcontentloaded");
    await forename.fill(Forename);
    await email.fill(Email);
    await message.fill(Message);
    await submit.first().click();

    await expect(
      this.page.getByText("we appreciate your feedback.", { exact: false }),
    ).toBeVisible({ timeout: 50000 });
  }

  async addToysToCart(toys: { name: string; quantity: number }[]) {
    const startShopping = this.jupierPageUIElementsMap.get(
      UILabel.StartShopping,
    );
    const cart = this.jupierPageUIElementsMap.get(UILabel.Cart);

    await startShopping.first().click();
    await this.page.waitForLoadState("domcontentloaded");

    for (const toy of toys) {
      await this.addToys(toy.name, toy.quantity);
    }
    await cart.first().click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async addToys(productName: string, quantity: number) {
    const product = this.page
      .locator("li.product")
      .filter({ hasText: productName });

    for (let i = 0; i < quantity; i++) {
      await product.getByRole("link", { name: "Buy" }).click();
    }
  }

  async verifySubTotalForEachproduct(
    toys: { name: string; expectedSubtotal: string }[],
  ) {
    for (const toy of toys) {
      await this.verifyProductSubTotal(toy.name, toy.expectedSubtotal);
    }
  }

  async verifyProductSubTotal(productName: string, expectedSubtotal: string) {
    const row = this.page
      .locator("tr.cart-item")
      .filter({ hasText: productName });
    await expect(row.locator("td").nth(3)).toHaveText(expectedSubtotal);
  }

  async verifyProductPrice(toys: { name: string; expectedPrice: string }[]) {
    for (const toy of toys) {
      await this.verifyEachProductPrice(toy.name, toy.expectedPrice);
    }
  }

  async verifyEachProductPrice(productName: string, expectedSubtotal: string) {
    const row = this.page
      .locator("tr.cart-item")
      .filter({ hasText: productName });
    await expect(row.locator("td").nth(1)).toHaveText(expectedSubtotal);
  }

  async verifyTotalPrice(totalPrice: string) {
    await expect(this.page.getByText(totalPrice)).toBeVisible();
    console.log("Validation is successful");
  }
}
