import { test } from "@playwright/test";
import JupiterToyPage from "../pages/JupiterToysPage";

const toysToAdd = [
  { name: "Stuffed Frog", quantity: 2 },
  { name: "Fluffy Bunny", quantity: 5 },
  { name: "Valentine Bear", quantity: 3 },
];

const toysSubTotalToVerify = [
  { name: "Stuffed Frog", expectedSubtotal: "$21.98" },
  { name: "Fluffy Bunny", expectedSubtotal: "$49.95" },
  { name: "Valentine Bear", expectedSubtotal: "$44.97" },
];

const toysToVerifyPrice = [
  { name: "Stuffed Frog", expectedPrice: "$10.99" },
  { name: "Fluffy Bunny", expectedPrice: "$9.99" },
  { name: "Valentine Bear", expectedPrice: "$14.99" },
];

test.describe("Cart Product Price and Subtotal Validation", async () => {
  test("should verify product prices, subtotals, and cart total", async ({
    page,
  }) => {
    const toysPage = new JupiterToyPage(page);

    await test.step("Launch Application", async () => {
      await toysPage.launchApp();
    });

    await test.step("Add toys to cart", async () => {
      await toysPage.addToysToCart(toysToAdd);
    });

    await test.step("Verify sub total for each product", async () => {
      await toysPage.verifySubTotalForEachproduct(toysSubTotalToVerify);
    });

    await test.step("Verify Price for each product", async () => {
      await toysPage.verifyProductPrice(toysToVerifyPrice);
    });

    await test.step("Validate total price", async () => {
      const totalPrice = "Total: 116.9";
      await toysPage.verifyTotalPrice(totalPrice);
    });
  });
});
