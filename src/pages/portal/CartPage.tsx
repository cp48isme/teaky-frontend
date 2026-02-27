import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { usePortalContext } from '../../contexts/PortalContext';
import Spinner from '../../components/ui/Spinner';

export default function CartPage() {
  const { slug } = useParams<{ slug: string }>();
  const { portal } = usePortalContext();
  const { cart, loading, updateItem, removeItem } = useCart();

  const primaryColor = portal?.brand_config?.primary_color || '#4F46E5';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-lg font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-gray-500">
          Browse products and add items to your cart.
        </p>
        <Link
          to={`/p/${slug}/products`}
          className="mt-4 inline-block rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const shippingCost = 9.99;
  const total = cart.subtotal + shippingCost;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="mt-6 space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border bg-white p-4"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                Product
              </p>
              <div className="mt-1 flex gap-3 text-xs text-gray-500">
                {item.size && <span>Size: {item.size}</span>}
                {item.color && <span>Color: {item.color}</span>}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                ${item.unit_price.toFixed(2)} each
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    item.quantity > 1
                      ? updateItem(item.id, { quantity: item.quantity - 1 })
                      : removeItem(item.id)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded border text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                  className="flex h-7 w-7 items-center justify-center rounded border text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <p className="w-20 text-right font-medium text-gray-900">
                ${(item.unit_price * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-6 rounded-lg border bg-white p-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>${cart.subtotal.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>
        <div className="mt-2 border-t pt-2 flex justify-between font-medium text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <Link
          to={`/p/${slug}/products`}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Continue Shopping
        </Link>
        <Link
          to={`/p/${slug}/checkout`}
          className="rounded-md px-6 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
