import { apiRequest } from './client';
import type { Proof, SubmitProofRequest, RejectProofRequest } from '../types/proof';

export async function listProofs(orderId: string): Promise<Proof[]> {
  return apiRequest<Proof[]>(`/orders/${orderId}/proofs`);
}

export async function submitProof(
  orderId: string,
  data: SubmitProofRequest,
): Promise<Proof> {
  return apiRequest<Proof>(`/orders/${orderId}/proofs`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProof(proofId: string): Promise<Proof> {
  return apiRequest<Proof>(`/proofs/${proofId}`);
}

export async function approveProof(proofId: string): Promise<Proof> {
  return apiRequest<Proof>(`/proofs/${proofId}/approve`, { method: 'POST' });
}

export async function rejectProof(
  proofId: string,
  data: RejectProofRequest,
): Promise<Proof> {
  return apiRequest<Proof>(`/proofs/${proofId}/reject`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
