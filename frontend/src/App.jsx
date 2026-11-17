
import { useState } from 'react';
import './App.css';

// Convert the parser output into rows of stitches
function formatChartData(parsedArray) {
  const rows = [];
  let stitches = [];

  for (const item of parsedArray) {
    if (item === "#" || item === " ") {
      // Save stitch colors
      stitches.push(item);
    } else if (typeof item === "number") {
      // A row number marks the end of a row
      rows.push({
        rowNumber: item,
        stitches: stitches.reverse()
      });

      stitches = [];
    }
  }

  return rows;
}
function PatternChart({ parsedArray }) {
  const rows = formatChartData(parsedArray);

  return (
    <div className="pattern-chart">
      {rows.map((row) => (
        <div key={row.rowNumber} className="chart-row">
          <span className="row-number">{row.rowNumber}</span>

          {row.stitches.map((stitch, index) => (
            <div
              key={index}
              className="chart-cell"
              style={{
                backgroundColor: stitch === "#" ? "#4A7C59" : "#FFFFFF",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
function App() {
  const [patternInput, setPatternInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const result = await fetch('http://localhost:8000/api/pattern', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instructions: patternInput,
        }),
      });

      if (!result.ok) {
        throw new Error('Failed to send pattern.');
      }

      const data = await result.json();
      setResponse(data);
      if (data.success && Array.isArray(data.parsed_array)) {
  console.log("Formatted chart data:", formatChartData(data.parsed_array));
}

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mosaic Knitting Converter</h1>
      </header>

      <main className="app-main">
        <div className="workspace">
          <section className="workspace-panel">
            <h2>Pattern Editor</h2>

            <div className="pattern-input">
              <label htmlFor="pattern-text">
                Pattern Instructions
              </label>

              <textarea
                id="pattern-text"
                placeholder="Row 1: With Color A, k1, sl1, k1..."
                value={patternInput}
                onChange={(event) => setPatternInput(event.target.value)}
                rows={12}
              />
            </div>

            <button
              type="button"
              className="generate-button"
              onClick={handleGenerate}
              disabled={!patternInput.trim() || loading}
            >
              {loading ? 'Generating...' : 'Generate Chart'}
            </button>
          </section>

          <section className="workspace-panel preview-panel">
            <h2>Chart Preview</h2>

            
            <div className="chart-placeholder">
              {error && <p role="alert">{error}</p>}

              {response && response.success ? (
                <div>
                  <p>Pattern received successfully!</p>
                  <PatternChart parsedArray={response.parsed_array} />
                  {Array.isArray(response.parsed_array) ? (
                    <div>
                      <p>Received {response.parsed_array.length} parsed items from the backend.</p>

                      <details>
                        <summary>Parser output array</summary>
                        <pre>{JSON.stringify(response.parsed_array, null, 2)}</pre>
                      </details>

                      <details>
                        <summary>Formatted chart output</summary>
                        <pre>{response.chart_string}</pre>
                      </details>
                    </div>
                  ) : (
                    <p>Parsed chart data is not available.</p>
                  )}

                  <details>
                    <summary>Original pattern instructions</summary>
                    <pre>{response.instructions}</pre>
                  </details>
                </div>
              ) : response && !response.success ? (
                <div>
                  <p>Failed to generate chart!</p>
                  <pre>{response.instructions}</pre>
                </div>
              ) : (
                !error && <p>Your generated chart will appear here.</p>
              )}
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
