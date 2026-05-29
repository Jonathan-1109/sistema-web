import type { BalanceState } from '@/types/domain';

interface BalanceIndicatorProps {
  balance: BalanceState;
  serverBalanced?: boolean | null;
}

export function BalanceIndicator({ balance, serverBalanced }: BalanceIndicatorProps) {
  const { isBalanced, totalOffers, totalDemands, delta } = balance;

  return (
    <div
      className={`panel-inset p-3.5 transition-colors
        ${isBalanced ? 'border-sage/40' : 'border-rose/40'}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
        <span className="font-mono text-ui-sm uppercase tracking-wider text-ink-soft">
          Balance oferta / demanda
        </span>
        <span
          className={`font-mono text-ui-sm font-bold shrink-0 px-2 py-0.5 rounded-md
            ${isBalanced ? 'text-sage bg-sage/15' : 'text-rose bg-rose/15'}`}
        >
          {isBalanced ? 'Equilibrado' : `Δ ${delta > 0 ? '+' : ''}${delta}`}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="min-w-0">
          <p className="font-mono text-2xl font-bold text-ink tabular-nums leading-none">
            {totalOffers}
          </p>
          <p className="text-ui-sm text-ink mt-1.5">Oferta total</p>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-2xl font-bold text-ink tabular-nums leading-none">
            {totalDemands}
          </p>
          <p className="text-ui-sm text-ink mt-1.5">Demanda total</p>
        </div>
      </div>
      {!isBalanced && (
        <p className="text-ui-sm text-ink-soft mt-3 leading-relaxed">
          Se balanceará automáticamente al resolver.
        </p>
      )}
      {serverBalanced === false && isBalanced && (
        <p className="text-ui-sm text-sage mt-2">Balanceado en servidor.</p>
      )}
    </div>
  );
}
