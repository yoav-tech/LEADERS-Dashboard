// Shared ClickUp helpers for the Management Projects Hub serverless functions.
// Token is read from the Vercel project env under several common names so a
// redeploy of the existing project inherits whatever name was already set.

const BASE = 'https://api.clickup.com/api/v2'

function token() {
  return (
    process.env.CLICKUP_API_KEY ||
    process.env.CLICKUP_TOKEN ||
    process.env.CLICKUP_PERSONAL_TOKEN ||
    process.env.CLICKUP_API_TOKEN ||
    process.env.CLICKUP_PK ||
    ''
  )
}

async function cu(path, options = {}) {
  const tk = token()
  if (!tk) {
    const err = new Error('ClickUp token not configured (set CLICKUP_API_KEY in Vercel env).')
    err.code = 'NO_TOKEN'
    throw err
  }
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      Authorization: tk,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const text = await res.text()
  let json
  try { json = text ? JSON.parse(text) : {} } catch { json = { raw: text } }
  if (!res.ok) {
    const err = new Error((json && (json.err || json.error)) || `ClickUp ${res.status}`)
    err.status = res.status
    err.body = json
    throw err
  }
  return json
}

// Read JSON body across Vercel Node runtime variations.
async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body) { try { return JSON.parse(req.body) } catch { return {} } }
  const chunks = []
  for await (const c of req) chunks.push(c)
  if (!chunks.length) return {}
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { return {} }
}

function cors(res, methods) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', methods)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

// YYYY-MM-DD -> epoch ms (noon UTC to avoid TZ day-shift). Empty -> null.
function dateToMs(iso) {
  if (!iso) return null
  const [y, m, d] = String(iso).split('-').map(Number)
  if (!y || !m || !d) return null
  return Date.UTC(y, m - 1, d, 12, 0, 0)
}
function msToISO(ms) {
  if (!ms) return ''
  return new Date(parseInt(ms)).toISOString().slice(0, 10)
}

module.exports = { BASE, token, cu, readBody, cors, dateToMs, msToISO }
