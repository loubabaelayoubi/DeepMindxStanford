"use client";

import { useState } from "react";
import { ReconstructionResult } from "@/app/types";
import { Check, Copy, Download, Video, List, AlertTriangle, FileText, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OutputSection({ data }: { data: ReconstructionResult }) {
    const [activeTab, setActiveTab] = useState<keyof typeof tabs>("overview");

    const tabs = {
        overview: { label: "Overview", icon: Activity },
        steps: { label: "SOP Steps", icon: List },
        checklist: { label: "Checklist", icon: Check },
        risks: { label: "Risks & Checks", icon: AlertTriangle },
        loom: { label: "Loom Script", icon: Video },
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    const downloadMarkdown = () => {
        const md = `# ${data.process_overview.process_name}\n\n${data.steps.map(s => `## Step ${s.step}: ${s.title}\n${s.instruction}`).join('\n\n')}`;
        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sop.md';
        a.click();
    };

    return (
        <section className="min-h-screenw-full max-w-5xl mx-auto px-6 py-20" id="output">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Sidebar Tabs */}
                <div className="md:w-64 flex-shrink-0">
                    <div className="sticky top-32 space-y-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">Deliverables</h3>
                        {(Object.keys(tabs) as Array<keyof typeof tabs>).map((key) => {
                            const TabIcon = tabs[key].icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === key
                                            ? "bg-black text-white shadow-lg"
                                            : "text-gray-500 hover:text-black hover:bg-gray-50"
                                        }`}
                                >
                                    <TabIcon size={18} />
                                    {tabs[key].label}
                                </button>
                            );
                        })}

                        <div className="pt-8 px-4 space-y-3">
                            <button onClick={downloadMarkdown} className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-black transition-colors">
                                <Download size={14} /> Download .md
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
                        >
                            {activeTab === "overview" && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-3xl font-bold mb-2">{data.process_overview.process_name}</h2>
                                        <p className="text-gray-500 text-lg">{data.process_overview.goal}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Role</label>
                                            <p className="font-medium mt-1">{data.process_overview.role}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">System</label>
                                            <p className="font-medium mt-1">{data.process_overview.system_type}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold mb-3">Assumptions made</h3>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                                            {data.process_overview.assumptions.map((a, i) => (
                                                <li key={i}>{a}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === "steps" && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold">Standard Operating Procedure</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {data.steps.map((step) => (
                                            <div key={step.step} className="flex gap-4 group">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm mt-1">
                                                    {step.step}
                                                </div>
                                                <div className="pt-1">
                                                    <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                                                    <p className="text-gray-600 leading-relaxed">{step.instruction}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "checklist" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold">Execution Checklist</h2>
                                        <button onClick={() => copyToClipboard(data.execution_checklist.join('\n'))} className="text-xs flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">
                                            <Copy size={12} /> Copy
                                        </button>
                                    </div>
                                    <ul className="space-y-3">
                                        {data.execution_checklist.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-default">
                                                <div className="mt-0.5 w-5 h-5 rounded border border-gray-300 flex-shrink-0" />
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === "risks" && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-6">Checks & Risks</h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="flex items-center gap-2 font-bold mb-4 text-green-700">
                                                <Check size={18} /> Required Checks
                                            </h3>
                                            <ul className="space-y-2">
                                                {data.checks_and_risks.checks.map((c, i) => (
                                                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                                                        <span className="text-gray-300">•</span> {c}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="flex items-center gap-2 font-bold mb-4 text-red-600">
                                                <AlertTriangle size={18} /> Potential Risks
                                            </h3>
                                            <ul className="space-y-2">
                                                {data.checks_and_risks.risks.map((r, i) => (
                                                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                                                        <span className="text-gray-300">•</span> {r}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "loom" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold">Loom Walkthrough Script</h2>
                                        <button onClick={() => copyToClipboard(data.loom_script.map(s => s.narration).join('\n'))} className="text-xs flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">
                                            <Copy size={12} /> Copy Script
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {data.loom_script.map((item) => (
                                            <div key={item.step} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold bg-black text-white px-2 py-0.5 rounded-full">Step {item.step}</span>
                                                    <span className="text-xs text-gray-400 font-medium">Focus: {item.focus}</span>
                                                </div>
                                                <p className="text-lg font-medium text-gray-900">"{item.narration}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
