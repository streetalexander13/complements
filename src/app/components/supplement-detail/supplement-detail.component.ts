import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupplementCatalogService, SupplementDetail, SupplementCategory } from '../../services/supplement-catalog.service';

@Component({
  selector: 'app-supplement-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './supplement-detail.component.html',
  styleUrls: ['./supplement-detail.component.scss']
})
export class SupplementDetailComponent implements OnInit {
  supplement: SupplementDetail | null = null;
  category: SupplementCategory | null = null;
  isLoading = true;
  selectedTab = 'overview';
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplementCatalogService: SupplementCatalogService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const supplementId = params['id'];
      this.loadSupplement(supplementId);
    });
  }

  loadSupplement(id: string): void {
    this.isLoading = true;
    
    // Simulate loading delay
    setTimeout(() => {
      this.supplement = this.supplementCatalogService.getSupplementById(id) || null;
      
      if (this.supplement) {
        this.category = this.supplementCatalogService.getCategories()
          .find(cat => cat.id === this.supplement!.category) || null;
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
    // TODO: Implement add to box functionality
    console.log('Adding to box:', this.supplement?.name, 'Quantity:', this.quantity);
  }

  goBack(): void {
    this.router.navigate(['/supplements']);
  }
}
