// jest-dom adds custom jest matchers for asserting on DOM nodes.
// This allows you to use matchers like:
// expect(element).toHaveTextContent(/react/i)
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Optional: Configure Jest to include the matchers globally
// This ensures that the matchers are available in all test files without needing to import them individually.

// Example of setting up a custom Jest environment
// This can be useful if you need to configure Jest in a specific way for your project.

// jest.setup.js or similar setup file
import { configure } from '@testing-library/dom';

// Configure the testing library to use jest-dom matchers
configure({ testIdAttribute: 'data-test-id' });

// If you have custom matchers or setup functions, you can include them here
// For example, adding a custom matcher for a specific scenario
expect.extend({
  toBeVisibleWithin(received, argument) {
    const pass = received.style.display !== 'none' && received.offsetParent !== null;
    if (pass) {
      return {
        message: () => `expected element not to be visible within ${argument}ms`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be visible within ${argument}ms`,
        pass: false,
      };
    }
  },
});

// Example usage of the custom matcher
// expect(element).toBeVisibleWithin(500);

// Ensure that the setup file is included in your Jest configuration
// This can be done by adding the setup file to the Jest configuration in your package.json or jest.config.js

// Example package.json configuration
/*
{
  "jest": {
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"]
  }
}
*/

// Example jest.config.js configuration
/*
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
*/
