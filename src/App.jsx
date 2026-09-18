import React, { useState } from 'react';
import Header from './components/Header';
import AgentPlayground from './components/AgentPlayground';
import ToolsDirectory from './components/ToolsDirectory';
import ExecutionLogs from './components/ExecutionLogs';
import { DEFAULT_GEMINI_KEY } from './services/agentEngine';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('playground'); // 'playground' | 'tools' | 'logs'
  const [apiKey] = useState(DEFAULT_GEMINI_KEY);
  const [selectedModel, setSelectedModel] = useState('gemini-3.6-flash');
  const [logs, setLogs] = useState([]);

  const handleSaveExecutionLog = (logEntry) => {
    setLogs((prev) => [logEntry, ...prev]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'playground' && (
          <AgentPlayground
            apiKey={apiKey}
            selectedModel={selectedModel}
            onSaveExecutionLog={handleSaveExecutionLog}
          />
        )}

        {activeTab === 'tools' && <ToolsDirectory />}

        {activeTab === 'logs' && (
          <ExecutionLogs logs={logs} onClearLogs={handleClearLogs} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Agent Tool Studio — Powered by Open Public APIs</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Tools: Open-Meteo • Frankfurter • USGS</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
