import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { SupplementCatalogService } from '../../services/supplement-catalog.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  cartItemCount = 0;

  constructor(
    private cartService: CartService,
    private supplementCatalogService: SupplementCatalogService
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  updateQuantity(supplementId: string, quantity: number): void {
    this.cartService.updateQuantity(supplementId, quantity);
  }

  removeItem(supplementId: string): void {
    this.cartService.removeFromCart(supplementId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  formatPrice(price: number): string {
    return `£${price.toFixed(2)}`;
  }

  getCategoryName(categoryId: string): string {
    const category = this.supplementCatalogService.getCategories().find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  }
}
