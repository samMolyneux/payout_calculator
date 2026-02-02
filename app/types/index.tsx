interface Player {
  id: number;
  name: string;
  net: number;
  inVal: number; // in pence
  invalid: boolean;
}

interface Transaction {
  from: string;
  to: string;
  val: number;
  key: string;
}

interface Adjustment {
  playerId: number;
  playerName: string;
  amount: number; // in pence, positive = added, negative = removed
}

export type { Player, Transaction, Adjustment };
