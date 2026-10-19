/**
 * Droits des comptes enregistrés : CELI, REER, CELIAPP, RAP, REEP (params-2026.json).
 * Fonctions pures, testées dans tests/engine.test.ts.
 */
import P from '../../data/params-2026.json';

export const YEAR = P.year;
const TL = P.tfsa.limits as Record<string, number>;
export const TFSA_YEARS = Object.keys(TL).map(Number).sort((a, b) => a - b);
export const tfsaLimit = (y: number) => TL[String(y)] ?? 0;
/** Somme des plafonds CELI de 2009 à l'année donnée (109 000 $ en 2026). */
export const tfsaCumulative = (to = YEAR) => TFSA_YEARS.filter((y) => y <= to).reduce((s, y) => s + tfsaLimit(y), 0);

/* ---------------- CELI ---------------- */
export interface TfsaIn {
  birthYear: number;
  /** Première année de résidence au Canada ; 0 = résident depuis toujours (ou avant 2009). */
  arrival: number;
  /** Années civiles entières passées hors du Canada (non-résident toute l'année) depuis les droits ouverts. */
  nonResidentYears?: number;
  /** Cotisations versées avant l'année en cours (transferts admissibles exclus). */
  contribBefore: number;
  /** Retraits faits avant l'année en cours (recrédités le 1er janvier qui suit chaque retrait). */
  withdrawBefore: number;
  contribThisYear: number;
  withdrawThisYear: number;
  year?: number;
}
export interface TfsaOut {
  startYear: number | null; years: number; accrued: number; roomJan1: number; available: number;
  excess: number; monthlyTax: number; addedBackNextYear: number; nextYearKnown: number | null;
  perYear: Array<{ year: number; limit: number; cumulative: number }>;
}
/** Année où les droits commencent : 2009, l'année des 18 ans ou l'année d'arrivée, la plus tardive. */
export function tfsaStartYear(birthYear: number, arrival: number, year = YEAR): number | null {
  const s = Math.max(P.tfsa.firstYear, birthYear + P.tfsa.ageMin, arrival || 0);
  return s <= year ? s : null;
}
export function tfsaRoom(i: TfsaIn): TfsaOut {
  const year = i.year ?? YEAR;
  const s = tfsaStartYear(i.birthYear, i.arrival, year);
  const perYear: TfsaOut['perYear'] = [];
  let cum = 0;
  if (s !== null) for (let y = s; y <= year; y++) { cum += tfsaLimit(y); perYear.push({ year: y, limit: tfsaLimit(y), cumulative: cum }); }
  const yearsCount = perYear.length;
  // Années entières de non-résidence : on retire les plafonds les plus récents avant l'année en cours
  // (convention prudente, l'utilisateur ne saisit qu'un nombre d'années).
  const nr = Math.max(0, Math.min(Math.round(i.nonResidentYears ?? 0), Math.max(0, yearsCount - 1)));
  const lost = perYear.slice(Math.max(0, yearsCount - 1 - nr), yearsCount - 1).reduce((a, b) => a + b.limit, 0);
  const accrued = cum - lost;
  const roomJan1 = accrued - Math.max(0, i.contribBefore) + Math.max(0, i.withdrawBefore);
  const available = roomJan1 - Math.max(0, i.contribThisYear);
  const excess = Math.max(0, -available);
  const next = tfsaLimit(year + 1) || null;
  return {
    startYear: s, years: yearsCount - nr, accrued, roomJan1, available: Math.max(0, available), excess,
    monthlyTax: excess * P.tfsa.excessTaxMonthly, addedBackNextYear: Math.max(0, i.withdrawThisYear),
    nextYearKnown: next === null ? null : Math.max(0, available) + i.withdrawThisYear + next, perYear,
  };
}
/** Impôt de 1 % par mois sur l'excédent le plus élevé de chaque mois (excédent constant sur n mois). */
export const excessTax = (excess: number, months: number, rate = P.tfsa.excessTaxMonthly) => Math.max(0, excess) * rate * Math.max(0, Math.round(months));

