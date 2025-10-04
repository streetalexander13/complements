import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplementDataService } from '../../services/supplement-data.service';
import { Supplement } from '../../models/supplement.model';
import { TypingAnimationService } from '../../services/typing-animation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  featuredSupplements: Supplement[] = [];
  stats = {
    studies: 0,
    supplements: 0,
    customers: 0
  };

  constructor(
    private supplementDataService: SupplementDataService,
    private typingService: TypingAnimationService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedSupplements();
    this.calculateStats();
  }

  ngAfterViewInit(): void {
    this.startAnimations();
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

  private async startAnimations(): Promise<void> {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Wait a bit for the page to load
    await new Promise(resolve => setTimeout(resolve, 200));

    // Make hero stats visible immediately
    this.makeHeroStatsVisible();

    // Animate hero text in parallel
    this.animateHeroText();
  }

  private makeHeroStatsVisible(): void {
    const statItems = document.querySelectorAll('.hero-stat-item');
    statItems.forEach((item, index) => {
      setTimeout(() => {
        (item as HTMLElement).classList.add('visible');
      }, index * 150); // Stagger by 150ms each
    });
  }

  private async animateHeroText(): Promise<void> {
    const heroText1 = document.getElementById('hero-text-1');
    const heroText2 = document.getElementById('hero-text-2');
    
    if (heroText1) {
      await this.typingService.typeTextWithCursor(heroText1, 'Stop Guessing.', 60);
    }
    
    if (heroText2) {
      await this.typingService.typeTextWithCursor(heroText2, 'Start Performing.', 60);
    }
  }
}
