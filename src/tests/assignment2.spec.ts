import { test } from "@playwright/test";
import JupiterToyPage from "../pages/JupiterToysPage";

test.describe("Contact Us Form Validation", async () => {
  test("should display successful submission message after submitting mandatory contact details", async ({
    page,
  }) => {
    const toysPage = new JupiterToyPage(page);

    await test.step("Launch Application", async () => {
      await toysPage.launchApp();
    });

    await test.step("Enter mandatory fields and validate successful submission message", async () => {
      const forename = "Ashok";
      const email = "ashok@abc.com";
      const message = "test message";
      await toysPage.populateMandatoryFieldsAndVerifySuccessMessage(
        forename,
        email,
        message,
      );
    });
  });
});
