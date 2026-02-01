interface Player {
  id: number;
  name: string;
  net: number;
  invalid: boolean;
  adjustedNet?: number;
}

interface Transaction {
  from: string;
  to: string;
  val: number;
  key: string;
}

export type { Player, Transaction };
