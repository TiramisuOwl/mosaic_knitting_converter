
import { useState } from 'react';
import './App.css';
import { formatChartData } from './utils/formatChartData';

// Display the parsed pattern as a visual knitting chart
function PatternChart({ parsedArray, colorA, colorB }) {
  const rows = formatChartData(parsedArray);

  return (
    <div className="pattern-chart">
      {[...rows].reverse().map((row) => (
        <div key={row.rowNumber} className="chart-row">
          {row.stitches.map((stitch, index) => (
            <div
              key={index}
              className="chart-cell"
              style={{
                backgroundColor: stitch === '#' ? colorA : colorB,
              }}
            />
          ))}

          <span className="row-number">{row.rowNumber}</span>
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
  // Custom colors for the knitting chart
  const [colorA, setColorA] = useState('#4A7C59');
  const [colorB, setColorB] = useState('#FFFFFF');

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
              {error ? (
                <p role="alert">{error}</p>
              ) : response?.success && Array.isArray(response.parsed_array) ? (
                <PatternChart
                  parsedArray={response.parsed_array}
                  colorA={colorA}
                  colorB={colorB}
                />
              ) : response && !response.success ? (
                <p role="alert">{response.instructions}</p>
              ) : response?.success ? (
                <p>Chart data is not available.</p>
              ) : loading ? (
                <p>Generating chart...</p>
              ) : (
                <p>Your generated chart will appear here.</p>
              )}
            </div>
            <div className="pattern-colors">
              <h3>Pattern Colors</h3>

              <div className="color-picker-group">
                <label htmlFor="color-a">Color A</label>
                <input
                  id="color-a"
                  type="color"
                  value={colorA}
                  onChange={(event) => setColorA(event.target.value)}
                />

                <label htmlFor="color-b">Color B</label>
                <input
                  id="color-b"
                  type="color"
                  value={colorB}
                  onChange={(event) => setColorB(event.target.value)}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
