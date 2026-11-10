import { useState } from 'react'
import { postJSON } from '../api'

// Shown when the backend has no battery/charging rows yet.
function DemoDataPrompt({ onDone }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function seed() {
    setBusy(true)
    setError('')
    try {
      await postJSON('/seed-demo-data')
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fleet-card" style={{ textAlign: 'center', padding: 40 }}>
      <h4>NO DATA YET</h4>
      <p>
        The backend has no battery or charging records. Generate sample data
        for your existing vehicles to get started.
      </p>
      <button
        className="primary-button"
        onClick={seed}
        disabled={busy}
        type="button"
      >
        {busy ? 'Generating…' : 'Generate demo data'}
      </button>
      {error && <p style={{ color: '#963f4a' }}>{error}</p>}
    </div>
  )
}

export default DemoDataPrompt
