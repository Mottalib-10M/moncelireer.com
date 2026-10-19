/**
 * Impôt sur le revenu 2026 : fédéral + une province ou un territoire, à partir de params-2026.json.
 *
 * Ce que le moteur applique (méthode publiée, page /fr/methode/) :
 *  - tranches et taux 2026 du fédéral et des 13 juridictions ;
 *  - montant personnel de base (crédit au taux le plus bas de chaque juridiction), avec la réduction
 *    fédérale entre 181 440 $ et 258 482 $, celle du Manitoba entre 200 000 $ et 400 000 $, et le Yukon
 *    qui suit le montant fédéral ;
 *  - surtaxe de l'Ontario (20 % et 36 % de l'impôt de base de l'Ontario au-delà de deux seuils) ;
 *  - abattement fédéral de 16,5 % de l'impôt fédéral de base pour les résidents du Québec.
 * Ce qu'il n'applique pas : les autres crédits non remboursables (RPC, AE, montant canadien pour emploi,
 * âge, pension), les réductions d'impôt des bas revenus (Ontario, C.-B.), la contribution santé de
 * l'Ontario, l'impôt minimum de remplacement. Ils jouent surtout sous 30 000 $ de revenu imposable.
 */
import P from '../../data/params-2026.json';

export type Prov = 'NL' | 'PE' | 'NS' | 'NB' | 'QC' | 'ON' | 'MB' | 'SK' | 'AB' | 'BC' | 'YT' | 'NT' | 'NU';
export const PROVS: Prov[] = ['QC', 'ON', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'YT', 'NT', 'NU'];

interface Juris { brackets: number[]; rates: number[]; bpa?: number; bpaFederal?: boolean; bpaPhase?: number[]; surtax?: number[][] }
const F = P.federal;
const J = P.provinces as unknown as Record<Prov, Juris>;
export const jur = (p: Prov) => J[p];

/** Impôt brut sur un barème progressif. */
export function bracketTax(income: number, brackets: number[], rates: number[]): number {
  let tax = 0, low = 0;
  const x = Math.max(0, income);
  for (let i = 0; i < rates.length; i++) {
    const high = i < brackets.length ? brackets[i] : Infinity;
    if (x <= low) break;
    tax += (Math.min(x, high) - low) * rates[i];
    low = high;
  }
  return tax;
}
/** Taux de la tranche où tombe un revenu. */
export function bracketRate(income: number, brackets: number[], rates: number[]): number {
  let i = 0;
  while (i < brackets.length && income > brackets[i]) i++;
  return rates[i];
}

/** Montant personnel de base fédéral 2026 (réduit entre le début de la tranche à 29 % et celle à 33 %). */
export function federalBpa(net: number): number {
  const [a, b] = [F.brackets[2], F.brackets[3]];
  if (net <= a) return F.bpaMax;
  if (net >= b) return F.bpaMin;
  return F.bpaMax - (F.bpaMax - F.bpaMin) * (net - a) / (b - a);
}
export function provBpa(p: Prov, net: number): number {
  const j = J[p];
  if (j.bpaFederal) return federalBpa(net);
  const bpa = j.bpa ?? 0;
  if (j.bpaPhase) {
    const [a, b] = j.bpaPhase;
    if (net <= a) return bpa;
    if (net >= b) return 0;
    return bpa - bpa * (net - a) / (b - a);
  }
  return bpa;
}

export interface TaxDetail { federal: number; provincial: number; surtax: number; abatement: number; total: number }
/** Impôt fédéral + provincial sur un revenu imposable (le revenu net sert aux réductions du montant de base). */
export function taxDetail(taxable: number, p: Prov): TaxDetail {
  const x = Math.max(0, taxable);
  const fedBasic = Math.max(0, bracketTax(x, F.brackets, F.rates) - F.creditRate * federalBpa(x));
  const abatement = p === 'QC' ? fedBasic * F.qcAbatement : 0;
  const j = J[p];
  const provBasic = Math.max(0, bracketTax(x, j.brackets, j.rates) - j.rates[0] * provBpa(p, x));
  let surtax = 0;
  if (j.surtax) for (const [threshold, rate] of j.surtax) surtax += Math.max(0, provBasic - threshold) * rate;
  const federal = fedBasic - abatement;
  return { federal, provincial: provBasic + surtax, surtax, abatement, total: federal + provBasic + surtax };
}
export const tax = (taxable: number, p: Prov) => taxDetail(taxable, p).total;

/** Taux marginal combiné : impôt supplémentaire sur les 100 $ suivants (ou précédents, sous zéro d'impôt). */
export function marginalRate(taxable: number, p: Prov, step = 100): number {
  return (tax(taxable + step, p) - tax(taxable, p)) / step;
}
/** Taux marginal décomposé en fédéral (après abattement) et provincial (surtaxe comprise). */
export function marginalSplit(taxable: number, p: Prov, step = 100) {
  const a = taxDetail(taxable, p), b = taxDetail(taxable + step, p);
  return { federal: (b.federal - a.federal) / step, provincial: (b.provincial - a.provincial) / step, total: (b.total - a.total) / step };
}
/** Économie d'impôt d'une déduction (REER, CELIAPP) : l'impôt avant moins l'impôt après. */
export function deductionSaving(taxable: number, deduction: number, p: Prov): number {
  const d = Math.max(0, Math.min(deduction, taxable));
  return tax(taxable, p) - tax(taxable - d, p);
}
/** Impôt sur un retrait ajouté à un revenu : l'impôt après moins l'impôt avant. */
export function withdrawalTax(otherIncome: number, withdrawal: number, p: Prov): number {
  return tax(otherIncome + Math.max(0, withdrawal), p) - tax(otherIncome, p);
}
/** Taux moyen d'une déduction ou d'un retrait (économie ou impôt / montant). */
export const averageOn = (amount: number, value: number) => (amount > 0 ? value / amount : 0);

/** Seuils où le taux marginal combiné change, entre deux revenus (pour les pages par province). */
export function rateSteps(p: Prov, max = 300000): Array<{ from: number; rate: number }> {
  const pts = [...new Set([0, ...F.brackets, ...J[p].brackets, ...(J[p].bpaPhase ?? [])])].filter((x) => x < max).sort((a, b) => a - b);
  return pts.map((from) => ({ from, rate: marginalRate(from + 50, p, 50) }));
}
