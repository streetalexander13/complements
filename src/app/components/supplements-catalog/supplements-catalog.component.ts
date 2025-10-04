import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupplementCatalogService, SupplementCategory, SupplementDetail } from '../../services/supplement-catalog.service';
import { TypingAnimationService } from '../../services/typing-animation.service';

@Component({
  selector: 'app-supplements-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './supplements-catalog.component.html',
  styleUrls: ['./supplements-catalog.component.scss']
})
export class SupplementsCatalogComponent implements OnInit, AfterViewInit {
  categories: SupplementCategory[] = [];
  supplements: SupplementDetail[] = [];
  filteredSupplements: SupplementDetail[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';
  isLoading = false;

  constructor(
    private supplementCatalogService: SupplementCatalogService,
    private typingService: TypingAnimationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.startAnimations();
  }

  loadData(): void {
    this.isLoading = true;
    
    // Simulate loading delay
    setTimeout(() => {
      this.categories = this.supplementCatalogService.getCategories();
      this.supplements = this.supplementCatalogService.getAllSupplements();
      this.filteredSupplements = this.supplements;
      this.isLoading = false;
    }, 500);
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory = categoryId;
    
    // Clear search query when switching to "all" category
    if (categoryId === 'all') {
      this.searchQuery = '';
    }
    
    this.filterSupplements();
  }

  onSearchChange(): void {
    this.filterSupplements();
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.filterSupplements();
  }

  filterSupplements(): void {
    let filtered = [...this.supplements]; // Create a copy to avoid mutating original array

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(supplement => supplement.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery && this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(supplement => 
        supplement.name.toLowerCase().includes(query) ||
        supplement.tags.some(tag => tag.toLowerCase().includes(query)) ||
        supplement.benefits.some(benefit => benefit.toLowerCase().includes(query))
      );
    }

    this.filteredSupplements = filtered;
    
    // Trigger stagger animation for filtered results
    this.animateFilteredResults();
  }

  getCategoryById(categoryId: string): SupplementCategory | undefined {
    return this.categories.find(cat => cat.id === categoryId);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getSupplementsByCategory(categoryId: string): SupplementDetail[] {
    return this.supplements.filter(supplement => supplement.category === categoryId);
  }

  private async startAnimations(): Promise<void> {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 600));

    // Animate supplement cards with stagger effect
    this.animateFilteredResults();
  }

  private async animateFilteredResults(): Promise<void> {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Wait for DOM to update
    await new Promise(resolve => setTimeout(resolve, 50));

    // Animate supplement cards with stagger effect
    const supplementCards = document.querySelectorAll('.supplement-card.stagger-item');
    if (supplementCards.length > 0) {
      await this.typingService.staggerText(Array.from(supplementCards) as HTMLElement[], 100);
    }
  }
}
