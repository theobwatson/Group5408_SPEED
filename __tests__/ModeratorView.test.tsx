// Import necessary packages
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ModeratorView from "../components/ModeratorView";
import fetchMock from "jest-fetch-mock"; // mock fetch for testing API calls

// Mocking fetch for testing
fetchMock.enableMocks();

// Reset any mocks before each test to ensure there's no shared state
beforeEach(() => {
  fetchMock.resetMocks();
  Object.defineProperty(window, "location", {
    writable: true,
    value: { reload: jest.fn() },
  });
});

// main test suite
describe("<ModeratorView />", () => {
  // mock article data
  const mockArticle = {
    _id: "123",
    title: "Test Title",
    author: "Test Author",
    date_published: "2023-01-01",
    DOI: "testDOI",
    journal: "Test Journal",
    volume: "1",
    pages: "1-10",
    inSearchersDb: false,
    inRejectedDb: false,
  };

  // Test if code can correctly identify an article that is a duplicate in speed
  test("correctly identifies duplicates in SPEED", () => {
    // Render the component
    const { getByText } = render(
      <ModeratorView
        articles={[mockArticle]}
        userArticles={[mockArticle]}
        rejectedArticles={[]}
      />
    );

    expect(getByText("Yes")).toBeInTheDocument(); // Duplicate in speed
    expect(getByText("No")).toBeInTheDocument(); // not rejected
  });

  // Test if the code can correctly identify an article that is previously rejected
  test("correctly identifies previously rejected articles", () => {
    const { getByText } = render(
      <ModeratorView
        articles={[mockArticle]}
        userArticles={[]}
        rejectedArticles={[mockArticle]}
      />
    );

    expect(getByText("No")).toBeInTheDocument(); // Not a duplicate in SPEED
    expect(getByText("Yes")).toBeInTheDocument(); // Previously rejected
  });

  // Test if the "Approve" button sends the API request
  test("handles Approve button click", async () => {
    // Mock the fetch response
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    const { getByText } = render(
      <ModeratorView
        articles={[mockArticle]}
        userArticles={[]}
        rejectedArticles={[]}
      />
    );

    fireEvent.click(getByText("Approve"));

    // Wait for the fetch to be called
    await waitFor(() => expect(fetchMock.mock.calls.length).toEqual(1));

    // Correct endpoint
    expect(fetchMock.mock.calls[0][0]).toBe("/api/updateArticle");

    const requestBody = fetchMock.mock.calls[0][1]?.body;
    expect(requestBody).toBeDefined();

    if (requestBody) {
      expect(requestBody).toContain(mockArticle._id); // Sending the correct ID
      expect(requestBody).toContain("analyst"); // Correct queue value
    }
  });

  // Test if the "Reject" button sends the API request
  test("handles Reject button click", async () => {
    // Mock the fetch response
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    const { getByText } = render(
      <ModeratorView
        articles={[mockArticle]}
        userArticles={[]}
        rejectedArticles={[]}
      />
    );

    fireEvent.click(getByText("Reject"));

    // Wait for the fetch to be called
    await waitFor(() => expect(fetchMock.mock.calls.length).toEqual(1));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/updateArticle"); // Correct endpoint

    // Sending the correct ID

    const requestBody = fetchMock.mock.calls[0][1]?.body;
    expect(requestBody).toBeDefined();

    if (requestBody) {
      expect(requestBody).toContain(mockArticle._id); // Sending the correct ID
      expect(requestBody).toContain("rejected"); // Correct queue value
    }
  });
});
