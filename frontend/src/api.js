// Backend base URL. Override with VITE_API_URL in frontend/.env if needed.
export const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function request(path, options) {
  let response
  try {
    response = await fetch(`${API}${path}`, options)
  } catch {
    throw new Error('Could not reach the backend. Check that it is running.')
  }

  if (!response.ok) {
    let detail = ''
    try {
      detail = (await response.json()).detail
    } catch {
      // response had no JSON body
    }
    throw new Error(
      typeof detail === 'string' && detail
        ? detail
        : `Request failed (${response.status})`
    )
  }

  return response.json()
}

export const getJSON = (path) => request(path)
export const postJSON = (path) => request(path, { method: 'POST' })
