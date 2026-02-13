
export interface ATSAnalysis {
  keywords: string[];
  technologies: string[];
  priorities: string[];
  experienceLevel: string;
}

export interface CVAudit {
  strengths: string[];
  weaknesses: string[];
  inconsistencies: string[];
  missingMetrics: string[];
}

export interface Recommendation {
  title: string;
  strategicPoints: string[];
  bulletPointTips: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface FinalCV {
  optimizedTitle: string;
  professionalSummary: string;
  keySkills: string[];
  professionalExperience: Experience[];
  projects: string[];
  education: string[];
  toolsAndTech: string[];
}

export interface OptimizationResult {
  atsScore: number;
  atsAnalysis: ATSAnalysis;
  cvAudit: CVAudit;
  recommendations: Recommendation;
  advancedTips: string[];
  finalCV: FinalCV;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  result: OptimizationResult;
}

export type AppStage = 'INPUT' | 'LOADING' | 'RESULT' | 'HISTORY';
