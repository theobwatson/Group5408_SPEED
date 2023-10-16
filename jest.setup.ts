// Mock just the reload method of window.location
Object.defineProperty(window, "location", {
    writable: true,
    value: { ...window.location, reload: jest.fn() }
  });
  
  import "@testing-library/jest-dom";
  import fetchMock from 'jest-fetch-mock';
  
  global.fetch = fetchMock as unknown as typeof fetch;
  