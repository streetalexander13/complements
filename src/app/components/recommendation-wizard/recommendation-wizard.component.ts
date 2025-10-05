import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserProfile, HealthGoal, ActivityLevel, DietType, BudgetRange, UserPreferences } from '../../models/supplement.model';
import { RecommendationService } from '../../services/recommendation.service';
import { Recommendation } from '../../models/supplement.model';

@Component({
  selector: 'app-recommendation-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, DragDropModule],
  templateUrl: './recommendation-wizard.component.html',
  styleUrls: ['./recommendation-wizard.component.scss']
})
export class RecommendationWizardComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages', { static: false }) chatMessages!: ElementRef;
  
  currentQuestion = 0;
  totalQuestions = 11; // Individual questions instead of steps
  wizardForm: FormGroup;
  recommendations: Recommendation[] = [];
  isLoading = false;
  isThinking = false;
  subscriptionSuccess = false;
  showReview = false;
  textInput = '';
  numberInput = '';
  textareaInput = '';
  userResponses: string[] = [];
  private shouldScrollToBottom = false;

  // Form options
  healthGoals = Object.values(HealthGoal);
  activityLevels = Object.values(ActivityLevel);
  dietTypes = [
    'omnivore',
    'vegetarian', 
    'vegan',
    'other'
  ];
  
  // Goal ranking system
  availableGoals: HealthGoal[] = [];
  rankedGoals: HealthGoal[] = [];
  
  // Body composition options
  bodyCompositionGoals = [
    { value: 'maintain', label: 'Maintain current weight', icon: 'balance' },
    { value: 'lose', label: 'Lose weight', icon: 'trending_down' },
    { value: 'gain', label: 'Gain weight/muscle', icon: 'trending_up' },
    { value: 'recomp', label: 'Body recomposition (lose fat, gain muscle)', icon: 'swap_horiz' }
  ];

  trainingFrequencies = [
    '1-2 times per week',
    '3-4 times per week', 
    '5-6 times per week',
    'Daily (7+ times per week)'
  ];
  trainingIntensities = [
    'Light (casual/recreational)',
    'Moderate (regular training)',
    'High (competitive/advanced)',
    'Elite (professional level)'
  ];

  // Individual questions for chatbot-like experience
  questions: any[] = [];
  sportGroups = [
    {
      name: 'Endurance Sports',
      icon: 'directions_run',
      sports: [
    { value: 'running', label: 'Running', icon: 'directions_run' },
    { value: 'cycling', label: 'Cycling', icon: 'directions_bike' },
        { value: 'swimming', label: 'Swimming', icon: 'pool' },
        { value: 'hiking', label: 'Hiking', icon: 'terrain' }
      ]
    },
    {
      name: 'Strength & Power',
      icon: 'fitness_center',
      sports: [
    { value: 'weightlifting', label: 'Weightlifting', icon: 'fitness_center' },
    { value: 'crossfit', label: 'CrossFit', icon: 'sports_martial_arts' },
        { value: 'climbing', label: 'Climbing', icon: 'scaling' }
      ]
    },
    {
      name: 'Team Sports',
      icon: 'sports',
      sports: [
        { value: 'football', label: 'Football', icon: 'sports_football' },
    { value: 'basketball', label: 'Basketball', icon: 'sports_basketball' },
        { value: 'tennis', label: 'Tennis', icon: 'sports_tennis' }
      ]
    },
    {
      name: 'Mind & Body',
      icon: 'self_improvement',
      sports: [
        { value: 'yoga', label: 'Yoga', icon: 'self_improvement' },
        { value: 'martial-arts', label: 'Martial Arts', icon: 'sports_martial_arts' },
        { value: 'dancing', label: 'Dancing', icon: 'music_note' }
      ]
    },
    {
      name: 'Other',
      icon: 'more_horiz',
      sports: [
        { value: 'golf', label: 'Golf', icon: 'sports_golf' },
        { value: 'other', label: 'Other', icon: 'more_horiz' }
      ]
    }
  ];
  budgetRanges = Object.values(BudgetRange);

  constructor(
    private fb: FormBuilder,
    private recommendationService: RecommendationService
  ) {
    this.wizardForm = this.createForm();
  }


  ngOnInit(): void {
    this.initializeGoals();
    this.initializeQuestions();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    if (this.chatMessages) {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    }
  }

  private initializeQuestions(): void {
    this.questions = [
      {
        id: 'name',
        question: "Hi! I'm here to help you build the perfect performance box. What should I call you?",
        type: 'text',
        placeholder: 'Your name',
        required: true
      },
      {
        id: 'age',
        question: "Nice to meet you! How old are you?",
        type: 'number',
        placeholder: 'Your age',
        required: true
      },
      {
        id: 'gender',
        question: "And just to make sure I get this right for you...",
        type: 'radio',
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' }
        ],
        required: true
      },
      {
        id: 'sports',
        question: "What sports do you do?",
        type: 'sports',
        required: true
      },
      {
        id: 'trainingFrequency',
        question: "How often do you train?",
        type: 'radio',
        options: this.trainingFrequencies.map(freq => ({ value: freq, label: freq })),
        required: true
      },
      {
        id: 'trainingIntensity',
        question: "How intense is your training?",
        type: 'radio',
        options: this.trainingIntensities.map(intensity => ({ value: intensity, label: intensity })),
        required: true
      },
      {
        id: 'goals',
        question: "What are your main goals?",
        type: 'goals',
        required: true
      },
      {
        id: 'bodyComposition',
        question: "What about your body composition?",
        type: 'radio',
        options: this.bodyCompositionGoals.map(comp => ({ value: comp.value, label: comp.label })),
        required: true
      },
      {
        id: 'fitnessLevel',
        question: "Which box level sounds right for you?",
        type: 'fitnessLevel',
        required: true
      },
      {
        id: 'dietType',
        question: "What's your diet like?",
        type: 'radio',
        options: this.dietTypes.map(diet => ({ value: diet, label: this.formatDietLabel(diet) })),
        required: true
      },
      {
        id: 'otherInfo',
        question: "Anything else I should know?",
        type: 'textarea',
        placeholder: 'Medical conditions, medications, allergies, current supplements, or anything else that might help me customize your box',
        required: false
      }
    ];
  }

  private initializeGoals(): void {
    // Initialize available goals (excluding weight-related ones that go in body composition)
    this.availableGoals = this.healthGoals.filter(goal => 
      goal !== HealthGoal.WEIGHT_LOSS && 
      goal !== HealthGoal.MUSCLE_GAIN
    );
    this.rankedGoals = [];
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Step 1: Basic Info
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: [25, [Validators.required, Validators.min(13), Validators.max(120)]],
      gender: ['', Validators.required],
      
      // Step 2: Sport & Activity (Enhanced)
      sports: [[], Validators.required],
      trainingFrequency: ['', Validators.required],
      trainingIntensity: ['', Validators.required],
      rankedGoals: [[], Validators.required],
      bodyComposition: ['', Validators.required],
      fitnessLevel: ['', Validators.required],
      
      // Step 3: Medical & Other (Consolidated)
      dietType: ['', Validators.required],
      otherInfo: ['']
    });
  }

  nextQuestion(): void {
    if (this.currentQuestion < this.totalQuestions - 1) {
      this.isThinking = true;
      this.shouldScrollToBottom = true;
      
      // Simulate thinking time
      setTimeout(() => {
        this.currentQuestion++;
        this.isThinking = false;
        this.shouldScrollToBottom = true;
      }, 1500);
    } else {
      // Show review
      this.showReview = true;
      this.shouldScrollToBottom = true;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.showReview = false;
    }
  }

  answerQuestion(value: any): void {
    const currentQ = this.questions[this.currentQuestion];
    
    // Update form value
    if (currentQ.type === 'sports') {
      // Handle sports selection
      const currentSports = this.wizardForm.get('sports')?.value || [];
      if (currentSports.includes(value)) {
        const newSports = currentSports.filter((s: string) => s !== value);
        this.wizardForm.patchValue({ sports: newSports });
      } else {
        this.wizardForm.patchValue({ sports: [...currentSports, value] });
      }
    } else if (currentQ.type === 'goals') {
      // Handle goals selection
      this.addGoalToRanked(value);
    } else {
      this.wizardForm.patchValue({ [currentQ.id]: value });
    }
    
    // Auto-advance for single-select questions
    if (currentQ.type !== 'sports' && currentQ.type !== 'goals' && currentQ.type !== 'textarea') {
      this.shouldScrollToBottom = true;
      setTimeout(() => {
        this.nextQuestion();
      }, 500);
    }
  }

  // Drag and drop methods
  dropGoal(event: CdkDragDrop<HealthGoal[]>): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving from available to ranked
      const goal = event.previousContainer.data[event.previousIndex];
      this.rankedGoals.splice(event.currentIndex, 0, goal);
      this.availableGoals.splice(event.previousIndex, 1);
    }
    this.updateRankedGoalsForm();
  }

  removeGoal(goal: HealthGoal): void {
    const index = this.rankedGoals.indexOf(goal);
      if (index > -1) {
      this.rankedGoals.splice(index, 1);
      this.availableGoals.push(goal);
      this.updateRankedGoalsForm();
    }
  }

  addGoalToRanked(goal: HealthGoal): void {
    const availableIndex = this.availableGoals.indexOf(goal);
    if (availableIndex > -1) {
      this.availableGoals.splice(availableIndex, 1);
      this.rankedGoals.push(goal);
      this.updateRankedGoalsForm();
    }
  }

  private updateRankedGoalsForm(): void {
    this.wizardForm.patchValue({ rankedGoals: this.rankedGoals });
    this.wizardForm.get('rankedGoals')?.updateValueAndValidity();
  }

  // Legacy methods for compatibility (can be removed later)
  onGoalChange(goal: HealthGoal, event: any): void {
    // This method is no longer used but kept for compatibility
  }

  isGoalSelected(goal: HealthGoal): boolean {
    return this.rankedGoals.includes(goal);
  }

  formatGoalLabel(goal: HealthGoal): string {
    return goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatActivityLabel(level: ActivityLevel): string {
    return level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatDietLabel(diet: string): string {
    const labels: { [key: string]: string } = {
      'omnivore': 'I eat everything',
      'vegetarian': 'Vegetarian',
      'vegan': 'Vegan',
      'other': 'Other dietary preference'
    };
    return labels[diet] || diet.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
        primaryGoals: formValue.rankedGoals,
        currentSupplements: formValue.otherInfo, // Extract from otherInfo if needed
        medicalConditions: formValue.otherInfo, // Extract from otherInfo if needed
        medications: formValue.otherInfo, // Extract from otherInfo if needed
        allergies: formValue.otherInfo, // Extract from otherInfo if needed
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
        this.subscriptionSuccess = true;
      }, 2000);
    }
  }

  getCurrentQuestion(): any {
    return this.questions[this.currentQuestion];
  }

  getProgressPercentage(): number {
    return ((this.currentQuestion + 1) / this.totalQuestions) * 100;
  }

  isQuestionAnswered(questionId: string): boolean {
    const value = this.wizardForm.get(questionId)?.value;
    if (questionId === 'sports') {
      return Array.isArray(value) && value.length > 0;
    } else if (questionId === 'goals') {
      return this.rankedGoals.length > 0;
    }
    return !!value;
  }

  submitTextAnswer(): void {
    if (this.textInput) {
      this.userResponses.push(this.textInput);
      this.answerQuestion(this.textInput);
      this.textInput = '';
      this.shouldScrollToBottom = true;
    }
  }

  submitNumberAnswer(): void {
    if (this.numberInput) {
      this.userResponses.push(this.numberInput);
      this.answerQuestion(parseInt(this.numberInput));
      this.numberInput = '';
      this.shouldScrollToBottom = true;
    }
  }

  submitTextareaAnswer(): void {
    if (this.textareaInput) {
      this.userResponses.push(this.textareaInput);
      this.answerQuestion(this.textareaInput);
      this.textareaInput = '';
      this.shouldScrollToBottom = true;
      this.nextQuestion();
    }
  }

  getUserResponses(): string[] {
    return this.userResponses;
  }

  getLevelTitle(level: string): string {
    const titles = {
      'beginner': 'Get Started',
      'intermediate': 'Build Your Base',
      'advanced': 'Fuel & Recover'
    };
    return titles[level as keyof typeof titles] || level;
  }

  getLevelDescription(level: string): string {
    const userProfile = this.buildUserProfile();
    const supplements = this.getPersonalizedSupplementsForLevel(level, userProfile);
    
    if (supplements.length === 0) {
      return 'Perfect for your goals and activity level';
    }
    
    const supplementNames = supplements.slice(0, 2).map(s => s.name).join(', ');
    const remaining = supplements.length - 2;
    
    if (remaining > 0) {
      return `${supplementNames} and ${remaining} more supplement${remaining > 1 ? 's' : ''}`;
    }
    
    return supplementNames;
  }

  getLevelPrice(level: string): string {
    const userProfile = this.buildUserProfile();
    const supplements = this.getPersonalizedSupplementsForLevel(level, userProfile);
    const totalPrice = supplements.reduce((sum, s) => sum + s.price, 0);
    
    if (totalPrice === 0) {
      const prices = {
        'beginner': '£29/month',
        'intermediate': '£39/month',
        'advanced': '£49/month'
      };
      return prices[level as keyof typeof prices] || '';
    }
    
    return `£${totalPrice}/month`;
  }

  getPersonalizedSupplementsForLevel(level: string, userProfile: any): any[] {
    // Generate recommendations based on user profile and level
    const recommendations = this.recommendationService.generateRecommendations(userProfile);
    
    // Filter based on level
    let levelSupplements = recommendations.map(r => r.supplement);
    
    switch (level) {
      case 'beginner':
        // Beginner gets 2-3 core supplements
        levelSupplements = levelSupplements.slice(0, 3);
        break;
      case 'intermediate':
        // Intermediate gets 3-4 supplements
        levelSupplements = levelSupplements.slice(0, 4);
        break;
      case 'advanced':
        // Advanced gets all recommendations (up to 5)
        levelSupplements = levelSupplements.slice(0, 5);
        break;
    }
    
    return levelSupplements;
  }

  buildUserProfile(): any {
    return {
      name: this.wizardForm.get('name')?.value || '',
      age: this.wizardForm.get('age')?.value || 25,
      gender: this.wizardForm.get('gender')?.value || 'other',
      primaryGoals: this.wizardForm.get('rankedGoals')?.value || [],
      activityLevel: this.wizardForm.get('trainingIntensity')?.value || 'moderate',
      sports: this.wizardForm.get('sports')?.value || [],
      trainingFrequency: this.wizardForm.get('trainingFrequency')?.value || '3-4',
      bodyComposition: this.wizardForm.get('bodyComposition')?.value || 'maintain',
      dietType: this.wizardForm.get('dietType')?.value || 'omnivore',
      medicalConditions: this.wizardForm.get('medicalConditions')?.value || [],
      budget: 'medium' // Default budget
    };
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.wizardForm.get('name')?.valid && this.wizardForm.get('age')?.valid && this.wizardForm.get('gender')?.valid);
      case 2:
        const sports = this.wizardForm.get('sports')?.value || [];
        const trainingFreq = this.wizardForm.get('trainingFrequency')?.value;
        const trainingIntensity = this.wizardForm.get('trainingIntensity')?.value;
        const rankedGoals = this.wizardForm.get('rankedGoals')?.value || [];
        const bodyComposition = this.wizardForm.get('bodyComposition')?.value;
        const fitnessLevel = this.wizardForm.get('fitnessLevel')?.value;
        return !!(sports.length > 0 && trainingFreq && trainingIntensity && rankedGoals.length > 0 && bodyComposition && fitnessLevel);
      case 3:
        return !!this.wizardForm.get('dietType')?.valid; // Medical info is optional, but diet type is required
      case 4:
        return this.wizardForm.valid; // Review step - all required fields should be valid
      default:
        return false;
    }
  }

  getFormattedGoals(): string {
    const goals = this.wizardForm.get('rankedGoals')?.value || [];
    return goals.map((g: HealthGoal) => this.formatGoalLabel(g)).join(', ');
  }

  getUserName(): string {
    return this.wizardForm.get('name')?.value || 'there';
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
      }, 2000);
    }
  }


  getSelectedLevel(): string {
    const level = this.wizardForm.get('fitnessLevel')?.value;
    const levels = {
      'beginner': 'Get Started',
      'intermediate': 'Build Your Base',
      'advanced': 'Fuel & Recover'
    };
    return levels[level as keyof typeof levels] || 'Get Started';
  }

  getPrimarySport(): string {
    const sports = this.wizardForm.get('sports')?.value || [];
    if (sports.length === 0) return 'Fitness';
    if (sports.length === 1) {
      // Find the sport across all groups
      for (const group of this.sportGroups) {
        const sport = group.sports.find(s => s.value === sports[0]);
        if (sport) return sport.label;
      }
      return 'Fitness';
    }
    return `${sports.length} Sports`;
  }

  getSportsList(): string {
    const sports = this.wizardForm.get('sports')?.value || [];
    return sports.map((sport: string) => {
      // Find the sport across all groups
      for (const group of this.sportGroups) {
        const sportObj = group.sports.find(s => s.value === sport);
        if (sportObj) return sportObj.label;
      }
      return sport;
    }).join(', ');
  }

  onSportChange(sport: string, event: any): void {
    const currentSports = this.wizardForm.get('sports')?.value || [];
    if (event.target.checked) {
      const newSports = [...currentSports, sport];
      this.wizardForm.patchValue({
        sports: newSports
      });
    } else {
      const newSports = currentSports.filter((s: string) => s !== sport);
      this.wizardForm.patchValue({
        sports: newSports
      });
    }
    // Trigger validation update
    this.wizardForm.get('sports')?.updateValueAndValidity();
  }

  isSportSelected(sport: string): boolean {
    const sports = this.wizardForm.get('sports')?.value || [];
    return sports.includes(sport);
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
      'advanced': '£49/month'
    };
    return prices[level as keyof typeof prices] || '£29/month';
  }
}