/* ---------------- REER ---------------- */
const RL = P.rrsp.dollarLimit as Record<string, number>;
export const rrspDollarLimit = (y: number) => RL[String(y)] ?? 0;
/** Revenu gagné à partir duquel 18 % atteignent le plafond de l'année. */
export const rrspIncomeForMax = (y = YEAR) => Math.ceil(rrspDollarLimit(y) / P.rrsp.earnedIncomeRate);
export interface RrspIn { earnedPrevYear: number; pensionAdjustment?: number; unusedRoom?: number; year?: number }
export function rrspRoom(i: RrspIn) {
  const year = i.year ?? YEAR;
  const pct = Math.max(0, i.earnedPrevYear) * P.rrsp.earnedIncomeRate;
  const cap = rrspDollarLimit(year);
  const newRoom = Math.max(0, Math.min(pct, cap) - Math.max(0, i.pensionAdjustment ?? 0));
  return { year, pct, cap, capped: pct > cap, newRoom, limit: newRoom + Math.max(0, i.unusedRoom ?? 0) };
}
/** Cotisations excédentaires : la partie au-delà de (maximum déductible + 2 000 $) paie 1 % par mois. */
export function rrspExcess(limit: number, unusedContrib: number, adult = true) {
  const over = Math.max(0, unusedContrib - limit);
  const cushion = adult ? P.rrsp.overCushion : 0;
  const taxed = Math.max(0, over - cushion);
  return { over, cushion, taxed, monthly: taxed * P.rrsp.excessTaxMonthly, cushionLeft: Math.max(0, cushion - over) };
}
/** Retenue à la source sur un retrait unique d'un REER (résident du Canada ; Québec : part fédérale). */
export function rrspWithholding(amount: number, quebec = false) {
  const w = P.rrsp.withholding;
  const rates = quebec ? w.ratesQcFederal : w.rates;
  const idx = amount <= w.bands[0] ? 0 : amount <= w.bands[1] ? 1 : 2;
  return { rate: rates[idx], withheld: Math.max(0, amount) * rates[idx] };
}
/** Règle d'attribution du REER de conjoint : un retrait est imposé au cotisant s'il a cotisé l'année
 *  du retrait ou les deux années précédentes. Renvoie la première année « libre ». */
export const spousalFreeYear = (lastContribYear: number) => lastContribYear + P.rrsp.spousalAttributionYears;

/* ---------------- CELIAPP ---------------- */
export interface FhsaIn { opened: number; contrib: Record<number, number>; year?: number }
/** Droits de participation CELIAPP année par année, depuis l'ouverture (formule de canada.ca, sans
 *  retraits imposables ni transferts désignés). */
export function fhsaRoom(i: FhsaIn) {
  const year = i.year ?? YEAR;
  const F = P.fhsa;
  const rows: Array<{ year: number; room: number; paid: number; carry: number; lifetimeLeft: number; excess: number }> = [];
  let carry = 0, used = 0, excessPrev = 0;
  for (let y = i.opened; y <= year; y++) {
    const room = y === i.opened ? Math.min(F.annual, F.lifetime) : Math.max(0, Math.min(F.annual + carry - excessPrev, F.lifetime - used + excessPrev));
    const paid = Math.max(0, i.contrib[y] ?? 0);
    const excess = Math.max(0, paid - room);
    used += paid;
    carry = Math.min(F.carryMax, Math.max(0, room - paid));
    excessPrev = excess;
    rows.push({ year: y, room, paid, carry, lifetimeLeft: Math.max(0, F.lifetime - used), excess });
  }
  const last = rows[rows.length - 1];
  return { rows, room: last?.room ?? 0, available: Math.max(0, (last?.room ?? 0) - (last?.paid ?? 0)), excess: last?.excess ?? 0, lifetimeLeft: last?.lifetimeLeft ?? F.lifetime, closeBy: i.opened + F.maxYears };
}
/** Années pour atteindre le plafond à vie en versant le maximum chaque année. */
export const fhsaYearsToMax = () => Math.ceil(P.fhsa.lifetime / P.fhsa.annual);

/* ---------------- RAP et REEP ---------------- */
export function hbpPlan(amount: number, firstWithdrawalYear: number) {
  const H = P.hbp;
  const a = Math.max(0, Math.min(amount, H.limit));
  const relief = firstWithdrawalYear >= H.reliefFrom && firstWithdrawalYear <= H.reliefTo;
  const start = firstWithdrawalYear + (relief ? H.reliefDelay : H.normalDelay);
  return { amount: a, capped: amount > H.limit, relief, start, end: start + H.repayYears - 1, annual: a / H.repayYears };
}
export function llpPlan(amount: number, firstWithdrawalYear: number, lastStudyYear: number) {
  const L = P.llp;
  const a = Math.max(0, Math.min(amount, L.total));
  const start = Math.min(firstWithdrawalYear + 5, Math.max(firstWithdrawalYear + 2, lastStudyYear + 2));
  return { amount: a, capped: amount > L.total, start, end: start + L.repayYears - 1, annual: a / L.repayYears };
}
