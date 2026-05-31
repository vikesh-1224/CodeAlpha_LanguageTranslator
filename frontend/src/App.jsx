import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, Copy, Check, Volume2, Globe } from 'lucide-react';
import './index.css';

const LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese (Simplified)',
  ja: 'Japanese',
  ko: 'Korean',
  ar: 'Arabic',
  hi: 'Hindi',
  bho: 'Bhojpuri',
  ta: 'Tamil',
  te: 'Telugu',
  ml: 'Malayalam'
};

function App() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);

    try {
      // 1. Try our new custom backend
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          sourceLangName: LANGUAGES[sourceLang],
          targetLangName: LANGUAGES[targetLang]
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translatedText);
        setIsTranslating(false);
        return; // Success! Exit early.
      } else {
        console.warn("Backend failed, falling back to Free API...");
      }
    } catch (error) {
      console.warn("Backend not running or unreachable, falling back to Free API...", error);
    }

    // 2. Fallback to free public API if backend is down or fails
    try {
      const fallbackResponse = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${sourceLang}|${targetLang}`);
      const fallbackData = await fallbackResponse.json();

      if (fallbackData && fallbackData.responseData && fallbackData.responseData.translatedText) {
        setTranslatedText(`[Free API Mode] \n\n${fallbackData.responseData.translatedText}`);
      } else {
        setTranslatedText(`[Simulation Mode] API Error: Invalid response format. Translated to ${LANGUAGES[targetLang]}: ${sourceText}`);
      }
    } catch (e) {
      setTranslatedText(`[Simulation Mode] API Error: ${e.message}. Translated to ${LANGUAGES[targetLang]}: ${sourceText}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <header className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
          <Globe size={40} color="var(--primary)" />
          <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-1px' }}>
            Aero<span className="gradient-text">Translate</span> AI
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Break language barriers instantly with advanced AI-powered translation.
        </p>
      </header>

      <main className="glass-panel animate-fade-in" style={{ padding: '2rem', animationDelay: '0.2s', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <option key={`source-${code}`} value={code}>{name}</option>
              ))}
            </select>
          </div>

          <button className="btn-icon" onClick={swapLanguages} title="Swap Languages">
            <ArrowRightLeft size={20} />
          </button>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <option key={`target-${code}`} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Translation Areas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

          {/* Source Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <textarea
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={handleTranslate} disabled={isTranslating || !sourceText.trim()}>
                {isTranslating ? <Sparkles className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {isTranslating ? 'Translating...' : 'Translate'}
              </button>
            </div>
          </div>

          {/* Target Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <textarea
                placeholder="Translation will appear here..."
                value={translatedText}
                readOnly
                style={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderStyle: 'dashed'
                }}
              />
              {translatedText && (
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                  <button className="btn-icon" onClick={copyToClipboard} title="Copy translation">
                    {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      <footer style={{ marginTop: 'auto', padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Built with ❤️ By Vikesh Kumar Yadav</p>
      </footer>

    </div>
  );
}

export default App;
