import { test, expect } from "@playwright/test";

test.describe("Notes App", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Clear localStorage for a clean state
    await page.evaluate(() => localStorage.clear());
  });

  test("redirects to sign in if not authenticated", async ({ page }) => {
    await page.goto("/notes");
    await expect(page).toHaveURL(/signin/);
  });

  test("shows error if username and password are empty", async ({ page }) => {
    await page.goto("/signin");
    await page.waitForSelector('[data-testid="signin-btn"]');
    await page.click('[data-testid="signin-btn"]');
    await expect(page.getByTestId("error-msg")).toHaveText(
      "Username and password are required.",
    );
  });

  test("shows error if username is empty", async ({ page }) => {
    await page.goto("/signin");
    await page.waitForSelector('[data-testid="password-input"]');
    await page.fill('[data-testid="password-input"]', "secret");
    await page.waitForSelector('[data-testid="signin-btn"]');
    await page.click('[data-testid="signin-btn"]');
    await expect(page.getByTestId("error-msg")).toHaveText(
      "Username and password are required.",
    );
  });

  test("shows error if password is empty", async ({ page }) => {
    await page.goto("/signin");
    await page.waitForSelector('[data-testid="username-input"]');
    await page.fill('[data-testid="username-input"]', "alice");
    await page.waitForSelector('[data-testid="signin-btn"]');
    await page.click('[data-testid="signin-btn"]');
    await expect(page.getByTestId("error-msg")).toHaveText(
      "Username and password are required.",
    );
  });

  test("can sign in with username and password", async ({ page }) => {
    await page.goto("/signin");
    await page.waitForSelector('[data-testid="username-input"]');
    await page.fill('[data-testid="username-input"]', "alice");
    await page.waitForSelector('[data-testid="password-input"]');
    await page.fill('[data-testid="password-input"]', "secret");
    await page.waitForSelector('[data-testid="signin-btn"]');
    await page.click('[data-testid="signin-btn"]');
    await expect(page).toHaveURL(/notes/);
    await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
  });

  test("can add a note", async ({ page }) => {
    await page.goto("/signin");
    await page.waitForSelector('[data-testid="username-input"]');
    await page.fill('[data-testid="username-input"]', "bob");
    await page.waitForSelector('[data-testid="password-input"]');
    await page.fill('[data-testid="password-input"]', "secret");
    await page.waitForSelector('[data-testid="signin-btn"]');
    await page.click('[data-testid="signin-btn"]');
    await page.waitForSelector('input[placeholder="New note title"]');
    await page.fill('input[placeholder="New note title"]', "First Note");
    await page.click('button:text("Add")');
    await expect(page.getByText("First Note")).toBeVisible();
  });

  test("can edit a note", async ({ page }) => {
    await page.goto("/signin");
    await page.waitForSelector('[data-testid="username-input"]');
    await page.fill('[data-testid="username-input"]', "bob");
    await page.waitForSelector('[data-testid="password-input"]');
    await page.fill('[data-testid="password-input"]', "secret");
    await page.waitForSelector('[data-testid="signin-btn"]');
    await page.click('[data-testid="signin-btn"]');
    await page.waitForSelector('input[placeholder="New note title"]');
    await page.fill('input[placeholder="New note title"]', "Edit Me");
    await page.click('button:text("Add")');
    await page.click('button:text("Edit")');
    await page.waitForSelector('[data-testid="edit-input"]');
    await page.fill('[data-testid="edit-input"]', "Edited Note");
    await page.click('button:text("Save")');
    await expect(page.getByText("Edited Note")).toBeVisible();
  });

  test("can delete a note", async ({ page }) => {
    await page.goto("/signin");
    await page.waitForSelector('[data-testid="username-input"]');
    await page.fill('[data-testid="username-input"]', "bob");
    await page.waitForSelector('[data-testid="password-input"]');
    await page.fill('[data-testid="password-input"]', "secret");
    await page.waitForSelector('[data-testid="signin-btn"]');
    await page.click('[data-testid="signin-btn"]');
    await page.waitForSelector('input[placeholder="New note title"]');
    await page.fill('input[placeholder="New note title"]', "Delete Me");
    await page.click('button:text("Add")');
    await page.click('button:text("Delete")');
    await expect(page.getByText("Delete Me")).not.toBeVisible();
  });

  test("can reorder notes with up/down buttons", async ({ page }) => {
    await page.goto("/signin");
    await page.waitForSelector('[data-testid="username-input"]');
    await page.fill('[data-testid="username-input"]', "bob");
    await page.waitForSelector('[data-testid="password-input"]');
    await page.fill('[data-testid="password-input"]', "secret");
    await page.waitForSelector('[data-testid="signin-btn"]');
    await page.click('[data-testid="signin-btn"]');
    await page.waitForSelector('input[placeholder="New note title"]');
    await page.fill('input[placeholder="New note title"]', "First");
    await page.click('button:text("Add")');
    await page.fill('input[placeholder="New note title"]', "Second");
    await page.click('button:text("Add")');
    // Move Second up
    // Wait for the move-up button to appear (should only be on the second note)
    await expect(page.locator('button[aria-label="move-up"]')).toHaveCount(1);
    await page.locator('button[aria-label="move-up"]').click();
    // Wait for the order to update using expect.poll
    await expect
      .poll(
        async () => {
          const items = await page
            .locator('[data-testid="notes-list"] > li')
            .allTextContents();
          return items;
        },
        {
          timeout: 2000,
        },
      )
      .toMatchObject([
        expect.stringContaining("Second"),
        expect.stringContaining("First"),
      ]);
  });

  test("navbar displays logo and sign out button when signed in", async ({
    page,
  }) => {
    await page.goto("/signin");
    await page.waitForSelector('[data-testid="username-input"]');
    await page.fill('[data-testid="username-input"]', "alice");
    await page.waitForSelector('[data-testid="password-input"]');
    await page.fill('[data-testid="password-input"]', "secret");
    await page.waitForSelector('[data-testid="signin-btn"]');
    await page.click('[data-testid="signin-btn"]');
    await page.waitForSelector("nav");
    await expect(page.locator("nav")).toBeVisible();
    // Check for the MdNote icon from react-icons
    await expect(page.locator('[aria-label="Notes Icon"]')).toBeVisible();
    await expect(page.getByTestId("signout-btn")).toBeVisible();
  });

  test("sign out button logs out and redirects to sign in", async ({
    page,
  }) => {
    await page.goto("/signin");
    await page.waitForSelector('[data-testid="username-input"]');
    await page.fill('[data-testid="username-input"]', "alice");
    await page.waitForSelector('[data-testid="password-input"]');
    await page.fill('[data-testid="password-input"]', "secret");
    await page.waitForSelector('[data-testid="signin-btn"]');
    await page.click('[data-testid="signin-btn"]');
    await page.waitForSelector('[data-testid="signout-btn"]');
    await page.click('[data-testid="signout-btn"]');
    await expect(page).toHaveURL(/signin/);
  });

  // Responsive layout test (basic):
  test("app layout is responsive", async ({ page }) => {
    await page.goto("/signin");
    await page.waitForSelector('[data-testid="username-input"]');
    await page.setViewportSize({ width: 375, height: 700 }); // mobile
    await expect(page.locator("nav")).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 }); // desktop
    await expect(page.locator("nav")).toBeVisible();
  });
});
