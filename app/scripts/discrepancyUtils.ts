import { Player, Adjustment, Transaction } from "../types/index";

interface SplitResult {
  success: boolean;
  adjustments: Adjustment[];
  error?: string;
}

/**
 * Splits the discrepancy among players.
 *
 * If discrepancy is positive (shortfall), players give back money (negative adjustments).
 * If discrepancy is negative (surplus), players receive extra money (positive adjustments).
 *
 * Uses cascading exclusion: in a shortfall, if a player's adjustment would exceed their outVal,
 * they are excluded and the remaining players absorb the full discrepancy.
 */
export function splitDiscrepancy(
  players: Player[],
  discrepancy: number
): SplitResult {
  if (players.length === 0) {
    return {
      success: false,
      adjustments: [],
      error: "No eligible players to split the discrepancy",
    };
  }

  // For negative discrepancy (surplus), no exclusion needed - just distribute
  // Negate to get positive adjustments (players receive money)
  if (discrepancy < 0) {
    return distributeEvenly(players, -discrepancy);
  }

  // For positive discrepancy (shortfall), check for cascading exclusions
  const shortfall = discrepancy;

  // Keep excluding players whose adjustment would exceed their outVal
  let stable = false;
  while (!stable && players.length > 0) {
    stable = true;
    const perPerson = Math.ceil(shortfall / players.length);
    for (const player of players) {
      const outVal = player.net + player.inVal;
      if (perPerson > outVal) {
        // This player's adjustment would exceed their 'out' value, exclude them
        players = players.filter((w) => w.id !== player.id);
        stable = false;
        break;
      }
    }
  }

  if (players.length === 0) {
    return {
      success: false,
      adjustments: [],
      error: "Cannot split - adjustment would exceed all players' out values",
    };
  }

  // Distribute the negative adjustment (negate to make adjustments negative)
  return distributeEvenly(players, -discrepancy);
}

/**
 * Distributes an amount evenly among players.
 * Remainder (1 pence each) goes to first N players.
 */
function distributeEvenly(players: Player[], amount: number): SplitResult {
  const absAmount = Math.abs(amount);
  const sign = amount > 0 ? 1 : -1;
  const baseAmount = Math.floor(absAmount / players.length);
  const remainder = absAmount % players.length;

  const adjustments: Adjustment[] = players.map((player, index) => {
    // First N players get 1 extra pence
    const extra = index < remainder ? 1 : 0;
    return {
      playerId: player.id,
      playerName: player.name,
      amount: (baseAmount + extra) * sign,
    };
  });

  return {
    success: true,
    adjustments,
  };
}

/**
 * Applies adjustments to create a new player list with modified net values.
 */
export function applyAdjustments(
  players: Player[],
  adjustments: Adjustment[]
): Player[] {
  return players.map((player) => {
    const adjustment = adjustments.find((a) => a.playerId === player.id);
    if (adjustment) {
      return {
        ...player,
        net: player.net + adjustment.amount,
      };
    }
    return player;
  });
}