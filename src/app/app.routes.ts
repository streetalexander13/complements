import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RecommendationWizardComponent } from './components/recommendation-wizard/recommendation-wizard.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SupplementsCatalogComponent } from './components/supplements-catalog/supplements-catalog.component';
import { SupplementDetailComponent } from './components/supplement-detail/supplement-detail.component';
import { ResearchComponent } from './components/research/research.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'wizard', component: RecommendationWizardComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'supplements', component: SupplementsCatalogComponent },
  { path: 'supplement/:id', component: SupplementDetailComponent },
  { path: 'products', redirectTo: 'supplements' },
  { path: 'research', component: ResearchComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '' }
];
