import { Routes } from '@angular/router';
import { TodosPage } from './components/todos-page/todos-page';

export const routes: Routes = [
  { path: 'todos/:status', component: TodosPage },
  // { path: 'about', loadChildren: () => import('./about/about.routes').then(m => m.aboutRoutes) },
  { path: '**', redirectTo: 'todos/all', pathMatch: 'full' },
];
