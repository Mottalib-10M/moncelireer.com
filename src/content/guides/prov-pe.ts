import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const P = K.jur('PE');
const PF = K.P.provinceFacts;
const bpaNow = P.bpa ?? 0, bpaOld = PF.peBpaBefore, r0 = P.rates[0];
const newRate = P.rates[P.rates.length - 1], newFrom = P.brackets[P.brackets.length - 1], prevTop = P.rates[P.rates.length - 2];
type H = { m: (x: number) => string };
// Ancien barème : sans la tranche à 20 %, ancien montant de base.
const gross = (x: number, br: number[], rt: number[]) => { let t = 0, low = 0; for (let i = 0; i < rt.length; i++) { const high = i < br.length ? br[i] : Infinity; if (x <= low) break; t += (Math.min(x, high) - low) * rt[i]; low = high; } return t; };
const oldTax = (x: number) => Math.max(0, gross(x, P.brackets.slice(0, -1), P.rates.slice(0, -1)) - r0 * bpaOld);
const newTax = (x: number) => K.taxDetail(x, 'PE').provincial;
const incs = [25000, 60000, 120000, 200000, 250000, 400000];
const ledger = (h: H) => incs.map((i) => { const bpaPart = Math.max(0, oldTax(Math.min(i, newFrom)) - newTax(Math.min(i, newFrom))); const topPart = Math.max(0, i - newFrom) * (newRate - prevTop); return [h.m(i), h.m(bpaPart), h.m(topPart), h.m(oldTax(i) - newTax(i))]; });
const bpaGain = r0 * (bpaNow - bpaOld);
const breakEven = newFrom + bpaGain / (newRate - prevTop);
// Cotisation de 15 000 $ à 260 000 $ : part de la province, avant et après.
const hiInc = 260000, hiCt = 15000;
const provSaveNow = newTax(hiInc) - newTax(hiInc - hiCt), provSaveOld = oldTax(hiInc) - oldTax(hiInc - hiCt);
// Retrait de 10 000 $ avec 40 000 $ d'autres revenus.
const mid = K.compare({ prov: 'PE', income: 70000, save: 5000, years: 25, growth: 0.03, retireIncome: 35000, spread: 20 });
const midHi = K.compare({ prov: 'PE', income: 70000, save: 5000, years: 25, growth: 0.03, retireIncome: 68000, spread: 20 });
const w = K.withholding(10000, false), wt = K.wtax(40000, 10000, 'PE');

