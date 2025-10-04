import { Component, HostListener, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isBrowser } from './utils/browser.utils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'With Complements';
  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    console.log('Mobile menu toggled, current state:', this.isMobileMenuOpen);
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('Mobile menu new state:', this.isMobileMenuOpen);
    this.updateBodyScroll();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.updateBodyScroll();
  }

  private updateBodyScroll(): void {
    if (isBrowser()) {
      if (this.isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth > 768) {
      this.isMobileMenuOpen = false;
      this.updateBodyScroll();
    }
  }

  ngOnDestroy(): void {
    // Restore body scroll when component is destroyed
    if (isBrowser()) {
      document.body.style.overflow = '';
    }
  }
}
