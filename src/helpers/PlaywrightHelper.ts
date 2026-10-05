import { Locator, Page } from "@playwright/test";
import { attachment } from "allure-js-commons";

export default class PlaywrightHelper {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fill(locator: Locator, text: string) {
    await locator.fill(text);
  }

  async click(locator: Locator) {
    await locator.click();
  }

  async selectOption(locator: Locator, option: string) {
    await locator.selectOption({ label: option });
  }

  async check(locator: Locator) {
    await locator.check();
  }

  async setChecked(locator: Locator, value: boolean) {
    await locator.setChecked(value);
  }

  async takeScreenshot() {
    const screenshot = await this.page.screenshot();
    await attachment("screenshot", screenshot, "image/png");
  }
}
