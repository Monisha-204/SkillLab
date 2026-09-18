import React from 'react';
import { Bot, Wrench, Activity, Cpu } from 'lucide-react';
import { AVAILABLE_MODELS } from '../services/agentEngine';

export default function Header({
  activeTab,
  setActiveTab,
  selectedModel,
  setSelectedModel
}) {

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-700 shadow-md shadow-indigo-500/20">
              <Bot className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-slate-900 tracking-tight">Gemini Agent Tool Studio</h1>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'playground'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Agent Playground</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'tools'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Tools Directory & Docs</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'logs'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span className="hidden md:inline">Execution Logs</span>
            </button>
          </nav>

          {/* Right Utilities (Model Selector & API Key) */}
          <div className="flex items-center gap-2">
            
            {/* Model Selector */}
            <div className="relative hidden lg:block">
              <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                <Cpu className="w-3.5 h-3.5 text-purple-600" />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer py-0.5"
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-white text-slate-900">
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
