
export interface SOPData {
  overview: {
    processName: string;
    role: string;
    systemType: string;
    goal: string;
  };
  steps: string[];
  risks: {
    check: string;
    risk: string;
  }[];
  checklist: string[];
  loomScript: {
    step: string;
    narration: string;
    focus: string;
  }[];
}

export interface AnalysisState {
  loading: boolean;
  error: string | null;
  result: SOPData | null;
  image: string | null;
}
