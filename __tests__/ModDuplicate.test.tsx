import { hasDuplicateDOI } from "../components/ModeratorView";
import { Article } from "../components/ModeratorView";

describe("hasDuplicateDOI", () => {
  it("should return true when there are duplicate DOIs", () => {
    const minimalArticles: Article[] = [
      { _id: "1", title: "Article 1", DOI: "123", author: "Author 1", date_published: "2023-01-01", journal: "Journal A", volume: "1", pages: "1-10", inSearchersDb: false, inRejectedDb: false },
      { _id: "2", title: "Article 2", DOI: "124", author: "Author 2", date_published: "2023-01-02", journal: "Journal B", volume: "2", pages: "11-20", inSearchersDb: false, inRejectedDb: false },
      { _id: "3", title: "Article 3", DOI: "123", author: "Author 3", date_published: "2023-01-03", journal: "Journal C", volume: "3", pages: "21-30", inSearchersDb: false, inRejectedDb: false }
    ];

    expect(hasDuplicateDOI(minimalArticles)).toBe(true);

    const fullArticles: Article[] = [
      {
        _id: "1",
        title: "Test Article 1",
        author: "Author 1",
        date_published: "2023-01-01",
        DOI: "12345",
        journal: "Journal A",
        volume: "1",
        pages: "1-10",
        inSearchersDb: false,
        inRejectedDb: false
      },
      {
        _id: "2",
        title: "Test Article 2",
        author: "Author 2",
        date_published: "2023-01-02",
        DOI: "12346",
        journal: "Journal B",
        volume: "2",
        pages: "11-20",
        inSearchersDb: false,
        inRejectedDb: false
      },
      {
        _id: "3",
        title: "Test Article 3",
        author: "Author 3",
        date_published: "2023-01-03",
        DOI: "12345",  // Duplicate DOI
        journal: "Journal C",
        volume: "3",
        pages: "21-30",
        inSearchersDb: false,
        inRejectedDb: false
      },
      {
        _id: "4",
        title: "Test Article 4",
        author: "Author 4",
        date_published: "2023-01-04",
        DOI: "12348",  
        journal: "Journal D",
        volume: "4",
        pages: "31-40",
        inSearchersDb: false,
        inRejectedDb: false
      }
    ];

    expect(hasDuplicateDOI(fullArticles)).toBe(true);
  });

  it("should return false when there are no duplicate DOIs", () => {
    const articles: Article[] = [
      { _id: "1", title: "Article 1", DOI: "123", author: "Author 1", date_published: "2023-01-01", journal: "Journal A", volume: "1", pages: "1-10", inSearchersDb: false, inRejectedDb: false },
      { _id: "2", title: "Article 2", DOI: "124", author: "Author 2", date_published: "2023-01-02", journal: "Journal B", volume: "2", pages: "11-20", inSearchersDb: false, inRejectedDb: false },
      { _id: "3", title: "Article 3", DOI: "125", author: "Author 3", date_published: "2023-01-03", journal: "Journal C", volume: "3", pages: "21-30", inSearchersDb: false, inRejectedDb: false }
    ];

    expect(hasDuplicateDOI(articles)).toBe(false);
  });
});
