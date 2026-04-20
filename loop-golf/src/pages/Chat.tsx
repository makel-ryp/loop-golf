import { useState, useRef } from 'react'
import { useUserData } from '../context/UserDataContext'
import type { UserProfile, QuizResult, ClubMetric } from '../utils/firestoreHelpers'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function buildSystemPrompt(
  profile: UserProfile | null,
  quiz: QuizResult | null,
  metrics: ClubMetric[]
): string {
  const lines: string[] = [
    "You are a friendly, encouraging golf coach inside Loop — a beginner-focused golf app made by Ryp Golf.",
    "Your job is to help new golfers learn, feel confident, and improve at their own pace.",
    "Keep answers concise, warm, and jargon-free unless you're explaining a term. Always be positive.",
    "",
    "## User context",
  ]

  if (profile) {
    lines.push(`- Name: ${profile.name}`)
    lines.push(`- Experience level: ${profile.golfLevel}`)
    lines.push(`- Years playing: ${profile.yearsExperience}`)
    if (profile.handicap !== null) lines.push(`- Handicap: ${profile.handicap}`)
    if (profile.projectedDrivingDistance) lines.push(`- Projected driving distance: ${profile.projectedDrivingDistance} yds`)
    if (profile.goals?.length) lines.push(`- Goals: ${profile.goals.join(', ')}`)
  } else {
    lines.push("- Profile not yet set up")
  }

  if (quiz) {
    lines.push(`- Golf IQ score: ${quiz.golfIQ}/100`)
    if (quiz.actionTags?.length) lines.push(`- Focus areas from quiz: ${quiz.actionTags.join(', ')}`)
  } else {
    lines.push("- Golf IQ quiz not yet completed")
  }

  if (metrics.length > 0) {
    lines.push("")
    lines.push("## Latest practice session (key clubs)")
    const top = [...metrics].sort((a, b) => b.shots - a.shots).slice(0, 6)
    for (const m of top) {
      lines.push(
        `- ${m.displayName}: avg carry ${Math.round(m.carryDistance)} yds, ` +
        `miss ${Math.round(m.avgMissYards)} yds ${m.missDirection}, ` +
        `${m.shots} shots`
      )
    }
  } else {
    lines.push("")
    lines.push("## Practice data: no sessions uploaded yet")
  }

  lines.push("")
  lines.push("Reference their data naturally when it's relevant. If they ask about something not in their data, answer generally as a coach.")

  return lines.join('\n')
}

const SUGGESTED_QUESTIONS = [
  "What should I focus on first?",
  "How do I stop topping the ball?",
  "What's a good score for a beginner?",
  "How do I know which club to use?",
]

export default function Chat() {
  const { profile, quiz, metrics, loading: dataLoading } = useUserData()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const systemPrompt = buildSystemPrompt(profile, quiz, metrics)

  function scrollToBottom() {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || sending || dataLoading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const newHistory = [...messages, userMsg]
    setMessages([...newHistory, { role: 'assistant', content: '' }])
    setInput('')
    setSending(true)
    scrollToBottom()

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          stream: true,
          system: systemPrompt,
          messages: newHistory,
        }),
      })

      if (!res.ok) {
        const body = await res.text()
        throw new Error(`API ${res.status}: ${body}`)
      }
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        // Keep the last (potentially incomplete) line in the buffer
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (!data || data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
              accumulated += parsed.delta.text
              setMessages([...newHistory, { role: 'assistant', content: accumulated }])
              scrollToBottom()
            }
          } catch { /* ignore malformed SSE line */ }
        }
      }
    } catch (err) {
      console.error('Chat error:', err)
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setMessages([...newHistory, {
        role: 'assistant',
        content: `Sorry, I couldn't connect to the coach. (${msg})`,
      }])
    } finally {
      setSending(false)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] max-w-lg mx-auto">
      {/* Header */}
      <div className="px-5 pt-10 pb-4 shrink-0">
        <h1 className="font-sans font-semibold text-2xl text-ryp-black tracking-tight mb-0.5">Coach</h1>
        <p className="text-sm text-ryp-mid">Ask anything about your game.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-2">
        {isEmpty && dataLoading && (
          <div className="flex items-center justify-center pt-16">
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-ryp-mid animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {isEmpty && !dataLoading && (
          <div className="flex flex-col items-center pt-6 pb-4 gap-5">
            <div className="w-16 h-16 rounded-2xl bg-ryp-black flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 10a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H10l-4 3V10z"
                  stroke="#00AF51" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-ryp-mid text-center max-w-xs leading-relaxed">
              Your personal golf coach. Ask about your swing, the rules, or what to work on next.
            </p>
            <div className="flex flex-col gap-2 w-full">
              {SUGGESTED_QUESTIONS.map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="text-left px-4 py-3 bg-white border border-black/8 rounded-xl text-sm text-ryp-black hover:border-ryp-green/40 hover:bg-ryp-green/5 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 py-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-ryp-black text-white rounded-br-sm'
                  : 'bg-white border border-black/8 text-ryp-black rounded-bl-sm'
              }`}>
                {msg.content || (
                  <span className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-ryp-mid animate-bounce inline-block"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-4 py-3 bg-ryp-off-white border-t border-black/8">
        <div className="flex items-center gap-2 bg-white border border-black/10 rounded-2xl px-4 py-2.5 focus-within:ring-1 focus-within:ring-ryp-green transition-all">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
            placeholder={dataLoading ? "Loading your profile..." : "Ask your coach..."}
            disabled={dataLoading}
            className="flex-1 bg-transparent text-sm text-ryp-black placeholder:text-black/30 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || sending || dataLoading}
            className="w-8 h-8 rounded-xl bg-ryp-black flex items-center justify-center shrink-0 disabled:opacity-30 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 12V2M2 7l5-5 5 5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
