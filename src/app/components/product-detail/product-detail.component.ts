import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supplement, ScientificReference } from '../../models/supplement.model';
import { SupplementDataService } from '../../services/supplement-data.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  @Input() supplementId: string = '';
  supplement: Supplement | undefined;
  selectedTab = 'benefits';
  quantity = 1;

  constructor(private supplementDataService: SupplementDataService) {}

  ngOnInit(): void {
    if (this.supplementId) {
      this.supplement = this.supplementDataService.getSupplementById(this.supplementId);
    }
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    // TODO: Implement cart functionality
    console.log(`Added ${this.quantity} x ${this.supplement?.name} to cart`);
  }

  getStrengthClass(strength: string): string {
    const classes = {
      'weak': 'strength-weak',
      'moderate': 'strength-moderate',
      'strong': 'strength-strong',
      'very-strong': 'strength-very-strong'
    };
    return classes[strength as keyof typeof classes] || '';
  }

  getStrengthLabel(strength: string): string {
    const labels = {
      'weak': 'Limited Evidence',
      'moderate': 'Moderate Evidence',
      'strong': 'Strong Evidence',
      'very-strong': 'Very Strong Evidence'
    };
    return labels[strength as keyof typeof labels] || strength;
  }

  getStudyTypeLabel(type: string): string {
    const labels = {
      'meta-analysis': 'Meta-Analysis',
      'rct': 'Randomized Controlled Trial',
      'cohort': 'Cohort Study',
      'case-control': 'Case-Control Study',
      'systematic-review': 'Systematic Review'
    };
    return labels[type as keyof typeof labels] || type;
  }

  getStudyTypeClass(type: string): string {
    const classes = {
      'meta-analysis': 'study-meta',
      'rct': 'study-rct',
      'cohort': 'study-cohort',
      'case-control': 'study-case-control',
      'systematic-review': 'study-systematic'
    };
    return classes[type as keyof typeof classes] || '';
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getTotalPrice(): number {
    if (!this.supplement) return 0;
    return this.supplement.price * this.quantity;
  }

  getReferenceUrl(refId: string): string {
    const ref = this.supplementDataService.getScientificReference(refId);
    return ref?.url || '#';
  }

  getReferenceTitle(refId: string): string {
    const ref = this.supplementDataService.getScientificReference(refId);
    return ref?.title || 'Reference not found';
  }

  getTotalSampleSize(): number {
    if (!this.supplement) return 0;
    return this.supplement.scientificReferences.reduce((total, ref) => total + ref.sampleSize, 0);
  }
}
