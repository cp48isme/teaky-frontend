import { apiRequest } from './client';
import type { LoginRateLimiterHealth } from '../types/lockouts';

/** The login rate limiter's state, staff session required (team:manage). */
export async function getLoginLimiterStatus(): Promise<LoginRateLimiterHealth> {
  return apiRequest<LoginRateLimiterHealth>('/auth/lockouts/status');
}
