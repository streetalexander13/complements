import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupplementCatalogService, SupplementCategory, SupplementDetail } from '../../services/supplement-catalog.service';

@Component({
  selector: 'app-supplements-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './supplements-catalog.component.html',
  styleUrls: ['./supplements-catalog.component.scss']
})
export class SupplementsCatalogComponent implements OnInit {
  categories: SupplementCategory[] = [];
  supplements: SupplementDetail[] = [];
  filteredSupplements: SupplementDetail[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';
  isLoading = false;

  constructor(private supplementCatalogService: SupplementCatalogService) {}

  ngOnInit(): void {
    this.loadData();
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
    this.filterSupplements();
  }

  onSearchChange(): void {
    this.filterSupplements();
  }

  filterSupplements(): void {
    let filtered = this.supplements;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(supplement => supplement.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(supplement => 
        supplement.name.toLowerCase().includes(query) ||
        supplement.tags.some(tag => tag.toLowerCase().includes(query)) ||
        supplement.benefits.some(benefit => benefit.toLowerCase().includes(query))
      );
    }

    this.filteredSupplements = filtered;
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
}
