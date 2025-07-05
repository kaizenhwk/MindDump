/**
 * CSS Loading Tests
 * These tests verify that CSS files can be imported without errors
 * CSS files are mocked by identity-obj-proxy in Jest configuration
 */

describe('CSS Files Loading', () => {
  test('CSS modules are properly mocked', () => {
    // Import CSS files to verify they are properly handled by Jest
    const mainCss = require('./main.css');
    const componentsCss = require('./components.css');
    const appCss = require('../App.css');
    
    // With identity-obj-proxy, CSS imports should return an object
    expect(typeof mainCss).toBe('object');
    expect(typeof componentsCss).toBe('object');
    expect(typeof appCss).toBe('object');
  });

  test('component CSS files are properly mocked', () => {
    const wordCloudCss = require('../components/WordCloud/WordCloud.css');
    const thoughtInputCss = require('../components/ThoughtInput/ThoughtInput.css');
    const thoughtListCss = require('../components/ThoughtList/ThoughtList.css');
    const searchBarCss = require('../components/Search/SearchBar.css');
    
    // All should be objects when mocked by identity-obj-proxy
    expect(typeof wordCloudCss).toBe('object');
    expect(typeof thoughtInputCss).toBe('object');
    expect(typeof thoughtListCss).toBe('object');
    expect(typeof searchBarCss).toBe('object');
  });

  test('CSS class names are accessible through proxy', () => {
    const componentsCss = require('./components.css');
    
    // identity-obj-proxy returns the property name as the value
    // This allows us to test that CSS classes are accessible
    expect(componentsCss.btn).toBe('btn');
    expect(componentsCss.card).toBe('card');
    expect(componentsCss['btn-primary']).toBe('btn-primary');
  });
});
