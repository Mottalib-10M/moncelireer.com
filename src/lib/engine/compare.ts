/**
 * REER contre CELI, et effets d'une déduction sur les prestations fédérales calculées sur le revenu.
 *
 * Modèle (page Méthode) : le lecteur peut épargner S $ après impôt cette année.
 *  - CELI : S $ placés, croissance sans impôt, retrait sans impôt.
 *  - REER : on verse C $ tel que C moins l'économie d'impôt réelle (tranches 2026 de sa province) égale S :
 *    l'effort net est le même. C croît au même rendement, puis se retire en parts égales sur k années,
 *    imposées par-dessus le revenu de retraite déclaré (barème 2026 en dollars constants).
 * Rendement en termes réels : le barème est indexé chaque année, le calcul reste en dollars d'aujourd'hui.
 */
import P from '../../data/params-2026.json';
import { deductionSaving, withdrawalTax, marginalRate, type Prov } from './tax';

/** Versement REER brut qui coûte S $ une fois le remboursement reçu. */
export function grossUp(taxable: number, afterTax: number, p: Prov): number {
  let c = afterTax;
  for (let k = 0; k < 40; k++) {
    const next = afterTax + deductionSaving(taxable, c, p);
    if (Math.abs(next - c) < 0.01) return next;
    c = next;
  }
  return c;
}

export interface CompareIn { prov: Prov; income: number; save: number; years: number; growth: number; retireIncome: number; spread: number; retireProv?: Prov }
export function rrspVsTfsa(i: CompareIn) {
  const rp = i.retireProv ?? i.prov;
  const g = Math.pow(1 + i.growth, Math.max(0, i.years));
  const contribution = grossUp(i.income, i.save, i.prov);
  const refund = contribution - i.save;
  const rateNow = contribution > 0 ? refund / contribution : 0;
  const tfsaValue = i.save * g;
  const rrspValue = contribution * g;
  const k = Math.max(1, Math.round(i.spread));
  const annual = rrspValue / k;
  const taxEach = withdrawalTax(i.retireIncome, annual, rp);
  const rrspTax = taxEach * k;
  const rrspNet = rrspValue - rrspTax;
  const rateLater = annual > 0 ? taxEach / annual : 0;
  const oasLimit = P.benefits.oas.threshold['2026'];
  const oasClaw = Math.max(0, Math.min(annual, i.retireIncome + annual - oasLimit)) * P.benefits.oas.recoveryRate;
  return {
    contribution, refund, rateNow, marginalNow: marginalRate(i.income, i.prov), tfsaValue, rrspValue, rrspTax, rrspNet, rateLater,
    annualWithdrawal: annual, gap: rrspNet - tfsaValue, oasClawPerYear: oasClaw,
    gisAtRisk: i.retireIncome < P.benefits.gis.singleMax,
  };
}

/** Allocation canadienne pour enfants : baisse de la réduction quand le revenu familial net rajusté baisse. */
export function ccbReduction(afni: number, children: number): number {
  const C = P.benefits.ccb;
  const n = String(Math.max(1, Math.min(4, Math.round(children))));
  const [r1, r2] = (C.rates as Record<string, number[]>)[n];
  const [a, b] = C.thresholds;
  if (afni <= a) return 0;
  if (afni <= b) return (afni - a) * r1;
  return (b - a) * r1 + (afni - b) * r2;
}
export function ccbGain(afni: number, deduction: number, children: number): number {
  if (children <= 0) return 0;
  return ccbReduction(afni, children) - ccbReduction(Math.max(0, afni - deduction), children);
}
/** Récupération de la pension de la SV : 15 % du revenu net au-delà du seuil de l'année de revenu. */
export function oasRecovery(net: number, incomeYear: 2025 | 2026 = 2026): number {
  const t = (P.benefits.oas.threshold as Record<string, number>)[String(incomeYear)];
  return Math.max(0, net - t) * P.benefits.oas.recoveryRate;
}
