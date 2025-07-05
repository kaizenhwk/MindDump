import { test, expect } from '@playwright/test';

test.describe('Epic 3: Word Cloud Visualization E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Complete User Workflow', () => {
    test('user can add thought and see word cloud update', async ({ page }) => {
      await page.goto('/');

      // Verify initial empty state
      await expect(page.locator('.word-cloud')).toContainText('No words yet');
      await expect(page.locator('.word-cloud')).toContainText('Your word cloud will appear here');

      // Add a thought with specific words
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('I love programming and coding. Programming is amazing!');

      // Save the thought
      await page.locator('button:has-text("Save Thought")').click();

      // Wait for word cloud to update
      await expect(page.locator('.word-cloud')).not.toContainText('No words yet');
      
      // Verify words appear in cloud (excluding stop words)
      await expect(page.locator('.word-cloud')).toContainText('programming');
      await expect(page.locator('.word-cloud')).toContainText('coding');
      await expect(page.locator('.word-cloud')).toContainText('amazing');
      
      // Verify stop words are excluded
      await expect(page.locator('.word-cloud')).not.toContainText('and');
      await expect(page.locator('.word-cloud')).not.toContainText('is');
    });

    test('word cloud updates with multiple thoughts', async ({ page }) => {
      await page.goto('/');

      // Add first thought
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('I love programming');
      await page.locator('button:has-text("Save Thought")').click();

      // Wait for first word cloud update
      await expect(page.locator('.word-cloud')).toContainText('programming');

      // Add second thought with repeated word
      await thoughtInput.fill('Programming is my passion');
      await page.locator('button:has-text("Save Thought")').click();

      // Verify both words appear
      await expect(page.locator('.word-cloud')).toContainText('programming');
      await expect(page.locator('.word-cloud')).toContainText('passion');
    });

    test('word cloud updates when thoughts are deleted', async ({ page }) => {
      await page.goto('/');

      // Add a thought
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('I love programming');
      await page.locator('button:has-text("Save Thought")').click();

      // Verify word appears
      await expect(page.locator('.word-cloud')).toContainText('programming');

      // Delete the thought
      await page.locator('[aria-label="Delete thought"]').click();

      // Verify word cloud returns to empty state
      await expect(page.locator('.word-cloud')).toContainText('No words yet');
      await expect(page.locator('.word-cloud')).not.toContainText('programming');
    });
  });

  test.describe('Interactive Word Analysis', () => {
    test('clicking word opens analysis modal', async ({ page }) => {
      await page.goto('/');

      // Add thought with word variants
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('I am running to the store. I run every morning.');
      await page.locator('button:has-text("Save Thought")').click();

      // Wait for word cloud to appear
      await expect(page.locator('.word-cloud')).toContainText('running');

      // Click on a word in the cloud
      await page.locator('.word-cloud .word').first().click();

      // Verify modal opens
      await expect(page.locator('.word-analysis-modal')).toBeVisible();
      await expect(page.locator('.word-analysis-modal')).toContainText('Statistics');
      await expect(page.locator('.word-analysis-modal')).toContainText('Word Variants');
      await expect(page.locator('.word-analysis-modal')).toContainText('Sample Usage');

      // Verify sample sentences are shown
      await expect(page.locator('.word-analysis-modal')).toContainText('running to the store');
    });

    test('modal closes with close button', async ({ page }) => {
      await page.goto('/');

      // Add thought and open modal
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('Testing modal functionality');
      await page.locator('button:has-text("Save Thought")').click();

      await expect(page.locator('.word-cloud')).toContainText('testing');
      await page.locator('.word-cloud .word').first().click();

      // Verify modal is open
      await expect(page.locator('.word-analysis-modal')).toBeVisible();

      // Close modal with close button
      await page.locator('[aria-label="Close modal"]').click();

      // Verify modal is closed
      await expect(page.locator('.word-analysis-modal')).not.toBeVisible();
    });

    test('modal closes when clicking backdrop', async ({ page }) => {
      await page.goto('/');

      // Add thought and open modal
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('Testing backdrop close');
      await page.locator('button:has-text("Save Thought")').click();

      await expect(page.locator('.word-cloud')).toContainText('testing');
      await page.locator('.word-cloud .word').first().click();

      // Verify modal is open
      await expect(page.locator('.word-analysis-modal')).toBeVisible();

      // Click backdrop to close
      await page.locator('.word-analysis-modal-backdrop').click();

      // Verify modal is closed
      await expect(page.locator('.word-analysis-modal')).not.toBeVisible();
    });

    test('word variants are displayed correctly', async ({ page }) => {
      await page.goto('/');

      // Add thought with word variants
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('I am running. I run daily. She runs fast.');
      await page.locator('button:has-text("Save Thought")').click();

      // Click on word to open modal
      await page.locator('.word-cloud .word').first().click();

      // Verify word variants section
      await expect(page.locator('.word-analysis-modal')).toContainText('Word Variants');
      
      // Check for different forms of the word
      const modalContent = page.locator('.word-analysis-modal');
      const hasRunning = await modalContent.locator('text=running').count() > 0;
      const hasRun = await modalContent.locator('text=run').count() > 0;
      const hasRuns = await modalContent.locator('text=runs').count() > 0;
      
      expect(hasRunning || hasRun || hasRuns).toBeTruthy();
    });
  });

  test.describe('Word Cloud Animations', () => {
    test('words have floating animations', async ({ page }) => {
      await page.goto('/');

      // Add thought
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('Testing animation functionality with multiple words');
      await page.locator('button:has-text("Save Thought")').click();

      // Wait for word cloud
      await expect(page.locator('.word-cloud .word')).toHaveCount(5, { timeout: 5000 });

      // Check that words have animation classes
      const words = page.locator('.word-cloud .word');
      const firstWord = words.first();
      
      // Verify animation class is applied
      await expect(firstWord).toHaveClass(/float-animation/);
    });

    test('hover effects work correctly', async ({ page }) => {
      await page.goto('/');

      // Add thought
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('Testing hover effects');
      await page.locator('button:has-text("Save Thought")').click();

      // Wait for word cloud
      await expect(page.locator('.word-cloud .word')).toHaveCount(3, { timeout: 5000 });

      const firstWord = page.locator('.word-cloud .word').first();
      
      // Hover over word
      await firstWord.hover();
      
      // Verify hover state (animation should pause or change)
      await expect(firstWord).toHaveClass(/hover/);
    });

    test('respects reduced motion preference', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');

      // Add thought
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('Testing reduced motion');
      await page.locator('button:has-text("Save Thought")').click();

      // Wait for word cloud
      await expect(page.locator('.word-cloud .word')).toHaveCount(3, { timeout: 5000 });

      // Verify animations are disabled or reduced
      const words = page.locator('.word-cloud .word');
      const animationDuration = await words.first().evaluate(el => 
        getComputedStyle(el).animationDuration
      );
      
      // Should be 0s or very short for reduced motion
      expect(animationDuration === '0s' || parseFloat(animationDuration) < 0.1).toBeTruthy();
    });
  });

  test.describe('Responsive Design', () => {
    test('word cloud works on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Add thought
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('Mobile responsive test');
      await page.locator('button:has-text("Save Thought")').click();

      // Verify word cloud appears and is responsive
      await expect(page.locator('.word-cloud')).toBeVisible();
      await expect(page.locator('.word-cloud .word')).toHaveCount(3, { timeout: 5000 });

      // Click word to test modal on mobile
      await page.locator('.word-cloud .word').first().click();
      await expect(page.locator('.word-analysis-modal')).toBeVisible();

      // Verify modal is responsive
      const modal = page.locator('.word-analysis-modal');
      const modalBox = await modal.boundingBox();
      expect(modalBox.width).toBeLessThanOrEqual(375);
    });

    test('word cloud adapts to different screen sizes', async ({ page }) => {
      // Test desktop size
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('Desktop size test with many words to fill space');
      await page.locator('button:has-text("Save Thought")').click();

      await expect(page.locator('.word-cloud .word')).toHaveCount(9, { timeout: 5000 });

      // Get word cloud dimensions on desktop
      const desktopBounds = await page.locator('.word-cloud').boundingBox();

      // Test tablet size
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500); // Allow for responsive adjustments

      // Verify word cloud adapts
      const tabletBounds = await page.locator('.word-cloud').boundingBox();
      expect(tabletBounds.width).toBeLessThan(desktopBounds.width);
    });
  });

  test.describe('Accessibility', () => {
    test('word cloud is keyboard accessible', async ({ page }) => {
      await page.goto('/');

      // Add thought
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('Keyboard accessibility test');
      await page.locator('button:has-text("Save Thought")').click();

      await expect(page.locator('.word-cloud .word')).toHaveCount(3, { timeout: 5000 });

      // Tab to first word
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // Navigate to word cloud area

      // Press Enter to activate word
      await page.keyboard.press('Enter');

      // Verify modal opens
      await expect(page.locator('.word-analysis-modal')).toBeVisible();

      // Press Escape to close modal
      await page.keyboard.press('Escape');
      await expect(page.locator('.word-analysis-modal')).not.toBeVisible();
    });

    test('word cloud has proper ARIA labels', async ({ page }) => {
      await page.goto('/');

      // Add thought
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('ARIA labels test');
      await page.locator('button:has-text("Save Thought")').click();

      await expect(page.locator('.word-cloud .word')).toHaveCount(3, { timeout: 5000 });

      // Check for proper ARIA attributes
      const firstWord = page.locator('.word-cloud .word').first();
      await expect(firstWord).toHaveAttribute('role', 'button');
      await expect(firstWord).toHaveAttribute('tabindex', '0');
      
      // Check for aria-label or accessible name
      const ariaLabel = await firstWord.getAttribute('aria-label');
      const textContent = await firstWord.textContent();
      expect(ariaLabel || textContent).toBeTruthy();
    });

    test('modal has proper focus management', async ({ page }) => {
      await page.goto('/');

      // Add thought and open modal
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('Focus management test');
      await page.locator('button:has-text("Save Thought")').click();

      await page.locator('.word-cloud .word').first().click();
      await expect(page.locator('.word-analysis-modal')).toBeVisible();

      // Verify focus is trapped in modal
      const closeButton = page.locator('[aria-label="Close modal"]');
      await expect(closeButton).toBeFocused();

      // Tab through modal elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should cycle back to close button
      await page.keyboard.press('Tab');
      await expect(closeButton).toBeFocused();
    });
  });

  test.describe('Performance', () => {
    test('handles large number of words efficiently', async ({ page }) => {
      await page.goto('/');

      // Add multiple thoughts with many words
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      
      const longThoughts = [
        'This is a comprehensive test with many different words to evaluate performance',
        'Another thought with various terms and expressions to increase word count significantly',
        'Testing scalability with numerous vocabulary items and diverse linguistic elements',
        'Performance evaluation using extensive textual content and multiple word variations',
        'Final thought containing additional terminology to maximize the word cloud density'
      ];

      for (const thought of longThoughts) {
        await thoughtInput.fill(thought);
        await page.locator('button:has-text("Save Thought")').click();
        await page.waitForTimeout(100); // Small delay between additions
      }

      // Measure rendering performance
      const startTime = Date.now();
      await expect(page.locator('.word-cloud .word')).toHaveCount(30, { timeout: 10000 });
      const endTime = Date.now();
      
      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(5000); // Should render within 5 seconds

      // Verify word cloud is still interactive
      await page.locator('.word-cloud .word').first().click();
      await expect(page.locator('.word-analysis-modal')).toBeVisible();
    });

    test('word cloud updates smoothly with frequent changes', async ({ page }) => {
      await page.goto('/');

      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');

      // Rapidly add and delete thoughts
      for (let i = 0; i < 5; i++) {
        await thoughtInput.fill(`Rapid test ${i} with unique words`);
        await page.locator('button:has-text("Save Thought")').click();
        await page.waitForTimeout(200);
        
        // Delete the thought
        await page.locator('[aria-label="Delete thought"]').last().click();
        await page.waitForTimeout(200);
      }

      // Add final thought
      await thoughtInput.fill('Final stability test');
      await page.locator('button:has-text("Save Thought")').click();

      // Verify word cloud is stable and functional
      await expect(page.locator('.word-cloud')).toContainText('final');
      await expect(page.locator('.word-cloud')).toContainText('stability');
    });
  });

  test.describe('Error Handling', () => {
    test('handles localStorage errors gracefully', async ({ page }) => {
      await page.goto('/');

      // Mock localStorage to throw errors
      await page.addInitScript(() => {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function() {
          throw new Error('Storage quota exceeded');
        };
      });

      // Try to add a thought
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('Testing error handling');
      await page.locator('button:has-text("Save Thought")').click();

      // App should still function (error handled gracefully)
      await expect(thoughtInput).toBeVisible();
      await expect(page.locator('body')).not.toContainText('Error');
    });

    test('handles empty word cloud state correctly', async ({ page }) => {
      await page.goto('/');

      // Verify empty state
      await expect(page.locator('.word-cloud')).toContainText('No words yet');
      await expect(page.locator('.word-cloud')).toContainText('Your word cloud will appear here');

      // Verify no clickable words
      const wordCount = await page.locator('.word-cloud .word').count();
      expect(wordCount).toBe(0);
    });

    test('handles malformed thought data', async ({ page }) => {
      await page.goto('/');

      // Inject malformed data into localStorage
      await page.evaluate(() => {
        localStorage.setItem('minddump_session_thoughts', 'invalid json');
        localStorage.setItem('minddump_session_wordFrequency', '{"invalid": "data"');
      });

      await page.reload();

      // App should handle malformed data gracefully
      await expect(page.locator('.word-cloud')).toContainText('No words yet');
      
      // Should still be able to add new thoughts
      const thoughtInput = page.locator('textarea[placeholder*="What\'s on your mind"]');
      await thoughtInput.fill('Recovery test');
      await page.locator('button:has-text("Save Thought")').click();
      
      await expect(page.locator('.word-cloud')).toContainText('recovery');
    });
  });
});
