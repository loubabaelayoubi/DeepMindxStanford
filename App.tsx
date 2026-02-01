
import React, { useState, useCallback } from 'react';
import { analyzeIndustrialScreenshot } from './services/geminiService';
import { AnalysisState, SOPData } from './types';
import { 
  FileSearch, 
  ShieldAlert, 
  CheckCircle2, 
  Video, 
  ArrowRight, 
  Upload, 
  AlertCircle,
  Settings,
  ClipboardList,
  Loader2
} from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    error: null,
    result: null,
    image: null
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, image: reader.result as string, result: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!state.image) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await analyzeIndustrialScreenshot(state.image);
      setState(prev => ({ ...prev, loading: false, result: data }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, loading: false, error: 'Failed to analyze the artifact. Ensure the image is clear and try again.' }));
    }
  };

  const reset = () => {
    setState({ loading: false, error: null, result: null, image: null });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-1.5 rounded-md">
              <Settings className="w-5 h-5 text-slate-900" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Industrial <span className="text-amber-500">Reconstruct</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="hidden sm:inline border-r border-slate-800 pr-4 italic">v2.1 Industrial Operations</span>
            {state.image && (
              <button 
                onClick={reset}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Reset System
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8">
        {!state.image && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mb-6 border border-slate-700">
              <Upload className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Input Industrial Artifact</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Upload a screenshot from a legacy ERP, MES, or QMS system. Our engine will reconstruct the underlying procedural workflow and generate execution-ready documentation.
            </p>
            <label className="group relative bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-4 rounded-xl font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95">
              <span>Select System Screenshot</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <p className="mt-4 text-xs text-slate-500 uppercase tracking-widest">Supports PNG, JPG, JPEG</p>
          </div>
        )}

        {state.image && !state.result && !state.loading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <div className="p-4 bg-slate-900 flex items-center justify-between border-b border-slate-700">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Previewing Industrial Source</span>
              </div>
              <img src={state.image} alt="Artifact" className="w-full max-h-[500px] object-contain bg-black" />
              <div className="p-6 bg-slate-900/80 backdrop-blur-sm flex justify-center">
                <button 
                  onClick={runAnalysis}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-10 py-4 rounded-xl font-bold transition-all flex items-center gap-2 group shadow-xl shadow-amber-500/10"
                >
                  Initiate Reconstruction
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {state.loading && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Analyzing Procedural Logic...</h3>
              <p className="text-slate-400 animate-pulse font-mono text-sm uppercase">Mapping UI anchors & industrial context</p>
            </div>
          </div>
        )}

        {state.error && (
          <div className="max-w-xl mx-auto bg-red-500/10 border border-red-500/50 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h4 className="font-bold text-red-500 mb-1">Processing Fault</h4>
              <p className="text-red-200/70 text-sm">{state.error}</p>
              <button onClick={reset} className="mt-4 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300">Try Again</button>
            </div>
          </div>
        )}

        {state.result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Column: Overview & Steps */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview Section */}
              <section className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileSearch className="w-6 h-6 text-amber-500" />
                  <h2 className="text-xl font-bold">Process Reconstruction Overview</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Process Name</label>
                    <p className="text-lg font-medium text-slate-200">{state.result.overview.processName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Operational Role</label>
                    <p className="text-lg font-medium text-slate-200">{state.result.overview.role}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Source System Type</label>
                    <p className="text-lg font-medium text-slate-200">{state.result.overview.systemType}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Strategic Goal</label>
                    <p className="text-lg font-medium text-slate-200">{state.result.overview.goal}</p>
                  </div>
                </div>
              </section>

              {/* Step-by-step Section */}
              <section className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <ClipboardList className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold">Procedural Workflow (SOP)</h2>
                </div>
                <div className="space-y-4">
                  {state.result.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center font-mono text-sm text-slate-300 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1 pb-4 border-b border-slate-800 group-last:border-0">
                        <p className="text-slate-300 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Loom Script Section */}
              <section className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Video className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold">Loom Walkthrough Script</h2>
                </div>
                <div className="space-y-6">
                  {state.result.loomScript.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-tighter">Segment {idx + 1}</span>
                        <span className="text-xs italic text-slate-500">Target Focus: {item.focus}</span>
                      </div>
                      <p className="text-slate-200 italic mb-2">"{item.narration}"</p>
                      <div className="text-[10px] uppercase font-mono text-slate-500 bg-slate-800 px-2 py-1 inline-block rounded">
                        Action: {item.step}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Risks & Checklist */}
            <div className="space-y-8">
              {/* Risks & Checks Section */}
              <section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                  <h2 className="text-xl font-bold text-red-100">Compliance & Risks</h2>
                </div>
                <div className="space-y-4">
                  {state.result.risks.map((r, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Risk Identification
                      </div>
                      <div className="pl-3.5 border-l border-red-500/30">
                        <p className="text-sm font-semibold text-slate-200 mb-1">{r.check}</p>
                        <p className="text-xs text-red-200/60 leading-normal">{r.risk}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Execution Checklist */}
              <section className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <h2 className="text-xl font-bold text-emerald-100">Field Checklist</h2>
                </div>
                <div className="space-y-3">
                  {state.result.checklist.map((item, idx) => (
                    <label key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 cursor-pointer hover:bg-emerald-500/20 transition-colors border border-transparent hover:border-emerald-500/30 group">
                      <input type="checkbox" className="mt-1 accent-emerald-500 rounded border-emerald-500/50 bg-slate-900" />
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item}</span>
                    </label>
                  ))}
                </div>
                <button 
                  onClick={() => window.print()}
                  className="w-full mt-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700"
                >
                  Generate PDF Handout
                </button>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; 2024 Industrial Systems Reconstruction Engine. Process identification based on visual inference only.
          </p>
          <div className="flex gap-6 text-xs font-mono uppercase tracking-widest text-slate-600">
            <span>Safety First</span>
            <span>Compliance Verified</span>
            <span>ISO 9001 Compatible</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
