import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RecommendationWizardComponent } from './components/recommendation-wizard/recommendation-wizard.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'wizard', component: RecommendationWizardComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'products', redirectTo: '' }, // Will implement products list later
  { path: 'research', redirectTo: '' }, // Will implement research page later
  { path: '**', redirectTo: '' }
];