export default defineGuide({
  id: 'prov-pe', group: 'prov', order: 49, tool: 'remboursement',
  toolArg: { pr: 'PE', rv: 70000, mt: 6000 },
  related: ['remboursement-reer', 'taux-marginal', 'retrait-reer', 'reer-ou-celi', 'prov-nb'],
  sources: ['t4127_jul', 't4127_jan', 'cra_rates_2026', 'cra_withholding'],
  fr: {
    slug: 'reer-ou-celi-ile-du-prince-edouard',
    nav: 'REER ou CELI à l’Île-du-Prince-Édouard', card: `Tranche à ${F.r(newRate)} au-delà de ${F.m(newFrom)}, montant de base porté à ${F.m(bpaNow)} : le REER à l'Î.-P.-É. en ${Y}.`,
    title: `REER ou CELI à l'Île-du-Prince-Édouard ${Y} : tranche à 20 %`,
    description: `REER ou CELI à l'Île-du-Prince-Édouard ${Y} : nouvelle tranche à ${F.r(newRate)} au-delà de ${F.m(newFrom)}, montant de base de ${F.m(bpaNow)} et ce que cela change pour votre REER.`,
    h1: `REER ou CELI à l'Île-du-Prince-Édouard en ${Y} : deux changements`,
    intro: 'L’Île-du-Prince-Édouard a relevé son montant personnel de base et ajouté une tranche d’impôt en 2026. Le simulateur applique les deux à votre revenu et à votre cotisation.',
    resume: `À l'Île-du-Prince-Édouard, deux changements touchent l'impôt de ${Y}. Le montant personnel de base passe de ${F.m(bpaOld)} à ${F.m(bpaNow)}, ce qui fait baisser l'impôt provincial d'au plus ${F.m(bpaGain)} par année. Une nouvelle tranche, annoncée le 14 avril ${Y}, impose à ${F.r(newRate)} la partie du revenu imposable qui dépasse ${F.m(newFrom)} ; jusque-là, le taux de ${F.r(prevTop)} s'appliquait à tout le revenu au-delà de ${F.m(P.brackets[3])}. Le barème compte maintenant six taux, de ${F.r(r0)} à ${F.r(newRate)}. Le bilan est favorable sous environ ${F.m(breakEven)} de revenu, défavorable au-delà. Pour le REER, la nouvelle tranche relève d'un point la valeur provinciale d'une déduction pour les dollars qui sortent de la zone au-delà de ${F.m(newFrom)}. Pour la plupart des contribuables de l'Île, rien ne change dans le choix : à ${F.m(60000)}, le taux marginal combiné est de ${F.p(K.marginal(60000, 'PE'))}, et à ${F.m(90000)} de ${F.p(K.marginal(90000, 'PE'))}. Le CELI n'est touché par aucune des deux mesures.`,
    faqs: [
      { q: 'Qu’est-ce que la nouvelle tranche d’impôt de 20 % à l’Île-du-Prince-Édouard ?', a: `Annoncée le 14 avril ${Y}, elle s'applique à la partie du revenu imposable qui dépasse ${F.m(newFrom)}, pour ${Y} et les années suivantes. Avant, cette partie était imposée à ${F.r(prevTop)}, comme le reste du revenu au-delà de ${F.m(P.brackets[3])}. Sur un revenu de ${F.m(250000)}, l'impôt provincial augmente de ${F.m((250000 - newFrom) * (newRate - prevTop))}, avant la baisse liée au montant de base.` },
      { q: 'Le montant personnel de base de l’Île-du-Prince-Édouard a-t-il augmenté en 2026 ?', a: `Oui, il passe de ${F.m(bpaOld)} à ${F.m(bpaNow)} au 1er janvier ${Y}, une hausse annoncée le 10 avril 2025. Le crédit se calcule au taux de ${F.r(r0)} : l'impôt provincial baisse d'au plus ${F.m(bpaGain)} par année. Sous ${F.m(bpaNow)} de revenu imposable, aucun impôt provincial n'est dû.` },
      { q: 'Combien d’impôt paie-t-on sur un retrait REER de 10 000 $ à l’Île-du-Prince-Édouard ?', a: `L'institution retient ${F.p(w.rate, 0)}, soit ${F.m(w.withheld)}. L'impôt réel dépend du reste de votre revenu : avec ${F.m(40000)} d'autres revenus, le retrait ajoute ${F.m(wt)} d'impôt, fédéral et provincial. La différence, ${F.m(wt - w.withheld)}, se paie au printemps avec la déclaration. Un retrait de CELI, lui, n'est jamais imposé.` },
      { q: 'Pourquoi un taux de 21 % apparaît-il sur les paies élevées à l’Île ?', a: `Les employeurs ont appliqué l'ancien barème pendant les six premiers mois de ${Y}. Pour rattraper l'écart, le guide T4127 de juillet leur fait retenir un taux proratisé de 21 % dans le calcul des retenues, sur la partie du revenu qui dépasse ${F.m(newFrom)}, à partir de la première paie de juillet. Dans la déclaration, le taux annuel est de ${F.r(newRate)}.` },
    ],
    body: (h) => `
<h2>Deux décisions, deux dates</h2>
<p>La première remonte au 10 avril 2025 : le gouvernement de l'Île annonçait que le montant personnel de base passerait de ${h.m(bpaOld)} à ${h.m(bpaNow)} le 1er janvier ${Y}. Le ${h.src('t4127_jan', 'guide T4127 de janvier')} l'appliquait dès la première paie de l'année. La seconde date du 14 avril ${Y} : une nouvelle tranche impose à ${h.r(newRate)} le revenu imposable au-delà de ${h.m(newFrom)}, pour ${Y} et les années suivantes. Comme elle est arrivée en cours d'année, le ${h.src('t4127_jul', 'guide T4127 de juillet')} fait appliquer un taux proratisé de 21 % sur les paies concernées à partir de juillet ; le taux annuel reste de ${h.r(newRate)}.</p>
<h2>Le bilan selon le revenu</h2>
<p>Les deux mesures jouent en sens contraire. La hausse du montant de base vaut ${h.r(r0)} de ${h.m(bpaNow - bpaOld)}, soit ${h.m(bpaGain)} pour quiconque payait déjà de l'impôt provincial. La nouvelle tranche coûte un point de pourcentage sur chaque dollar au-delà de ${h.m(newFrom)}. Les deux s'annulent vers ${h.m(breakEven)} de revenu imposable.</p>
${h.table(['Revenu imposable', 'Gain du montant de base', 'Coût de la tranche à 20 %', 'Baisse nette de l’impôt provincial'], ledger(h), `Impôt de l'Île-du-Prince-Édouard en ${Y} comparé à l'ancien barème (montant de base de ${h.m(bpaOld)}, taux de ${h.r(prevTop)} au sommet). Un montant négatif est une hausse.`, ['l', 'r', 'r', 'r'])}
<h2>Six taux, dont cinq sous ${h.m(newFrom)}</h2>
<p>Sous la nouvelle tranche, le barème de l'Île reste serré : ${P.rates.slice(0, -1).map((r) => h.r(r)).join(', ')}, avec des seuils à ${P.brackets.slice(0, -1).map((b) => h.m(b)).join(', ')}, selon la ${h.src('cra_rates_2026', 'page des taux 2026')}. Combiné au fédéral, le taux marginal passe de ${h.p(K.marginal(30000, 'PE'))} à ${h.m(30000)} à ${h.p(K.marginal(50000, 'PE'))} à ${h.m(50000)}, puis ${h.p(K.marginal(80000, 'PE'))} à ${h.m(80000)} et ${h.p(K.marginal(130000, 'PE'))} à ${h.m(130000)}. Le premier seuil, ${h.m(P.brackets[0])}, est bas : dès un revenu modeste, chaque dollar déduit au REER fait économiser plus que le seul taux d'entrée.</p>
<h2>Au-delà de ${h.m(newFrom)}, une déduction qui vaut un point de plus</h2>
<p>Pour un revenu élevé, la nouvelle tranche augmente la valeur d'une cotisation REER. Prenons ${h.m(hiInc)} de revenu imposable et une cotisation de ${h.m(hiCt)}. Avec le barème actuel, la part provinciale de l'économie est de ${h.m(provSaveNow)} ; avec l'ancien, elle aurait été de ${h.m(provSaveOld)}. Au total, fédéral compris, la cotisation fait baisser l'impôt de ${h.m(K.saving(hiInc, hiCt, 'PE'))}, à un taux marginal combiné de ${h.p(K.marginal(hiInc, 'PE'))}. L'écart reste petit, mais il joue chaque année où le revenu dépasse ${h.m(newFrom)}, et il compte quand le revenu de retraite sera nettement plus bas.</p>
${h.mini('reerCeli', { t: 'REER ou CELI à l’Île-du-Prince-Édouard', p: ['rv', 'ep', 'rr', 'an'], d: { pr: 'PE', rv: 70000, rr: 35000 } })}
<h2>Pour un salaire moyen de l'Île</h2>
<p>La plupart des contribuables de l'Île ne sont touchés que par la hausse du montant de base, et elle ne change presque rien à la valeur d'une déduction. Le choix se fait donc comme avant, en comparant le taux récupéré aujourd'hui et celui qui sera payé au retrait. À ${h.m(70000)} de revenu, avec ${h.m(5000)} d'épargne par an pendant 25 ans, le REER récupère ${h.p(mid.rateNow)}. Si le revenu de retraite prévu est de ${h.m(35000)}, les retraits seront imposés à ${h.p(mid.rateLater)} et le REER laissera ${h.m(Math.abs(mid.gap))} de plus que le CELI. Avec une rente qui porterait ce revenu à ${h.m(68000)}, l'écart ne serait plus que de ${h.m(Math.abs(midHi.gap))}${Math.abs(midHi.gap) < 1 ? ', une égalité' : ''} : le CELI devient alors le choix le plus souple, puisque ses retraits ne comptent pas dans le revenu imposable.</p>
<h2>Un retrait REER à l'Île : la retenue et l'impôt réel</h2>
<p>La retenue prélevée par l'institution sur un retrait n'est qu'un acompte. Pour un retrait unique de ${h.m(10000)}, la ${h.src('cra_withholding', 'grille de l’Agence du revenu du Canada')} prévoit ${h.p(w.rate, 0)}, soit ${h.m(w.withheld)}. L'impôt réel dépend du reste du revenu de l'année. Une personne qui a ${h.m(40000)} d'autres revenus paiera ${h.m(wt)} sur ce retrait, un taux moyen de ${h.p(wt / 10000)} : il lui restera ${h.m(wt - w.withheld)} à payer au printemps. C'est le principal argument du CELI pour une épargne qui pourrait servir avant la retraite : son retrait n'est ni imposé ni retenu, et le montant retiré s'ajoute de nouveau aux droits de cotisation le 1er janvier suivant, ce qui n'est pas le cas du REER.</p>
`,
  },
  en: {
    slug: 'rrsp-vs-tfsa-prince-edward-island',
    nav: 'RRSP or TFSA in Prince Edward Island', card: `A ${E.r(newRate)} bracket above ${E.m(newFrom)}, basic amount up to ${E.m(bpaNow)}: the RRSP in PEI for ${Y}.`,
    title: `RRSP vs TFSA in Prince Edward Island ${Y}: new 20% bracket`,
    description: `RRSP or TFSA in Prince Edward Island ${Y}: a new ${E.r(newRate)} bracket above ${E.m(newFrom)}, a ${E.m(bpaNow)} basic personal amount, and what each change does to your own RRSP.`,
    h1: `RRSP or TFSA in Prince Edward Island in ${Y}: two changes`,
    intro: 'Prince Edward Island raised its basic personal amount and added a tax bracket in 2026. The calculator applies both to your income and your contribution.',
    resume: `In Prince Edward Island, two changes shape ${Y} income tax. The basic personal amount goes from ${E.m(bpaOld)} to ${E.m(bpaNow)}, which lowers provincial tax by at most ${E.m(bpaGain)} a year. A new bracket, announced on April 14, ${Y}, taxes the part of taxable income above ${E.m(newFrom)} at ${E.r(newRate)}; until then, the ${E.r(prevTop)} rate applied to all income above ${E.m(P.brackets[3])}. The table now has six rates, from ${E.r(r0)} to ${E.r(newRate)}. The net effect is a tax cut below about ${E.m(breakEven)} of income and an increase above it. For an RRSP, the new bracket adds one percentage point to the provincial value of a deduction for the dollars that come out of the range above ${E.m(newFrom)}. For most Islanders nothing changes in the choice: at ${E.m(60000)}, the combined marginal rate is ${E.p(K.marginal(60000, 'PE'))}, and at ${E.m(90000)} it is ${E.p(K.marginal(90000, 'PE'))}. Neither measure touches the TFSA.`,
    faqs: [
      { q: 'What is the new 20% tax bracket in Prince Edward Island?', a: `Announced on April 14, ${Y}, it applies to the part of taxable income above ${E.m(newFrom)}, for ${Y} and later years. Before, that part was taxed at ${E.r(prevTop)}, like the rest of income above ${E.m(P.brackets[3])}. On a ${E.m(250000)} income, provincial tax goes up by ${E.m((250000 - newFrom) * (newRate - prevTop))}, before the cut from the higher basic amount.` },
      { q: 'Did the PEI basic personal amount go up in 2026?', a: `Yes, it rises from ${E.m(bpaOld)} to ${E.m(bpaNow)} on January 1, ${Y}, an increase announced on April 10, 2025. The credit is worked out at ${E.r(r0)}, so provincial tax drops by at most ${E.m(bpaGain)} a year. Below ${E.m(bpaNow)} of taxable income, no provincial tax is owed.` },
      { q: 'How much tax will I pay on a $10,000 RRSP withdrawal in PEI?', a: `The institution withholds ${E.p(w.rate, 0)}, which is ${E.m(w.withheld)}. The real tax depends on the rest of your income: with ${E.m(40000)} of other income, the withdrawal adds ${E.m(wt)} of federal and provincial tax. The difference, ${E.m(wt - w.withheld)}, is paid in the spring with your return. A TFSA withdrawal is never taxed at all.` },
      { q: 'Why does a 21% rate show up on high paycheques in PEI?', a: `Employers used the old table for the first six months of ${Y}. To catch up, the July T4127 guide has them withhold at a prorated 21% in the withholding formula, on the part of income above ${E.m(newFrom)}, from the first payroll in July. On the tax return, the annual rate is ${E.r(newRate)}.` },
    ],
    body: (h) => `
<h2>Two decisions, two dates</h2>
<p>The first goes back to April 10, 2025: the Island government announced that the basic personal amount would rise from ${h.m(bpaOld)} to ${h.m(bpaNow)} on January 1, ${Y}. The ${h.src('t4127_jan', 'January T4127 guide')} applied it from the first payroll of the year. The second dates from April 14, ${Y}: a new bracket taxes taxable income above ${h.m(newFrom)} at ${h.r(newRate)}, for ${Y} and later years. Because it came partway through the year, the ${h.src('t4127_jul', 'July T4127 guide')} has employers apply a prorated 21% rate to the pay concerned from July; the annual rate is still ${h.r(newRate)}.</p>
<h2>The net effect by income</h2>
<p>The two measures pull in opposite directions. The higher basic amount is worth ${h.r(r0)} of ${h.m(bpaNow - bpaOld)}, or ${h.m(bpaGain)} for anyone who already paid provincial tax. The new bracket costs one percentage point on each dollar above ${h.m(newFrom)}. The two cancel out at about ${h.m(breakEven)} of taxable income.</p>
${h.table(['Taxable income', 'Gain from the basic amount', 'Cost of the 20% bracket', 'Net cut in provincial tax'], ledger(h), `Prince Edward Island tax in ${Y} compared with the old table (basic amount of ${h.m(bpaOld)}, top rate of ${h.r(prevTop)}). A negative amount is an increase.`, ['l', 'r', 'r', 'r'])}
<h2>Six rates, five of them below ${h.m(newFrom)}</h2>
<p>Below the new bracket, the Island's table stays tightly packed: ${P.rates.slice(0, -1).map((r) => h.r(r)).join(', ')}, with thresholds at ${P.brackets.slice(0, -1).map((b) => h.m(b)).join(', ')}, according to the ${h.src('cra_rates_2026', '2026 rates page')}. Combined with the federal rate, the marginal rate goes from ${h.p(K.marginal(30000, 'PE'))} at ${h.m(30000)} to ${h.p(K.marginal(50000, 'PE'))} at ${h.m(50000)}, then ${h.p(K.marginal(80000, 'PE'))} at ${h.m(80000)} and ${h.p(K.marginal(130000, 'PE'))} at ${h.m(130000)}. The first threshold, ${h.m(P.brackets[0])}, is low: even on a modest income, each dollar deducted through an RRSP saves more than the entry rate alone.</p>
<h2>Above ${h.m(newFrom)}, a deduction worth one point more</h2>
<p>For a high income, the new bracket makes an RRSP contribution worth more. Take ${h.m(hiInc)} of taxable income and a ${h.m(hiCt)} contribution. With the current table, the provincial part of the saving is ${h.m(provSaveNow)}; with the old one it would have been ${h.m(provSaveOld)}. In total, federal included, the contribution lowers tax by ${h.m(K.saving(hiInc, hiCt, 'PE'))}, at a combined marginal rate of ${h.p(K.marginal(hiInc, 'PE'))}. The gap is small, but it applies every year income is above ${h.m(newFrom)}, and it counts when retirement income will be much lower.</p>
${h.mini('reerCeli', { t: 'RRSP or TFSA in Prince Edward Island', p: ['rv', 'ep', 'rr', 'an'], d: { pr: 'PE', rv: 70000, rr: 35000 } })}
<h2>For an average Island salary</h2>
<p>Most Island taxpayers are only affected by the higher basic amount, and it barely changes what a deduction is worth. The choice works as before, by comparing the rate recovered today with the rate that will be paid on withdrawal. At ${h.m(70000)} of income, saving ${h.m(5000)} a year for 25 years, the RRSP gets back ${h.p(mid.rateNow)}. If expected retirement income is ${h.m(35000)}, withdrawals will be taxed at ${h.p(mid.rateLater)} and the RRSP will leave ${h.m(Math.abs(mid.gap))} more than the TFSA. With a pension that brought that income to ${h.m(68000)}, the gap would shrink to ${h.m(Math.abs(midHi.gap))}${Math.abs(midHi.gap) < 1 ? ', a tie' : ''}: the TFSA then becomes the more flexible choice, since its withdrawals do not count as taxable income.</p>
<h2>An RRSP withdrawal in PEI: withholding and real tax</h2>
<p>The tax an institution holds back on a withdrawal is only a prepayment. On a single ${h.m(10000)} withdrawal, the ${h.src('cra_withholding', 'Canada Revenue Agency schedule')} sets ${h.p(w.rate, 0)}, which is ${h.m(w.withheld)}. The real tax depends on the rest of the year's income. Someone with ${h.m(40000)} of other income will pay ${h.m(wt)} on that withdrawal, an average rate of ${h.p(wt / 10000)}, leaving ${h.m(wt - w.withheld)} to pay in the spring. That is the main case for the TFSA when savings might be needed before retirement: its withdrawals are neither taxed nor withheld, and the amount taken out becomes contribution room again the next January 1, which an RRSP never gives back.</p>
`,
  },
});
