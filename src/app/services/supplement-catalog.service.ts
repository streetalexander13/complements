import { Injectable } from '@angular/core';

export interface SupplementCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface SupplementDetail {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  ingredients: string[];
  dosage: {
    amount: string;
    frequency: string;
    timing: string;
    duration: string;
  };
  whenToTake: string[];
  whenNotToTake: string[];
  sideEffects: string[];
  interactions: string[];
  scientificEvidence: {
    study: string;
    journal: string;
    year: number;
    sampleSize: number;
    results: string;
    url?: string;
  }[];
  price: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SupplementCatalogService {
  
  categories: SupplementCategory[] = [
    {
      id: 'recovery',
      name: 'Recovery',
      description: 'Supplements to enhance muscle recovery and reduce inflammation',
      icon: '🔄',
      color: '#3B82F6'
    },
    {
      id: 'performance',
      name: 'Performance',
      description: 'Supplements to boost strength, power, and endurance',
      icon: '⚡',
      color: '#10B981'
    },
    {
      id: 'health',
      name: 'Health & Wellness',
      description: 'Supplements for overall health and immune support',
      icon: '💊',
      color: '#8B5CF6'
    },
    {
      id: 'sleep',
      name: 'Sleep & Recovery',
      description: 'Supplements to improve sleep quality and recovery',
      icon: '😴',
      color: '#6366F1'
    },
    {
      id: 'joint',
      name: 'Joint & Bone',
      description: 'Supplements for joint health and bone strength',
      icon: '🦴',
      color: '#F59E0B'
    }
  ];

  supplements: SupplementDetail[] = [
    {
      id: 'creatine-monohydrate',
      name: 'Creatine Monohydrate',
      category: 'performance',
      shortDescription: 'The most researched supplement for strength and power gains',
      fullDescription: 'Creatine monohydrate is the gold standard for strength and power enhancement. It increases phosphocreatine stores in muscles, providing rapid energy for high-intensity activities.',
      benefits: [
        '8-15% increase in strength and power',
        'Improved muscle mass and size',
        'Enhanced high-intensity performance',
        'Faster muscle recovery between sets',
        'May improve cognitive function'
      ],
      ingredients: ['Creatine Monohydrate (Micronized)', 'Vegetable Capsule'],
      dosage: {
        amount: '3-5g daily',
        frequency: 'Once daily',
        timing: 'Any time, with or without food',
        duration: 'Ongoing for best results'
      },
      whenToTake: [
        'Before or after workouts',
        'With a meal for better absorption',
        'Consistently at the same time daily'
      ],
      whenNotToTake: [
        'If you have kidney disease',
        'If you have diabetes (consult doctor)',
        'If you are pregnant or breastfeeding',
        'If you are under 18 without supervision'
      ],
      sideEffects: [
        'Mild stomach upset (rare)',
        'Water retention (temporary)',
        'Weight gain (muscle/water)'
      ],
      interactions: [
        'May interact with diuretics',
        'Avoid with excessive caffeine',
        'Consult doctor if taking kidney medications'
      ],
      scientificEvidence: [
        {
          study: 'Effects of creatine supplementation on performance and training adaptations',
          journal: 'Molecular and Cellular Biochemistry',
          year: 2003,
          sampleSize: 286,
          results: 'Significant improvements in strength, power, and muscle mass',
          url: 'https://pubmed.ncbi.nlm.nih.gov/12701815/'
        },
        {
          study: 'Creatine supplementation and exercise performance',
          journal: 'Sports Medicine',
          year: 2018,
          sampleSize: 150,
          results: '8-15% increase in strength and power output',
          url: 'https://pubmed.ncbi.nlm.nih.gov/29978103/'
        }
      ],
      price: 24.99,
      image: 'creatine.jpg',
      rating: 4.8,
      reviews: 1247,
      inStock: true,
      tags: ['strength', 'power', 'muscle', 'performance']
    },
    {
      id: 'whey-protein',
      name: 'Whey Protein Isolate',
      category: 'recovery',
      shortDescription: 'Fast-absorbing protein for optimal muscle recovery',
      fullDescription: 'Whey protein isolate is the purest form of whey protein, providing all essential amino acids for muscle protein synthesis and recovery.',
      benefits: [
        '5-15% faster muscle recovery',
        'Complete amino acid profile',
        'High biological value',
        'Supports muscle protein synthesis',
        'Convenient post-workout nutrition'
      ],
      ingredients: ['Whey Protein Isolate', 'Natural Flavors', 'Stevia'],
      dosage: {
        amount: '25-30g',
        frequency: '1-2 times daily',
        timing: 'Within 30 minutes post-workout',
        duration: 'Ongoing for best results'
      },
      whenToTake: [
        'Immediately after workouts',
        'Between meals as a snack',
        'Before bed for overnight recovery'
      ],
      whenNotToTake: [
        'If you have dairy allergies',
        'If you have lactose intolerance',
        'If you have kidney disease (consult doctor)'
      ],
      sideEffects: [
        'Mild digestive discomfort (rare)',
        'Bloating in sensitive individuals'
      ],
      interactions: [
        'May enhance effects of other protein sources',
        'Best absorbed with carbohydrates'
      ],
      scientificEvidence: [
        {
          study: 'Timing of protein intake and muscle protein synthesis',
          journal: 'Journal of the International Society of Sports Nutrition',
          year: 2017,
          sampleSize: 89,
          results: 'Significant improvement in muscle protein synthesis with post-workout protein',
          url: 'https://pubmed.ncbi.nlm.nih.gov/28642676/'
        }
      ],
      price: 39.99,
      image: 'whey-protein.jpg',
      rating: 4.7,
      reviews: 2156,
      inStock: true,
      tags: ['protein', 'recovery', 'muscle', 'post-workout']
    },
    {
      id: 'omega-3',
      name: 'Omega-3 Fish Oil',
      category: 'health',
      shortDescription: 'Essential fatty acids for heart, brain, and joint health',
      fullDescription: 'High-quality fish oil providing EPA and DHA omega-3 fatty acids, essential for cardiovascular health, brain function, and reducing inflammation.',
      benefits: [
        '2-3x faster recovery from exercise',
        'Reduced inflammation and joint pain',
        'Improved cardiovascular health',
        'Enhanced brain function and mood',
        'Better skin and hair health'
      ],
      ingredients: ['Fish Oil (EPA 1000mg, DHA 500mg)', 'Gelatin Capsule', 'Vitamin E'],
      dosage: {
        amount: '2-3 capsules daily',
        frequency: 'With meals',
        timing: 'With breakfast or lunch',
        duration: 'Ongoing for best results'
      },
      whenToTake: [
        'With meals for better absorption',
        'Consistently at the same time daily',
        'After workouts to reduce inflammation'
      ],
      whenNotToTake: [
        'If you have fish allergies',
        'If you take blood thinners (consult doctor)',
        'If you have bleeding disorders'
      ],
      sideEffects: [
        'Fishy aftertaste (rare with quality products)',
        'Mild digestive upset (rare)'
      ],
      interactions: [
        'May enhance blood thinning effects',
        'Consult doctor if taking anticoagulants'
      ],
      scientificEvidence: [
        {
          study: 'Omega-3 fatty acids and exercise performance',
          journal: 'Journal of Sports Science & Medicine',
          year: 2019,
          sampleSize: 45,
          results: 'Significant reduction in exercise-induced inflammation and muscle damage',
          url: 'https://pubmed.ncbi.nlm.nih.gov/31191100/'
        }
      ],
      price: 29.99,
      image: 'omega3.jpg',
      rating: 4.6,
      reviews: 892,
      inStock: true,
      tags: ['omega-3', 'inflammation', 'heart', 'brain', 'joints']
    },
    {
      id: 'vitamin-d3',
      name: 'Vitamin D3 + K2',
      category: 'health',
      shortDescription: 'Essential for bone health, immune function, and muscle strength',
      fullDescription: 'Vitamin D3 with K2 for optimal absorption and bone health. Essential for calcium absorption, immune function, and muscle strength.',
      benefits: [
        '23% stronger bones and teeth',
        'Enhanced immune system function',
        'Improved muscle strength and function',
        'Better mood and mental health',
        'Reduced risk of fractures'
      ],
      ingredients: ['Vitamin D3 (2000 IU)', 'Vitamin K2 (MK-7)', 'MCT Oil', 'Gelatin Capsule'],
      dosage: {
        amount: '1 capsule daily',
        frequency: 'Once daily',
        timing: 'With a meal containing fat',
        duration: 'Ongoing, especially in winter months'
      },
      whenToTake: [
        'With breakfast containing healthy fats',
        'Consistently at the same time daily',
        'During winter months or limited sun exposure'
      ],
      whenNotToTake: [
        'If you have hypercalcemia',
        'If you have kidney stones',
        'If you take certain medications (consult doctor)'
      ],
      sideEffects: [
        'Rare with proper dosing',
        'Nausea if taken on empty stomach'
      ],
      interactions: [
        'May interact with certain heart medications',
        'Best absorbed with magnesium'
      ],
      scientificEvidence: [
        {
          study: 'Vitamin D and muscle function',
          journal: 'Bone Research',
          year: 2019,
          sampleSize: 120,
          results: 'Significant improvement in muscle strength and bone density',
          url: 'https://pubmed.ncbi.nlm.nih.gov/31666999/'
        }
      ],
      price: 19.99,
      image: 'vitamin-d3.jpg',
      rating: 4.5,
      reviews: 634,
      inStock: true,
      tags: ['vitamin-d', 'bone', 'immune', 'strength', 'mood']
    },
    {
      id: 'magnesium-glycinate',
      name: 'Magnesium Glycinate',
      category: 'sleep',
      shortDescription: 'The most bioavailable form of magnesium for sleep and recovery',
      fullDescription: 'Magnesium glycinate is the most bioavailable form of magnesium, essential for muscle relaxation, sleep quality, and recovery.',
      benefits: [
        '15% better sleep quality',
        'Reduced muscle cramps and tension',
        'Improved stress management',
        'Enhanced muscle recovery',
        'Better energy levels'
      ],
      ingredients: ['Magnesium Glycinate (400mg)', 'Vegetable Capsule'],
      dosage: {
        amount: '2 capsules daily',
        frequency: 'Once daily',
        timing: '30 minutes before bed',
        duration: 'Ongoing for best results'
      },
      whenToTake: [
        '30 minutes before bedtime',
        'With a small amount of food',
        'Consistently at the same time daily'
      ],
      whenNotToTake: [
        'If you have kidney disease',
        'If you have heart block',
        'If you take certain medications (consult doctor)'
      ],
      sideEffects: [
        'Mild digestive upset (rare)',
        'Loose stools if taken in excess'
      ],
      interactions: [
        'May enhance effects of muscle relaxants',
        'Consult doctor if taking heart medications'
      ],
      scientificEvidence: [
        {
          study: 'Magnesium supplementation and sleep quality',
          journal: 'Sleep Medicine',
          year: 2021,
          sampleSize: 78,
          results: 'Significant improvement in sleep quality and muscle relaxation',
          url: 'https://pubmed.ncbi.nlm.nih.gov/33814354/'
        }
      ],
      price: 22.99,
      image: 'magnesium.jpg',
      rating: 4.4,
      reviews: 456,
      inStock: true,
      tags: ['magnesium', 'sleep', 'recovery', 'muscle', 'stress']
    },
    {
      id: 'probiotic',
      name: 'Probiotic Complex',
      category: 'health',
      shortDescription: '50 billion CFU probiotic for gut health and immune support',
      fullDescription: 'High-potency probiotic with 50 billion CFU of beneficial bacteria strains for optimal gut health, immune function, and nutrient absorption.',
      benefits: [
        'Improved gut health and digestion',
        'Enhanced immune system function',
        'Better nutrient absorption',
        'Reduced bloating and digestive issues',
        'Improved mood and mental health'
      ],
      ingredients: ['Lactobacillus Acidophilus', 'Bifidobacterium Lactis', 'Prebiotic Fiber', 'Vegetable Capsule'],
      dosage: {
        amount: '1 capsule daily',
        frequency: 'Once daily',
        timing: 'On empty stomach, preferably morning',
        duration: 'Ongoing for best results'
      },
      whenToTake: [
        'First thing in the morning on empty stomach',
        'At least 2 hours before or after antibiotics',
        'Consistently at the same time daily'
      ],
      whenNotToTake: [
        'If you have severe immune system disorders',
        'If you have central line catheters',
        'If you are critically ill'
      ],
      sideEffects: [
        'Mild digestive upset initially (normal)',
        'Temporary bloating (rare)'
      ],
      interactions: [
        'May reduce effectiveness of antibiotics',
        'Take 2 hours before or after antibiotics'
      ],
      scientificEvidence: [
        {
          study: 'Probiotics and athletic performance',
          journal: 'Nutrients',
          year: 2020,
          sampleSize: 67,
          results: 'Significant improvement in gut health and immune markers in athletes',
          url: 'https://pubmed.ncbi.nlm.nih.gov/32168780/'
        }
      ],
      price: 34.99,
      image: 'probiotic.jpg',
      rating: 4.3,
      reviews: 723,
      inStock: true,
      tags: ['probiotic', 'gut', 'immune', 'digestion', 'health']
    }
  ];

  getCategories(): SupplementCategory[] {
    return this.categories;
  }

  getSupplementsByCategory(categoryId: string): SupplementDetail[] {
    return this.supplements.filter(supplement => supplement.category === categoryId);
  }

  getSupplementById(id: string): SupplementDetail | undefined {
    return this.supplements.find(supplement => supplement.id === id);
  }

  getAllSupplements(): SupplementDetail[] {
    return this.supplements;
  }

  searchSupplements(query: string): SupplementDetail[] {
    const lowercaseQuery = query.toLowerCase();
    return this.supplements.filter(supplement => 
      supplement.name.toLowerCase().includes(lowercaseQuery) ||
      supplement.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      supplement.benefits.some(benefit => benefit.toLowerCase().includes(lowercaseQuery))
    );
  }
}
