import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should search for a movie and display results', async ({ page }) => {
    // 1. Navigate to the home page
    await page.goto('/');

    // 2. Click the search button in the header to open the overlay
    // Note: Using a more specific selector to distinguish from the search button inside the overlay
    await page.locator('header').getByRole('button', { name: '検索' }).click();

    // 3. Wait for the overlay to be visible and fill in the search input
    const searchInput = page.getByPlaceholder('映画のタイトルを入力...');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Dune');

    // 4. Click the search button within the overlay
    await page.locator('div[class*="bg-opacity-50"]').getByRole('button', { name: '検索' }).click();

    // 5. Wait for the navigation to the search results page
    await page.waitForURL('**/search?q=Dune');

    // 6. Check if the search results are displayed
    // This requires knowing the structure of the SearchPage component.
    // Let's assume there is a heading with the search query.
    await expect(page.getByRole('heading', { name: /検索結果/ })).toBeVisible();

    // 7. Check if at least one movie card is visible
    await expect(page.locator('[class*="movie-card"]').first()).toBeVisible();
  });
});
