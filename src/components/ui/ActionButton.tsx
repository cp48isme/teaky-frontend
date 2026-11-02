import { useId, type ButtonHTMLAttributes, type ReactNode } from 'react';

// A button that says why it cannot be pressed (30 Oct 2026, ruling R1). A
// disabled primary button with no reason was the third silent shape found on
// 29 Oct: recipients empty, phone empty, nothing anywhere said so. The reason
// renders beside the button and is wired to it by aria-describedby, so it is
// read out with the button's name.

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Why the button cannot be pressed right now; null or '' when it can. */
  reason?: string | null;
  pending?: boolean;
  /** Shown in place of the children while pending. */
  pendingLabel?: ReactNode;
  reasonClassName?: string;
}

export default function ActionButton({
  reason,
  pending = false,
  pendingLabel,
  disabled,
  children,
  className,
  type = 'button',
  reasonClassName,
  ...rest
}: ActionButtonProps) {
  const reasonId = useId();
  const blocked = Boolean(reason);
  return (
    <>
      <button
        type={type}
        {...rest}
        className={className}
        disabled={disabled || blocked || pending}
        aria-busy={pending || undefined}
        aria-describedby={blocked ? reasonId : rest['aria-describedby']}
      >
        {pending && pendingLabel != null ? pendingLabel : children}
      </button>
      {blocked && (
        <p id={reasonId} className={reasonClassName ?? 'mt-1 text-sm text-gray-600'}>
          {reason}
        </p>
      )}
    </>
  );
}
