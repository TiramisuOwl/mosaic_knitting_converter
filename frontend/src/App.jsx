
import { useState } from 'react';
import './App.css';

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

              {response ? (
                <div>
                  <p>Pattern received successfully!</p>
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
