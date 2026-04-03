import { useState, useCallback } from 'react'
import { Sun, Moon, Languages, Copy, Check, Download, Map, AlertCircle } from 'lucide-react'

const translations = {
  en: {
    title: 'Sitemap Generator',
    subtitle: 'Input a list of URLs, configure options, and generate an XML sitemap.',
    urlsLabel: 'URLs (one per line)',
    urlsPlaceholder: 'https://example.com/\nhttps://example.com/about\nhttps://example.com/contact',
    generate: 'Generate Sitemap',
    clear: 'Clear',
    copy: 'Copy XML',
    copied: 'Copied!',
    download: 'Download',
    defaultChangefreq: 'Default changefreq',
    defaultPriority: 'Default priority',
    lastmod: 'Include lastmod (today)',
    output: 'XML Sitemap Output',
    urlCount: 'URLs',
    noOutput: 'Enter URLs above and click "Generate Sitemap"',
    invalidUrls: 'Some URLs seem invalid and were skipped',
    changefreqOptions: { always: 'always', hourly: 'hourly', daily: 'daily', weekly: 'weekly', monthly: 'monthly', yearly: 'yearly', never: 'never' },
    builtBy: 'Built by',
  },
  pt: {
    title: 'Gerador de Sitemap',
    subtitle: 'Insira uma lista de URLs, configure as opcoes e gere um sitemap XML.',
    urlsLabel: 'URLs (uma por linha)',
    urlsPlaceholder: 'https://exemplo.com/\nhttps://exemplo.com/sobre\nhttps://exemplo.com/contato',
    generate: 'Gerar Sitemap',
    clear: 'Limpar',
    copy: 'Copiar XML',
    copied: 'Copiado!',
    download: 'Baixar',
    defaultChangefreq: 'Changefreq padrao',
    defaultPriority: 'Prioridade padrao',
    lastmod: 'Incluir lastmod (hoje)',
    output: 'Saida do Sitemap XML',
    urlCount: 'URLs',
    noOutput: 'Insira URLs acima e clique em "Gerar Sitemap"',
    invalidUrls: 'Algumas URLs parecem invalidas e foram ignoradas',
    changefreqOptions: { always: 'always', hourly: 'hourly', daily: 'daily', weekly: 'weekly', monthly: 'monthly', yearly: 'yearly', never: 'never' },
    builtBy: 'Criado por',
  }
} as const

type Lang = keyof typeof translations

function isValidUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}

function generateSitemap(urls: string[], changefreq: string, priority: string, includeLastmod: boolean): string {
  const today = new Date().toISOString().slice(0, 10)
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ]
  for (const url of urls) {
    lines.push('  <url>')
    lines.push(`    <loc>${url}</loc>`)
    if (includeLastmod) lines.push(`    <lastmod>${today}</lastmod>`)
    lines.push(`    <changefreq>${changefreq}</changefreq>`)
    lines.push(`    <priority>${priority}</priority>`)
    lines.push('  </url>')
  }
  lines.push('</urlset>')
  return lines.join('\n')
}

export default function SitemapGenerator() {
  const [lang, setLang] = useState<Lang>(() => navigator.language.startsWith('pt') ? 'pt' : 'en')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [changefreq, setChangefreq] = useState('weekly')
  const [priority, setPriority] = useState('0.5')
  const [includeLastmod, setIncludeLastmod] = useState(true)
  const [copied, setCopied] = useState(false)
  const [invalidCount, setInvalidCount] = useState(0)
  const [validCount, setValidCount] = useState(0)

  const t = translations[lang]

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark)
  }

  const handleGenerate = useCallback(() => {
    const lines = input.split('\n').map(l => l.trim()).filter(Boolean)
    const valid = lines.filter(isValidUrl)
    const invalid = lines.length - valid.length
    setInvalidCount(invalid)
    setValidCount(valid.length)
    if (!valid.length) return
    setOutput(generateSitemap(valid, changefreq, priority, includeLastmod))
  }, [input, changefreq, priority, includeLastmod])

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'application/xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'sitemap.xml'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const PRIORITIES = ['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1']

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <Map size={18} className="text-white" />
            </div>
            <span className="font-semibold">Sitemap Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/sitemap-generator" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
              <div className="space-y-2">
                <label className="font-semibold text-sm">{t.urlsLabel}</label>
                <textarea value={input} onChange={e => setInput(e.target.value)} rows={12} spellCheck={false}
                  placeholder={t.urlsPlaceholder}
                  className="w-full font-mono text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{t.defaultChangefreq}</label>
                  <select value={changefreq} onChange={e => setChangefreq(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {Object.keys(t.changefreqOptions).map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{t.defaultPriority}</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeLastmod} onChange={e => setIncludeLastmod(e.target.checked)} className="accent-teal-500 h-4 w-4" />
                <span className="text-sm">{t.lastmod}</span>
              </label>

              <div className="flex gap-2">
                <button onClick={handleGenerate} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-600 transition-colors">
                  <Map size={15} />{t.generate}
                </button>
                <button onClick={() => { setInput(''); setOutput(''); setInvalidCount(0); setValidCount(0) }}
                  className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">{t.clear}</button>
              </div>

              {invalidCount > 0 && (
                <div className="flex items-start gap-2 rounded-lg border border-yellow-300 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 text-xs text-yellow-700 dark:text-yellow-400">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />{invalidCount} {t.invalidUrls}
                </div>
              )}
            </div>

            {/* Output */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{t.output}</span>
                  {validCount > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">{validCount} {t.urlCount}</span>}
                </div>
                {output && (
                  <div className="flex gap-1.5">
                    <button onClick={handleCopy} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      {copied ? t.copied : t.copy}
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      <Download size={12} />{t.download}
                    </button>
                  </div>
                )}
              </div>

              {output ? (
                <textarea readOnly value={output} rows={20}
                  className="w-full font-mono text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 resize-none focus:outline-none" />
              ) : (
                <div className="flex items-center justify-center min-h-[20rem] rounded-lg bg-zinc-50 dark:bg-zinc-800/30 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 text-sm text-center px-4">
                  {t.noOutput}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-teal-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
