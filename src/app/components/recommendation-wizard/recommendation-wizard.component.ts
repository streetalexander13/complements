import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserProfile, HealthGoal, ActivityLevel, DietType, BudgetRange, UserPreferences } from '../../models/supplement.model';
import { RecommendationService } from '../../services/recommendation.service';
import { Recommendation } from '../../models/supplement.model';

@Component({
  selector: 'app-recommendation-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recommendation-wizard.component.html',
  styleUrls: ['./recommendation-wizard.component.scss']
})
export class RecommendationWizardComponent implements OnInit {
  currentStep = 1;
  totalSteps = 6;
  wizardForm: FormGroup;
  recommendations: Recommendation[] = [];
  isLoading = false;
  subscriptionSuccess = false;

  // Form options
  healthGoals = Object.values(HealthGoal);
  activityLevels = Object.values(ActivityLevel);
  dietTypes = Object.values(DietType);
  budgetRanges = Object.values(BudgetRange);

  constructor(
    private fb: FormBuilder,
    private recommendationService: RecommendationService
  ) {
    this.wizardForm = this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): FormGroup {
    return this.fb.group({
      // Step 1: Basic Info
      age: [25, [Validators.required, Validators.min(13), Validators.max(120)]],
      gender: ['', Validators.required],
      
      // Step 2: Sport & Activity
      primarySport: ['', Validators.required],
      activityLevel: ['', Validators.required],
      
      // Step 3: Goals & Level
      fitnessLevel: ['', Validators.required],
      primaryGoals: [[], Validators.required],
      
      // Step 4: Diet & Preferences
      dietType: ['', Validators.required],
      allergies: [''],
      currentSupplements: [''],
      
      // Step 5: Health & Medical
      medicalConditions: [''],
      medications: ['']
    });
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  onGoalChange(goal: HealthGoal, event: any): void {
    const currentGoals = this.wizardForm.get('primaryGoals')?.value || [];
    if (event.target.checked) {
      if (!currentGoals.includes(goal)) {
        currentGoals.push(goal);
      }
    } else {
      const index = currentGoals.indexOf(goal);
      if (index > -1) {
        currentGoals.splice(index, 1);
      }
    }
    this.wizardForm.patchValue({ primaryGoals: currentGoals });
  }

  isGoalSelected(goal: HealthGoal): boolean {
    const currentGoals = this.wizardForm.get('primaryGoals')?.value || [];
    return currentGoals.includes(goal);
  }

  formatGoalLabel(goal: HealthGoal): string {
    return goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatActivityLabel(level: ActivityLevel): string {
    return level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatDietLabel(diet: DietType): string {
    return diet.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatBudgetLabel(budget: BudgetRange): string {
    const labels = {
      'low': '$0-25/month',
      'medium': '$25-75/month',
      'high': '$75-150/month',
      'premium': '$150+/month'
    };
    return labels[budget as keyof typeof labels];
  }

  generateRecommendations(): void {
    if (this.wizardForm.valid) {
      this.isLoading = true;
      
      const formValue = this.wizardForm.value;
      const userProfile: UserProfile = {
        age: formValue.age,
        gender: formValue.gender,
        activityLevel: formValue.activityLevel,
        primaryGoals: formValue.primaryGoals,
        currentSupplements: formValue.currentSupplements,
        medicalConditions: formValue.medicalConditions,
        medications: formValue.medications,
        allergies: formValue.allergies,
        dietType: formValue.dietType,
        budget: formValue.budget,
        preferences: {
          pillSize: formValue.pillSize,
          frequency: formValue.frequency,
          form: formValue.form,
          organic: formValue.organic,
          thirdPartyTested: formValue.thirdPartyTested,
          allergenFree: formValue.allergenFree
        }
      };

      // Simulate API call delay
      setTimeout(() => {
        this.recommendations = this.recommendationService.generateRecommendations(userProfile);
        this.isLoading = false;
        this.currentStep = this.totalSteps + 1; // Move to results step
      }, 2000);
    }
  }

  getStepTitle(): string {
    const titles = {
      1: 'Basic Information',
      2: 'Activity & Goals',
      3: 'Health & Medical',
      4: 'Diet & Lifestyle',
      5: 'Preferences',
      6: 'Review & Generate'
    };
    return titles[this.currentStep as keyof typeof titles] || '';
  }

  getStepDescription(): string {
    const descriptions = {
      1: 'Tell us about yourself to personalize your recommendations',
      2: 'What are your primary health and fitness goals?',
      3: 'Any medical conditions or medications we should know about?',
      4: 'Help us understand your dietary preferences and current routine',
      5: 'Customize your supplement preferences and budget',
      6: 'Review your information and generate personalized recommendations'
    };
    return descriptions[this.currentStep as keyof typeof descriptions] || '';
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.wizardForm.get('age')?.valid && this.wizardForm.get('gender')?.valid);
      case 2:
        return !!(this.wizardForm.get('activityLevel')?.valid && this.wizardForm.get('primaryGoals')?.valid);
      case 3:
        return true; // Optional step
      case 4:
        return !!this.wizardForm.get('dietType')?.valid;
      case 5:
        return !!this.wizardForm.get('budget')?.valid;
      case 6:
        return this.wizardForm.valid;
      default:
        return false;
    }
  }

  getFormattedGoals(): string {
    const goals = this.wizardForm.get('primaryGoals')?.value || [];
    return goals.map((g: HealthGoal) => this.formatGoalLabel(g)).join(', ');
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  subscribeToBox(): void {
    if (this.wizardForm.valid) {
      this.isLoading = true;
      
      // Simulate subscription process
      setTimeout(() => {
        this.isLoading = false;
        this.subscriptionSuccess = true;
        this.currentStep = this.totalSteps + 1;
      }, 2000);
    }
  }

  getUserName(): string {
    const gender = this.wizardForm.get('gender')?.value;
    const names = {
      'male': ['Alex', 'James', 'Tom', 'Mike', 'Chris'],
      'female': ['Maddy', 'Sarah', 'Emma', 'Lisa', 'Kate'],
      'other': ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey']
    };
    const nameList = names[gender as keyof typeof names] || names.other;
    return nameList[Math.floor(Math.random() * nameList.length)];
  }

  getSelectedLevel(): string {
    const level = this.wizardForm.get('fitnessLevel')?.value;
    const levels = {
      'beginner': 'Get Started',
      'intermediate': 'Build Your Base',
      'advanced': 'Fuel & Recover Smarter',
      'elite': 'Performance Maximiser'
    };
    return levels[level as keyof typeof levels] || 'Get Started';
  }

  getPrimarySport(): string {
    const sport = this.wizardForm.get('primarySport')?.value;
    const sports = {
      'running': 'Running',
      'climbing': 'Climbing',
      'cycling': 'Cycling',
      'weightlifting': 'Weightlifting',
      'yoga': 'Yoga',
      'crossfit': 'CrossFit'
    };
    return sports[sport as keyof typeof sports] || 'Fitness';
  }

  getDietType(): string {
    const diet = this.wizardForm.get('dietType')?.value;
    const diets = {
      'vegan': 'Vegan',
      'vegetarian': 'Vegetarian',
      'omnivore': 'Whey',
      'keto': 'Keto-friendly',
      'paleo': 'Paleo-friendly'
    };
    return diets[diet as keyof typeof diets] || 'Whey';
  }

  getBoxPrice(): string {
    const level = this.wizardForm.get('fitnessLevel')?.value;
    const prices = {
      'beginner': '£29/month',
      'intermediate': '£39/month',
      'advanced': '£49/month',
      'elite': '£69/month'
    };
    return prices[level as keyof typeof prices] || '£29/month';
  }
}
