import { hasDuplicateDOI } from "../components/ModeratorView";

describe("hasDuplicateDOI", () => {
  it("should return true when there are duplicate DOIs", () => {
    const articles = [
      { DOI: "123", title: "Article 1" },
      { DOI: "124", title: "Article 2" },
      { DOI: "123", title: "Article 3" }
    ];

    expect(hasDuplicateDOI(articles)).toBe(true);
  });

  it("should return false when there are no duplicate DOIs", () => {
    const articles = [
      { DOI: "123", title: "Article 1" },
      { DOI: "124", title: "Article 2" },
      { DOI: "125", title: "Article 3" }
    ];

    expect(hasDuplicateDOI(articles)).toBe(false);
  });
});
