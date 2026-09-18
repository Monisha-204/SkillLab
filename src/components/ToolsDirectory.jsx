import React, { useState } from 'react';
import {
  Wrench,
  MapPin,
  Sun,
  Wind,
  DollarSign,
  Activity,
  ExternalLink,
  Play,
  Clock,
  Layers,
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import { METADATA_TOOLS, TOOL_HANDLER_MAP } from '../services/tools';

export default function ToolsDirectory() {
  const [selectedToolId, setSelectedToolId] = useState(METADATA_TOOLS[0].id);
  const [testInputs, setTestInputs] = useState({
    get_coordinates: { city: 'Tokyo' },
    get_weather: { latitude: 35.6762, longitude: 139.6503, location_name: 'Tokyo' },
    get_air_quality: { latitude: 37.7749, longitude: -122.4194, location_name: 'San Francisco' },
    convert_currency: { amount: 100, from_currency: 'USD', to_currency: 'EUR,GBP,JPY' },
    get_recent_earthquakes: { min_magnitude: 4.5, days_back: 3, limit: 5 }
  });

  const [testResults, setTestResults] = useState({});
  const [testLoading, setTestLoading] = useState({});
  const [testError, setTestError] = useState({});

  const activeTool = METADATA_TOOLS.find((t) => t.id === selectedToolId) || METADATA_TOOLS[0];

  const handleInputChange = (toolId, paramName, value) => {
    setTestInputs((prev) => ({
      ...prev,
      [toolId]: {
        ...prev[toolId],
        [paramName]: value
      }
    }));
  };

  const handleRunManualTest = async (toolId) => {
    setTestLoading((prev) => ({ ...prev, [toolId]: true }));
    setTestError((prev) => ({ ...prev, [toolId]: null }));
    const startTime = Date.now();

    try {
      const handler = TOOL_HANDLER_MAP[toolId];
      const args = testInputs[toolId] || {};
      const result = await handler(args);
      const latency = Date.now() - startTime;

      setTestResults((prev) => ({
        ...prev,
        [toolId]: { result, latency, timestamp: new Date().toLocaleTimeString() }
      }));
    } catch (err) {
      setTestError((prev) => ({ ...prev, [toolId]: err.message }));
    } finally {
      setTestLoading((prev) => ({ ...prev, [toolId]: false }));
    }
  };

  const renderToolIcon = (iconName) => {
    switch (iconName) {
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-emerald-600" />;
      case 'SunCloud':
        return <Sun className="w-5 h-5 text-amber-600" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-teal-600" />;
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-indigo-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-rose-600" />;
      default:
        return <Wrench className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-semibold mb-2">
            <Wrench className="w-3.5 h-3.5 text-purple-600" />
            <span>Comprehensive Tool Documentation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Tools Provided to the Agent
          </h2>

        </div>
      </div>

      {/* Summary Comparison Matrix Table */}
      {/* <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" /> Tools Comparison Matrix
          </h3>
          <span className="text-xs text-slate-500 font-medium">5 Live Tools Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] font-mono border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Tool Name</th>
                <th className="py-3.5 px-4 font-bold">API Provider</th>
                <th className="py-3.5 px-4 font-bold">API Key Needed?</th>
                <th className="py-3.5 px-4 font-bold">Data Returned</th>
                <th className="py-3.5 px-4 font-bold">Difficulty</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {METADATA_TOOLS.map((tool) => (
                <tr
                  key={tool.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    selectedToolId === tool.id ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                    {renderToolIcon(tool.iconName)}
                    <span>{tool.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">
                    {tool.apiProvider}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> No (Free)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 text-xs">
                    {tool.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs border border-purple-200 font-semibold">
                      {tool.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedToolId(tool.id)}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-indigo-700 text-xs font-bold transition-all inline-flex items-center gap-1 border border-slate-200"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      {/* Main Detail & Interactive Sandbox Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar Tool Picker */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Select Tool to Test & Inspect
          </h3>
          <div className="space-y-2">
            {METADATA_TOOLS.map((t) => {
              const isSelected = selectedToolId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedToolId(t.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/10'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{renderToolIcon(t.iconName)}</div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.category}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Tool Documentation & Sandbox Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          {/* Header of Active Tool */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                {renderToolIcon(activeTool.iconName)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{activeTool.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
                    No API Key Required
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{activeTool.endpoint}</p>
              </div>
            </div>

            <a
              href={activeTool.endpoint}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
            >
              <span>Provider Spec</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tool Description & Functionality
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-medium">
              {activeTool.description}
            </p>
          </div>

          {/* Input Parameters Table */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Schema Input Parameters
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-mono uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-bold">Parameter</th>
                    <th className="py-2.5 px-3 font-bold">Type</th>
                    <th className="py-2.5 px-3 font-bold">Required</th>
                    <th className="py-2.5 px-3 font-bold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans text-slate-800">
                  {activeTool.parameters.map((param) => (
                    <tr key={param.name}>
                      <td className="py-2.5 px-3 font-mono text-indigo-700 font-bold">
                        {param.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-purple-700">{param.type}</td>
                      <td className="py-2.5 px-3">
                        {param.required ? (
                          <span className="text-rose-600 font-bold">Yes</span>
                        ) : (
                          <span className="text-slate-500">Optional</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Live Sandbox */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-600" /> Interactive Live Test Sandbox
              </h4>
              <span className="text-xs text-slate-500 font-medium">Direct API Execution</span>
            </div>

            {/* Test Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              {activeTool.parameters.map((param) => (
                <div key={param.name} className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>{param.name}</span>
                    {param.required && <span className="text-rose-600 text-[10px]">*required</span>}
                  </label>
                  <input
                    type={param.type === 'number' ? 'number' : 'text'}
                    step="any"
                    value={testInputs[activeTool.id]?.[param.name] ?? ''}
                    onChange={(e) =>
                      handleInputChange(
                        activeTool.id,
                        param.name,
                        param.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                      )
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleRunManualTest(activeTool.id)}
                disabled={testLoading[activeTool.id]}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md"
              >
                {testLoading[activeTool.id] ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing API Request...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute API Test</span>
                  </>
                )}
              </button>

              {testResults[activeTool.id]?.latency && (
                <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>Response in {testResults[activeTool.id].latency}ms</span>
                </span>
              )}
            </div>

            {/* Error View */}
            {testError[activeTool.id] && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {testError[activeTool.id]}
              </div>
            )}

            {/* Live API JSON Output */}
            {testResults[activeTool.id]?.result && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-500 font-bold">Live JSON Response:</span>
                <pre className="p-4 bg-slate-900 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800 max-h-72">
                  {JSON.stringify(testResults[activeTool.id].result, null, 2)}
                </pre>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
