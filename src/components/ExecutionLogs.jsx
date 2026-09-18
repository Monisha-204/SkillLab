import React from 'react';
import { Activity, Clock, Wrench, Terminal, Trash2 } from 'lucide-react';
import { METADATA_TOOLS } from '../services/tools';

export default function ExecutionLogs({ logs = [], onClearLogs }) {
  const totalCalls = logs.length;
  const totalDuration = logs.reduce((acc, l) => acc + (l.durationMs || 0), 0);
  const avgDuration = totalCalls ? Math.round(totalDuration / totalCalls) : 0;

  // Tool usage counts
  const toolCounts = {};
  logs.forEach((log) => {
    (log.toolsUsed || []).forEach((t) => {
      toolCounts[t] = (toolCounts[t] || 0) + 1;
    });
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600" /> Agent Execution Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time performance metrics and invocation history
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        )}
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 uppercase font-mono font-bold">Total Agent Runs</span>
          <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>{totalCalls}</span>
            <span className="text-xs text-emerald-600 font-normal">Prompts</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 uppercase font-mono font-bold">Avg Latency</span>
          <div className="text-2xl font-black text-indigo-600 flex items-center gap-2">
            <span>{avgDuration}</span>
            <span className="text-xs text-slate-500 font-normal">ms / run</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 uppercase font-mono font-bold">Unique Tools Invoked</span>
          <div className="text-2xl font-black text-purple-600 flex items-center gap-2">
            <span>{Object.keys(toolCounts).length}</span>
            <span className="text-xs text-slate-500 font-normal">of 5 tools</span>
          </div>
        </div>
      </div>

      {/* Tool Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Wrench className="w-4 h-4 text-purple-600" /> Tool Invocation Distribution
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {METADATA_TOOLS.map((tool) => {
            const count = toolCounts[tool.id] || 0;
            return (
              <div
                key={tool.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{tool.name}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{tool.apiProvider}</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-mono text-xs font-bold border border-indigo-200">
                    {count} {count === 1 ? 'call' : 'calls'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-600" /> Historical Execution Trace
          </h3>
          <span className="text-xs text-slate-500 font-medium">{logs.length} Log Entries</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm space-y-2">
            <Activity className="w-8 h-8 text-slate-400 mx-auto" />
            <p>No agent executions recorded yet. Run a prompt in the Agent Playground!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {logs.map((log, index) => (
              <div key={index} className="p-4 hover:bg-slate-50 transition-colors space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                      #{logs.length - index}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-[10px] font-bold">
                      {log.model}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>{log.durationMs}ms</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-900 font-semibold">"{log.prompt}"</p>

                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-500">Tools:</span>
                  {(log.toolsUsed || []).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono text-[11px] font-bold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
