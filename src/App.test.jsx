import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('MindDump')).toBeInTheDocument();
  });

  test('renders main heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /minddump/i });
    expect(heading).toBeInTheDocument();
  });

  test('renders subtitle', () => {
    render(<App />);
    const subtitle = screen.getByText(/capture your thoughts and visualize your thinking patterns/i);
    expect(subtitle).toBeInTheDocument();
  });

  test('renders main sections', () => {
    render(<App />);
    
    // Check for main app structure
    const appElement = screen.getByRole('main');
    expect(appElement).toBeInTheDocument();
    
    // Check for header
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  test('app starts without console errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<App />);
    
    expect(consoleSpy).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
