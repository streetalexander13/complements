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
  @ViewChild('chatContainer', { static: false }) chatMessagesContainer!: ElementRef;
  
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
  chatMessages: { type: 'bot' | 'user', content: string, timestamp?: Date }[] = [];
  private shouldScrollToBottom = false;
  showOverlayInput = false;
  // Removed chat expand/collapse; always show full history
  private readonly chatScrollDurationMs = 600; // unified, slightly slower scroll
  levelOptions: string[] = ['simple', 'essentials'];

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
        { value: 'climbing', label: 'Climbing', icon: 'terrain' }
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
    this.initializeChat();
  }

  private initializeChat(): void {
    // Add the first question to chat history
    if (this.questions.length > 0) {
      this.chatMessages.push({
        type: 'bot',
        content: this.questions[0].question,
        timestamp: new Date()
      });
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    if (!this.chatMessagesContainer) return;
    const el = this.chatMessagesContainer.nativeElement as HTMLElement;
    const start = el.scrollTop;
    const end = el.scrollHeight;
    const duration = this.chatScrollDurationMs;
    const startTime = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const elapsed = Math.min(1, (now - startTime) / duration);
      const value = start + (end - start) * easeOutCubic(elapsed);
      el.scrollTop = value;
      if (elapsed < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Removed toggleChatExpand and getVisibleChatMessages; chat always shows full history

  private getThinkingTime(question: any): number {
    if (!question) return 800; // Default for review section
    
    // Simple questions - very quick response
    if (question.type === 'text' || question.type === 'number') {
      return 400; // 0.4 seconds for basic input questions
    }
    
    // Radio button questions - quick response
    if (question.type === 'radio') {
      return 600; // 0.6 seconds for single choice questions
    }
    
    // Complex questions - longer thinking time
    if (question.type === 'sports' || question.type === 'goals') {
      return 1200; // 1.2 seconds for multi-select questions
    }
    
    // Fitness level and other complex questions
    if (question.type === 'fitnessLevel' || question.type === 'textarea') {
      return 1000; // 1 second for complex questions
    }
    
    // Default for any other question types
    return 800; // 0.8 seconds default
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
        question: "How many products are you comfortable using in a regimen? Select the answer that fits you best.",
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
      goal !== HealthGoal.MUSCLE_GAIN &&
      goal !== HealthGoal.COGNITIVE_FUNCTION &&
      goal !== HealthGoal.SKIN_HEALTH &&
      goal !== HealthGoal.SLEEP_QUALITY &&
      goal !== HealthGoal.BONE_HEALTH
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
    // Handle current question response before advancing
    const currentQ = this.questions[this.currentQuestion];
    
    // Add user response to chat history for multi-select questions
    if (currentQ.type === 'sports') {
      const selectedSports = this.wizardForm.get('sports')?.value || [];
      if (selectedSports.length > 0) {
        // Format sports selection for display
        const sportsList = selectedSports.map((sport: string) => {
          // Find the sport label from sportGroups
          for (const group of this.sportGroups) {
            const sportObj = group.sports.find(s => s.value === sport);
            if (sportObj) return sportObj.label;
          }
          return sport;
        }).join(', ');
        
        this.chatMessages.push({
          type: 'user',
          content: sportsList,
          timestamp: new Date()
        });
      }
    } else if (currentQ.type === 'goals') {
      const rankedGoals = this.wizardForm.get('rankedGoals')?.value || [];
      if (rankedGoals.length > 0) {
        const goalsList = rankedGoals.map((goal: HealthGoal) => this.formatGoalLabel(goal)).join(', ');
        this.chatMessages.push({
          type: 'user',
          content: goalsList,
          timestamp: new Date()
        });
      }
    }
    
    if (this.currentQuestion < this.totalQuestions - 1) {
      this.isThinking = true;
      this.shouldScrollToBottom = true;
      
      // Simulate thinking time based on question complexity
      const nextQuestion = this.questions[this.currentQuestion + 1];
      const thinkingTime = this.getThinkingTime(nextQuestion);
      
      setTimeout(() => {
        this.currentQuestion++;
        this.isThinking = false;
        
        // Add the new question to chat history
        if (this.questions[this.currentQuestion]) {
          this.chatMessages.push({
            type: 'bot',
            content: this.questions[this.currentQuestion].question,
            timestamp: new Date()
          });
        }
        
        this.shouldScrollToBottom = true;
      }, thinkingTime);
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
    
    // Add user response to chat history for single-select questions
    if (currentQ.type === 'radio' || currentQ.type === 'fitnessLevel') {
      let displayValue = value;
      
      // Format the display value for better readability
      if (currentQ.type === 'radio' && currentQ.options) {
        const option = currentQ.options.find((opt: any) => opt.value === value);
        displayValue = option ? option.label : value;
      } else if (currentQ.type === 'fitnessLevel') {
        displayValue = this.getLevelTitle(value);
      }
      
      this.chatMessages.push({
        type: 'user',
        content: displayValue,
        timestamp: new Date()
      });
      this.shouldScrollToBottom = true;
    }
    
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
    } else if (currentQ.type === 'sports') {
      // For sports, we need to handle the response when they click continue
      // The sports selection is handled in the continue button
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
        activityLevel: this.mapTrainingIntensityToActivityLevel(formValue.trainingIntensity),
        primaryGoals: Array.isArray(formValue.rankedGoals) ? formValue.rankedGoals : [],
        // These fields are not explicitly collected; default to empty arrays
        currentSupplements: [],
        medicalConditions: [],
        medications: [],
        allergies: [],
        dietType: this.coerceDietType(formValue.dietType),
        // Not collected in the wizard; default to medium to avoid type errors
        budget: BudgetRange.MEDIUM,
        // Not collected in the wizard; provide sensible defaults
        preferences: {
          pillSize: 'medium',
          frequency: 'daily',
          form: 'capsules',
          organic: false,
          thirdPartyTested: true,
          allergenFree: false
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

  private mapTrainingIntensityToActivityLevel(intensity: string): ActivityLevel {
    if (!intensity) return ActivityLevel.MODERATELY_ACTIVE;
    const value = String(intensity).toLowerCase();
    if (value.includes('elite')) return ActivityLevel.EXTREMELY_ACTIVE;
    if (value.includes('high')) return ActivityLevel.VERY_ACTIVE;
    if (value.includes('moderate')) return ActivityLevel.MODERATELY_ACTIVE;
    if (value.includes('light')) return ActivityLevel.LIGHTLY_ACTIVE;
    return ActivityLevel.MODERATELY_ACTIVE;
  }

  private coerceDietType(diet: string): DietType {
    switch (diet) {
      case 'omnivore':
        return DietType.OMNIVORE;
      case 'vegetarian':
        return DietType.VEGETARIAN;
      case 'vegan':
        return DietType.VEGAN;
      case 'keto':
        return DietType.KETO;
      case 'paleo':
        return DietType.PALEO;
      case 'mediterranean':
        return DietType.MEDITERRANEAN;
      case 'gluten-free':
        return DietType.GLUTEN_FREE;
      case 'dairy-free':
        return DietType.DAIRY_FREE;
      default:
        return DietType.OMNIVORE;
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
      
      // Add user response to chat history
      this.chatMessages.push({
        type: 'user',
        content: this.textInput,
        timestamp: new Date()
      });
      
      this.answerQuestion(this.textInput);
      this.textInput = '';
      this.shouldScrollToBottom = true;
      setTimeout(() => this.scrollToBottom(), 60);
    }
  }

  submitNumberAnswer(): void {
    if (this.numberInput) {
      this.userResponses.push(this.numberInput);
      
      // Add user response to chat history
      this.chatMessages.push({
        type: 'user',
        content: this.numberInput,
        timestamp: new Date()
      });
      
      this.answerQuestion(parseInt(this.numberInput));
      this.numberInput = '';
      this.shouldScrollToBottom = true;
      setTimeout(() => this.scrollToBottom(), 60);
    }
  }

  submitTextareaAnswer(): void {
    if (this.textareaInput) {
      this.userResponses.push(this.textareaInput);
      
      // Add user response to chat history
      this.chatMessages.push({
        type: 'user',
        content: this.textareaInput,
        timestamp: new Date()
      });
      
      this.answerQuestion(this.textareaInput);
      this.textareaInput = '';
      this.shouldScrollToBottom = true;
      setTimeout(() => this.scrollToBottom(), 0);
      this.nextQuestion();
    }
  }

  submitNothingElse(): void {
    // Add "Nothing else" to chat history
    this.chatMessages.push({
      type: 'user',
      content: 'Nothing else',
      timestamp: new Date()
    });
    
    // Answer with empty string
    this.answerQuestion('');
    this.shouldScrollToBottom = true;
    setTimeout(() => this.scrollToBottom(), 0);
    this.nextQuestion();
  }

  getUserResponses(): string[] {
    return this.userResponses;
  }

  getLevelTitle(level: string): string {
    const titles = {
      'beginner': 'Simple',
      'intermediate': 'Essentials',
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
    
    // Create a more descriptive message based on the user's profile
    const primaryGoals = userProfile.primaryGoals || [];
    const sports = userProfile.sports || [];
    const trainingFrequency = userProfile.trainingFrequency || '';
    
    let description = '';
    
    switch (level) {
      case 'beginner':
        if (primaryGoals.some((goal: string) => goal.includes('strength') || goal.includes('muscle'))) {
          description = 'Essential supplements for muscle building and recovery';
        } else if (sports.includes('running') || sports.includes('cycling')) {
          description = 'Foundation supplements for endurance training';
        } else {
          description = 'Core supplements for overall health and wellness';
        }
        break;
        
      case 'intermediate':
        if (primaryGoals.some((goal: string) => goal.includes('strength'))) {
          description = 'Advanced muscle building with creatine and recovery support';
        } else if (sports.includes('weightlifting') || sports.includes('crossfit')) {
          description = 'Performance supplements for strength training';
        } else if (trainingFrequency.includes('5-6')) {
          description = 'Recovery and performance for frequent training';
        } else {
          description = 'Enhanced supplementation for active lifestyle';
        }
        break;
        
      case 'advanced':
        if (trainingFrequency.includes('5-6') || trainingFrequency.includes('Daily')) {
          description = 'Complete supplementation for elite training demands';
        } else if (primaryGoals.length >= 3) {
          description = 'Comprehensive support for multiple health goals';
        } else {
          description = 'Full-spectrum supplementation for peak performance';
        }
        break;
        
      default:
        description = 'Personalized supplements for your goals';
    }
    
    const supplementNames = supplements.slice(0, 2).map(s => s.name).join(', ');
    const remaining = supplements.length - 2;
    
    if (remaining > 0) {
      return `${description} • ${supplementNames} and ${remaining} more`;
    }
    
    return `${description} • ${supplementNames}`;
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
    
    // Filter and customize based on level and user profile
    let levelSupplements = recommendations.map(r => r.supplement);
    
    // Apply level-specific filtering and personalization
    switch (level) {
      case 'beginner':
        // Beginner gets 2-3 core supplements, prioritizing foundational ones
        levelSupplements = this.getBeginnerSupplements(userProfile, levelSupplements);
        break;
      case 'intermediate':
        // Intermediate gets 3-4 supplements with more specialized options
        levelSupplements = this.getIntermediateSupplements(userProfile, levelSupplements);
        break;
      case 'advanced':
        // Advanced gets all recommendations (up to 5) with full specialization
        levelSupplements = this.getAdvancedSupplements(userProfile, levelSupplements);
        break;
    }
    
    return levelSupplements;
  }

  private getBeginnerSupplements(userProfile: any, allSupplements: any[]): any[] {
    // For beginners, prioritize foundational supplements based on their goals
    const foundationalSupplements = [];
    
    // Always include Vitamin D3 for beginners (essential foundation)
    const vitaminD = allSupplements.find(s => s.id === 'vitamin-d3');
    if (vitaminD) foundationalSupplements.push(vitaminD);
    
    // Add protein if they're doing strength training or muscle building
    const hasStrengthGoals = userProfile.primaryGoals?.some((goal: string) => 
      goal.includes('strength') || goal.includes('muscle') || goal.includes('gain')
    );
    const isActive = userProfile.trainingFrequency?.includes('3-4') || userProfile.trainingFrequency?.includes('5-6');
    
    if (hasStrengthGoals || isActive) {
      const protein = allSupplements.find(s => s.id === 'whey-protein-isolate');
      if (protein) foundationalSupplements.push(protein);
    }
    
    // Add omega-3 for cardiovascular health if they're over 30 or have heart health goals
    const hasHeartGoals = userProfile.primaryGoals?.some((goal: string) => goal.includes('heart'));
    if (userProfile.age >= 30 || hasHeartGoals) {
      const omega3 = allSupplements.find(s => s.id === 'omega-3-fish-oil');
      if (omega3) foundationalSupplements.push(omega3);
    }
    
    // If still less than 3, add probiotic for general health
    if (foundationalSupplements.length < 3) {
      const probiotic = allSupplements.find(s => s.id === 'probiotic-complex');
      if (probiotic) foundationalSupplements.push(probiotic);
    }
    
    return foundationalSupplements.slice(0, 3);
  }

  private getIntermediateSupplements(userProfile: any, allSupplements: any[]): any[] {
    // For intermediate, build on beginner foundation with more specialized options
    const intermediateSupplements = [];
    
    // Start with beginner foundation
    const beginnerSupplements = this.getBeginnerSupplements(userProfile, allSupplements);
    intermediateSupplements.push(...beginnerSupplements);
    
    // Add creatine for strength/power goals if they're training regularly
    const hasStrengthGoals = userProfile.primaryGoals?.some((goal: string) => 
      goal.includes('strength') || goal.includes('power')
    );
    const trainsRegularly = userProfile.trainingFrequency?.includes('3-4') || userProfile.trainingFrequency?.includes('5-6');
    
    if (hasStrengthGoals && trainsRegularly) {
      const creatine = allSupplements.find(s => s.id === 'creatine-monohydrate');
      if (creatine && !intermediateSupplements.find(s => s.id === 'creatine-monohydrate')) {
        intermediateSupplements.push(creatine);
      }
    }
    
    // Add sport-specific supplements based on their activities
    const sports = userProfile.sports || [];
    if (sports.includes('running') || sports.includes('cycling') || sports.includes('swimming')) {
      // Endurance sports - prioritize recovery and cardiovascular health
      const omega3 = allSupplements.find(s => s.id === 'omega-3-fish-oil');
      if (omega3 && !intermediateSupplements.find(s => s.id === 'omega-3-fish-oil')) {
        intermediateSupplements.push(omega3);
      }
    }
    
    return intermediateSupplements.slice(0, 4);
  }

  private getAdvancedSupplements(userProfile: any, allSupplements: any[]): any[] {
    // For advanced users, provide comprehensive supplementation
    const advancedSupplements = [];
    
    // Start with intermediate foundation
    const intermediateSupplements = this.getIntermediateSupplements(userProfile, allSupplements);
    advancedSupplements.push(...intermediateSupplements);
    
    // Add all remaining high-confidence recommendations
    const recommendations = this.recommendationService.generateRecommendations(userProfile);
    const allRecommended = recommendations.map(r => r.supplement);
    
    // Add any supplements not already included
    for (const supplement of allRecommended) {
      if (!advancedSupplements.find(s => s.id === supplement.id)) {
        advancedSupplements.push(supplement);
      }
    }
    
    return advancedSupplements.slice(0, 5);
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

  subscribeToBoxForLevel(level: string): void {
    // set selected level before subscribing
    this.wizardForm.patchValue({ fitnessLevel: level });
    this.subscribeToBox();
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

  getAllSports(): any[] {
    const allSports: any[] = [];
    this.sportGroups.forEach(group => {
      allSports.push(...group.sports);
    });
    return allSports;
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

  shouldUseOverlayInput(): boolean {
    const currentQ = this.getCurrentQuestion();
    if (!currentQ) return false;
    
    // Don't use overlay for any inputs - show everything inline for better UX
    return false;
  }

  toggleOverlayInput(): void {
    this.showOverlayInput = !this.showOverlayInput;
  }

  closeOverlayInput(): void {
    this.showOverlayInput = false;
  }

  getOverlayTitle(): string {
    const currentQ = this.getCurrentQuestion();
    if (!currentQ) return '';
    
    // Only textarea uses overlay
    if (currentQ.type === 'textarea') {
      return 'Additional Information';
    }
    
    return 'Input';
  }

  // Dynamically size the input area based on the current question type.
  // We animate min-height in CSS for smooth grow/shrink.
  getInputMinHeight(): number {
    const q = this.getCurrentQuestion();
    if (!q) return 120;
    switch (q.type) {
      case 'text':
      case 'number':
        return 120; // compact
      case 'radio':
        return 220; // a couple of buttons
      case 'sports':
        return 420; // grid of sport buttons
      case 'goals':
        return 460; // two columns + ranked area
      case 'fitnessLevel':
        return 520; // 3 cards grid
      case 'textarea':
        return 240; // larger text input
      default:
        return 200;
    }
  }

}
