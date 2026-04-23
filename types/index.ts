export type SurveyKey = "estres-financiero" | "guiones-dinero";

export type LikertOption = {
  value: number;
  label: string;
};

export type Question = {
  id: number;
  text: string;
  dimension: string;
};

export type SurveyConfig = {
  key: SurveyKey;
  title: string;
  subtitle: string;
  description: string;
  options: LikertOption[];
  questions: Question[];
};

export type Answers = Record<number, number>;

export type DimensionResult = {
  dimension: string;
  score: number;
  interpretation: string;
};

export type StressResult = {
  total: number;
  level: string;
  dimensions: DimensionResult[];
  recommendations: string[];
  generatedAt: string;
};

export type ScriptResult = {
  dimensions: DimensionResult[];
  dominant: string;
  mixedProfile: boolean;
  recommendations: string[];
  generatedAt: string;
};
