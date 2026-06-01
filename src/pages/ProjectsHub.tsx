/* ===== LDRS Projects Hub — page =====
   Recreated from the Claude Design handoff bundle (management/project/app.jsx).
   A refined, fully interactive RTL Hebrew management dashboard: company hero,
   category filters, strategic project cards, and a slide-over Tasks/Updates panel.
   The design-time Tweaks panel is omitted; its chosen defaults are baked into
   the stylesheet (indigo accent, warm theme, comfortable density, detailed cards). */
import { useEffect, useMemo, useState, type SVGProps } from 'react'
import {
  AV, CATS, STATUS, company, initials, projects,
  type CatKey, type Company, type Project, type StatusKey, type Task, type Update,
} from '@/data/projectsHub'
import '@/styles/projectsHub.css'

/* --- tiny inline icons --- */
const I = {
  search: (p: SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>,
  plus: (p: SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14" /></svg>,
  bell: (p: SVGProps<SVGSVGElement>) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>,
  grid: (p: SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>,
  rows: (p: SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><rect x="3" y="4" width="18" height="5" rx="2" /><rect x="3" y="15" width="18" height="5" rx="2" /></svg>,
  cal: (p: SVGProps<SVGSVGElement>) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>,
  check: (p: SVGProps<SVGSVGElement>) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5" /></svg>,
  list: (p: SVGProps<SVGSVGElement>) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>,
  arrow: (p: SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5M12 5l-7 7 7 7" /></svg>,
  close: (p: SVGProps<SVGSVGElement>) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>,
  spark: (p: SVGProps<SVGSVGElement>) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></svg>,
}

/* The shape the slide-over panel needs — projects satisfy it directly, and the
   company hero is adapted into it when opened. */
interface PanelItem {
  title: string
  cat: CatKey
  status: StatusKey
  owner: string
  progress: number
  nextDate: string
  goal?: string
  tasks?: Task[]
  updates?: Update[]
}

function Avatar({ name, cls = '' }: { name: string; cls?: string }) {
  return <div className={'avatar ' + cls} style={{ background: AV[name] || 'var(--muted)' }} title={name}>{initials(name)}</div>
}

function Progress({ v }: { v: number }) {
  return <div className="progress"><i style={{ width: v + '%' }} /></div>
}

/* ---------- Project card ---------- */
function ProjectCard({ p, minimal, showProgress, onOpen }: {
  p: Project; minimal: boolean; showProgress: boolean; onOpen: (p: PanelItem) => void
}) {
  const cat = CATS[p.cat], st = STATUS[p.status]
  return (
    <article className={'card' + (minimal ? ' minimal' : '')} onClick={() => onOpen(p)}>
      <span className="card-cat-bar" style={{ background: cat.color }} />
      <div className="card-top">
        <span className="cat-tag"><span className="dot" style={{ background: cat.color }} />{cat.he}</span>
        <span className="status"><span className="dot" style={{ background: st.color }} />{st.he}</span>
      </div>

      <div>
        <h3 className="card-title">{p.title}</h3>
        <div className="card-meta-row" style={{ marginTop: 10 }}>
          <span className="card-owner"><Avatar name={p.owner} />{p.owner}</span>
        </div>
      </div>

      {showProgress && !minimal && (
        <div className="prog-wrap">
          <div className="prog-label"><span>התקדמות</span><b>{p.progress}%</b></div>
          <Progress v={p.progress} />
        </div>
      )}

      <div className="card-foot">
        <span className="foot-item"><I.cal />{p.nextDate}</span>
        <span className="tasks-pill"><I.list />{p.openTasks > 0 ? `${p.openTasks} משימות פתוחות` : 'אין משימות פתוחות'}</span>
      </div>
    </article>
  )
}

/* ---------- Hero company card ---------- */
function Hero({ onOpen }: { onOpen: (p: PanelItem) => void }) {
  const c: Company = company
  return (
    <article className="hero">
      <div>
        <div className="hero-eyebrow"><span className="ring" />פרויקט חברה · משותף לכל ההנהלה</div>
        <h2 className="hero-title">{c.title}</h2>
        <p className="hero-desc">{c.desc}</p>
        <div className="prog-wrap" style={{ maxWidth: 360, marginBottom: 22 }}>
          <div className="prog-label"><span>התקדמות כוללת</span><b>{c.progress}%</b></div>
          <Progress v={c.progress} />
        </div>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => onOpen({ title: c.title, cat: 'ops', status: 'active', owner: 'דנה לוי', progress: c.progress, nextDate: c.nextDate, goal: c.nextMilestone, tasks: c.tasks, updates: c.updates })}>פתיחת פרטים ומשימות <I.arrow /></button>
          <button className="btn-ghost">שיתוף עדכון</button>
        </div>
      </div>
      <div className="hero-aside">
        <div className="hero-metric-row">
          <span className="k">צוות מוביל</span>
          <div className="avatars">
            {c.team.slice(0, 5).map((n) => <Avatar key={n} name={n} />)}
            {c.team.length > 5 && <div className="avatar more">+{c.team.length - 5}</div>}
          </div>
        </div>
        <div className="hero-metric-row"><span className="k">משימות פתוחות</span><span className="v">{c.openTasks}</span></div>
        <div className="hero-metric-row"><span className="k">אבן דרך הבאה</span><span className="v">{c.nextMilestone}</span></div>
        <div className="hero-metric-row"><span className="k">מועד</span><span className="v">{c.nextDate}</span></div>
        <div className="hero-metric-row"><span className="k">עודכן</span><span className="v" style={{ color: 'var(--st-active)' }}>{c.updatedAgo}</span></div>
      </div>
    </article>
  )
}

/* ---------- Slide-over panel ---------- */
function Panel({ project, onClose }: { project: PanelItem | null; onClose: () => void }) {
  const [tab, setTab] = useState<'tasks' | 'updates'>('tasks')
  const [tasks, setTasks] = useState<Task[]>([])
  const [draft, setDraft] = useState('')
  useEffect(() => {
    setTasks(project ? (project.tasks || []).map((t) => ({ ...t })) : [])
    setTab('tasks')
    setDraft('')
  }, [project])
  if (!project) return null
  const cat = CATS[project.cat], st = STATUS[project.status]
  const updates = project.updates || []
  const doneCount = tasks.filter((t) => t.done).length
  const toggle = (i: number) => setTasks((ts) => ts.map((t, j) => (j === i ? { ...t, done: !t.done } : t)))
  const add = () => {
    if (!draft.trim()) return
    setTasks((ts) => [...ts, { t: draft.trim(), done: false, who: project.owner, due: 'חדש' }])
    setDraft('')
  }

  return (
    <aside className="panel open" role="dialog" aria-modal="true">
      <div className="panel-head">
        <div className="panel-top">
          <div>
            <div className="panel-cat"><span className="dot" style={{ background: cat.color }} />{cat.he}<span style={{ color: 'var(--faint)' }}>·</span><span className="status" style={{ padding: '3px 9px' }}><span className="dot" style={{ background: st.color }} />{st.he}</span></div>
            <h2 className="panel-title">{project.title}</h2>
            {project.goal && <p className="panel-sub">{project.goal}</p>}
          </div>
          <button className="panel-close" onClick={onClose} aria-label="סגירה"><I.close /></button>
        </div>
        <div className="panel-stats">
          <div className="panel-stat"><div className="v">{project.progress}%</div><div className="k">התקדמות</div></div>
          <div className="panel-stat"><div className="v">{tasks.length - doneCount}</div><div className="k">משימות פתוחות</div></div>
          <div className="panel-stat"><div className="v">{project.nextDate}</div><div className="k">יעד הבא</div></div>
          <div className="panel-stat"><div className="v" style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Avatar name={project.owner} /></div><div className="k">{project.owner}</div></div>
        </div>
        <div className="tabs">
          <button className={'tab' + (tab === 'tasks' ? ' on' : '')} onClick={() => setTab('tasks')}>משימות<span className="badge">{tasks.length}</span></button>
          <button className={'tab' + (tab === 'updates' ? ' on' : '')} onClick={() => setTab('updates')}>עדכונים<span className="badge">{updates.length}</span></button>
        </div>
      </div>

      <div className="panel-body">
        {tab === 'tasks' && (
          tasks.length === 0 ? (
            <div className="empty-state">
              <div className="ico"><I.list /></div>
              <b>עוד אין משימות</b>
              הפרויקט בשלבי תכנון — הוסיפו את המשימה הראשונה כדי להתחיל לעקוב.
              <div className="add-task" style={{ maxWidth: 360, margin: '20px auto 0' }}>
                <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="משימה חדשה…" />
                <button onClick={add}>הוספה</button>
              </div>
            </div>
          ) : (
            <div>
              {tasks.map((t, i) => (
                <div key={i} className={'task' + (t.done ? ' done' : '')}>
                  <button className={'checkbox' + (t.done ? ' done' : '')} onClick={() => toggle(i)} aria-label="סימון"><I.check /></button>
                  <div className="task-main">
                    <div className="task-text">{t.t}</div>
                    <div className="task-meta"><Avatar name={t.who} /><span>{t.who}</span><span className="task-tag">{t.due}</span></div>
                  </div>
                </div>
              ))}
              <div className="add-task">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="הוספת משימה… (Enter)" />
                <button onClick={add}><I.plus /></button>
              </div>
            </div>
          )
        )}

        {tab === 'updates' && (
          updates.length === 0 ? (
            <div className="empty-state"><div className="ico"><I.spark /></div><b>אין עדכונים עדיין</b>שתפו את העדכון הראשון על הפרויקט.</div>
          ) : (
            <div>
              {updates.map((u, i) => (
                <div key={i} className="update">
                  <div className="update-line"><Avatar name={u.who} /><div className="stem" /></div>
                  <div className="update-body">
                    <span className="who">{u.who}</span><span className="when">{u.when}</span>
                    <div className="what">{u.what}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </aside>
  )
}

/* ---------- Page ---------- */
export function ProjectsHub() {
  const [filter, setFilter] = useState<'all' | CatKey>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [active, setActive] = useState<PanelItem | null>(null)
  const [now, setNow] = useState('')

  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length }
    for (const k in CATS) c[k] = projects.filter((p) => p.cat === k).length
    return c
  }, [])
  const visible = filter === 'all' ? projects : projects.filter((p) => p.cat === filter)

  const totalOpen = projects.reduce((s, p) => s + p.openTasks, 0) + company.openTasks
  const activeCount = projects.filter((p) => p.status === 'active').length
  const dueSoon = projects.filter((p) => /יוני/.test(p.nextDate)).length

  const today = new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="projects-hub" dir="rtl" lang="he">
      {/* top bar */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">LD</div>
          <div><div className="brand-name">LDRS</div><div className="brand-sub">הנהלה</div></div>
        </div>
        <div className="topbar-spacer" />
        <div className="topbar-actions">
          <div className="search"><I.search /><input placeholder="חיפוש פרויקט…" /></div>
          <button className="btn-primary"><I.plus />פרויקט חדש</button>
          <button className="icon-btn"><I.bell /></button>
          <span className="clock"><span className="clock-dot" />{now}</span>
          <Avatar name="דנה לוי" />
        </div>
      </header>

      <main className="page">
        <div className="page-head">
          <div>
            <h1 className="page-title">דשבורד פרויקטים</h1>
            <div className="page-date">{today}</div>
          </div>
          <div className="overview">
            <div className="stat"><div className="stat-num">{activeCount}<small> / {projects.length}</small></div><div className="stat-label"><span className="stat-dot" style={{ background: 'var(--st-active)' }} />פרויקטים פעילים</div></div>
            <div className="stat"><div className="stat-num">{totalOpen}</div><div className="stat-label"><span className="stat-dot" style={{ background: 'var(--accent)' }} />משימות פתוחות</div></div>
            <div className="stat"><div className="stat-num">{dueSoon}</div><div className="stat-label"><span className="stat-dot" style={{ background: 'var(--cat-clients)' }} />יעדים החודש</div></div>
          </div>
        </div>

        {/* filters */}
        <div className="filters">
          <button className={'chip' + (filter === 'all' ? ' active' : '')} onClick={() => setFilter('all')}>הכל<span className="count">{counts.all}</span></button>
          {(Object.entries(CATS) as [CatKey, typeof CATS[CatKey]][]).map(([k, c]) => (
            <button key={k} className={'chip' + (filter === k ? ' active' : '')} onClick={() => setFilter(k)}>
              <span className="dot" style={{ background: c.color }} />{c.he}<span className="count">{counts[k]}</span>
            </button>
          ))}
          <div className="filters-spacer" />
          <div className="view-toggle">
            <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')} aria-label="רשת"><I.grid /></button>
            <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')} aria-label="רשימה"><I.rows /></button>
          </div>
        </div>

        {/* hero */}
        {filter === 'all' && (
          <section className="section">
            <Hero onOpen={setActive} />
          </section>
        )}

        {/* strategic projects */}
        <section className="section">
          <div className="section-head">
            <span className="section-eyebrow">פרויקטים אסטרטגיים</span>
            <span style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 600 }}>{visible.length}</span>
            <span className="section-rule" />
          </div>
          <div className={'grid' + (view === 'list' ? ' list' : '')}>
            {visible.map((p) => (
              <ProjectCard key={p.id} p={p} minimal={false} showProgress={true} onOpen={setActive} />
            ))}
          </div>
        </section>
      </main>

      <div className={'scrim' + (active ? ' open' : '')} onClick={() => setActive(null)} />
      <Panel project={active} onClose={() => setActive(null)} />
    </div>
  )
}

export default ProjectsHub
