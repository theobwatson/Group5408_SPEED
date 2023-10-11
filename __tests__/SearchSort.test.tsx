// Necessary imports
import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SearchSort from "../components/SearchSort";

describe("<SearchSort />", () => {
  it("sets the selected SE method correctly", () => {
    // Mock functions for props
    const setSelectedSEMethod = jest.fn();
    const mockSetSearchTerm = jest.fn();
    const mockSetStartYear = jest.fn();
    const mockSetEndYear = jest.fn();
    const mockSetSortPreference = jest.fn();

    // Render component
    const { getByDisplayValue, getByText } = render(
      <SearchSort
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        allSEMethods={["Method 1", "Method 2", "A Specific SE Method"]}
        selectedSEMethod="Method 1"
        setSelectedSEMethod={setSelectedSEMethod}
        startYear={null}
        setStartYear={mockSetStartYear}
        endYear={null}
        setEndYear={mockSetEndYear}
        sortPreference={null}
        setSortPreference={mockSetSortPreference}
      />
    );

    // Interact with the dropdown
    const dropdown = getByDisplayValue("Method 1");
    fireEvent.change(dropdown, { target: { value: "A Specific SE Method" } });

    // Assert
    expect(setSelectedSEMethod).toHaveBeenCalledWith("A Specific SE Method");
  });

  it("sets the start and end year correctly", () => {
    // Mock functions for props
    const setSelectedSEMethod = jest.fn();
    const mockSetSearchTerm = jest.fn();
    const mockSetStartYear = jest.fn();
    const mockSetEndYear = jest.fn();
    const mockSetSortPreference = jest.fn();

    // Render component
    const { getByPlaceholderText } = render(
      <SearchSort
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        allSEMethods={["Method 1", "Method 2", "A Specific SE Method"]}
        selectedSEMethod="Method 1"
        setSelectedSEMethod={setSelectedSEMethod}
        startYear={null}
        setStartYear={mockSetStartYear}
        endYear={null}
        setEndYear={mockSetEndYear}
        sortPreference={null}
        setSortPreference={mockSetSortPreference}
      />
    );

    // Interact with the "From Year" input
    const startYearInput = getByPlaceholderText("From Year");
    fireEvent.change(startYearInput, { target: { value: "2005" } });

    // Assert
    expect(mockSetStartYear).toHaveBeenCalledWith(2005);

    // Interact with the "To Year" input
    const endYearInput = getByPlaceholderText("To Year");
    fireEvent.change(endYearInput, { target: { value: "2015" } });

    // Assert
    expect(mockSetEndYear).toHaveBeenCalledWith(2015);
  });

  it("handles SE method selection and sort preference correctly", () => {
    // Mock functions for props
    const mockSetSearchTerm = jest.fn();
    const mockSetSelectedSEMethod = jest.fn();
    const mockSetStartYear = jest.fn();
    const mockSetEndYear = jest.fn();
    const mockSetSortPreference = jest.fn();

    // Render component
    const { getByText } = render(
      <SearchSort
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        allSEMethods={["Method 1", "Method 2", "A Specific SE Method"]}
        selectedSEMethod="Method 1"
        setSelectedSEMethod={mockSetSelectedSEMethod}
        startYear={null}
        setStartYear={mockSetStartYear}
        endYear={null}
        setEndYear={mockSetEndYear}
        sortPreference={null}
        setSortPreference={mockSetSortPreference}
      />
    );

    // Interact with the dropdown
    const dropdown = getByText("Method 1").closest("select");
    if (dropdown) {
      fireEvent.change(dropdown, { target: { value: "A Specific SE Method" } });
    }

    // Assert
    expect(mockSetSelectedSEMethod).toHaveBeenCalledWith(
      "A Specific SE Method"
    );

    // Interact with the "Most Recent" button
    fireEvent.click(getByText("Most Recent"));

    // Assert
    expect(mockSetSortPreference).toHaveBeenCalledWith(expect.any(Function));

    const passedFunctionForMostRecent = mockSetSortPreference.mock.calls[0][0];
    expect(passedFunctionForMostRecent("mostRecent")).toBe(null);
    expect(passedFunctionForMostRecent(null)).toBe("mostRecent");
  });
});
