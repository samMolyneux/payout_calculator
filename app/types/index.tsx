interface Player {
  id: number;
  name: string;
  in?: number;  // in pence
  out?: number; // in pence
  net: number;  // in pence (calculated as out - in)
  invalid: boolean;
}

interface Transaction {
  from: string;
  to: string;
  val: number;
  key: string;
}

export type { Player, Transaction };
