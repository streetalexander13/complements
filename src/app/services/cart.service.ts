import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Supplement } from '../models/supplement.model';

export interface CartItem {
  supplement: any; // Simplified to avoid type conflicts
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    // Load cart from localStorage if available
    this.loadCartFromStorage();
  }

  addToCart(supplement: any, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.supplement.id === supplement.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ supplement, quantity });
    }
    
    this.updateCart();
  }

  removeFromCart(supplementId: string): void {
    this.cartItems = this.cartItems.filter(item => item.supplement.id !== supplementId);
    this.updateCart();
  }

  updateQuantity(supplementId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.supplement.id === supplementId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(supplementId);
      } else {
        item.quantity = quantity;
        this.updateCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.supplement.price * item.quantity), 0);
  }

  isInCart(supplementId: string): boolean {
    return this.cartItems.some(item => item.supplement.id === supplementId);
  }

  private updateCart(): void {
    this.cartItemsSubject.next([...this.cartItems]);
    this.saveCartToStorage();
  }

  private saveCartToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('complements-cart', JSON.stringify(this.cartItems));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedCart = localStorage.getItem('complements-cart');
      if (savedCart) {
        try {
          this.cartItems = JSON.parse(savedCart);
          this.cartItemsSubject.next([...this.cartItems]);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
          this.cartItems = [];
        }
      }
    }
  }
}
