export interface Supplement {
  id: string;
  name: string;
  category: SupplementCategory;
  description: string;
  benefits: Benefit[];
  ingredients: Ingredient[];
  dosage: DosageInfo;
  scientificReferences: ScientificReference[];
  contraindications: string[];
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

export interface Benefit {
  title: string;
  description: string;
  strength: 'weak' | 'moderate' | 'strong' | 'very-strong';
  scientificReferences: string[];
  targetPopulation: string[];
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  purpose: string;
  scientificReferences: string[];
}

export interface DosageInfo {
  recommended: string;
  timing: string;
  duration: string;
  notes: string;
}

export interface ScientificReference {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  url: string;
  studyType: 'meta-analysis' | 'rct' | 'cohort' | 'case-control' | 'systematic-review';
  sampleSize: number;
  keyFindings: string[];
  relevanceScore: number; // 1-10 scale
}

export enum SupplementCategory {
  VITAMINS = 'vitamins',
  MINERALS = 'minerals',
  PROTEIN = 'protein',
  OMEGA3 = 'omega3',
  PROBIOTICS = 'probiotics',
  ANTIOXIDANTS = 'antioxidants',
  SPORTS_NUTRITION = 'sports-nutrition',
  COGNITIVE = 'cognitive',
  JOINT_HEALTH = 'joint-health',
  HEART_HEALTH = 'heart-health'
}

export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: ActivityLevel;
  primaryGoals: HealthGoal[];
  currentSupplements: string[];
  medicalConditions: string[];
  medications: string[];
  allergies: string[];
  dietType: DietType;
  budget: BudgetRange;
  preferences: UserPreferences;
}

export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHTLY_ACTIVE = 'lightly-active',
  MODERATELY_ACTIVE = 'moderately-active',
  VERY_ACTIVE = 'very-active',
  EXTREMELY_ACTIVE = 'extremely-active'
}

export enum HealthGoal {
  MUSCLE_GAIN = 'muscle-gain',
  WEIGHT_LOSS = 'weight-loss',
  ENDURANCE = 'endurance',
  STRENGTH = 'strength',
  RECOVERY = 'recovery',
  IMMUNE_SUPPORT = 'immune-support',
  COGNITIVE_FUNCTION = 'cognitive-function',
  HEART_HEALTH = 'heart-health',
  BONE_HEALTH = 'bone-health',
  SKIN_HEALTH = 'skin-health',
  SLEEP_QUALITY = 'sleep-quality',
  ENERGY_LEVELS = 'energy-levels'
}

export enum DietType {
  OMNIVORE = 'omnivore',
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  KETO = 'keto',
  PALEO = 'paleo',
  MEDITERRANEAN = 'mediterranean',
  GLUTEN_FREE = 'gluten-free',
  DAIRY_FREE = 'dairy-free'
}

export enum BudgetRange {
  LOW = 'low', // $0-25/month
  MEDIUM = 'medium', // $25-75/month
  HIGH = 'high', // $75-150/month
  PREMIUM = 'premium' // $150+/month
}

export interface UserPreferences {
  pillSize: 'small' | 'medium' | 'large';
  frequency: 'daily' | 'weekly' | 'as-needed';
  form: 'capsules' | 'tablets' | 'powder' | 'liquid' | 'gummies';
  organic: boolean;
  thirdPartyTested: boolean;
  allergenFree: boolean;
}

export interface Recommendation {
  supplement: Supplement;
  confidence: number; // 0-100
  reasoning: string[];
  scientificEvidence: ScientificReference[];
  personalizedDosage: string;
  timing: string;
  expectedBenefits: string[];
  timeline: string;
  alternatives: Supplement[];
}
