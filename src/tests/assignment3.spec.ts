import { test } from "@playwright/test";
import JupiterToyPage from "../pages/JupiterToysPage";

test.describe("Cart Product Price and Subtotal Validation", async () => {
  test("should verify product prices, subtotals, and cart total", async ({
    page,
  }) => {
    const toysPage = new JupiterToyPage(page);

    await test.step("Launch Application", async () => {
      await toysPage.launchApp();
    });

    await test.step("Add toys to cart", async () => {
      await toysPage.addToysToCart();
    });

    await test.step("Verify sub total for each product", async () => {
      await toysPage.verifySubTotalForEachproduct();
    });

    await test.step("Verify Price for each product", async () => {
      await toysPage.verifyProductPrice();
    });

    await test.step("Validate total price", async () => {
      await toysPage.verifyTotalPrice();
    });
  });
});
