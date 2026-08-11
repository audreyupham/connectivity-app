import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import "./SearchResultsPage.css";

function highlight(text, search) {
  if (!text) return text;

  const regex = new RegExp(`(${search})`, "gi");

  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <mark key={index}>{part}</mark>
    ) : (
      part
    )
  );
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      setLoading(true);

      const res = await api.get(
        `/contacts/search?q=${encodeURIComponent(query)}`
      );

      if (res.ok) {
        setResults(res.data);
      }

      setLoading(false);
    }

    loadResults();
  }, [query]);

  if (loading) {
    return (
      <div className="search-results-page">
        <h1>Searching...</h1>
      </div>
    );
  }

  return (
    <div className="search-results-page">

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1>
        Results for "{query}"
      </h1>

      <p className="results-count">
        {results.length} contact{results.length !== 1 && "s"} found
      </p>

      {results.length === 0 && (
        <div className="empty-results">
          No matches found.
        </div>
      )}

      {results.map(contact => (
        <div
          key={contact.id}
          className="search-result-card"
          onClick={() => navigate(`/contacts/${contact.id}`)}
        >
          <h2>{contact.name}</h2>

          {contact.generalNotes && (
            <div className="search-section">
              <h4>General Notes</h4>

              <p>
                {highlight(contact.generalNotes, query)}
              </p>
            </div>
          )}

          {contact.matchingNotes?.length > 0 && (
            <div className="search-section">

              <h4>Matching Notes</h4>

              {contact.matchingNotes.map(note => (
                <div
                  key={note.id}
                  className="matching-note"
                >
                  <small>
                    {new Date(note.timestamp).toLocaleDateString()}
                  </small>

                  <p>
                    {highlight(note.text, query)}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>
      ))}

    </div>
  );
}