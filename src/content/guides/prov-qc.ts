import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const Q = K.jur('QC');
const d80 = K.taxDetail(80000, 'QC');
const s80 = K.split(80000, 'QC'), on80 = K.marginal(80000, 'ON');
const inc = [45000, 70000, 100000, 125000, 160000];
const rows = (h: { m: (x: number) => string; p: (x: number, d?: number) => string }) => inc.map((i) => { const s = K.split(i, 'QC'); return [h.m(i), h.p(s.federal), h.p(s.provincial), h.p(s.total), h.m(K.saving(i, 5000, 'QC'))]; });
const w10 = K.withholding(10000, true);
const cmp = K.compare({ prov: 'QC', income: 85000, save: 6000, years: 25, growth: 0.03, retireIncome: 38000, spread: 20 });

export default defineGuide({
  id: 'prov-qc', group: 'prov', order: 40, tool: 'reerCeli',
  toolArg: { pr: 'QC', rv: 85000, rr: 38000 },
  related: ['reer-ou-celi', 'taux-marginal', 'retrait-reer', 'celiapp', 'prov-on'],
  sources: ['t4127_jul', 'cra_rates_2026', 'rq_rates', 'mb_budget_2026', 'cra_withholding'],
  fr: {
    slug: 'reer-ou-celi-quebec',
    nav: 'REER ou CELI au Québec', card: `Abattement de 16,5 %, impôt du Québec de ${F.r(Q.rates[0])} à ${F.r(Q.rates[Q.rates.length - 1])} : le remboursement REER réel en ${Y}.`,
    title: `REER ou CELI au Québec ${Y} : remboursement et taux réels`,
    description: `REER ou CELI au Québec ${Y} : abattement fédéral de 16,5 %, impôt du Québec de 14 % à 25,75 %, deux déclarations, retenues réduites. Calcul avec vos chiffres.`,
    h1: `REER ou CELI au Québec en ${Y} : ce que vous récupérez vraiment`,
    intro: 'Au Québec, une cotisation REER réduit deux impôts à la fois, celui d’Ottawa et celui de Québec. Le simulateur applique les deux barèmes 2026 et l’abattement propre aux résidents du Québec.',
    resume: `Un résident du Québec qui verse au REER fait baisser deux impôts : l'impôt fédéral, réduit de 16,5 % par l'abattement du Québec, et l'impôt du Québec, dont les taux vont de ${F.r(Q.rates[0])} à ${F.r(Q.rates[Q.rates.length - 1])} en ${Y} avec un montant personnel de base de ${F.m(Q.bpa ?? 0)}. À ${F.m(80000)} de revenu imposable, le taux marginal combiné est de ${F.p(s80.total)} : ${F.p(s80.federal)} au fédéral après abattement et ${F.p(s80.provincial)} au Québec. C'est plus qu'en Ontario au même revenu (${F.p(on80)}), si bien qu'une cotisation REER rapporte davantage ici. Le CELI fonctionne de la même façon partout au Canada et ne réduit aucun des deux impôts. Le choix se joue donc, comme ailleurs, entre votre taux d'aujourd'hui et votre taux au retrait, mais avec des taux québécois plus élevés aux deux bouts. À la retraite, les retraits REER sont imposés par les deux gouvernements, et les retenues à la source se partagent entre Ottawa et Québec.`,
    faqs: [
      { q: 'Pourquoi le taux fédéral est-il plus bas pour un résident du Québec ?', a: `Parce que le Québec perçoit son propre impôt et finance lui-même certains programmes, le fédéral réduit de 16,5 % l'impôt fédéral de base de ses résidents. C'est l'abattement du Québec. Au taux fédéral de 20,5 %, le taux réellement payé devient environ ${F.p(0.205 * (1 - K.P.federal.qcAbatement))}. L'abattement s'applique aussi sur l'économie d'impôt d'une cotisation REER.` },
      { q: 'Faut-il déclarer la cotisation REER dans les deux déclarations au Québec ?', a: 'Oui. Un résident du Québec produit une déclaration fédérale auprès de l’Agence du revenu du Canada et une déclaration provinciale auprès de Revenu Québec. La cotisation REER se déduit dans les deux, avec les mêmes reçus. Le remboursement arrive donc en deux parts, une de chaque gouvernement, ou réduit les deux soldes à payer.' },
      { q: 'Combien retient-on sur un retrait REER au Québec ?', a: `Pour un retrait unique de ${F.m(10000)}, l'institution retient ${F.p(w10.rate, 0)} d'impôt fédéral, au lieu de 20 % ailleurs au Canada, plus l'impôt du Québec prévu par ses propres règles. Ces retenues sont des acomptes : l'impôt final se calcule dans les deux déclarations, selon votre revenu total de l'année.` },
      { q: 'Le CELIAPP réduit-il aussi l’impôt du Québec ?', a: `Oui, une cotisation au CELIAPP se déduit dans la déclaration fédérale et dans celle du Québec, comme une cotisation REER. À ${F.m(80000)} de revenu, ${F.m(8000)} versés au CELIAPP font baisser l'impôt total d'environ ${F.m(K.saving(80000, 8000, 'QC'))}. Le retrait pour acheter une première propriété n'est imposé ni par Ottawa ni par Québec.` },
    ],
    body: (h) => `
<h2>Deux impôts, un seul geste</h2>
<p>Le Québec est la seule province qui perçoit elle-même son impôt sur le revenu. Une cotisation REER y est donc déduite deux fois : dans la déclaration fédérale, où elle réduit l'impôt calculé avec les tranches fédérales puis diminué de l'abattement, et dans la déclaration du Québec, où elle réduit l'impôt calculé avec le barème québécois. Pour une personne qui gagne ${h.m(80000)}, l'impôt fédéral net est de ${h.m(d80.federal)} après un abattement de ${h.m(d80.abatement)}, et l'impôt du Québec de ${h.m(d80.provincial)}.</p>
<h2>Le barème du Québec en ${Y}</h2>
<p>Le Québec impose le revenu à quatre taux : ${Q.rates.map((r) => h.r(r)).join(', ')}. Le montant personnel de base s'élève à ${h.m(Q.bpa ?? 0)}, le plus élevé des provinces de l'Est. Ces deux données ont été vérifiées dans le tableau interprovincial du ${h.src('mb_budget_2026', 'budget 2026 du Manitoba')}. Les seuils des tranches appliqués par le simulateur sont ceux publiés par ${h.src('rq_rates', 'Revenu Québec')} ; ils n'ont pas pu être relus lors de cette mise à jour et le seront dès que possible.</p>
${h.table(['Revenu imposable', 'Part fédérale', 'Part du Québec', 'Taux combiné', 'Économie sur 5 000 $'], rows(h), `Taux marginal par gouvernement et économie d'une cotisation REER de ${h.m(5000)}, Québec, ${Y}.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Ce que l'abattement change pour le REER</h2>
<p>L'abattement réduit l'impôt fédéral de 16,5 %. Il réduit donc aussi, dans la même proportion, la part fédérale de votre remboursement : au taux fédéral de 20,5 %, un dollar déduit ne rapporte qu'environ ${h.p(0.205 * (1 - K.P.federal.qcAbatement))} au fédéral. La part québécoise compense largement, puisque le taux du Québec dépasse presque toujours le taux provincial ailleurs. Résultat : à revenu égal, le remboursement REER d'un Québécois est en général plus élevé que celui d'un Ontarien ou d'un Albertain. Le tableau de l'accueil compare les 13 provinces et territoires.</p>
${h.mini('remboursement', { t: 'Votre remboursement REER au Québec', p: ['rv', 'mt'], d: { pr: 'QC', rv: 80000, mt: 5000 } })}
<h2>Un exemple complet</h2>
<p>Une personne de ${h.m(85000)} de revenu peut épargner ${h.m(6000)} par an et prévoit ${h.m(38000)} de revenu imposable à la retraite, rentes du RRQ et de la Sécurité de la vieillesse comprises. Pour le même effort, elle peut verser ${h.m(cmp.contribution)} au REER, puisque le remboursement de ${h.m(cmp.refund)} finance la différence. Après 25 ans à 3 % de rendement réel et 20 ans de retraits, le REER lui laisse ${h.m(cmp.rrspNet)} après impôt, contre ${h.m(cmp.tfsaValue)} pour le CELI. L'écart vient d'un taux récupéré de ${h.p(cmp.rateNow)} contre ${h.p(cmp.rateLater)} payé au retrait.</p>
<h2>Les retraits et la retraite au Québec</h2>
<p>Sur un retrait unique de REER, la retenue fédérale est de ${h.p(K.P.rrsp.withholding.ratesQcFederal[0], 0)}, ${h.p(K.P.rrsp.withholding.ratesQcFederal[1], 0)} ou ${h.p(K.P.rrsp.withholding.ratesQcFederal[2], 0)} selon le montant, au lieu de 10, 20 ou 30 % dans les autres provinces, selon la ${h.src('cra_withholding', 'page de l’Agence sur les retenues')} ; l'institution retient en plus l'impôt du Québec. À la retraite, le Régime de rentes du Québec remplace le Régime de pensions du Canada, mais la Sécurité de la vieillesse et le Supplément de revenu garanti sont fédéraux et suivent les mêmes seuils qu'ailleurs. Le CELI garde ici son avantage habituel : ses retraits n'entrent dans aucun revenu, ni fédéral ni québécois.</p>
<p>Le RAP et le REEP existent aussi dans la déclaration du Québec : un retrait admissible n'est imposé par aucun des deux gouvernements, et un remboursement manqué s'ajoute au revenu dans les deux déclarations. Pour un couple qui achète une première maison, chaque conjoint peut combiner son CELIAPP et son RAP pour la même propriété, ce qui mobilise jusqu'à ${h.m(K.P.fhsa.lifetime + K.P.hbp.limit)} par personne avant toute mise de fonds ordinaire.</p>
<h2>Ce que le simulateur ne compte pas au Québec</h2>
<p>Le calcul retient les tranches, les taux, le montant personnel de base et l'abattement. Il ne compte pas les crédits liés aux cotisations au RRQ, au RQAP et à l'assurance-emploi, ni l'Allocation famille, qui dépend elle aussi du revenu familial et augmente quand une déduction REER le fait baisser. Pour un revenu modeste avec enfants, le gain réel d'une cotisation peut donc être un peu plus élevé que le chiffre affiché.</p>
`,
  },
  en: {
    slug: 'rrsp-vs-tfsa-quebec',
    nav: 'RRSP or TFSA in Quebec', card: `16.5% abatement, Quebec tax from ${E.r(Q.rates[0])} to ${E.r(Q.rates[Q.rates.length - 1])}: the real ${Y} RRSP refund.`,
    title: `RRSP vs TFSA in Quebec ${Y}: real refund and tax rates`,
    description: `RRSP or TFSA in Quebec for ${Y}: the 16.5% federal abatement, Quebec tax from 14% to 25.75%, two tax returns and lower withholding. Run it with your numbers.`,
    h1: `RRSP or TFSA in Quebec in ${Y}: what you really get back`,
    intro: 'In Quebec, an RRSP contribution cuts two taxes at once, Ottawa’s and Quebec’s. The calculator applies both 2026 tax tables and the abatement that only Quebec residents get.',
    resume: `A Quebec resident who contributes to an RRSP lowers two taxes: federal tax, reduced by 16.5% through the Quebec abatement, and Quebec income tax, with rates from ${E.r(Q.rates[0])} to ${E.r(Q.rates[Q.rates.length - 1])} in ${Y} and a basic personal amount of ${E.m(Q.bpa ?? 0)}. At ${E.m(80000)} of taxable income, the combined marginal rate is ${E.p(s80.total)}: ${E.p(s80.federal)} federal after the abatement and ${E.p(s80.provincial)} Quebec. That is higher than in Ontario at the same income (${E.p(on80)}), so an RRSP contribution saves more here. A TFSA works the same way everywhere in Canada and reduces neither tax. As elsewhere, the choice turns on your rate today against your rate on withdrawal, but with higher Quebec rates at both ends. In retirement, RRSP withdrawals are taxed by both governments, and withholding is split between Ottawa and Quebec.`,
    faqs: [
      { q: 'Why is the federal rate lower for Quebec residents?', a: `Because Quebec collects its own income tax and funds some programs itself, the federal government reduces the basic federal tax of Quebec residents by 16.5%. This is the Quebec abatement. At the 20.5% federal rate, the rate actually paid becomes about ${E.p(0.205 * (1 - K.P.federal.qcAbatement))}. The abatement also applies to the tax saved by an RRSP contribution.` },
      { q: 'Do I claim my RRSP contribution on both returns in Quebec?', a: 'Yes. A Quebec resident files a federal return with the Canada Revenue Agency and a provincial return with Revenu Québec. The RRSP contribution is deducted on both, using the same receipts. The refund therefore comes in two parts, one from each government, or reduces both balances owing.' },
      { q: 'How much tax is withheld on an RRSP withdrawal in Quebec?', a: `On a single ${E.m(10000)} withdrawal, the institution withholds ${E.p(w10.rate, 0)} federal tax, instead of 20% elsewhere in Canada, plus Quebec tax under Quebec's own rules. These amounts are prepayments: the final tax is worked out on both returns, based on your total income for the year.` },
      { q: 'Does the FHSA also reduce Quebec income tax?', a: `Yes, an FHSA contribution is deducted on both the federal and the Quebec return, like an RRSP contribution. At ${E.m(80000)} of income, ${E.m(8000)} put into an FHSA lowers total tax by about ${E.m(K.saving(80000, 8000, 'QC'))}. A withdrawal to buy a first home is taxed by neither Ottawa nor Quebec.` },
    ],
    body: (h) => `
<h2>Two taxes, one contribution</h2>
<p>Quebec is the only province that collects its own income tax. An RRSP contribution is therefore deducted twice: on the federal return, where it lowers tax worked out with the federal brackets and then cut by the abatement, and on the Quebec return, where it lowers tax worked out with Quebec's table. For someone earning ${h.m(80000)}, net federal tax is ${h.m(d80.federal)} after an abatement of ${h.m(d80.abatement)}, and Quebec tax is ${h.m(d80.provincial)}.</p>
<h2>Quebec's ${Y} tax table</h2>
<p>Quebec taxes income at four rates: ${Q.rates.map((r) => h.r(r)).join(', ')}. The basic personal amount is ${h.m(Q.bpa ?? 0)}, the highest among the eastern provinces. Both figures were checked in the interprovincial table of the ${h.src('mb_budget_2026', 'Manitoba 2026 budget')}. The bracket thresholds used by the calculator are those published by ${h.src('rq_rates', 'Revenu Québec')}; they could not be re-read during this update and will be as soon as possible.</p>
${h.table(['Taxable income', 'Federal share', 'Quebec share', 'Combined rate', 'Saved on $5,000'], rows(h), `Marginal rate by government and tax saved by a ${h.m(5000)} RRSP contribution, Quebec, ${Y}.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>What the abatement means for an RRSP</h2>
<p>The abatement cuts federal tax by 16.5%, so it also cuts the federal part of your refund in the same proportion: at the 20.5% federal rate, each dollar deducted saves only about ${h.p(0.205 * (1 - K.P.federal.qcAbatement))} federally. The Quebec part more than makes up for it, since Quebec's rate is almost always above the provincial rate elsewhere. The result: at the same income, a Quebecer's RRSP refund is usually larger than an Ontarian's or an Albertan's. The table on the home page compares all 13 provinces and territories.</p>
${h.mini('remboursement', { t: 'Your RRSP refund in Quebec', p: ['rv', 'mt'], d: { pr: 'QC', rv: 80000, mt: 5000 } })}
<h2>A worked example</h2>
<p>Someone earning ${h.m(85000)} can save ${h.m(6000)} a year and expects ${h.m(38000)} of taxable income in retirement, including QPP and Old Age Security. For the same effort, they can put ${h.m(cmp.contribution)} in an RRSP, since the ${h.m(cmp.refund)} refund covers the difference. After 25 years at a 3% real return and 20 years of withdrawals, the RRSP leaves ${h.m(cmp.rrspNet)} after tax, against ${h.m(cmp.tfsaValue)} in the TFSA. The gap comes from saving ${h.p(cmp.rateNow)} now against paying ${h.p(cmp.rateLater)} on the way out.</p>
<h2>Withdrawals and retirement in Quebec</h2>
<p>On a single RRSP withdrawal, federal withholding is ${h.p(K.P.rrsp.withholding.ratesQcFederal[0], 0)}, ${h.p(K.P.rrsp.withholding.ratesQcFederal[1], 0)} or ${h.p(K.P.rrsp.withholding.ratesQcFederal[2], 0)} depending on the amount, instead of 10, 20 or 30% in other provinces, according to the ${h.src('cra_withholding', 'agency’s withholding page')}; the institution also withholds Quebec tax. In retirement, the Quebec Pension Plan replaces the Canada Pension Plan, but Old Age Security and the Guaranteed Income Supplement are federal and follow the same thresholds as everywhere else. The TFSA keeps its usual edge here: its withdrawals count as income for neither government.</p>
<p>The HBP and the LLP also apply on the Quebec return: a qualifying withdrawal is taxed by neither government, and a missed repayment is added to income on both returns. For a couple buying a first home, each spouse can combine their FHSA and their HBP for the same property, which can put up to ${h.m(K.P.fhsa.lifetime + K.P.hbp.limit)} per person toward the purchase before any ordinary savings.</p>
<h2>What the calculator leaves out in Quebec</h2>
<p>The calculation uses the brackets, rates, basic personal amount and abatement. It does not count the credits for QPP, QPIP and EI contributions, or Quebec's Family Allowance, which also depends on family income and rises when an RRSP deduction lowers it. For a modest income with children, the real gain from a contribution can be a little higher than the figure shown.</p>
`,
  },
});
