import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getPrinterOrder,
  updateOrder,
  updateOrderStatus,
  updateProductionStatus,
  downloadOrderInvoicePdf,
} from '../api/orders';
import { listProofs, submitProof, approveProof, rejectProof } from '../api/proofs';
import { getOrderSyncStatus, manualPushOrder } from '../api/mis';
import { getTrackingInfo } from '../api/shipping';
import { syncOrderToQuickBooks } from '../api/quickbooks';
import type { Order } from '../types/order';
import { PRODUCTION_STATUSES } from '../types/order';
import type { Proof } from '../types/proof';
import type { OrderSyncStatus } from '../types/mis';
import type { TrackingInfo } from '../types/shipping';
import Spinner from '../components/ui/Spinner';

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  in_production: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-teal-100 text-teal-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const PRODUCTION_STATUS_COLORS: Record<string, string> = {
  received: 'bg-blue-50 text-blue-700',
  in_prepress: 'bg-yellow-50 text-yellow-700',
  printing: 'bg-purple-50 text-purple-700',
  finishing: 'bg-orange-50 text-orange-700',
  quality_check: 'bg-cyan-50 text-cyan-700',
  ready_to_ship: 'bg-green-50 text-green-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  picked_up: 'bg-teal-50 text-teal-700',
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  submitted: ['pending_approval', 'approved', 'cancelled'],
  pending_approval: ['approved', 'cancelled'],
  approved: ['in_production', 'cancelled'],
  in_production: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['completed'],
};

