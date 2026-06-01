/* ===== LDRS Projects Hub — sample data (Hebrew) =====
   Ported from the Claude Design handoff bundle (management/project/data.js).
   Realistic placeholder content — swap in real projects/owners/dates as needed. */

export type CatKey = 'revenue' | 'product' | 'people' | 'ops' | 'clients'
export type StatusKey = 'active' | 'plan' | 'hold' | 'done'

export interface CatDef { he: string; color: string }
export interface StatusDef { he: string; color: string }

export interface Task {
  t: string
  done: boolean
  who: string
  due: string
}

export interface Update {
  who: string
  when: string
  what: string
}

export interface Project {
  id: string
  title: string
  cat: CatKey
  status: StatusKey
  owner: string
  progress: number
  nextDate: string
  openTasks: number
  updatedAgo: string
  goal: string
  tasks: Task[]
  updates: Update[]
}

export interface Company {
  id: string
  title: string
  desc: string
  progress: number
  team: string[]
  openTasks: number
  nextMilestone: string
  nextDate: string
  updatedAgo: string
  tasks: Task[]
  updates: Update[]
}

export const CATS: Record<CatKey, CatDef> = {
  revenue: { he: 'הכנסות', color: 'var(--cat-revenue)' },
  product: { he: 'מוצר', color: 'var(--cat-product)' },
  people: { he: 'אנשים', color: 'var(--cat-people)' },
  ops: { he: 'תפעול', color: 'var(--cat-ops)' },
  clients: { he: 'לקוחות', color: 'var(--cat-clients)' },
}

export const STATUS: Record<StatusKey, StatusDef> = {
  active: { he: 'פעיל', color: 'var(--st-active)' },
  plan: { he: 'תכנון', color: 'var(--st-plan)' },
  hold: { he: 'בהמתנה', color: 'var(--st-hold)' },
  done: { he: 'הושלם', color: 'var(--st-done)' },
}

// avatar background hues (warm/cool spread)
export const AV: Record<string, string> = {
  'דנה לוי': 'oklch(0.6 0.13 25)',
  'יוסי כהן': 'oklch(0.55 0.12 250)',
  'מאיה גל': 'oklch(0.6 0.12 300)',
  'רון אבני': 'oklch(0.58 0.12 160)',
  'שירה פרץ': 'oklch(0.62 0.13 60)',
  'עידן מור': 'oklch(0.55 0.12 200)',
  'נועה ברק': 'oklch(0.6 0.13 350)',
  'אורי שמש': 'oklch(0.57 0.12 130)',
}

export function initials(name: string): string {
  const p = name.trim().split(/\s+/)
  return (p[0][0] + (p[1] ? p[1][0] : '')).trim()
}

export const company: Company = {
  id: 'company',
  title: 'פרויקט חברה',
  desc: 'מרחב העבודה המשותף לכל ההנהלה — יעדים רוחביים, החלטות מפתח ומשימות שנוגעות לכלל החברה.',
  progress: 64,
  team: ['דנה לוי', 'יוסי כהן', 'מאיה גל', 'רון אבני', 'שירה פרץ', 'עידן מור', 'נועה ברק'],
  openTasks: 9,
  nextMilestone: 'סקירת רבעון Q3',
  nextDate: '22 ביוני',
  updatedAgo: 'היום',
  tasks: [
    { t: 'סיכום יעדי Q3 מול ראשי המחלקות', done: true, who: 'דנה לוי', due: 'הושלם' },
    { t: 'גיבוש תקציב שיווק רבעוני', done: false, who: 'יוסי כהן', due: '18 ביוני' },
    { t: 'מצגת דירקטוריון', done: false, who: 'דנה לוי', due: '22 ביוני' },
    { t: 'עדכון מדיניות עבודה היברידית', done: false, who: 'עידן מור', due: '25 ביוני' },
  ],
  updates: [
    { who: 'דנה לוי', when: 'היום', what: 'נקבע מועד סקירת הרבעון ל-22 ביוני. כל ראשי המחלקות התבקשו להגיש סיכום עד ה-20.' },
    { who: 'יוסי כהן', when: 'לפני יומיים', what: 'תקציב השיווק לרבעון אושר עקרונית, ממתין לחתימה סופית.' },
  ],
}

