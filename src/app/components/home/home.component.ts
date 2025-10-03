import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplementDataService } from '../../services/supplement-data.service';
import { Supplement } from '../../models/supplement.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredSupplements: Supplement[] = [];
  stats = {
    studies: 0,
    supplements: 0,
    customers: 0
  };

  constructor(private supplementDataService: SupplementDataService) {}

  ngOnInit(): void {
    this.loadFeaturedSupplements();
    this.calculateStats();
  }

  private loadFeaturedSupplements(): void {
    const allSupplements = this.supplementDataService.getAllSupplements();
    this.featuredSupplements = allSupplements.slice(0, 3); // Show top 3
  }

  private calculateStats(): void {
    const allSupplements = this.supplementDataService.getAllSupplements();
    const allReferences = this.supplementDataService.getAllScientificReferences();
    
    this.stats = {
      studies: allReferences.length,
      supplements: allSupplements.length,
      customers: 12500 // Mock data
    };
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}
