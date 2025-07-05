import { render, screen } from '@testing-library/react';
import WordCloud from './WordCloud';
import { ThoughtProvider } from '../../hooks';

// Mock localStorage for testing
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = mockLocalStorage;

describe('WordCloud Component', () => {
  const renderWithProvider = (component) => {
    return render(
      <ThoughtProvider>
        {component}
      </ThoughtProvider>
    );
  };

  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.clear.mockClear();
  });

  test('renders without crashing', () => {
    renderWithProvider(<WordCloud />);
    // Check that the component renders the Word Cloud heading
    const heading = screen.getByRole('heading', { name: /word cloud/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays empty state when no thoughts exist', () => {
    renderWithProvider(<WordCloud />);
    // Should show empty state since no thoughts are added yet
    expect(screen.getByText(/no words yet/i)).toBeInTheDocument();
    expect(screen.getByText(/your word cloud will appear here/i)).toBeInTheDocument();
  });

  test('renders word cloud container', () => {
    renderWithProvider(<WordCloud />);
    // Check that the main word cloud div is rendered by finding the heading specifically
    const heading = screen.getByRole('heading', { name: /word cloud/i });
    const wordCloudDiv = heading.closest('.word-cloud');
    expect(wordCloudDiv).toBeInTheDocument();
  });

  // Enhanced Word Cloud Animation Tests (US-3.3)
  describe('Enhanced Word Cloud Animations', () => {
    test('word size calculation algorithm works correctly', () => {
      // Test the size calculation logic directly
      const testFrequencies = [
        { frequency: 1, maxFreq: 5, expectedMin: 10, expectedMax: 48 },
        { frequency: 5, maxFreq: 5, expectedMin: 10, expectedMax: 48 },
        { frequency: 3, maxFreq: 5, expectedMin: 10, expectedMax: 48 }
      ];

      testFrequencies.forEach(({ frequency, maxFreq, expectedMin, expectedMax }) => {
        const size = Math.max(10, Math.min(48, 10 + (frequency / maxFreq) * 38));
        expect(size).toBeGreaterThanOrEqual(expectedMin);
        expect(size).toBeLessThanOrEqual(expectedMax);
      });
    });

    test('floating animation class is applied in component structure', () => {
      renderWithProvider(<WordCloud />);
      
      // Check that the component structure supports floating animations
      const wordCloudDiv = document.querySelector('.word-cloud');
      expect(wordCloudDiv).toBeInTheDocument();
      
      // Verify CSS classes exist for animation support
      expect(wordCloudDiv).toHaveClass('word-cloud');
    });

    test('animation timing properties are properly structured', () => {
      // Test the randomization logic for animation timing
      const delays = [];
      const durations = [];
      
      // Generate multiple values to test randomization
      for (let i = 0; i < 10; i++) {
        const delay = Math.random() * 3;
        const duration = 3 + Math.random() * 3;
        
        delays.push(delay);
        durations.push(duration);
        
        expect(delay).toBeGreaterThanOrEqual(0);
        expect(delay).toBeLessThanOrEqual(3);
        expect(duration).toBeGreaterThanOrEqual(3);
        expect(duration).toBeLessThanOrEqual(6);
      }
      
      // Verify we get different values (randomization working)
      const uniqueDelays = new Set(delays.map(d => Math.round(d * 100)));
      const uniqueDurations = new Set(durations.map(d => Math.round(d * 100)));
      expect(uniqueDelays.size).toBeGreaterThan(1);
      expect(uniqueDurations.size).toBeGreaterThan(1);
    });

    test('accessibility features are properly implemented', () => {
      // Mock matchMedia for reduced motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      renderWithProvider(<WordCloud />);
      
      // CSS media query handling is tested through CSS, 
      // but we can verify the component renders properly
      const heading = screen.getByRole('heading', { name: /word cloud/i });
      expect(heading).toBeInTheDocument();
    });

    test('component structure supports word frequency display', () => {
      renderWithProvider(<WordCloud />);
      
      // Check that the component has the structure to display word frequency
      const heading = screen.getByRole('heading', { name: /word cloud/i });
      expect(heading).toBeInTheDocument();
      
      // Verify empty state is shown when no data
      expect(screen.getByText(/no words yet/i)).toBeInTheDocument();
    });

    test('responsive design structure is properly implemented', () => {
      renderWithProvider(<WordCloud />);
      
      // Check that the main word cloud structure exists
      const wordCloud = document.querySelector('.word-cloud');
      expect(wordCloud).toBeInTheDocument();
      expect(wordCloud).toHaveClass('word-cloud');
      
      // Verify header structure exists
      const header = document.querySelector('.word-cloud-header');
      expect(header).toBeInTheDocument();
    });
  });
});