export const projects: Project[] = [
  {
    id: 'mkt', title: 'שיווק לידרס', cat: 'revenue', status: 'active',
    owner: 'דנה לוי', progress: 68, nextDate: '15 ביוני', openTasks: 5, updatedAgo: 'לפני יומיים',
    goal: 'הגדלת לידים אורגניים ב-40% עד סוף הרבעון',
    tasks: [
      { t: 'השקת קמפיין רימרקטינג', done: true, who: 'דנה לוי', due: 'הושלם' },
      { t: 'אופטימיזציה לדפי נחיתה', done: false, who: 'דנה לוי', due: '10 ביוני' },
      { t: 'תכנון תוכן לחודש הבא', done: false, who: 'נועה ברק', due: '12 ביוני' },
      { t: 'דוח ביצועים למנכ"ל', done: false, who: 'דנה לוי', due: '15 ביוני' },
      { t: 'בחירת ספק וידאו', done: false, who: 'נועה ברק', due: '18 ביוני' },
    ],
    updates: [
      { who: 'דנה לוי', when: 'לפני יומיים', what: 'קמפיין הרימרקטינג עלה לאוויר — CTR ראשוני של 3.1%, מעל היעד.' },
      { who: 'נועה ברק', when: 'לפני 4 ימים', what: 'הושלמה בחירת שלושת הנושאים המרכזיים לתוכן הרבעון.' },
      { who: 'דנה לוי', when: 'לפני שבוע', what: 'הוגדרו יעדי הלידים מול מחלקת המכירות.' },
    ],
  },
  {
    id: 'comm', title: 'עמלות סוכנים', cat: 'revenue', status: 'active',
    owner: 'יוסי כהן', progress: 42, nextDate: '30 ביוני', openTasks: 8, updatedAgo: 'אתמול',
    goal: 'מודל עמלות חדש ושקוף שמתגמל ביצועים',
    tasks: [
      { t: 'מיפוי מבנה העמלות הקיים', done: true, who: 'יוסי כהן', due: 'הושלם' },
      { t: 'הגדרת מדרגות תגמול', done: false, who: 'יוסי כהן', due: '20 ביוני' },
      { t: 'אישור משפטי למודל', done: false, who: 'אורי שמש', due: '25 ביוני' },
      { t: 'תקשור לסוכנים', done: false, who: 'יוסי כהן', due: '30 ביוני' },
    ],
    updates: [
      { who: 'יוסי כהן', when: 'אתמול', what: 'הושלם מיפוי כל מסלולי העמלות — נמצאו 3 כפילויות לתיקון.' },
      { who: 'אורי שמש', when: 'לפני 5 ימים', what: 'התקבלה טיוטה ראשונית מהיועץ המשפטי.' },
    ],
  },
  {
    id: 'agent', title: 'Agent Leaders', cat: 'product', status: 'hold',
    owner: 'מאיה גל', progress: 25, nextDate: '10 ביולי', openTasks: 3, updatedAgo: 'לפני שבוע',
    goal: 'פלטפורמת ניהול לסוכנים עם דאשבורד ביצועים',
    tasks: [
      { t: 'אפיון מסכי הליבה', done: true, who: 'מאיה גל', due: 'הושלם' },
      { t: 'תיאום עם צוות הפיתוח', done: false, who: 'מאיה גל', due: 'ממתין' },
      { t: 'הגדרת תקציב פיתוח', done: false, who: 'אורי שמש', due: 'ממתין' },
    ],
    updates: [
      { who: 'מאיה גל', when: 'לפני שבוע', what: 'הפרויקט הוקפא זמנית עד לאישור התקציב לרבעון הבא.' },
      { who: 'מאיה גל', when: 'לפני שבועיים', what: 'הושלם אפיון UX למסכי הליבה.' },
    ],
  },
  {
    id: 'bestie', title: 'BestieAi', cat: 'product', status: 'active',
    owner: 'רון אבני', progress: 81, nextDate: '5 ביולי', openTasks: 6, updatedAgo: 'היום',
    goal: 'עוזר AI פנימי לצוותי התמיכה והמכירות',
    tasks: [
      { t: 'אינטגרציה עם בסיס הידע', done: true, who: 'רון אבני', due: 'הושלם' },
      { t: 'בדיקות משתמשים — סבב א׳', done: true, who: 'רון אבני', due: 'הושלם' },
      { t: 'שיפור דיוק תשובות', done: false, who: 'רון אבני', due: '28 ביוני' },
      { t: 'מסך הגדרות למנהל', done: false, who: 'מאיה גל', due: '1 ביולי' },
      { t: 'הכנת חומרי הדרכה', done: false, who: 'נועה ברק', due: '3 ביולי' },
      { t: 'השקה לצוות פיילוט', done: false, who: 'רון אבני', due: '5 ביולי' },
    ],
    updates: [
      { who: 'רון אבני', when: 'היום', what: 'סבב בדיקות המשתמשים הסתיים — שביעות רצון של 4.6/5. מתקדמים לשיפורי דיוק.' },
      { who: 'מאיה גל', when: 'לפני 3 ימים', what: 'עיצוב מסך ההגדרות אושר ועבר לפיתוח.' },
      { who: 'רון אבני', when: 'לפני שבוע', what: 'האינטגרציה עם בסיס הידע יציבה בסביבת הבדיקות.' },
    ],
  },
  {
    id: 'crm', title: 'CRM — Leaders #1', cat: 'ops', status: 'plan',
    owner: 'שירה פרץ', progress: 12, nextDate: '1 באוגוסט', openTasks: 0, updatedAgo: 'לפני 3 ימים',
    goal: 'מערכת CRM מאוחדת לכלל מחלקות החברה',
    tasks: [],
    updates: [
      { who: 'שירה פרץ', when: 'לפני 3 ימים', what: 'נפתח הפרויקט. בשלב איסוף דרישות מהמחלקות.' },
    ],
  },
  {
    id: 'hire', title: 'גיוס וצמיחת צוות', cat: 'people', status: 'plan',
    owner: 'עידן מור', progress: 8, nextDate: '20 ביולי', openTasks: 2, updatedAgo: 'לפני 5 ימים',
    goal: 'גיוס 6 תפקידי מפתח וחיזוק תהליך הקליטה',
    tasks: [
      { t: 'הגדרת פרופיל תפקידים', done: false, who: 'עידן מור', due: '15 ביולי' },
      { t: 'בחירת פלטפורמת גיוס', done: false, who: 'עידן מור', due: '20 ביולי' },
    ],
    updates: [
      { who: 'עידן מור', when: 'לפני 5 ימים', what: 'אושרו 6 תקנים חדשים לרבעון הקרוב.' },
    ],
  },
  {
    id: 'vip', title: 'מועדון לקוחות VIP', cat: 'clients', status: 'active',
    owner: 'נועה ברק', progress: 55, nextDate: '8 ביולי', openTasks: 4, updatedAgo: 'אתמול',
    goal: 'תוכנית נאמנות והטבות ללקוחות הגדולים',
    tasks: [
      { t: 'הגדרת קריטריונים לחברות', done: true, who: 'נועה ברק', due: 'הושלם' },
      { t: 'עיצוב חבילת הטבות', done: false, who: 'נועה ברק', due: '25 ביוני' },
      { t: 'בניית עמוד נחיתה ייעודי', done: false, who: 'דנה לוי', due: '1 ביולי' },
      { t: 'פיילוט עם 10 לקוחות', done: false, who: 'נועה ברק', due: '8 ביולי' },
    ],
    updates: [
      { who: 'נועה ברק', when: 'אתמול', what: 'הקריטריונים לחברות אושרו — 38 לקוחות עומדים בתנאי הסף.' },
      { who: 'דנה לוי', when: 'לפני 4 ימים', what: 'הוצגו שלושה כיווני עיצוב לחבילת ההטבות.' },
    ],
  },
]
