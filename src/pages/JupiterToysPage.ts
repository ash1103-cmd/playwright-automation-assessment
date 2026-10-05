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

  async addToysToCart() {
    const startShopping = this.jupierPageUIElementsMap.get(
      UILabel.StartShopping,
    );
    const cart = this.jupierPageUIElementsMap.get(UILabel.Cart);

    await startShopping.first().click();
    await this.page.waitForLoadState("domcontentloaded");

    await this.addToys("Stuffed Frog", 2);
    await this.addToys("Fluffy Bunny", 5);
    await this.addToys("Valentine Bear", 3);
    await cart.first().click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(3000);
  }

  async addToys(productName: string, quantity: number) {
    const product = this.page
      .locator("li.product")
      .filter({ hasText: productName });

    for (let i = 0; i < quantity; i++) {
      await product.getByRole("link", { name: "Buy" }).click();
    }
  }

  async verifySubTotalForEachproduct() {
    await this.verifyProductSubTotal("Stuffed Frog", "$21.98");
    await this.verifyProductSubTotal("Fluffy Bunny", "$49.95");
    await this.verifyProductSubTotal("Valentine Bear", "$44.97");
  }

  async verifyProductSubTotal(productName: string, expectedSubtotal: string) {
    const row = this.page
      .locator("tr.cart-item")
      .filter({ hasText: productName });
    await expect(row.locator("td").nth(3)).toHaveText(expectedSubtotal);
  }

  async verifyProductPrice() {
    await this.verifyEachProductPrice("Stuffed Frog", "$10.99");
    await this.verifyEachProductPrice("Fluffy Bunny", "$9.99");
    await this.verifyEachProductPrice("Valentine Bear", "$14.99");
  }

  async verifyEachProductPrice(productName: string, expectedSubtotal: string) {
    const row = this.page
      .locator("tr.cart-item")
      .filter({ hasText: productName });
    await expect(row.locator("td").nth(1)).toHaveText(expectedSubtotal);
  }

  async verifyTotalPrice() {
    await expect(this.page.getByText("Total: 116.9")).toBeVisible();
    console.log("Validation is successful");
  }
}
