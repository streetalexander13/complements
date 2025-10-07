import { Injectable } from '@angular/core';
import { UserProfile, HealthGoal, ActivityLevel, Supplement, Recommendation, SupplementCategory } from '../models/supplement.model';
import { SupplementDataService } from './supplement-data.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  constructor(private supplementDataService: SupplementDataService) {}

  generateRecommendations(userProfile: UserProfile): Recommendation[] {
    const allSupplements = this.supplementDataService.getAllSupplements();
    const recommendations: Recommendation[] = [];

    // Core supplements based on age and activity level
    const coreSupplements = this.getCoreSupplements(userProfile);
    
    // Goal-specific supplements
    const goalSupplements = this.getGoalSpecificSupplements(userProfile);
    
    // Combine and score recommendations
    const candidateSupplements = [...coreSupplements, ...goalSupplements];
    const uniqueSupplements = this.removeDuplicates(candidateSupplements);

    for (const supplement of uniqueSupplements) {
      const recommendation = this.createRecommendation(supplement, userProfile);
      if (recommendation.confidence >= 60) { // Only include high-confidence recommendations
        recommendations.push(recommendation);
      }
    }

    // Sort by confidence score and return top 5
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  private getCoreSupplements(userProfile: UserProfile): Supplement[] {
    const supplements = this.supplementDataService.getAllSupplements();
    const core: Supplement[] = [];

    // Vitamin D for everyone (especially important for older adults)
    const vitaminD = supplements.find(s => s.id === 'vitamin-d3');
    if (vitaminD) core.push(vitaminD);

    // Omega-3 for cardiovascular health (especially important for older adults)
    if (userProfile.age >= 30) {
      const omega3 = supplements.find(s => s.id === 'omega-3-fish-oil');
      if (omega3) core.push(omega3);
    }

    // Probiotics for digestive health
    const probiotic = supplements.find(s => s.id === 'probiotic-complex');
    if (probiotic) core.push(probiotic);

    return core;
  }

  private getGoalSpecificSupplements(userProfile: UserProfile): Supplement[] {
    const supplements = this.supplementDataService.getAllSupplements();
    const goalSupplements: Supplement[] = [];

    for (const goal of userProfile.primaryGoals) {
      switch (goal) {
        case HealthGoal.MUSCLE_GAIN:
        case HealthGoal.STRENGTH:
          const creatine = supplements.find(s => s.id === 'creatine-monohydrate');
          const whey = supplements.find(s => s.id === 'whey-protein-isolate');
          if (creatine) goalSupplements.push(creatine);
          if (whey) goalSupplements.push(whey);
          break;

        case HealthGoal.ENDURANCE:
        case HealthGoal.RECOVERY:
          const wheyProtein = supplements.find(s => s.id === 'whey-protein-isolate');
          const omega3ForRecovery = supplements.find(s => s.id === 'omega-3-fish-oil');
          if (wheyProtein) goalSupplements.push(wheyProtein);
          if (omega3ForRecovery) goalSupplements.push(omega3ForRecovery);
          break;

        case HealthGoal.HEART_HEALTH:
          const omega3 = supplements.find(s => s.id === 'omega-3-fish-oil');
          if (omega3) goalSupplements.push(omega3);
          break;

        case HealthGoal.IMMUNE_SUPPORT:
          const probiotic = supplements.find(s => s.id === 'probiotic-complex');
          const vitaminDForImmune = supplements.find(s => s.id === 'vitamin-d3');
          if (probiotic) goalSupplements.push(probiotic);
          if (vitaminDForImmune) goalSupplements.push(vitaminDForImmune);
          break;

        case HealthGoal.BONE_HEALTH:
          const vitaminD = supplements.find(s => s.id === 'vitamin-d3');
          if (vitaminD) goalSupplements.push(vitaminD);
          break;

        case HealthGoal.COGNITIVE_FUNCTION:
        case HealthGoal.ENERGY_LEVELS:
          const omega3ForBrain = supplements.find(s => s.id === 'omega-3-fish-oil');
          if (omega3ForBrain) goalSupplements.push(omega3ForBrain);
          break;
      }
    }

    // Add sport-specific supplements based on activity level and sports
    const sportSpecificSupplements = this.getSportSpecificSupplements(userProfile);
    goalSupplements.push(...sportSpecificSupplements);

    return goalSupplements;
  }

  private getSportSpecificSupplements(userProfile: UserProfile): Supplement[] {
    const supplements = this.supplementDataService.getAllSupplements();
    const sportSupplements: Supplement[] = [];

    // Check if user has sports data (from the wizard form)
    const sports = (userProfile as any).sports || [];
    const trainingFrequency = (userProfile as any).trainingFrequency || '';
    const trainingIntensity = (userProfile as any).trainingIntensity || '';

    // Endurance sports need more recovery support
    const enduranceSports = ['running', 'cycling', 'swimming', 'hiking'];
    const hasEnduranceSports = sports.some((sport: string) => enduranceSports.includes(sport));
    
    if (hasEnduranceSports) {
      const omega3 = supplements.find(s => s.id === 'omega-3-fish-oil');
      const protein = supplements.find(s => s.id === 'whey-protein-isolate');
      if (omega3 && !sportSupplements.find(s => s.id === 'omega-3-fish-oil')) {
        sportSupplements.push(omega3);
      }
      if (protein && !sportSupplements.find(s => s.id === 'whey-protein-isolate')) {
        sportSupplements.push(protein);
      }
    }

    // Strength sports need creatine and protein
    const strengthSports = ['weightlifting', 'crossfit', 'climbing'];
    const hasStrengthSports = sports.some((sport: string) => strengthSports.includes(sport));
    
    if (hasStrengthSports) {
      const creatine = supplements.find(s => s.id === 'creatine-monohydrate');
      const protein = supplements.find(s => s.id === 'whey-protein-isolate');
      if (creatine && !sportSupplements.find(s => s.id === 'creatine-monohydrate')) {
        sportSupplements.push(creatine);
      }
      if (protein && !sportSupplements.find(s => s.id === 'whey-protein-isolate')) {
        sportSupplements.push(protein);
      }
    }

    // High training frequency or intensity needs more recovery support
    const isHighFrequency = trainingFrequency.includes('5-6') || trainingFrequency.includes('Daily');
    const isHighIntensity = trainingIntensity.includes('High') || trainingIntensity.includes('Elite');
    
    if (isHighFrequency || isHighIntensity) {
      const probiotic = supplements.find(s => s.id === 'probiotic-complex');
      if (probiotic && !sportSupplements.find(s => s.id === 'probiotic-complex')) {
        sportSupplements.push(probiotic);
      }
    }

    return sportSupplements;
  }

  private createRecommendation(supplement: Supplement, userProfile: UserProfile): Recommendation {
    let confidence = 50; // Base confidence
    const reasoning: string[] = [];
    const expectedBenefits: string[] = [];

    // Age-based scoring
    if (userProfile.age >= 50) {
      if (supplement.category === SupplementCategory.HEART_HEALTH) {
        confidence += 20;
        reasoning.push('Heart health becomes increasingly important with age');
      }
      if (supplement.category === SupplementCategory.VITAMINS) {
        confidence += 15;
        reasoning.push('Nutrient absorption decreases with age');
      }
    }

    // Activity level scoring
    if (userProfile.activityLevel === ActivityLevel.VERY_ACTIVE || 
        userProfile.activityLevel === ActivityLevel.EXTREMELY_ACTIVE) {
      if (supplement.category === SupplementCategory.SPORTS_NUTRITION) {
        confidence += 25;
        reasoning.push('High activity level increases nutritional demands');
      }
      if (supplement.category === SupplementCategory.PROTEIN) {
        confidence += 20;
        reasoning.push('Active individuals need more protein for recovery');
      }
    }

    // Goal-based scoring
    for (const goal of userProfile.primaryGoals) {
      const relevantBenefits = supplement.benefits.filter(benefit => 
        benefit.targetPopulation.some(pop => 
          this.goalToPopulation(goal).includes(pop)
        )
      );
      
      if (relevantBenefits.length > 0) {
        confidence += 15;
        reasoning.push(`Supports your goal: ${this.formatGoal(goal)}`);
        expectedBenefits.push(...relevantBenefits.map(b => b.title));
      }
    }

    // Medical conditions consideration
    if (userProfile.medicalConditions.length > 0) {
      const contraindicated = supplement.contraindications.some(contra => 
        userProfile.medicalConditions.some(condition => 
          condition.toLowerCase().includes(contra.toLowerCase())
        )
      );
      
      if (contraindicated) {
        confidence = 0; // Don't recommend if contraindicated
        reasoning.push('Not recommended due to medical conditions');
      }
    }

    // Budget consideration
    const budgetScore = this.getBudgetScore(userProfile.budget, supplement.price);
    confidence += budgetScore;
    if (budgetScore > 0) {
      reasoning.push('Fits within your budget range');
    }

    // Generate personalized dosage
    const personalizedDosage = this.getPersonalizedDosage(supplement, userProfile);
    const timing = this.getOptimalTiming(supplement, userProfile);
    const timeline = this.getExpectedTimeline(supplement);

    return {
      supplement,
      confidence: Math.min(confidence, 100),
      reasoning,
      scientificEvidence: supplement.scientificReferences,
      personalizedDosage,
      timing,
      expectedBenefits: [...new Set(expectedBenefits)],
      timeline,
      alternatives: this.getAlternatives(supplement)
    };
  }

  private goalToPopulation(goal: HealthGoal): string[] {
    const mapping: { [key in HealthGoal]: string[] } = {
      [HealthGoal.MUSCLE_GAIN]: ['bodybuilders', 'fitness enthusiasts', 'athletes'],
      [HealthGoal.STRENGTH]: ['strength trainers', 'athletes', 'bodybuilders'],
      [HealthGoal.ENDURANCE]: ['athletes', 'endurance athletes'],
      [HealthGoal.RECOVERY]: ['athletes', 'active individuals'],
      [HealthGoal.WEIGHT_LOSS]: ['weight loss', 'body recomposition'],
      [HealthGoal.IMMUNE_SUPPORT]: ['immune-compromised', 'frequent illness'],
      [HealthGoal.COGNITIVE_FUNCTION]: ['adults', 'elderly', 'students'],
      [HealthGoal.HEART_HEALTH]: ['adults over 30', 'heart disease risk factors'],
      [HealthGoal.BONE_HEALTH]: ['adults', 'postmenopausal women', 'elderly'],
      [HealthGoal.SKIN_HEALTH]: ['adults', 'skin health'],
      [HealthGoal.SLEEP_QUALITY]: ['adults', 'sleep issues'],
      [HealthGoal.ENERGY_LEVELS]: ['adults', 'fatigue', 'active individuals']
    };
    return mapping[goal] || [];
  }

  private formatGoal(goal: HealthGoal): string {
    return goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private getBudgetScore(budget: string, price: number): number {
    const budgetRanges = {
      'low': 50,
      'medium': 100,
      'high': 200,
      'premium': 500
    };
    
    const maxPrice = budgetRanges[budget as keyof typeof budgetRanges] || 100;
    return price <= maxPrice ? 10 : -20;
  }

  private getPersonalizedDosage(supplement: Supplement, userProfile: UserProfile): string {
    let dosage = supplement.dosage.recommended;
    
    // Adjust based on body weight for certain supplements
    if (supplement.id === 'creatine-monohydrate') {
      // Standard 3-5g regardless of weight
      dosage = '3-5g daily';
    } else if (supplement.id === 'whey-protein-isolate') {
      // Adjust based on activity level
      if (userProfile.activityLevel === ActivityLevel.VERY_ACTIVE || 
          userProfile.activityLevel === ActivityLevel.EXTREMELY_ACTIVE) {
        dosage = '30-40g per serving';
      } else {
        dosage = '20-25g per serving';
      }
    }
    
    return dosage;
  }

  private getOptimalTiming(supplement: Supplement, userProfile: UserProfile): string {
    if (supplement.id === 'whey-protein-isolate') {
      return 'Post-workout or between meals';
    } else if (supplement.id === 'creatine-monohydrate') {
      return 'Post-workout or with meals';
    } else if (supplement.id === 'vitamin-d3') {
      return 'With fat-containing meals';
    } else {
      return supplement.dosage.timing;
    }
  }

  private getExpectedTimeline(supplement: Supplement): string {
    const timelines: { [key: string]: string } = {
      'creatine-monohydrate': '2-4 weeks for strength benefits',
      'omega-3-fish-oil': '4-8 weeks for cardiovascular benefits',
      'vitamin-d3': '6-12 weeks for bone health benefits',
      'whey-protein-isolate': 'Immediate for muscle protein synthesis',
      'probiotic-complex': '2-4 weeks for digestive benefits'
    };
    
    return timelines[supplement.id] || '4-8 weeks for optimal benefits';
  }

  private getAlternatives(supplement: Supplement): Supplement[] {
    const alternatives: Supplement[] = [];
    const allSupplements = this.supplementDataService.getAllSupplements();
    
    // Find supplements in the same category
    const sameCategory = allSupplements.filter(s => 
      s.category === supplement.category && s.id !== supplement.id
    );
    
    return sameCategory.slice(0, 2); // Return top 2 alternatives
  }

  private removeDuplicates(supplements: Supplement[]): Supplement[] {
    const seen = new Set();
    return supplements.filter(supplement => {
      if (seen.has(supplement.id)) {
        return false;
      }
      seen.add(supplement.id);
      return true;
    });
  }
}
