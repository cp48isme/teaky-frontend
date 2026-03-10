import { useState } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Spinner from '../ui/Spinner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  primaryColor?: string;
}

function PaymentForm({ onSuccess, primaryColor }: Omit<StripePaymentFormProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? 'Payment validation failed');
      setProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed. Please try again.');
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else if (paymentIntent && paymentIntent.status === 'requires_action') {
      setError('Additional authentication required. Please complete the verification.');
      setProcessing(false);
    } else {
      setError('Unexpected payment status. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full rounded-md px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
        style={{ backgroundColor: primaryColor || '#558B2F' }}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner className="h-4 w-4 text-white" /> Processing payment...
          </span>
        ) : (
          'Pay Now'
        )}
      </button>
    </form>
  );
}

export default function StripePaymentForm({
  clientSecret,
  onSuccess,
  primaryColor,
}: StripePaymentFormProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: primaryColor || '#558B2F',
          },
        },
      }}
    >
      <PaymentForm onSuccess={onSuccess} primaryColor={primaryColor} />
    </Elements>
  );
}
