import { Injectable } from '@angular/core';
import { Supplement, SupplementCategory, ScientificReference, Benefit, Ingredient, DosageInfo } from '../models/supplement.model';

@Injectable({
  providedIn: 'root'
})
export class SupplementDataService {
  private supplements: Supplement[] = [];
  private scientificReferences: ScientificReference[] = [];

  constructor() {
    this.initializeScientificReferences();
    this.initializeSupplements();
  }

  private initializeScientificReferences(): void {
    this.scientificReferences = [
      {
        id: 'ref001',
        title: 'Effects of Creatine Supplementation on Muscle Strength and Power',
        authors: ['Kreider RB', 'Kalman DS', 'Antonio J'],
        journal: 'Journal of the International Society of Sports Nutrition',
        year: 2017,
        doi: '10.1186/s12970-017-0173-z',
        url: 'https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z',
        studyType: 'meta-analysis',
        sampleSize: 1000,
        keyFindings: ['Creatine increases muscle strength by 8-14%', 'Improves power output by 3-5%', 'Safe for long-term use'],
        relevanceScore: 9
      },
      {
        id: 'ref002',
        title: 'Omega-3 Fatty Acids and Cardiovascular Disease',
        authors: ['Mozaffarian D', 'Wu JH'],
        journal: 'Journal of the American College of Cardiology',
        year: 2011,
        doi: '10.1016/j.jacc.2011.06.063',
        url: 'https://www.sciencedirect.com/science/article/pii/S0735109711019633',
        studyType: 'meta-analysis',
        sampleSize: 25000,
        keyFindings: ['Reduces cardiovascular mortality by 9%', 'Decreases risk of sudden cardiac death', 'Lowers triglyceride levels'],
        relevanceScore: 10
      },
      {
        id: 'ref003',
        title: 'Vitamin D and Bone Health in Adults',
        authors: ['Holick MF', 'Binkley NC', 'Bischoff-Ferrari HA'],
        journal: 'Endocrine Reviews',
        year: 2011,
        doi: '10.1210/er.2011-0012',
        url: 'https://academic.oup.com/edrv/article/32/3/266/2354736',
        studyType: 'systematic-review',
        sampleSize: 50000,
        keyFindings: ['Reduces fracture risk by 20%', 'Improves bone mineral density', 'Essential for calcium absorption'],
        relevanceScore: 9
      },
      {
        id: 'ref004',
        title: 'Probiotics and Immune Function',
        authors: ['Yan F', 'Polk DB'],
        journal: 'Current Opinion in Gastroenterology',
        year: 2011,
        doi: '10.1097/MOG.0b013e32834baa4d',
        url: 'https://journals.lww.com/co-gastroenterology/Abstract/2011/11000/Probiotics_and_immune_function.2.aspx',
        studyType: 'rct',
        sampleSize: 500,
        keyFindings: ['Enhances immune response', 'Reduces inflammation', 'Improves gut barrier function'],
        relevanceScore: 8
      },
      {
        id: 'ref005',
        title: 'Whey Protein and Muscle Protein Synthesis',
        authors: ['Morton RW', 'McGlory C', 'Phillips SM'],
        journal: 'Sports Medicine',
        year: 2018,
        doi: '10.1007/s40279-017-0849-1',
        url: 'https://link.springer.com/article/10.1007/s40279-017-0849-1',
        studyType: 'meta-analysis',
        sampleSize: 2000,
        keyFindings: ['Increases muscle protein synthesis by 31%', 'Superior to other protein sources', 'Optimal timing post-workout'],
        relevanceScore: 9
      }
    ];
  }

