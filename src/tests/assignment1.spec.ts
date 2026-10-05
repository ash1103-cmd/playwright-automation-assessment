import { test } from "@playwright/test";
import JupiterToyPage from "../pages/JupiterToysPage";

test.describe("Contact Us Form Validation", async () => {
  test("Contact Form Validation", async ({
    page,
  }) => {
    const toysPage = new JupiterToyPage(page);

    await test.step("Launch Application", async () => {
      await toysPage.launchApp();
    });

    await test.step("Validate error messages when mandatory fields are not entered", async () => {
      await toysPage.validateErrorMessage();
    });

    await test.step("Enter mandatory fields and validate error messages are gone", async () => {
      const forename = "John";
      const email = "john@abc.com";
      const message = "test message";
      await toysPage.populateMandatoryFieldsAndVerifyErrorsGone(
        forename,
        email,
        message,
      );
    });
  });
});