export default function PrinterOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  // MIS sync state
  const [syncStatus, setSyncStatus] = useState<OrderSyncStatus | null>(null);
  const [pushing, setPushing] = useState(false);

  // Production status state
  const [productionNotes, setProductionNotes] = useState('');
  const [updatingProduction, setUpdatingProduction] = useState(false);

  // Tracking info state
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);

  // QuickBooks sync state
  const [syncingQB, setSyncingQB] = useState(false);

  // Invoice state
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  // Proof submission state
  const [proofFileUrl, setProofFileUrl] = useState('');
  const [selectedLineItem, setSelectedLineItem] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const fetchData = async () => {
    if (!orderId) return;
    try {
      const [o, p] = await Promise.all([
        getPrinterOrder(orderId),
        listProofs(orderId),
      ]);
      setOrder(o);
      setProofs(p);
      setTrackingNumber(o.tracking_number || '');
      setNotes(o.notes || '');
      // Fetch sync status (best-effort)
      getOrderSyncStatus(orderId).then(setSyncStatus).catch(() => {});
      // Fetch tracking info if tracking number exists
      if (o.tracking_number) {
        getTrackingInfo(o.tracking_number).then(setTrackingInfo).catch(() => {});
      }
    } catch {
      // handled by loading state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orderId]);

  const handleStatusTransition = async (newStatus: string) => {
    if (!orderId) return;
    try {
      const updated = await updateOrderStatus(orderId, { status: newStatus });
      setOrder(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleProductionStatusUpdate = async (newStatus: string) => {
    if (!orderId) return;
    setUpdatingProduction(true);
    try {
      const updated = await updateProductionStatus(orderId, {
        production_status: newStatus,
        notes: productionNotes || undefined,
      });
      setOrder(updated);
      setProductionNotes('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update production status');
    } finally {
      setUpdatingProduction(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!orderId) return;
    try {
      const updated = await updateOrder(orderId, {
        tracking_number: trackingNumber || undefined,
        notes: notes || undefined,
      });
      setOrder(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleManualPush = async () => {
    if (!orderId) return;
    setPushing(true);
    try {
      await manualPushOrder(orderId);
      const status = await getOrderSyncStatus(orderId);
      setSyncStatus(status);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to push to MIS');
    } finally {
      setPushing(false);
    }
  };

  const handleSyncToQuickBooks = async () => {
    if (!orderId) return;
    setSyncingQB(true);
    try {
      const result = await syncOrderToQuickBooks(orderId);
      if (result.error) {
        alert(`QuickBooks sync error: ${result.error}`);
      } else {
        alert(`Synced to QuickBooks (Invoice: ${result.qbo_invoice_id || 'pending'})`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to sync to QuickBooks');
    } finally {
      setSyncingQB(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!orderId) return;
    setDownloadingInvoice(true);
    try {
      const blob = await downloadOrderInvoicePdf(orderId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order?.order_number || orderId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to download invoice');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const handleSubmitProof = async () => {
    if (!orderId || !selectedLineItem || !proofFileUrl) return;
    try {
      await submitProof(orderId, {
        line_item_id: selectedLineItem,
        file_url: proofFileUrl,
      });
      setProofFileUrl('');
      setSelectedLineItem('');
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit proof');
    }
  };

  const handleApproveProof = async (proofId: string) => {
    try {
      await approveProof(proofId);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve');
    }
  };

  const handleRejectProof = async (proofId: string) => {
    if (!rejectReason.trim()) {
      alert('Please enter a reason for rejection');
      return;
    }
    try {
      await rejectProof(proofId, { reason: rejectReason });
      setRejectReason('');
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (!order) {
    return <p className="py-8 text-center text-gray-500">Order not found.</p>;
  }

  const nextStatuses = VALID_TRANSITIONS[order.status] || [];
  const showProductionStatus = ['approved', 'in_production'].includes(order.status);

  return (
    <div className="space-y-6">
      <Link to="/orders" className="text-sm text-indigo-600 hover:text-indigo-800">
        &larr; Back to orders
      </Link>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{order.order_number}</h2>
        <div className="flex items-center gap-2">
          {order.production_status && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                PRODUCTION_STATUS_COLORS[order.production_status] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {order.production_status.replace(/_/g, ' ')}
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Status Actions */}
      {nextStatuses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {nextStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusTransition(status)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                status === 'cancelled'
                  ? 'border border-red-300 text-red-600 hover:bg-red-50'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Production Status Update */}
      {showProductionStatus && (
        <div className="rounded-lg border bg-white p-4 space-y-3">
          <h3 className="font-medium text-gray-900">Production Status</h3>
          <div className="flex flex-wrap gap-1.5">
            {PRODUCTION_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => handleProductionStatusUpdate(status)}
                disabled={updatingProduction || order.production_status === status}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                  order.production_status === status
                    ? 'bg-indigo-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500">Production Notes</label>
              <input
                type="text"
                value={productionNotes}
                onChange={(e) => setProductionNotes(e.target.value)}
                placeholder="Optional notes about this status..."
                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          {order.production_notes && (
            <p className="text-xs text-gray-500">Last note: {order.production_notes}</p>
          )}
        </div>
      )}

      {/* Line Items */}
      <div className="rounded-lg border bg-white p-4">
        <h3 className="font-medium text-gray-900">Line Items</h3>
        <div className="mt-3 space-y-3">
          {order.line_items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                <p className="text-xs text-gray-500">
                  {item.product_sku && `SKU: ${item.product_sku} | `}
                  Qty: {item.quantity}
                  {item.size && ` | Size: ${item.size}`}
                  {item.color && ` | Color: ${item.color}`}
                </p>
                {item.needs_proof && (
                  <span className={`mt-1 inline-block text-xs font-medium ${
                    item.proof_status === 'approved' ? 'text-green-600' :
                    item.proof_status === 'rejected' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    Proof: {item.proof_status || 'needed'}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium">${Number(item.line_total).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>${Number(order.shipping_cost).toFixed(2)}</span>
          </div>
          {Number(order.tax_amount) > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${Number(order.tax_amount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping, Tracking & Invoice */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h3 className="font-medium text-gray-900">Shipping Address</h3>
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <p>{order.shipping_address.name}</p>
            <p>{order.shipping_address.line1}</p>
            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
            <p>
              {order.shipping_address.city}, {order.shipping_address.state}{' '}
              {order.shipping_address.postal_code}
            </p>
          </div>

          {/* Tracking Info */}
          {trackingInfo && (
            <div className="mt-4 border-t pt-3">
              <h4 className="text-sm font-medium text-gray-900">Tracking</h4>
              <div className="mt-1 text-xs text-gray-600 space-y-1">
                <p>Status: <span className="font-medium">{trackingInfo.status}</span></p>
                {trackingInfo.carrier && <p>Carrier: {trackingInfo.carrier}</p>}
                {trackingInfo.estimated_delivery && (
                  <p>Est. Delivery: {new Date(trackingInfo.estimated_delivery).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-white p-4 space-y-3">
          <h3 className="font-medium text-gray-900">Details</h3>
          <div>
            <label className="block text-xs font-medium text-gray-500">Tracking Number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDetails}
              className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              onClick={handleDownloadInvoice}
              disabled={downloadingInvoice}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
            </button>
            <button
              onClick={handleSyncToQuickBooks}
              disabled={syncingQB}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {syncingQB ? 'Syncing...' : 'Sync to QB'}
            </button>
          </div>
        </div>
      </div>

      {/* MIS Sync */}
      {syncStatus && (
        <div className="rounded-lg border bg-white p-4 space-y-3">
          <h3 className="font-medium text-gray-900">MIS Sync</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">External ID:</span>{' '}
              <span className="font-mono">{syncStatus.dm_order_id ?? 'Not synced'}</span>
            </div>
            <div>
              <span className="text-gray-500">Last Sync:</span>{' '}
              {syncStatus.last_sync_at
                ? new Date(syncStatus.last_sync_at).toLocaleString()
                : 'Never'}
            </div>
            {syncStatus.last_sync_status && (
              <div>
                <span className="text-gray-500">Status:</span>{' '}
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    syncStatus.last_sync_status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : syncStatus.last_sync_status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {syncStatus.last_sync_status}
                </span>
              </div>
            )}
            {syncStatus.error_message && (
              <div className="col-span-2">
                <span className="text-gray-500">Error:</span>{' '}
                <span className="text-red-600 text-xs">{syncStatus.error_message}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleManualPush}
            disabled={pushing}
            className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {pushing ? 'Pushing...' : 'Push to MIS'}
          </button>
        </div>
      )}

      {/* Proofs Section */}
      {order.line_items.some((i) => i.needs_proof) && (
        <div className="rounded-lg border bg-white p-4">
          <h3 className="font-medium text-gray-900">Proofs</h3>

          {/* Submit Proof */}
          <div className="mt-3 flex flex-wrap gap-2 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-500">Line Item</label>
              <select
                value={selectedLineItem}
                onChange={(e) => setSelectedLineItem(e.target.value)}
                className="mt-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
              >
                <option value="">Select...</option>
                {order.line_items.filter(i => i.needs_proof).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.product_name} {item.size && `(${item.size})`}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500">Proof File URL</label>
              <input
                type="url"
                value={proofFileUrl}
                onChange={(e) => setProofFileUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
            <button
              onClick={handleSubmitProof}
              disabled={!selectedLineItem || !proofFileUrl}
              className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Submit Proof
            </button>
          </div>

          {/* Existing Proofs */}
          {proofs.length > 0 && (
            <div className="mt-4 space-y-3">
              {proofs.map((proof) => (
                <div key={proof.id} className="rounded border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Version {proof.version}
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          proof.status === 'approved' ? 'bg-green-100 text-green-800' :
                          proof.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {proof.status}
                        </span>
                      </p>
                      {proof.file_url && (
                        <a href={proof.file_url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline">
                          View File
                        </a>
                      )}
                      {proof.rejection_reason && (
                        <p className="mt-1 text-xs text-red-600">Reason: {proof.rejection_reason}</p>
                      )}
                    </div>
                    {proof.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveProof(proof.id)}
                          className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason..."
                            className="w-32 rounded border px-2 py-1 text-xs"
                          />
                          <button
                            onClick={() => handleRejectProof(proof.id)}
                            className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
