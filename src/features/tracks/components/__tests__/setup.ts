import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Runs a cleanup after each test case to remove any rendered components from the DOM
afterEach(() => {
  cleanup();
}); 