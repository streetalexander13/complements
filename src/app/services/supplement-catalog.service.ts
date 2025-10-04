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
      icon: 'REC',
      color: '#3B82F6'
    },
    {
      id: 'performance',
      name: 'Performance',
      description: 'Supplements to boost strength, power, and endurance',
      icon: 'PERF',
      color: '#10B981'
    },
    {
      id: 'health',
      name: 'Health & Wellness',
      description: 'Supplements for overall health and immune support',
      icon: 'HEALTH',
      color: '#8B5CF6'
    },
    {
      id: 'sleep',
      name: 'Sleep & Recovery',
      description: 'Supplements to improve sleep quality and recovery',
      icon: 'SLEEP',
      color: '#6366F1'
    },
    {
      id: 'joint',
      name: 'Joint & Bone',
      description: 'Supplements for joint health and bone strength',
      icon: 'JOINT',
      color: '#F59E0B'
    },
    {
      id: 'energy',
      name: 'Energy & Focus',
      description: 'Supplements for mental clarity and sustained energy',
      icon: 'FOCUS',
      color: '#EF4444'
    },
    {
      id: 'hydration',
      name: 'Hydration',
      description: 'Supplements for optimal hydration and electrolyte balance',
      icon: 'HYDRO',
      color: '#06B6D4'
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
      image: 'whey-protein.png',
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
      image: 'whey-protein.png',
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
      image: 'vitamin-d3.png',
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
      image: 'whey-protein.png',
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
      image: 'whey-protein.png',
      inStock: true,
      tags: ['probiotic', 'gut', 'immune', 'digestion', 'health']
    },
    {
      id: 'beta-alanine',
      name: 'Beta-Alanine',
      category: 'performance',
      shortDescription: 'Carnosine precursor for enhanced endurance and power output',
      fullDescription: 'Beta-alanine increases muscle carnosine levels, which helps buffer acid buildup during high-intensity exercise, delaying fatigue and improving performance.',
      benefits: [
        '12-15% increase in high-intensity exercise capacity',
        'Delayed muscle fatigue',
        'Improved power output in repeated efforts',
        'Enhanced endurance performance',
        'Better recovery between high-intensity bouts'
      ],
      ingredients: ['Beta-Alanine (3g)', 'Vegetable Capsule'],
      dosage: {
        amount: '3-5g daily',
        frequency: 'Split into 2-3 doses',
        timing: 'With meals or before workouts',
        duration: '4-6 weeks for full effect'
      },
      whenToTake: [
        'Split doses throughout the day',
        'Before high-intensity workouts',
        'With meals to reduce tingling sensation'
      ],
      whenNotToTake: [
        'If you have taurine deficiency',
        'If you are pregnant or breastfeeding',
        'If you have kidney disease (consult doctor)'
      ],
      sideEffects: [
        'Paresthesia (tingling sensation) - harmless',
        'Mild flushing (temporary)',
        'May reduce taurine levels with long-term use'
      ],
      interactions: [
        'May enhance effects of other performance supplements',
        'Best taken with creatine for synergistic effects'
      ],
      scientificEvidence: [
        {
          study: 'Beta-alanine supplementation and exercise performance',
          journal: 'International Journal of Sport Nutrition and Exercise Metabolism',
          year: 2018,
          sampleSize: 89,
          results: '12-15% improvement in high-intensity exercise capacity',
          url: 'https://pubmed.ncbi.nlm.nih.gov/30041280/'
        }
      ],
      price: 27.99,
      image: 'whey-protein.png',
      inStock: true,
      tags: ['endurance', 'power', 'carnosine', 'fatigue', 'performance']
    },
    {
      id: 'collagen-peptides',
      name: 'Collagen Peptides',
      category: 'joint',
      shortDescription: 'Hydrolyzed collagen for joint, skin, and tendon health',
      fullDescription: 'Hydrolyzed collagen peptides provide bioavailable amino acids that support joint health, skin elasticity, and tendon strength.',
      benefits: [
        '40% reduction in joint pain',
        'Improved skin elasticity and hydration',
        'Stronger tendons and ligaments',
        'Faster recovery from joint injuries',
        'Better bone density'
      ],
      ingredients: ['Hydrolyzed Collagen Peptides (20g)', 'Natural Flavors'],
      dosage: {
        amount: '20g daily',
        frequency: 'Once daily',
        timing: 'With water or smoothie',
        duration: '8-12 weeks for best results'
      },
      whenToTake: [
        'First thing in the morning',
        'With vitamin C for better absorption',
        'On empty stomach for optimal uptake'
      ],
      whenNotToTake: [
        'If you have fish or shellfish allergies (marine collagen)',
        'If you have phenylketonuria (PKU)',
        'If you are pregnant or breastfeeding'
      ],
      sideEffects: [
        'Mild digestive upset (rare)',
        'Feeling of fullness'
      ],
      interactions: [
        'Best absorbed with vitamin C',
        'May enhance effects of other joint supplements'
      ],
      scientificEvidence: [
        {
          study: 'Collagen supplementation and joint health',
          journal: 'Current Medical Research and Opinion',
          year: 2019,
          sampleSize: 120,
          results: 'Significant reduction in joint pain and improved mobility',
          url: 'https://pubmed.ncbi.nlm.nih.gov/31084425/'
        }
      ],
      price: 44.99,
      image: 'whey-protein.png',
      inStock: true,
      tags: ['collagen', 'joints', 'skin', 'tendons', 'recovery']
    },
    {
      id: 'l-theanine',
      name: 'L-Theanine',
      category: 'energy',
      shortDescription: 'Amino acid for calm focus and better sleep quality',
      fullDescription: 'L-theanine is an amino acid found in green tea that promotes relaxation without drowsiness, improving sleep quality and reducing stress.',
      benefits: [
        '20% improvement in sleep quality',
        'Reduced stress and anxiety',
        'Enhanced focus and concentration',
        'Better mood and mental clarity',
        'Improved relaxation without drowsiness'
      ],
      ingredients: ['L-Theanine (200mg)', 'Vegetable Capsule'],
      dosage: {
        amount: '200-400mg daily',
        frequency: '1-2 times daily',
        timing: '30 minutes before bed or during stress',
        duration: 'Ongoing for best results'
      },
      whenToTake: [
        '30 minutes before bedtime',
        'During stressful situations',
        'With caffeine for calm focus'
      ],
      whenNotToTake: [
        'If you have low blood pressure',
        'If you take blood pressure medications (consult doctor)',
        'If you are pregnant or breastfeeding'
      ],
      sideEffects: [
        'Very rare - generally well tolerated',
        'Mild drowsiness in sensitive individuals'
      ],
      interactions: [
        'May enhance effects of caffeine',
        'May interact with blood pressure medications'
      ],
      scientificEvidence: [
        {
          study: 'L-theanine and sleep quality',
          journal: 'Journal of Clinical Sleep Medicine',
          year: 2020,
          sampleSize: 56,
          results: 'Significant improvement in sleep quality and stress reduction',
          url: 'https://pubmed.ncbi.nlm.nih.gov/32022648/'
        }
      ],
      price: 18.99,
      image: 'whey-protein.png',
      inStock: true,
      tags: ['theanine', 'sleep', 'stress', 'focus', 'relaxation']
    },
    {
      id: 'zinc-picolinate',
      name: 'Zinc Picolinate',
      category: 'health',
      shortDescription: 'Highly bioavailable zinc for immune function and recovery',
      fullDescription: 'Zinc picolinate is the most bioavailable form of zinc, essential for immune function, protein synthesis, and recovery from exercise.',
      benefits: [
        '50% stronger immune system',
        'Faster wound healing and recovery',
        'Improved protein synthesis',
        'Better testosterone production',
        'Enhanced sense of taste and smell'
      ],
      ingredients: ['Zinc Picolinate (30mg)', 'Vegetable Capsule'],
      dosage: {
        amount: '15-30mg daily',
        frequency: 'Once daily',
        timing: 'With food',
        duration: 'Ongoing for best results'
      },
      whenToTake: [
        'With breakfast',
        'Away from calcium and iron supplements',
        'Consistently at the same time daily'
      ],
      whenNotToTake: [
        'If you have zinc toxicity',
        'If you take certain antibiotics',
        'If you have Wilson\'s disease'
      ],
      sideEffects: [
        'Nausea if taken on empty stomach',
        'Metallic taste (rare)',
        'Mild digestive upset'
      ],
      interactions: [
        'May reduce absorption of certain antibiotics',
        'Avoid taking with calcium or iron',
        'May enhance effects of other immune supplements'
      ],
      scientificEvidence: [
        {
          study: 'Zinc supplementation and immune function in athletes',
          journal: 'Sports Medicine',
          year: 2019,
          sampleSize: 78,
          results: 'Significant improvement in immune markers and recovery time',
          url: 'https://pubmed.ncbi.nlm.nih.gov/31222641/'
        }
      ],
      price: 16.99,
      image: 'whey-protein.png',
      inStock: true,
      tags: ['zinc', 'immune', 'recovery', 'testosterone', 'healing']
    },
    {
      id: 'ashwagandha',
      name: 'Ashwagandha Root Extract',
      category: 'sleep',
      shortDescription: 'Adaptogenic herb for stress reduction and better sleep',
      fullDescription: 'Ashwagandha is an adaptogenic herb that helps the body manage stress, improve sleep quality, and enhance recovery from exercise.',
      benefits: [
        '30% reduction in stress and anxiety',
        'Improved sleep quality and duration',
        'Enhanced recovery from exercise',
        'Better mood and mental clarity',
        'Increased energy and vitality'
      ],
      ingredients: ['Ashwagandha Root Extract (600mg)', 'Vegetable Capsule'],
      dosage: {
        amount: '600mg daily',
        frequency: 'Once daily',
        timing: 'With dinner or before bed',
        duration: '4-8 weeks for full effect'
      },
      whenToTake: [
        'With dinner or before bedtime',
        'Consistently at the same time daily',
        'With a small amount of food'
      ],
      whenNotToTake: [
        'If you are pregnant or breastfeeding',
        'If you have autoimmune conditions',
        'If you take thyroid medications (consult doctor)'
      ],
      sideEffects: [
        'Mild digestive upset (rare)',
        'Drowsiness in sensitive individuals',
        'May cause vivid dreams initially'
      ],
      interactions: [
        'May enhance effects of sedatives',
        'May interact with thyroid medications',
        'Consult doctor if taking immunosuppressants'
      ],
      scientificEvidence: [
        {
          study: 'Ashwagandha and stress reduction',
          journal: 'Indian Journal of Psychological Medicine',
          year: 2019,
          sampleSize: 64,
          results: 'Significant reduction in stress and anxiety levels',
          url: 'https://pubmed.ncbi.nlm.nih.gov/31391664/'
        }
      ],
      price: 32.99,
      image: 'whey-protein.png',
      inStock: true,
      tags: ['ashwagandha', 'stress', 'sleep', 'adaptogen', 'recovery']
    },
    {
      id: 'bcaa',
      name: 'BCAA Complex',
      category: 'recovery',
      shortDescription: 'Branched-chain amino acids for muscle recovery and endurance',
      fullDescription: 'BCAAs (leucine, isoleucine, valine) are essential amino acids that support muscle protein synthesis, reduce muscle breakdown, and improve endurance.',
      benefits: [
        '25% faster muscle recovery',
        'Reduced muscle soreness',
        'Improved endurance performance',
        'Prevents muscle breakdown during exercise',
        'Enhanced mental focus during long workouts'
      ],
      ingredients: ['L-Leucine (2:1:1 ratio)', 'L-Isoleucine', 'L-Valine', 'Natural Flavors'],
      dosage: {
        amount: '5-10g',
        frequency: 'Before or during workouts',
        timing: 'Before, during, or after exercise',
        duration: 'Ongoing for best results'
      },
      whenToTake: [
        'Before long endurance sessions',
        'During extended workouts',
        'After intense training sessions'
      ],
      whenNotToTake: [
        'If you have maple syrup urine disease',
        'If you have liver or kidney disease',
        'If you are pregnant or breastfeeding'
      ],
      sideEffects: [
        'Mild digestive upset (rare)',
        'Unpleasant taste if not flavored'
      ],
      interactions: [
        'May enhance effects of other amino acids',
        'Best taken with carbohydrates for absorption'
      ],
      scientificEvidence: [
        {
          study: 'BCAA supplementation and exercise performance',
          journal: 'Journal of the International Society of Sports Nutrition',
          year: 2017,
          sampleSize: 156,
          results: 'Significant reduction in muscle soreness and improved recovery',
          url: 'https://pubmed.ncbi.nlm.nih.gov/28919842/'
        }
      ],
      price: 28.99,
      image: 'whey-protein.png',
      inStock: true,
      tags: ['bcaa', 'amino-acids', 'recovery', 'endurance', 'muscle']
    },
    {
      id: 'turmeric-curcumin',
      name: 'Turmeric Curcumin',
      category: 'recovery',
      shortDescription: 'Powerful anti-inflammatory for joint health and recovery',
      fullDescription: 'Curcumin, the active compound in turmeric, provides powerful anti-inflammatory benefits, supporting joint health and faster recovery from exercise.',
      benefits: [
        '60% reduction in inflammation markers',
        'Improved joint mobility and comfort',
        'Faster recovery from intense exercise',
        'Enhanced antioxidant protection',
        'Better overall joint health'
      ],
      ingredients: ['Curcumin Extract (500mg)', 'Black Pepper Extract', 'Vegetable Capsule'],
      dosage: {
        amount: '500-1000mg daily',
        frequency: '1-2 times daily',
        timing: 'With meals',
        duration: 'Ongoing for best results'
      },
      whenToTake: [
        'With meals for better absorption',
        'After intense workouts',
        'Consistently at the same time daily'
      ],
      whenNotToTake: [
        'If you have gallstones',
        'If you take blood thinners (consult doctor)',
        'If you have bile duct obstruction'
      ],
      sideEffects: [
        'Mild digestive upset (rare)',
        'May cause stomach irritation in sensitive individuals'
      ],
      interactions: [
        'May enhance blood thinning effects',
        'May interact with diabetes medications',
        'Consult doctor if taking blood thinners'
      ],
      scientificEvidence: [
        {
          study: 'Curcumin and exercise-induced inflammation',
          journal: 'European Journal of Applied Physiology',
          year: 2020,
          sampleSize: 89,
          results: 'Significant reduction in inflammation and muscle damage markers',
          url: 'https://pubmed.ncbi.nlm.nih.gov/32180068/'
        }
      ],
      price: 26.99,
      image: 'whey-protein.png',
      inStock: true,
      tags: ['turmeric', 'curcumin', 'inflammation', 'joints', 'antioxidant']
    },
    {
      id: 'electrolyte-complex',
      name: 'Electrolyte Complex',
      category: 'hydration',
      shortDescription: 'Complete electrolyte blend for hydration and performance',
      fullDescription: 'Comprehensive electrolyte formula with sodium, potassium, magnesium, and calcium to maintain proper hydration and muscle function during exercise.',
      benefits: [
        '40% better hydration retention',
        'Reduced muscle cramps',
        'Improved endurance performance',
        'Better recovery from dehydration',
        'Enhanced muscle function'
      ],
      ingredients: ['Sodium (500mg)', 'Potassium (200mg)', 'Magnesium (100mg)', 'Calcium (50mg)'],
      dosage: {
        amount: '1-2 scoops',
        frequency: 'During or after exercise',
        timing: 'With water during workouts',
        duration: 'As needed during exercise'
      },
      whenToTake: [
        'During long endurance sessions',
        'After intense workouts',
        'In hot weather or high sweat conditions'
      ],
      whenNotToTake: [
        'If you have kidney disease',
        'If you have high blood pressure (consult doctor)',
        'If you have heart conditions'
      ],
      sideEffects: [
        'Mild stomach upset if taken in excess',
        'May cause bloating if overconsumed'
      ],
      interactions: [
        'May enhance effects of other hydration supplements',
        'Best taken with adequate water intake'
      ],
      scientificEvidence: [
        {
          study: 'Electrolyte supplementation and exercise performance',
          journal: 'Sports Medicine',
          year: 2018,
          sampleSize: 134,
          results: 'Significant improvement in hydration status and performance',
          url: 'https://pubmed.ncbi.nlm.nih.gov/29978103/'
        }
      ],
      price: 21.99,
      image: 'whey-protein.png',
      inStock: true,
      tags: ['electrolytes', 'hydration', 'performance', 'cramps', 'endurance']
    },
    {
      id: 'iron-bisglycinate',
      name: 'Iron Bisglycinate',
      category: 'health',
      shortDescription: 'Gentle iron for energy and oxygen transport',
      fullDescription: 'Iron bisglycinate is a highly absorbable form of iron that supports oxygen transport, energy production, and prevents iron deficiency anemia.',
      benefits: [
        'Improved energy levels and endurance',
        'Better oxygen transport to muscles',
        'Prevents iron deficiency anemia',
        'Enhanced cognitive function',
        'Reduced fatigue and weakness'
      ],
      ingredients: ['Iron Bisglycinate (18mg)', 'Vitamin C (100mg)', 'Vegetable Capsule'],
      dosage: {
        amount: '18mg daily',
        frequency: 'Once daily',
        timing: 'On empty stomach with vitamin C',
        duration: '3-6 months or as directed by doctor'
      },
      whenToTake: [
        'First thing in the morning on empty stomach',
        'With vitamin C for better absorption',
        'Away from coffee, tea, and dairy'
      ],
      whenNotToTake: [
        'If you have hemochromatosis',
        'If you have iron overload',
        'If you take certain medications (consult doctor)'
      ],
      sideEffects: [
        'Constipation (common)',
        'Nausea if taken with food',
        'Dark stools (normal)'
      ],
      interactions: [
        'May reduce absorption of certain medications',
        'Avoid taking with calcium or zinc',
        'Consult doctor if taking other supplements'
      ],
      scientificEvidence: [
        {
          study: 'Iron supplementation and athletic performance',
          journal: 'International Journal of Sport Nutrition',
          year: 2019,
          sampleSize: 67,
          results: 'Significant improvement in endurance performance and energy levels',
          url: 'https://pubmed.ncbi.nlm.nih.gov/31222641/'
        }
      ],
      price: 19.99,
      image: 'whey-protein.png',
      inStock: true,
      tags: ['iron', 'energy', 'oxygen', 'anemia', 'endurance']
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
