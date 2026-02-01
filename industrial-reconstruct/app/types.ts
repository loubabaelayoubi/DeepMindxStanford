export interface ProcessOverview {
    process_name: string;
    role: string;
    system_type: string;
    goal: string;
    assumptions: string[];
}

export interface Step {
    step: number;
    title: string;
    instruction: string;
}

export interface ChecksAndRisks {
    checks: string[];
    risks: string[];
}

export interface LoomScriptItem {
    step: number;
    narration: string;
    focus: string;
}

export interface ReconstructionResult {
    process_overview: ProcessOverview;
    steps: Step[];
    checks_and_risks: ChecksAndRisks;
    execution_checklist: string[];
    loom_script: LoomScriptItem[];
}
