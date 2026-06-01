// GET  /api/tasks?listId=ID  -> { tasks: [ ClickUp task ] }
// POST /api/tasks  { listId, name, goal, dim, ownerId, teamIds[], startDate, dueDate, updateDue, status } -> created task { id, linkedLists }
//
// New tasks embed goal/dimension/update markers in the description, assign the
// owner + collaborators, and are best-effort tagged "הנהלה".

const { cu, readBody, cors, dateToMs } = require('../lib/clickup')

const MGMT_TAG = 'הנהלה'

function buildDescription({ goal, dim, updateDue }) {
  const lines = []
  if (goal) lines.push(`📌 מטרה: ${goal}`)
  if (dim) lines.push(`📊 ממד: ${dim}`)
  if (updateDue) lines.push(`🔄 מועד עדכון סטטוס: ${updateDue}`)
  return lines.join('\n')
}

module.exports = async (req, res) => {
  cors(res, 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const listId = req.query?.listId || new URL(req.url, 'http://x').searchParams.get('listId')
      if (!listId) return res.status(400).json({ error: 'listId required' })
      const data = await cu(`/list/${listId}/task?subtasks=true&include_closed=true&order_by=created`)
      return res.status(200).json({ tasks: data.tasks || [] })
    }

    if (req.method === 'POST') {
      const body = await readBody(req)
      const { listId, name } = body
      if (!listId || !name) return res.status(400).json({ error: 'listId and name required' })

      const assignees = []
      if (body.ownerId) assignees.push(Number(body.ownerId))
      ;(body.teamIds || []).forEach((id) => { const n = Number(id); if (n && !assignees.includes(n)) assignees.push(n) })

      const payload = {
        name,
        description: buildDescription(body),
        assignees,
        tags: [MGMT_TAG],
      }
      const start = dateToMs(body.startDate)
      const due = dateToMs(body.dueDate)
      if (start) { payload.start_date = start; payload.start_date_time = false }
      if (due) { payload.due_date = due; payload.due_date_time = false }
      if (body.status) payload.status = body.status

      let task
      try {
        task = await cu(`/list/${listId}/task`, { method: 'POST', body: JSON.stringify(payload) })
      } catch (e) {
        // Status or tag may be invalid for this list — retry without them.
        delete payload.status
        delete payload.tags
        task = await cu(`/list/${listId}/task`, { method: 'POST', body: JSON.stringify(payload) })
        // Best-effort add the management tag separately.
        try { await cu(`/task/${task.id}/tag/${encodeURIComponent(MGMT_TAG)}`, { method: 'POST' }) } catch { /* ignore */ }
      }

      return res.status(200).json({ id: task.id, linkedLists: 0 })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(e.code === 'NO_TOKEN' ? 500 : (e.status || 500)).json({ error: e.message, details: e.body })
  }
}
