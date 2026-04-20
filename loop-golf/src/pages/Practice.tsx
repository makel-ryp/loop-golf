import { useState, useRef } from 'react'

export default function Practice() {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setFileName(file.name)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  return (
    <div className="px-5 pt-10 pb-4 max-w-lg mx-auto">
      <h1 className="font-sans font-semibold text-2xl text-ryp-black tracking-tight mb-1">Practice</h1>
      <p className="text-sm text-ryp-mid mb-7">Upload your GSPRO session to see your numbers club-by-club.</p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-xl py-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors mb-6
          ${dragging ? 'border-ryp-green bg-ryp-green-tint' : 'border-black/15 hover:border-ryp-green hover:bg-ryp-green-tint/50'}`}
      >
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M18 4v20M10 12l8-8 8 8" stroke={dragging ? '#00AF51' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 28h24" stroke={dragging ? '#00AF51' : '#aaa'} strokeWidth="2" strokeLinecap="round" />
        </svg>
        {fileName ? (
          <span className="text-sm font-medium text-ryp-green">{fileName}</span>
        ) : (
          <>
            <span className="text-sm font-medium text-ryp-black">Drop your GSPRO .csv here</span>
            <span className="text-xs text-ryp-mid">or tap to browse</span>
          </>
        )}
      </div>

      {/* Placeholder stat cards — replace with real data from csvParser + shotAnalyzer */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-medium tracking-widest uppercase text-ryp-mid mb-1">Your clubs</p>
        {['Driver', '3-Wood', '7-Iron', 'Pitching Wedge'].map((club) => (
          <div key={club} className="bg-white border border-black/8 rounded-xl px-5 py-4 flex items-center justify-between opacity-40">
            <span className="text-sm font-medium text-ryp-black">{club}</span>
            <div className="flex gap-6 text-right">
              <div>
                <p className="text-[10px] text-ryp-mid">Carry</p>
                <p className="text-sm font-semibold text-ryp-black">— yds</p>
              </div>
              <div>
                <p className="text-[10px] text-ryp-mid">Miss</p>
                <p className="text-sm font-semibold text-ryp-black">—</p>
              </div>
            </div>
          </div>
        ))}
        <p className="text-xs text-ryp-mid text-center mt-3">Upload a session to see your real data.</p>
      </div>
    </div>
  )
}
