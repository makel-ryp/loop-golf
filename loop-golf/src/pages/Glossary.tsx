import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { GLOSSARY, type GlossaryCategory } from '../data/glossary'

const CATEGORIES: { value: GlossaryCategory | 'all'; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'scoring',   label: 'Scoring' },
  { value: 'swing',     label: 'Swing' },
  { value: 'rules',     label: 'Rules' },
  { value: 'course',    label: 'Course' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'etiquette', label: 'Etiquette' },
  { value: 'strategy',  label: 'Strategy' },
]

const CATEGORY_COLORS: Record<GlossaryCategory, string> = {
  scoring:   'bg-blue-100 text-blue-700',
  swing:     'bg-purple-100 text-purple-700',
  rules:     'bg-amber-100 text-amber-700',
  course:    'bg-green-100 text-green-700',
  equipment: 'bg-orange-100 text-orange-700',
  etiquette: 'bg-pink-100 text-pink-700',
  strategy:  'bg-teal-100 text-teal-700',
}

export default function Glossary() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<GlossaryCategory | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return GLOSSARY.filter(entry => {
      const matchesCat = category === 'all' || entry.category === category
      const matchesQ   = !q || entry.term.toLowerCase().includes(q) || entry.definition.toLowerCase().includes(q)
      return matchesCat && matchesQ
    })
  }, [query, category])

  // Group by first letter
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const entry of filtered) {
      const letter = entry.term[0].toUpperCase()
      const arr = map.get(letter) ?? []
      arr.push(entry)
      map.set(letter, arr)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <div className="px-5 pt-10 pb-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <button
          onClick={() => navigate('/learn')}
          className="p-1.5 -ml-1.5 rounded-lg hover:bg-black/5 transition-colors"
          aria-label="Back"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4l-5 5 5 5" stroke="#111" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="font-sans font-semibold text-2xl text-ryp-black tracking-tight">Glossary</h1>
      </div>
      <p className="text-sm text-ryp-mid mb-5 ml-8">{GLOSSARY.length} terms to know before you tee off.</p>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 opacity-35" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="#111" strokeWidth="1.5" />
          <path d="M10 10l3 3" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search terms..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-black/10 rounded-xl text-sm placeholder:text-black/30 focus:outline-none focus:ring-1 focus:ring-ryp-green"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              category === cat.value
                ? 'bg-ryp-black text-white'
                : 'bg-white border border-black/10 text-ryp-mid hover:border-black/25'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Term count */}
      {(query || category !== 'all') && (
        <p className="text-xs text-ryp-mid mb-4">{filtered.length} term{filtered.length !== 1 ? 's' : ''}</p>
      )}

      {/* Grouped list */}
      {grouped.length === 0 ? (
        <p className="text-sm text-ryp-mid text-center py-10">No terms match your search.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(([letter, entries]) => (
            <div key={letter}>
              <div className="text-xs font-semibold text-ryp-mid tracking-widest uppercase mb-2 pl-1">{letter}</div>
              <div className="flex flex-col divide-y divide-black/5 bg-white rounded-xl border border-black/8 overflow-hidden">
                {entries.map(entry => (
                  <button
                    key={entry.term}
                    onClick={() => setExpanded(expanded === entry.term ? null : entry.term)}
                    className="w-full text-left px-4 py-3 hover:bg-black/[0.02] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-ryp-black">{entry.term}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[entry.category]}`}>
                          {entry.category}
                        </span>
                      </div>
                      <svg
                        width="14" height="14" viewBox="0 0 14 14" fill="none"
                        className={`shrink-0 opacity-40 transition-transform ${expanded === entry.term ? 'rotate-90' : ''}`}
                      >
                        <path d="M5 3l4 4-4 4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {expanded === entry.term && (
                      <p className="text-sm text-ryp-mid leading-relaxed mt-2 pr-4">{entry.definition}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