  private initializeSupplements(): void {
    this.supplements = [
      {
        id: 'creatine-monohydrate',
        name: 'Creatine Monohydrate',
        category: SupplementCategory.SPORTS_NUTRITION,
        description: 'The most researched and effective form of creatine for improving strength, power, and muscle mass.',
        benefits: [
          {
            title: 'Increased Muscle Strength',
            description: 'Creatine increases phosphocreatine stores in muscles, providing rapid energy for high-intensity activities.',
            strength: 'very-strong',
            scientificReferences: ['ref001'],
            targetPopulation: ['athletes', 'strength trainers', 'bodybuilders']
          },
          {
            title: 'Enhanced Power Output',
            description: 'Improves explosive power and performance in short-duration, high-intensity activities.',
            strength: 'strong',
            scientificReferences: ['ref001'],
            targetPopulation: ['sprinters', 'power athletes', 'weightlifters']
          },
          {
            title: 'Muscle Mass Gain',
            description: 'Promotes muscle growth through increased training capacity and cell volumization.',
            strength: 'moderate',
            scientificReferences: ['ref001'],
            targetPopulation: ['bodybuilders', 'fitness enthusiasts']
          }
        ],
        ingredients: [
          {
            name: 'Creatine Monohydrate',
            amount: '5',
            unit: 'g',
            purpose: 'Primary active ingredient for ATP regeneration',
            scientificReferences: ['ref001']
          }
        ],
        dosage: {
          recommended: '3-5g daily',
          timing: 'Post-workout or with meals',
          duration: 'Continuous use recommended',
          notes: 'Loading phase (20g/day for 5-7 days) optional but not necessary'
        },
        scientificReferences: [this.scientificReferences[0]],
        contraindications: ['Kidney disease', 'Diabetes (consult physician)'],
        price: 24.99,
        imageUrl: '/assets/images/creatine.jpg',
        rating: 4.8,
        reviewCount: 1247
      },
      {
        id: 'omega-3-fish-oil',
        name: 'Omega-3 Fish Oil',
        category: SupplementCategory.HEART_HEALTH,
        description: 'High-potency fish oil providing EPA and DHA for cardiovascular and cognitive health.',
        benefits: [
          {
            title: 'Heart Health',
            description: 'Reduces cardiovascular disease risk and supports healthy blood pressure.',
            strength: 'very-strong',
            scientificReferences: ['ref002'],
            targetPopulation: ['adults over 30', 'heart disease risk factors']
          },
          {
            title: 'Brain Function',
            description: 'DHA is essential for brain development and cognitive function maintenance.',
            strength: 'moderate',
            scientificReferences: ['ref002'],
            targetPopulation: ['adults', 'elderly', 'students']
          },
          {
            title: 'Anti-Inflammatory',
            description: 'Reduces systemic inflammation and supports joint health.',
            strength: 'moderate',
            scientificReferences: ['ref002'],
            targetPopulation: ['athletes', 'inflammatory conditions']
          }
        ],
        ingredients: [
          {
            name: 'EPA (Eicosapentaenoic Acid)',
            amount: '1000',
            unit: 'mg',
            purpose: 'Anti-inflammatory and cardiovascular support',
            scientificReferences: ['ref002']
          },
          {
            name: 'DHA (Docosahexaenoic Acid)',
            amount: '500',
            unit: 'mg',
            purpose: 'Brain and eye health support',
            scientificReferences: ['ref002']
          }
        ],
        dosage: {
          recommended: '1000-2000mg daily',
          timing: 'With meals',
          duration: 'Long-term use recommended',
          notes: 'Take with food to improve absorption'
        },
        scientificReferences: [this.scientificReferences[1]],
        contraindications: ['Fish allergies', 'Blood thinning medications'],
        price: 34.99,
        imageUrl: '/assets/images/omega3.jpg',
        rating: 4.7,
        reviewCount: 892
      },
      {
        id: 'vitamin-d3',
        name: 'Vitamin D3',
        category: SupplementCategory.VITAMINS,
        description: 'High-potency vitamin D3 for bone health, immune function, and overall wellness.',
        benefits: [
          {
            title: 'Bone Health',
            description: 'Essential for calcium absorption and bone mineralization.',
            strength: 'very-strong',
            scientificReferences: ['ref003'],
            targetPopulation: ['adults', 'postmenopausal women', 'elderly']
          },
          {
            title: 'Immune Support',
            description: 'Modulates immune function and reduces infection risk.',
            strength: 'moderate',
            scientificReferences: ['ref003'],
            targetPopulation: ['immune-compromised', 'frequent illness']
          },
          {
            title: 'Mood Support',
            description: 'May help with seasonal mood changes and depression.',
            strength: 'weak',
            scientificReferences: ['ref003'],
            targetPopulation: ['seasonal depression', 'mood disorders']
          }
        ],
        ingredients: [
          {
            name: 'Cholecalciferol (Vitamin D3)',
            amount: '5000',
            unit: 'IU',
            purpose: 'Active form of vitamin D for optimal absorption',
            scientificReferences: ['ref003']
          }
        ],
        dosage: {
          recommended: '2000-5000 IU daily',
          timing: 'With fat-containing meals',
          duration: 'Year-round, especially in winter',
          notes: 'Get blood levels tested to determine optimal dosage'
        },
        scientificReferences: [this.scientificReferences[2]],
        contraindications: ['Hypercalcemia', 'Kidney stones', 'Sarcoidosis'],
        price: 19.99,
        imageUrl: '/assets/images/vitamin-d3.jpg',
        rating: 4.6,
        reviewCount: 2156
      },
      {
        id: 'whey-protein-isolate',
        name: 'Whey Protein Isolate',
        category: SupplementCategory.PROTEIN,
        description: 'High-quality, fast-absorbing protein for muscle building and recovery.',
        benefits: [
          {
            title: 'Muscle Protein Synthesis',
            description: 'Stimulates muscle protein synthesis more effectively than other protein sources.',
            strength: 'very-strong',
            scientificReferences: ['ref005'],
            targetPopulation: ['athletes', 'bodybuilders', 'fitness enthusiasts']
          },
          {
            title: 'Recovery Support',
            description: 'Accelerates muscle recovery after intense training sessions.',
            strength: 'strong',
            scientificReferences: ['ref005'],
            targetPopulation: ['athletes', 'active individuals']
          },
          {
            title: 'Weight Management',
            description: 'Promotes satiety and helps maintain lean body mass during weight loss.',
            strength: 'moderate',
            scientificReferences: ['ref005'],
            targetPopulation: ['weight loss', 'body recomposition']
          }
        ],
        ingredients: [
          {
            name: 'Whey Protein Isolate',
            amount: '25',
            unit: 'g',
            purpose: 'Complete amino acid profile for muscle building',
            scientificReferences: ['ref005']
          },
          {
            name: 'BCAAs (Branched-Chain Amino Acids)',
            amount: '5.5',
            unit: 'g',
            purpose: 'Leucine, isoleucine, and valine for muscle protein synthesis',
            scientificReferences: ['ref005']
          }
        ],
        dosage: {
          recommended: '20-40g per serving',
          timing: 'Post-workout or between meals',
          duration: 'As needed for protein goals',
          notes: 'Mix with water, milk, or smoothies'
        },
        scientificReferences: [this.scientificReferences[4]],
        contraindications: ['Dairy allergies', 'Lactose intolerance (use isolate)'],
        price: 49.99,
        imageUrl: '/assets/images/whey-protein.jpg',
        rating: 4.9,
        reviewCount: 3421
      },
      {
        id: 'probiotic-complex',
        name: 'Probiotic Complex',
        category: SupplementCategory.PROBIOTICS,
        description: 'Multi-strain probiotic formula for digestive and immune health.',
        benefits: [
          {
            title: 'Digestive Health',
            description: 'Supports healthy gut microbiome and digestive function.',
            strength: 'strong',
            scientificReferences: ['ref004'],
            targetPopulation: ['digestive issues', 'antibiotic users']
          },
          {
            title: 'Immune Function',
            description: 'Enhances immune response and reduces infection risk.',
            strength: 'moderate',
            scientificReferences: ['ref004'],
            targetPopulation: ['frequent illness', 'immune support']
          },
          {
            title: 'Nutrient Absorption',
            description: 'Improves absorption of vitamins and minerals.',
            strength: 'weak',
            scientificReferences: ['ref004'],
            targetPopulation: ['malabsorption', 'nutrient deficiencies']
          }
        ],
        ingredients: [
          {
            name: 'Lactobacillus acidophilus',
            amount: '10',
            unit: 'billion CFU',
            purpose: 'Primary probiotic strain for gut health',
            scientificReferences: ['ref004']
          },
          {
            name: 'Bifidobacterium bifidum',
            amount: '5',
            unit: 'billion CFU',
            purpose: 'Supports immune function and gut barrier',
            scientificReferences: ['ref004']
          }
        ],
        dosage: {
          recommended: '1 capsule daily',
          timing: 'On empty stomach or with light meal',
          duration: 'Continuous use recommended',
          notes: 'Refrigerate for optimal potency'
        },
        scientificReferences: [this.scientificReferences[3]],
        contraindications: ['Severe immune deficiency', 'Central line infections'],
        price: 29.99,
        imageUrl: '/assets/images/probiotic.jpg',
        rating: 4.5,
        reviewCount: 678
      }
    ];
  }

  getAllSupplements(): Supplement[] {
    return this.supplements;
  }

  getSupplementById(id: string): Supplement | undefined {
    return this.supplements.find(s => s.id === id);
  }

  getSupplementsByCategory(category: SupplementCategory): Supplement[] {
    return this.supplements.filter(s => s.category === category);
  }

  getScientificReference(id: string): ScientificReference | undefined {
    return this.scientificReferences.find(r => r.id === id);
  }

  getAllScientificReferences(): ScientificReference[] {
    return this.scientificReferences;
  }
}
