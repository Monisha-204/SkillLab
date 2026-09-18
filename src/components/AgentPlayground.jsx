import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  AlertCircle,
  Clock,
  Wrench,
  Copy,
  Check,
  MapPin,
  Sun,
  Wind,
  DollarSign,
  Activity,
  Layers,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { runAgentLoop, stripMarkdownSymbols } from '../services/agentEngine';
import { METADATA_TOOLS } from '../services/tools';

const SAMPLE_PROMPTS = [
  {
    title: 'Weather & Air Quality in Tokyo',
    prompt: 'What is the current weather and air quality in Tokyo right now?',
    category: 'Weather + AQI',
    toolsExpected: ['get_coordinates', 'get_weather', 'get_air_quality'],
    icon: Sun
  },
  {
    title: 'USD to EUR + Paris Weather',
    prompt: 'If I have $250 USD, how much EUR is that, and what is the current weather in Paris?',
    category: 'Currency + Weather',
    toolsExpected: ['convert_currency', 'get_coordinates', 'get_weather'],
    icon: DollarSign
  },
  {
    title: 'San Francisco AQI + Recent Earthquakes',
    prompt: 'Show me recent earthquakes above magnitude 4.0 worldwide, and check the air quality in San Francisco.',
    category: 'Earthquakes + AQI',
    toolsExpected: ['get_recent_earthquakes', 'get_coordinates', 'get_air_quality'],
    icon: Activity
  },
  {
    title: 'London vs New York Comparison',
    prompt: 'Compare the weather, air quality, and exchange rate between London (GBP) and New York (USD).',
    category: 'Multi-Location Multi-Tool',
    toolsExpected: ['get_coordinates', 'get_weather', 'get_air_quality', 'convert_currency'],
    icon: Layers
  }
];

export default function AgentPlayground({ apiKey, selectedModel, onSaveExecutionLog }) {
  const [prompt, setPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSelectSample = (samplePrompt) => {
    setPrompt(samplePrompt);
    setError(null);
  };

  const handleRunAgent = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isExecuting) return;

    setIsExecuting(true);
    setError(null);
    setResult(null);

    try {
      const agentResult = await runAgentLoop({
        prompt: prompt.trim(),
        apiKey,
        model: selectedModel
      });

      setResult(agentResult);
      if (onSaveExecutionLog) {
        onSaveExecutionLog({
          prompt,
          timestamp: new Date().toISOString(),
          toolsUsed: agentResult.toolsUsed,
          durationMs: agentResult.totalDurationMs,
          stepsCount: agentResult.steps.length,
          model: selectedModel
        });
      }
    } catch (err) {
      console.error('Agent execution error:', err);
      setError(err.message || 'Failed to execute agent prompt.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyAnswer = () => {
    if (!result?.answer) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getToolMeta = (toolId) => {
    return METADATA_TOOLS.find((t) => t.id === toolId) || {
      name: toolId,
      category: 'External API',
      apiProvider: 'Public API',
      color: 'indigo',
      iconName: 'Wrench'
    };
  };

  const renderToolIcon = (toolId) => {
    switch (toolId) {
      case 'get_coordinates':
        return <MapPin className="w-4 h-4 text-emerald-600" />;
      case 'get_weather':
        return <Sun className="w-4 h-4 text-amber-600" />;
      case 'get_air_quality':
        return <Wind className="w-4 h-4 text-teal-600" />;
      case 'convert_currency':
        return <DollarSign className="w-4 h-4 text-indigo-600" />;
      case 'get_recent_earthquakes':
        return <Activity className="w-4 h-4 text-rose-600" />;
      default:
        return <Wrench className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner / Hero Intro */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Autonomous Multi-Tool Agent</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Ask Anything — The Agent Selects & Executes Tools Automatically
          </h2>
          <p className="mt-1 text-slate-600 text-xs sm:text-sm leading-relaxed">
            Type your question below. The Gemini agent evaluates your query, calls the required real-time APIs (Geocoding, Weather, Air Quality, Currency, Earthquakes), and provides a comprehensive response.
          </p>
        </div>
      </div>

      {/* Preset Prompt Shortcuts */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Sample Prompts to Try
          </h3>
          <span className="text-xs text-slate-500">{SAMPLE_PROMPTS.length} Presets Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_PROMPTS.map((sample, idx) => {
            const IconComponent = sample.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample.prompt)}
                disabled={isExecuting}
                className="text-left p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 shadow-sm transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 mb-1">
                    <IconComponent className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span>{sample.category}</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium line-clamp-2 leading-snug">
                    "{sample.prompt}"
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1 text-[10px] text-slate-500 font-medium">
                  <span>Tools:</span>
                  {sample.toolsExpected.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                      {t.replace('get_', '').replace('convert_', '')}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Prompt Input Form */}
      <form onSubmit={handleRunAgent} className="space-y-4">
        <div className="relative rounded-2xl bg-white border border-slate-300 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-md">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here... (e.g. 'What is the current weather and air quality in Tokyo, and convert 500 JPY to USD?')"
            disabled={isExecuting}
            className="w-full bg-transparent px-4 py-3.5 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none resize-none font-sans"
          />

          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="font-mono">{prompt.length} chars</span>
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="text-slate-600 hover:text-slate-900 text-xs underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> Clear Input
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isExecuting || !prompt.trim()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
                isExecuting || !prompt.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 active:scale-95'
              }`}
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Agent Thinking & Executing Tools...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute Agent</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Execution Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Execution Error</h4>
            <p className="text-xs leading-relaxed text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* AGENT OUTPUT — GIVEN RIGHT BELOW THE INPUT BOX (AS REQUESTED) */}
      {result && result.answer && (
        <div className="space-y-4">
          
          {/* Main Agent Answer Card */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 via-slate-50 to-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Agent Answer</h3>
                  <p className="text-xs text-indigo-700 font-semibold">
                    Synthesized from live data tools
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500 hidden sm:flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {result.totalDurationMs}ms
                </span>
                <button
                  onClick={handleCopyAnswer}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-all shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{copied ? 'Copied!' : 'Copy Answer'}</span>
                </button>
              </div>
            </div>

            <div className="p-6 text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans space-y-4">
              {stripMarkdownSymbols(result.answer)}
            </div>
          </div>

          {/* SINGLE DIV BOX FOR ALL TOOLS USED (AS REQUESTED) */}
          {result.toolsUsed && result.toolsUsed.length > 0 && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      Tools Used for This Task
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-mono font-bold">
                        {result.toolsUsed.length} {result.toolsUsed.length === 1 ? 'Tool' : 'Tools'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      The agent automatically selected and executed these live APIs for your prompt
                    </p>
                  </div>
                </div>
              </div>

              {/* Clean tool badges div container - no raw arguments or responses */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {result.toolsUsed.map((toolId) => {
                  const meta = getToolMeta(toolId);
                  return (
                    <div
                      key={toolId}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm text-xs font-semibold text-slate-900"
                    >
                      {renderToolIcon(toolId)}
                      <span className="text-slate-900 font-bold">{meta.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-600 font-mono font-medium">
                        {meta.apiProvider || 'Public API'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
