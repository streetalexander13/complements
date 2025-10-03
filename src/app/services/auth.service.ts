import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscription?: {
    level: string;
    sports: string[];
    trainingFrequency: string;
    status: 'active' | 'paused' | 'cancelled';
    nextDelivery: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check for stored user on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<{ success: boolean; user?: User; error?: string }> {
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        // Mock authentication - in real app, this would call your backend
        if (email === 'demo@complements.com' && password === 'demo123') {
          const user: User = {
            id: '1',
            email: 'demo@complements.com',
            firstName: 'Demo',
            lastName: 'User',
            subscription: {
              level: 'Build Your Base',
              sports: ['running', 'climbing'],
              trainingFrequency: '3-4 times per week',
              status: 'active',
              nextDelivery: '2024-02-15'
            }
          };
          this.setCurrentUser(user);
          observer.next({ success: true, user });
        } else {
          observer.next({ success: false, error: 'Invalid email or password' });
        }
        observer.complete();
      }, 1000);
    });
  }

  signup(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Observable<{ success: boolean; user?: User; error?: string }> {
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        // Mock signup - in real app, this would call your backend
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        };
        this.setCurrentUser(user);
        observer.next({ success: true, user });
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  updateSubscription(subscription: User['subscription']): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, subscription };
      this.setCurrentUser(updatedUser);
    }
  }
}
