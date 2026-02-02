export default function SplitTheDiscrepancy() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Split the Discrepancy</h1>

        <p className="mb-4">
          If the money at the table doesn&apos;t add up (due to lost chips,
          miscounts, etc) the app will show you the discrepancy (the difference
          between what everyone bought in for and what they&apos;re cashing
          out).
        </p>

        <p className="mb-4">
          Instead of figuring out who should cover the difference, the{" "}
          <strong>Split the discrepancy</strong> button can be used to
          automatically divide it evenly among all players:
        </p>

        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>
            <strong>Shortfall</strong> (money is missing): Each player gives
            back a small amount to make up the difference
          </li>
          <li>
            <strong>Surplus</strong> (extra money): Each player receives a bit
            extra
          </li>
        </ul>

        <p className="mb-4">
          If the amount doesn&apos;t divide evenly, the remainder (1p at a time)
          goes to the first few players.
        </p>

        <p className="mb-4">
          If a player&apos;s share would exceed what they cashed out for,
          they&apos;re automatically excluded and the remaining players cover
          the difference.
        </p>

        <p className="mb-4">
          After splitting, the payout transactions are recalculated with the
          adjusted amounts.
        </p>

        <p>
          Adjustments are listed below the transaction table, the inputs are not
          changed.
        </p>
      </div>
    </div>
  );
}
