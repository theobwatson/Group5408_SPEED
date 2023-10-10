// Necessary imports
import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import UserView from "../components/UserView";

describe("UserView Component", () => {
  // Add some mock articles to test the display of data
  const mockArticles = [
    {
      _id: "1",
      title: "Test Title",
      author: "Test Author",
      description: "Description",
      date_published: "2021-10-01T00:00:00.000Z",
      DOI: "12345",
      result: "Test approve",
      research_type: "Test Type",
      journal: "Test Journal",
      SE_methods: ["Method 1", "Method 2"],
      claims: ["Claim 1", "Claim 2"],
    },
    {
      _id: "2",
      title: "Test Title 2",
      author: "Test Author 2",
      description: "Description 2",
      date_published: "2022-10-01T00:00:00.000Z",
      DOI: "123456",
      result: "Test approve",
      research_type: "Test Type",
      journal: "Test Journal",
      SE_methods: ["Method 3", "Method 4"],
      claims: ["Claim 1", "Claim 2"],
    },
    {
      _id: "3",
      title: "Test Title 3",
      author: "Test Author 3",
      description: "Description 3",
      date_published: "2023-10-01T00:00:00.000Z",
      DOI: "1234567",
      result: "Test approve",
      research_type: "Test Type",
      journal: "Test Journal",
      SE_methods: ["Method 4", "Method 5"],
      claims: ["Claim 1", "Claim 2"],
    },
  ];

  test("renders UserView component", () => {
    render(<UserView articles={mockArticles} />);

    // Check if the table is rendered
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Check if the correct headers are rendered
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Author")).toBeInTheDocument();
    expect(screen.getByText("Date Published")).toBeInTheDocument();
    expect(screen.getByText("Research Type")).toBeInTheDocument();
    expect(screen.getByText("Journal")).toBeInTheDocument();
    expect(screen.getByText("SE Methods")).toBeInTheDocument();

    // Check if the data is rendered
    const elements = screen.getAllByText("Test Title");

    // Check if multiple rows are rendered
    expect(elements.length).toBeGreaterThan(0);
  });

  test("expands and collapses row on button click", async () => {
    render(<UserView articles={mockArticles} />);

    // Assuming there are multiple rows, getting all "Show more" buttons
    const buttons = screen.getAllByText("Show more");

    // Clicking the first "Show more" button to expand the row
    userEvent.click(buttons[0]);

    // Asserting that "Claims:" is in the document, indicating the row has expanded
    expect(await screen.findByText(/Claims:/i)).toBeInTheDocument();

    // Clicking again to collapse
    userEvent.click(buttons[0]);

    // Asserting that "Claims:" is not in the document, indicating the row has collapsed
    await waitFor(() =>
      expect(screen.queryByText(/Claims:/i)).not.toBeInTheDocument()
    );
  });

  // Test-Driven Development was used here:
  test("searches and filters articles by title", async () => {
    render(<UserView articles={mockArticles} />);

    const searchInput = screen.getByPlaceholderText("Search articles");
    userEvent.type(searchInput, "Test Title 2");

    const searchButton = screen.getByText("Search");
    userEvent.click(searchButton);

    const matchingRow = await screen.findByText("Test Title 2");
    expect(matchingRow).toBeInTheDocument();

    const nonMatchingRow1 = screen.queryByText("Test Title");
    const nonMatchingRow2 = screen.queryByText("Test Title 3");
    expect(nonMatchingRow1).not.toBeInTheDocument();
    expect(nonMatchingRow2).not.toBeInTheDocument();
  });

  test("clears the search term and displays original articles", async () => {
    render(<UserView articles={mockArticles} />);

    const searchInput = screen.getByPlaceholderText("Search articles");
    userEvent.type(searchInput, "Test Title 2");

    const searchButton = screen.getByText("Search");
    userEvent.click(searchButton);

    const matchingRow = await screen.findByText("Test Title 2");
    expect(matchingRow).toBeInTheDocument();

    const clearButton = screen.getByText("Clear");
    userEvent.click(clearButton);

    const originalRow = await screen.findByText("Test Title");
    expect(originalRow).toBeInTheDocument();
  });

  test("notifies when no matching articles are found", async () => {
    render(<UserView articles={mockArticles} />);

    const searchInput = screen.getByPlaceholderText("Search articles");
    userEvent.type(searchInput, "Non-existent Term");

    const searchButton = screen.getByText("Search");
    userEvent.click(searchButton);

    const noResultsMessage = await screen.findByText("No results found");
    expect(noResultsMessage).toBeInTheDocument();
  });
});
