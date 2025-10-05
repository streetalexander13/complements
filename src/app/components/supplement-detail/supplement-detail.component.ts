import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupplementCatalogService, SupplementDetail, SupplementCategory } from '../../services/supplement-catalog.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-supplement-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './supplement-detail.component.html',
  styleUrls: ['./supplement-detail.component.scss']
})
export class SupplementDetailComponent implements OnInit {
  supplement: SupplementDetail | null = null;
  category: SupplementCategory | null = null;
  isLoading = true;
  selectedTab = 'overview';
  quantity = 1;
  showAllStudies = false;
  selectedStudyType = 'all';
  filteredStudies: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplementCatalogService: SupplementCatalogService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      const supplementId = params['id'];
      console.log('Extracted supplement ID:', supplementId);
      this.loadSupplement(supplementId);
    });
  }

  loadSupplement(id: string): void {
    console.log('Loading supplement with ID:', id);
    this.isLoading = true;
    
    // Simulate loading delay
    setTimeout(() => {
      this.supplement = this.supplementCatalogService.getSupplementById(id) || null;
      console.log('Found supplement:', this.supplement);
      
      if (this.supplement) {
        this.category = this.supplementCatalogService.getCategories()
          .find(cat => cat.id === this.supplement!.category) || null;
        console.log('Found category:', this.category);
      } else {
        console.log('No supplement found with ID:', id);
        // Let's see what supplements are available
        const allSupplements = this.supplementCatalogService.getAllSupplements();
        console.log('Available supplements:', allSupplements.map(s => ({ id: s.id, name: s.name })));
      }
      
      this.isLoading = false;
    }, 500);
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

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getTotalPrice(): number {
    return this.supplement ? this.supplement.price * this.quantity : 0;
  }

  addToBox(): void {
    if (this.supplement) {
      this.cartService.addToCart(this.supplement, this.quantity);
      // Optionally navigate to cart or show success message
      console.log('Added to cart:', this.supplement.name, 'Quantity:', this.quantity);
    }
  }

  goBack(): void {
    this.router.navigate(['/supplements']);
  }

  toggleShowAll(): void {
    this.showAllStudies = !this.showAllStudies;
  }

  getDisplayedStudies(): any[] {
    if (this.showAllStudies) {
      return this.filteredStudies;
    }
    return this.supplement?.scientificEvidence.slice(0, 3) || [];
  }

  filterStudies(): void {
    if (!this.supplement) return;
    
    let filtered = [...this.supplement.scientificEvidence];

    if (this.selectedStudyType !== 'all') {
      filtered = filtered.filter(study => study.credibility === this.selectedStudyType);
    }

    this.filteredStudies = filtered;
  }

  getMetaAnalysisCount(): number {
    return this.supplement?.scientificEvidence.filter(study => study.credibility === 'meta-analysis').length || 0;
  }

  getHighCredibilityCount(): number {
    return this.supplement?.scientificEvidence.filter(study => study.credibilityScore >= 90).length || 0;
  }

  getCredibilityIcon(credibility: string): string {
    const icons: { [key: string]: string } = {
      'meta-analysis': 'analytics',
      'systematic-review': 'search',
      'rct': 'science',
      'cohort': 'trending_up'
    };
    return icons[credibility] || 'article';
  }

  getCredibilityLabel(credibility: string): string {
    const labels: { [key: string]: string } = {
      'meta-analysis': 'Meta-Analysis',
      'systematic-review': 'Systematic Review',
      'rct': 'RCT',
      'cohort': 'Cohort Study'
    };
    return labels[credibility] || 'Study';
  }
}
