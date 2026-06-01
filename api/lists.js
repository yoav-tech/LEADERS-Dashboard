// GET  /api/lists            -> { lists: [ { id, name, rawContent, goal, dim, priority, ownerId, ownerName, status, startDate, dueDate, updateDue } ] }
// PATCH /api/lists  { listId, ...meta } -> { ok: true }
//
// Project metadata is round-tripped through the ClickUp list description
// (content), stored after an `LDRS-META:` line as JSON. The text before that
// line is preserved as the human-readable description (rawContent).

const { cu, readBody, cors, msToISO } = require('../lib/clickup')

const FOLDER_ID = '901516138381' // 📊 פרויקטים — הנהלה

const META_KEYS = ['goal', 'dim', 'priority', 'ownerId', 'ownerName', 'status', 'startDate', 'dueDate', 'updateDue']
const MARKER = 'LDRS-META:'

function parseContent(content) {
  const c = String(content || '')
  const idx = c.indexOf(MARKER)
  const meta = {}
  let rawContent = c
  if (idx !== -1) {
    rawContent = c.slice(0, idx).trim()
    const jsonStr = c.slice(idx + MARKER.length).trim()
    try {
      const parsed = JSON.parse(jsonStr)
      for (const k of META_KEYS) if (parsed[k] != null) meta[k] = parsed[k]
    } catch { /* ignore malformed meta */ }
  }
  return { rawContent, meta }
}

function buildContent(rawContent, meta) {
  const clean = {}
  for (const k of META_KEYS) clean[k] = meta[k] == null ? '' : meta[k]
  return `${(rawContent || '').trim()}\n\n${MARKER}${JSON.stringify(clean)}`
}

module.exports = async (req, res) => {
  cors(res, 'GET, PATCH, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const folder = await cu(`/folder/${FOLDER_ID}/list?archived=false`)
      const lists = folder.lists || []
      // Fetch each list individually to reliably get its `content`.
      const detailed = await Promise.all(lists.map(async (l) => {
        let content = l.content || ''
        try { const full = await cu(`/list/${l.id}`); content = full.content || content } catch { /* keep */ }
        const { rawContent, meta } = parseContent(content)
        return {
          id: l.id,
          name: l.name,
          rawContent,
          goal: meta.goal || '',
          dim: meta.dim || '',
          priority: meta.priority || '',
          ownerId: meta.ownerId || '',
          ownerName: meta.ownerName || '',
          status: meta.status || 'planning',
          startDate: meta.startDate || '',
          dueDate: meta.dueDate || '',
          updateDue: meta.updateDue || '',
        }
      }))
      return res.status(200).json({ lists: detailed })
    }

    if (req.method === 'PATCH') {
      const body = await readBody(req)
      const { listId } = body
      if (!listId) return res.status(400).json({ error: 'listId required' })
      // Preserve the existing human description (text before the meta marker).
      let rawContent = ''
      try { const full = await cu(`/list/${listId}`); rawContent = parseContent(full.content).rawContent } catch { /* none */ }
      const meta = {}
      for (const k of META_KEYS) meta[k] = body[k] == null ? '' : body[k]
      await cu(`/list/${listId}`, { method: 'PUT', body: JSON.stringify({ content: buildContent(rawContent, meta) }) })
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(e.code === 'NO_TOKEN' ? 500 : (e.status || 500)).json({ error: e.message, details: e.body })
  }
}

module.exports.msToISO = msToISO
