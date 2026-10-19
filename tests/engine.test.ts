/** Moteur : plafonds, droits, impôt 2026 et simulateurs, contrôlés sur des cas calculés à la main. */
import { describe, expect, it } from 'vitest';
import P from '../src/data/params-2026.json';
import { tax, marginalRate, marginalSplit, deductionSaving, taxDetail, PROVS, federalBpa } from '../src/lib/engine/tax';
import { tfsaCumulative, tfsaRoom, tfsaStartYear, rrspRoom, rrspExcess, rrspWithholding, fhsaRoom, hbpPlan, llpPlan, spousalFreeYear, excessTax } from '../src/lib/engine/accounts';
import { rrspVsTfsa, grossUp, ccbGain, oasRecovery } from '../src/lib/engine/compare';
import { TOOL_KINDS, runTool } from '../src/lib/tool-specs';

const near = (a: number, b: number, d = 0.0005) => expect(Math.abs(a - b), `${a} vs ${b}`).toBeLessThan(d);

describe('CELI', () => {
  it('plafonds de 2009 à 2026 : 109 000 $', () => { expect(tfsaCumulative(2026)).toBe(109000); expect(P.tfsa.limits['2026']).toBe(7000); expect(P.tfsa.limits['2015']).toBe(10000); });
  it('2027 non publié', () => { expect(P.tfsa.limit2027).toBeNull(); expect((P.tfsa.limits as Record<string, number>)['2027']).toBeUndefined(); });
  it('début des droits : 2009, 18 ans ou arrivée', () => {
    expect(tfsaStartYear(1980, 0)).toBe(2009);
    expect(tfsaStartYear(2000, 0)).toBe(2018);
    expect(tfsaStartYear(1980, 2019)).toBe(2019);
    expect(tfsaStartYear(2010, 0)).toBeNull();
  });
  it('né en 1991, jamais cotisé : 109 000 $', () => { expect(tfsaRoom({ birthYear: 1991, arrival: 0, contribBefore: 0, withdrawBefore: 0, contribThisYear: 0, withdrawThisYear: 0 }).available).toBe(109000); });
  it('né en 2000 : 2018 à 2026 = 57 500 $', () => { expect(tfsaRoom({ birthYear: 2000, arrival: 0, contribBefore: 0, withdrawBefore: 0, contribThisYear: 0, withdrawThisYear: 0 }).available).toBe(5500 + 6000 * 4 + 6500 + 7000 * 3); });
  it('arrivé en 2022 : 6 000 + 6 500 + 21 000', () => { expect(tfsaRoom({ birthYear: 1985, arrival: 2022, contribBefore: 0, withdrawBefore: 0, contribThisYear: 0, withdrawThisYear: 0 }).available).toBe(33500); });
  it('retraits recrédités l’année suivante, excédent à 1 % par mois', () => {
    const r = tfsaRoom({ birthYear: 1990, arrival: 2024, contribBefore: 14000, withdrawBefore: 0, contribThisYear: 9000, withdrawThisYear: 9000 });
    expect(r.roomJan1).toBe(7000); expect(r.excess).toBe(2000); expect(r.monthlyTax).toBe(20); expect(r.addedBackNextYear).toBe(9000);
    expect(excessTax(3000, 6)).toBe(180);
  });
});

describe('REER', () => {
  it('plafonds', () => { expect(P.rrsp.dollarLimit['2026']).toBe(33810); expect(P.rrsp.dollarLimit['2027']).toBe(35390); });
  it('18 % du revenu, plafonné, moins le FE', () => {
    expect(rrspRoom({ earnedPrevYear: 100000 }).newRoom).toBe(18000);
    expect(rrspRoom({ earnedPrevYear: 250000 }).newRoom).toBe(33810);
    expect(rrspRoom({ earnedPrevYear: 100000, pensionAdjustment: 6000, unusedRoom: 5000 }).limit).toBe(17000);
  });
  it('marge de 2 000 $', () => { const e = rrspExcess(10000, 13500); expect(e.over).toBe(3500); expect(e.taxed).toBe(1500); expect(e.monthly).toBe(15); });
  it('retenue à la source', () => { expect(rrspWithholding(5000).rate).toBe(0.1); expect(rrspWithholding(10000).rate).toBe(0.2); expect(rrspWithholding(20000).rate).toBe(0.3); expect(rrspWithholding(20000, true).rate).toBe(0.15); });
  it('REER de conjoint : trois années', () => { expect(spousalFreeYear(2026)).toBe(2029); });
});

