// Importing necessary libraries and components
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ModeratorView from '../components/ModeratorView';
import fetchMock from 'jest-fetch-mock';

// Before all tests, enable fetch mocks
beforeAll(() => {
  fetchMock.enableMocks();
});

afterEach(() => {
    fetchMock.resetMocks();
  });

// Mock data to be used in tests
const mockArticles = [
  {
    _id: "1",
    title: "Test Article 1",
    author: "Author 1",
    date_published: "2023-10-11",
    DOI: "1234",
    journal: "Test Journal",
    volume: "1",
    pages: "10-15",
    inSearchersDb: false,
    inRejectedDb: false
  },
];

// Grouping tests related to the ModeratorView component
describe('<ModeratorView />', () => {
  // Before each test, reset all mocks to ensure a clean state
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  // Test for approving an article
  it('approves an article successfully', async () => {
    // Mocking a successful response from the API when an article is approved
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Article approved successfully' }));

    // Rendering the ModeratorView component with mock data
    const { getByText } = render(<ModeratorView articles={mockArticles} />);

    // Locating the "Approve" button and simulating a click
    const approveButton = getByText('Approve');
    fireEvent.click(approveButton);

    expect(fetch).toHaveBeenCalled();
    console.log((fetch as jest.MockedFunction<typeof fetch>).mock.calls.length);

    // Awaiting the fetch call to complete and asserting that it was called correctly
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/api/updateArticle', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ articleId: "1", newQueueValue: 'analyst' })
      }));
    });
  });

  // Test for rejecting an article
  it('rejects an article successfully', async () => {
    // Mocking a successful response from the API when an article is rejected
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Article rejected successfully' }));

    // Rendering the ModeratorView component with mock data
    const { getByText } = render(<ModeratorView articles={mockArticles} />);

    // Locating the "Reject" button and simulating a click
    const rejectButton = getByText('Reject');
    fireEvent.click(rejectButton);

    expect(fetch).toHaveBeenCalled();
    console.log((fetch as jest.MockedFunction<typeof fetch>).mock.calls.length);

    // Awaiting the fetch call to complete and asserting that it was called correctly
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/api/updateArticle', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ articleId: "1", newQueueValue: 'rejected' })
      }));
    });
  });

});
