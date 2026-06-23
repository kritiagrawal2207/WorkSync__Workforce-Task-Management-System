import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
 
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
 
  const allowedRoles: string[] = route.data['roles'] ?? [];
  const userRole = authService.getRole();
 
  if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
    return true;
  }
  router.navigate(['/dashboard']);
  return false;
};