import React, { useState } from 'react';
import { Key, Shield, Eye, EyeOff, Save, Check, RotateCcw } from 'lucide-react';
import { DEFAULT_GEMINI_KEY } from '../services/agentEngine';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSaveKey }) {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveKey(inputKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefault = () => {
    setInputKey(DEFAULT_GEMINI_KEY);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Gemini API Key Settings</h3>
            <p className="text-xs text-slate-500">
              Manage your Google Gemini API Key for agent function execution
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>API Key</span>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-indigo-600 hover:text-indigo-800 text-[11px] underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Restore Default Key
              </button>
            </label>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter Gemini API Key..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 space-y-1 leading-relaxed">
            <div className="font-bold flex items-center gap-1 text-indigo-950">
              <Shield className="w-3.5 h-3.5 text-indigo-600" /> Key Pre-configured
            </div>
            <p className="text-indigo-800">
              The app is initialized with your provided Gemini API key. Keys are processed strictly client-side to make direct requests to Google's official Gemini endpoint.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Key Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
