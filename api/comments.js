// GET  /api/comments?listId=ID -> { comments: [ { comment_text, user, date } ] }
// POST /api/comments  { listId, text, authorName, type } -> { id }
//
// Updates are stored as ClickUp List comments, prefixed with a type emoji and
// the author name: `<emoji> [author]\n<text>`.

const { cu, readBody, cors } = require('../lib/clickup')

const TYPE_EMOJI = { general: '📋', block: '🔴', good: '✅', status: '🔄' }

module.exports = async (req, res) => {
  cors(res, 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const listId = req.query?.listId || new URL(req.url, 'http://x').searchParams.get('listId')
      if (!listId) return res.status(400).json({ error: 'listId required' })
      const data = await cu(`/list/${listId}/comment`)
      return res.status(200).json({ comments: data.comments || [] })
    }

    if (req.method === 'POST') {
      const body = await readBody(req)
      const { listId, text } = body
      if (!listId || !text) return res.status(400).json({ error: 'listId and text required' })
      const emoji = TYPE_EMOJI[body.type] || TYPE_EMOJI.general
      const author = (body.authorName || 'הנהלה').trim()
      const comment_text = `${emoji} [${author}]\n${text}`
      const data = await cu(`/list/${listId}/comment`, { method: 'POST', body: JSON.stringify({ comment_text, notify_all: false }) })
      return res.status(200).json({ id: data.id || data.comment?.id || true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(e.code === 'NO_TOKEN' ? 500 : (e.status || 500)).json({ error: e.message, details: e.body })
  }
}