describe('CELIAPP, RAP, REEP', () => {
  it('8 000 $ la première année, report de 8 000 $ au plus', () => {
    const f = fhsaRoom({ opened: 2024, contrib: { 2024: 2000, 2025: 0 } , year: 2026 });
    expect(f.rows[0].room).toBe(8000); expect(f.rows[1].room).toBe(14000); expect(f.rows[2].room).toBe(16000);
  });
  it('plafond à vie 40 000 $', () => { const f = fhsaRoom({ opened: 2023, contrib: { 2023: 8000, 2024: 8000, 2025: 8000, 2026: 8000 } }); expect(f.lifetimeLeft).toBe(8000); expect(f.closeBy).toBe(2038); });
  it('RAP : 60 000 $, 15 ans, début à la 5e année pour 2022 à 2028', () => { const h = hbpPlan(30000, 2026); expect(h.start).toBe(2031); expect(h.annual).toBe(2000); expect(hbpPlan(30000, 2021).start).toBe(2023); expect(hbpPlan(70000, 2026).amount).toBe(60000); });
  it('REEP : 10 ans, au plus tard la 5e année', () => { const r = llpPlan(20000, 2026, 2027); expect(r.start).toBe(2029); expect(r.annual).toBe(2000); expect(llpPlan(20000, 2026, 2035).start).toBe(2031); });
});

describe('impôt 2026', () => {
  it('taux marginal combiné à 60 000 $', () => {
    near(marginalRate(70000, 'ON'), 0.205 + 0.0915);
    near(marginalRate(70000, 'AB'), 0.205 + 0.10);
    near(marginalRate(70000, 'QC'), 0.205 * 0.835 + 0.19);
    near(marginalRate(70000, 'BC'), 0.205 + 0.077);
  });
  it('Ontario : surtaxe au-delà de 120 000 $', () => { near(marginalRate(130000, 'ON'), 0.26 + 0.1116 * 1.56, 0.001); });
  it('montant personnel de base fédéral', () => { expect(federalBpa(50000)).toBe(16452); expect(federalBpa(300000)).toBe(14829); });
  it('aucun impôt sous les montants de base', () => { for (const p of PROVS) expect(tax(10000, p)).toBe(0); });
  it('abattement du Québec : 16,5 % du fédéral de base', () => { const d = taxDetail(80000, 'QC'); near(d.abatement / (d.federal + d.abatement), 0.165, 1e-9); });
  it('déduction de 5 000 $ à 75 000 $ en Ontario = 5 000 × 29,65 %', () => { near(deductionSaving(75000, 5000, 'ON'), 5000 * 0.2965, 0.5); });
  it('décomposition = total', () => { const s = marginalSplit(90000, 'QC'); near(s.federal + s.provincial, s.total, 1e-9); });
});

describe('REER contre CELI', () => {
  it('même taux aujourd’hui et au retrait : égalité', () => {
    const c = rrspVsTfsa({ prov: 'ON', income: 75000, save: 5000, years: 20, growth: 0.03, retireIncome: 75000, spread: 1 });
    expect(Math.abs(c.gap) / c.tfsaValue).toBeLessThan(0.02);
  });
  it('taux plus bas à la retraite : le REER gagne', () => { expect(rrspVsTfsa({ prov: 'QC', income: 110000, save: 5000, years: 25, growth: 0.03, retireIncome: 30000, spread: 20 }).gap).toBeGreaterThan(0); });
  it('grossUp : C moins le remboursement = S', () => { const c = grossUp(80000, 5000, 'BC'); near(c - deductionSaving(80000, c, 'BC'), 5000, 0.05); });
  it('ACE et SV', () => { expect(ccbGain(90000, 5000, 2)).toBeCloseTo(5000 * 0.057, 6); expect(oasRecovery(105323)).toBeCloseTo(1500, 6); });
});

describe('simulateurs', () => {
  for (const k of TOOL_KINDS) for (const l of ['fr', 'en'] as const) it(`${k} (${l}) rend une carte complète`, () => {
    const out = runTool(k, l);
    const all = JSON.stringify(out);
    expect(all).not.toMatch(/NaN|undefined|Infinity|null/);
    expect(out.value.length).toBeGreaterThan(0);
  });
});
