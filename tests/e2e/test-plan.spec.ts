import { test, expect } from "@playwright/test";

// Note: Since the backend is not running and we don't have a config file,
// this test serves as a script demonstrating the automation of the requested flow.
// You might need to adjust some locators (like test ids or specific aria-labels)
// depending on how the components are precisely rendered in the DOM.

// 0. Log in to the testing account with dummy info
test.beforeEach(async ({ page }) => {
	await page.goto("./signin");
	await page
		.getByRole("textbox", { name: "email" })
		.fill("mistertest64@example.com");
	await page.getByRole("textbox", { name: "password" }).fill("mistertest64");
	await page.getByRole("button", { name: /Log In/i }).click();
	await page.waitForURL(".");
});

// 2. Log out from the testing account
test.afterEach(async ({ page }) => {
	await page.goto("./signout");
	await page.getByRole("button", { name: /Sign Out/i }).click();
	await page.waitForURL(".");
});

test.describe("End-to-End Test for Kiminoto App Test Plan", () => {
	test("Whole US1-* sequentially", async ({ page, request }) => {
		// ==========================================
		// 1. Follow the test plan from the PDF file
		// ==========================================

		// EPIC 1: Upvotes and downvotes on reviews of rental information
		// US1-1: View Reviews for a Car Provider
		await test.step("TC1-1-1: See reviews for a car provider when there are reviews", async () => {
			await page.goto("./providers");

			// The card for the car provider with ID 699edeced7f38d5e46173e7e is clicked.
			// We assume the card has a link containing the provider ID.
			await page.locator('a[href*="699edeced7f38d5e46173e7e"]').first().click();

			// Expected Output: Reviews are visible.
			await expect(page.getByText(/CUSTOMER REVIEWS/i).first()).toBeVisible();
			// Wait for reviews to load
			await page.waitForSelector("text=Nina Gutkowski");
		});

		await test.step('TC1-1-2: See a "no reviews found" for a car provider when there are no reviews', async () => {
			await page.goto("./providers");

			// The card for the car provider with ID 69e34cc780508b0d86446bd2 is clicked.
			await page.locator('a[href*="69e34cc780508b0d86446bd2"]').first().click();

			// Expected Output: "NO REVIEWS YET" is shown
			await expect(page.getByText(/NO REVIEWS YET/i)).toBeVisible();
		});

		// US1-2: Upvote Reviews for a Car Provider
		await test.step("TC1-2-1 & TC1-2-2: Upvote a review & Prevent duplicate upvotes", async () => {
			await page.goto("/providers/699edeced7f38d5e46173e7e"); // Navigate back to the provider with reviews

			const firstReviewUpvoteBtn = page.locator("button:has(svg)").first();

			// TC1-2-1: Upvote a not-previously upvoted review

			// get the score number
			const beforeScore = await page
				.getByText(/^\-?[0-9]+$/i)
				.first()
				.textContent();
			expect(beforeScore).not.toBeNull();
			const beforeNumber = parseInt(beforeScore || "");
			expect(beforeNumber).not.toBeNaN();

			// click the upvote button
			await firstReviewUpvoteBtn.click();

			// get the score number
			const afterScore = await page
				.getByText(/^\-?[0-9]+$/i)
				.first()
				.textContent();
			expect(afterScore).not.toBeNull();
			const afterNumber = parseInt(afterScore || "");
			expect(afterNumber).not.toBeNaN();

			// Verify that the upvote count increased:
			// check that the number has increased by 1
			expect(afterNumber).toBe(beforeNumber + 1);

			// TC1-2-2: Prevent duplicate upvotes on a previously upvoted review
			await firstReviewUpvoteBtn.click();

			// get the score number
			const duplicateScore = await page
				.getByText(/^\-?[0-9]+$/i)
				.first()
				.textContent();
			expect(duplicateScore).not.toBeNull();
			const duplicateNumber = parseInt(duplicateScore || "");
			expect(duplicateNumber).not.toBeNaN();

			// Verify that the upvote count reverted:
			// check that the number has decreased by 1
			expect(duplicateNumber).toBe(afterNumber - 1);
		});

		// US1-3: Downvote Reviews for a Car Provider
		await test.step("TC1-3-1 & TC1-3-2: Downvote a review & Prevent duplicate downvotes", async () => {
			await page.goto("/providers/699edeced7f38d5e46173e7e"); // Navigate back to the provider with reviews

			// Find the downvote button of the first review (assuming the second button in the voting group)
			const firstReviewDownvoteBtn = page.locator("button:has(svg)").nth(1);

			// get the score number
			const beforeScore = await page
				.getByText(/^\-?[0-9]+$/i)
				.first()
				.textContent();
			expect(beforeScore).not.toBeNull();
			const beforeNumber = parseInt(beforeScore || "");
			expect(beforeNumber).not.toBeNaN();

			// TC1-3-1: Downvote a not-previously downvoted review
			await firstReviewDownvoteBtn.click();

			// get the score number
			const afterScore = await page
				.getByText(/^\-?[0-9]+$/i)
				.first()
				.textContent();
			expect(afterScore).not.toBeNull();
			const afterNumber = parseInt(afterScore || "");
			expect(afterNumber).not.toBeNaN();

			// Verify that the upvote count decreased:
			// check that the number has decreased by 1
			expect(afterNumber).toBe(beforeNumber - 1);

			// TC1-3-2: Prevent duplicate downvotes on a previously downvoted review
			await firstReviewDownvoteBtn.click();

			// get the score number
			const duplicateScore = await page
				.getByText(/^\-?[0-9]+$/i)
				.first()
				.textContent();
			expect(duplicateScore).not.toBeNull();
			const duplicateNumber = parseInt(duplicateScore || "");
			expect(duplicateNumber).not.toBeNaN();

			// Verify that the upvote count reverted:
			// check that the number has increased by 1
			expect(duplicateNumber).toBe(afterNumber + 1);
		});

		// US1-4: Sort Reviews for a Car Provider
		await test.step("TC1-4-1: Sort reviews for a car provider based on voting score (most popular)", async () => {
			// Click on "MOST POPULAR" sorting button
			const mostPopularBtn = page.getByRole("button", {
				name: /MOST POPULAR/i,
			});
			await mostPopularBtn.click();

			// Verify sorting: Tung Tung Tung Sahur made the comment with the highest number of
			// upvotes, he should be the first up the list.
			const name = await page.locator(".username").first().textContent();
			expect(name).toBe("Tung Tung Tung Sahur");
		});

		await test.step("TC1-4-2: Sort reviews for a car provider based on most recent", async () => {
			// Click on "NEWEST FIRST" sorting button
			const newestFirstBtn = page.getByRole("button", {
				name: /NEWEST FIRST/i,
			});
			await newestFirstBtn.click();

			// Verify sorting: paopao made the newest comment, he should be the first up the list.
			const name = await page.locator(".username").first().textContent();
			expect(name).toBe("paopao");
		});
	});
});
