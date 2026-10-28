
import { useState } from 'react';
import './App.css';

function App() {
  const [patternInput, setPatternInput] = useState('');

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
              disabled={!patternInput.trim()}
            >
              Generate Chart
            </button>
          </section>

          <section className="workspace-panel preview-panel">
            <h2>Chart Preview</h2>

            <div className="chart-placeholder">
              <p>Your generated chart will appear here.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
