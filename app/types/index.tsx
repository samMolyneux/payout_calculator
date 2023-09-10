interface Player {
  id: number;
  name: string;
  net: number;
}

interface Transaction {
  from: string;
  to: string;
  val: number;
  key: string;
}

export type { Player, Transaction };
