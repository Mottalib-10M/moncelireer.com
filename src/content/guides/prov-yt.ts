import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const T = K.jur('YT');
const FD = K.P.federal;
const FB = FD.brackets;
const top = T.rates[T.rates.length - 1], topFrom = T.brackets[T.brackets.length - 1];
const steps = K.steps('YT', 600000).filter((s) => s.rate > 0);
// Zone de réduction du montant de base, fédéral et Yukon ensemble.
const zA = FB[2], zB = FB[3], zMid = 220000;
const listed = FD.rates[3] + T.rates[3];
const real = K.marginal(zMid, 'YT');
// Revenir sous le seuil fédéral de 117 045 $ depuis 125 000 $.
const startInc = 125000, toLine = startInc - FB[1];
const low = K.compare({ prov: 'YT', income: 90000, save: 6000, years: 25, growth: 0.03, retireIncome: 35000, spread: 20 });
const high = K.compare({ prov: 'YT', income: 90000, save: 6000, years: 25, growth: 0.03, retireIncome: 75000, spread: 20 });
const lead = (g: number, fr: boolean) => (Math.abs(g) < 1 ? (fr ? 'une égalité' : 'a tie') : `${fr ? 'en faveur du' : 'in favour of the'} ${g > 0 ? (fr ? 'REER' : 'RRSP') : (fr ? 'CELI' : 'TFSA')}`);

export default defineGuide({
  id: 'prov-yt', group: 'prov', order: 50, tool: 'remboursement',
  toolArg: { pr: 'YT', rv: 125000, mt: 8000 },
  related: ['reer-ou-celi', 'taux-marginal', 'remboursement-reer', 'plafond-reer', 'prov-nt'],
  sources: ['cra_rates_2026', 't4127_jan', 't4127_jul'],
  fr: {
    slug: 'reer-ou-celi-yukon',
    nav: 'REER ou CELI au Yukon', card: `Tranches calquées sur le fédéral, cinq taux de ${F.r(T.rates[0])} à ${F.r(top)} : ce que vaut une cotisation REER au Yukon en ${Y}.`,
    title: `REER ou CELI au Yukon ${Y} : tranches alignées sur Ottawa`,
    description: `REER ou CELI au Yukon ${Y} : cinq taux de ${F.r(T.rates[0])} à ${F.r(top)}, tranches et montant de base identiques au fédéral jusqu'à ${F.m(zA)}. Taux et remboursement REER.`,
    h1: `REER ou CELI au Yukon en ${Y} : un barème aligné sur le fédéral`,
    intro: 'Au Yukon, les seuils de l’impôt territorial sont ceux du fédéral. Le simulateur calcule l’économie d’une cotisation REER avec les deux barèmes de 2026.',
    resume: `Le Yukon impose le revenu de ${Y} à ${T.rates.map((r) => F.r(r)).join(', ')}, avec des seuils à ${T.brackets.map((b) => F.m(b)).join(', ')}. Les trois premiers seuils sont exactement ceux du fédéral, et le montant personnel de base suit lui aussi le montant fédéral : ${F.m(FD.bpaMax)}, réduit progressivement jusqu'à ${F.m(FD.bpaMin)} entre ${F.m(zA)} et ${F.m(zB)} de revenu. Conséquence pratique : le taux marginal combiné ne change qu'à quelques endroits, toujours les mêmes que ceux du fédéral, plus le seuil territorial de ${F.m(topFrom)}. Il est de ${F.p(K.marginal(45000, 'YT'))} jusqu'à ${F.m(FB[0])}, de ${F.p(K.marginal(80000, 'YT'))} jusqu'à ${F.m(FB[1])}, puis de ${F.p(K.marginal(150000, 'YT'))}. Une cotisation REER qui ramène le revenu sous l'un de ces seuils rapporte le taux le plus élevé sur chaque dollar déduit. Sous ${F.m(FD.bpaMax)} de revenu imposable, aucun impôt n'est dû ni à Ottawa ni au Yukon, et une cotisation REER ne fait rien économiser : le CELI y est le compte logique.`,
    faqs: [
      { q: 'Le Yukon a-t-il les mêmes tranches d’impôt que le fédéral ?', a: `Jusqu'à ${F.m(zA)}, oui : les seuils de ${F.m(FB[0])}, ${F.m(FB[1])} et ${F.m(FB[2])} sont communs aux deux barèmes. Au-delà, le Yukon n'a plus qu'un seuil, ${F.m(topFrom)}, où son taux passe de ${F.r(T.rates[3])} à ${F.r(top)}, alors que le fédéral passe à 33 % dès ${F.m(FB[3])}. Les taux du Yukon, eux, sont propres au territoire.` },
      { q: 'Le montant personnel de base du Yukon suit-il celui du fédéral ?', a: `Il est égal au montant fédéral : ${F.m(FD.bpaMax)} pour un revenu net jusqu'à ${F.m(zA)}, puis il diminue graduellement jusqu'à ${F.m(FD.bpaMin)} à ${F.m(zB)}. Le crédit se calcule au premier taux du Yukon, ${F.r(T.rates[0])}. Le guide de paie de l'Agence précise que les montants personnels du Yukon sont harmonisés avec les montants fédéraux.` },
      { q: `Pourquoi le taux marginal du Yukon est-il plus élevé entre ${F.m(zA)} et ${F.m(zB)} ?`, a: `Dans cette zone, le montant personnel de base fond à la fois au fédéral et au Yukon. Chaque dollar de revenu en plus fait perdre un peu de crédit des deux côtés. À ${F.m(zMid)}, l'addition des taux de tranche donne ${F.p(listed)}, mais le taux réel est de ${F.p(real)}. Une déduction REER y récupère ce taux réel.` },
      { q: `Combien verser au REER pour redescendre sous ${F.m(FB[1])} au Yukon ?`, a: `Il suffit de verser la partie du revenu imposable qui dépasse le seuil. À ${F.m(startInc)}, une cotisation de ${F.m(toLine)} fait baisser l'impôt de ${F.m(K.saving(startInc, toLine, 'YT'))}, au taux de ${F.p(K.marginal(startInc, 'YT'))}. Chaque dollar supplémentaire ne rapporte ensuite que ${F.p(K.marginal(100000, 'YT'))}, jusqu'au seuil suivant de ${F.m(FB[0])}. L'épargne qui reste peut alors aller au CELI.` },
    ],
    body: (h) => `
<h2>Un barème calqué sur le fédéral</h2>
<p>Le Yukon a choisi de faire coïncider ses tranches avec celles d'Ottawa. La ${h.src('cra_rates_2026', 'page des taux 2026 de l’Agence du revenu du Canada')} donne cinq taux territoriaux, ${T.rates.map((r) => h.r(r)).join(', ')}, appliqués à partir de ${T.brackets.map((b) => h.m(b)).join(', ')}. Les trois premiers seuils sont ceux du fédéral au dollar près. Le montant personnel de base suit la même logique : le ${h.src('t4127_jan', 'guide T4127 de janvier')} précise que les montants personnels du Yukon sont harmonisés avec les montants fédéraux, si bien qu'ils ne relèvent pas d'une indexation propre. Celui de ${Y} est donc de ${h.m(FD.bpaMax)}, et il se réduit au-delà de ${h.m(zA)} comme celui d'Ottawa. Le ${h.src('t4127_jul', 'guide de juillet')} ne signale aucun changement en cours d'année pour le territoire.</p>
<h2>Où le taux combiné change au Yukon</h2>
<p>Comme les seuils se superposent, le taux combiné fait peu de marches, et elles sont hautes. Le tableau montre chacune d'elles jusqu'au-delà du seuil territorial de ${h.m(topFrom)}.</p>
${h.table(['Revenu imposable à partir de', 'Taux marginal combiné'], steps.map((s) => [h.m(s.from), h.p(s.rate)]), `Taux combinés fédéral et Yukon, ${Y}, revenu ordinaire. Sous environ ${h.m(FD.bpaMax)}, aucun impôt n'est dû.`, ['l', 'r'])}
<p>La lecture est plus simple qu'ailleurs : ce que vaut une déduction REER au Yukon dépend presque uniquement de la tranche fédérale où vous êtes. Il n'y a pas, comme au Nouveau-Brunswick ou en Colombie-Britannique, de seuil territorial qui tombe quelques milliers de dollars avant ou après celui d'Ottawa.</p>
<h2>Entre ${h.m(zA)} et ${h.m(zB)} : plus que l'addition des taux</h2>
<p>Dans cette zone, le montant personnel de base diminue au fédéral, et comme celui du Yukon le suit, il diminue aussi au territoire. Chaque dollar gagné fait donc perdre un peu de crédit des deux côtés, en plus de l'impôt de tranche. À ${h.m(zMid)}, l'addition des taux affichés donne ${h.p(listed)} ; le taux réel est de ${h.p(real)}. C'est ce taux réel que récupère une cotisation REER faite dans cette zone. Au-delà de ${h.m(zB)}, la réduction s'arrête et le taux combiné passe à ${h.p(K.marginal(zB + 10000, 'YT'))}, puis à ${h.p(K.marginal(topFrom + 10000, 'YT'))} au-delà de ${h.m(topFrom)}.</p>
<h2>Au-delà de ${h.m(topFrom)}</h2>
<p>Le seul seuil propre au Yukon est très haut. Au-delà de ${h.m(topFrom)}, le taux territorial passe à ${h.r(top)} et le taux combiné atteint ${h.p(K.marginal(topFrom + 10000, 'YT'))}. Pour ces revenus, la limite n'est plus le taux mais le plafond : en ${Y}, la déduction REER ne peut dépasser ${h.m(K.rrspLimit(Y))} de droits nouveaux, plus les droits inutilisés des années passées. Une cotisation au plafond ne fait donc sortir qu'une petite partie du revenu de la tranche la plus haute, et le CELI, sans déduction, sert alors d'épargne complémentaire.</p>
<h2>Viser le seuil de ${h.m(FB[1])}</h2>
<p>Parce que les marches sont hautes, le montant à verser se calcule facilement. Une personne au revenu imposable de ${h.m(startInc)} a ${h.m(toLine)} au-dessus du deuxième seuil fédéral. Une cotisation de ce montant fait baisser l'impôt de ${h.m(K.saving(startInc, toLine, 'YT'))}, soit ${h.p(K.marginal(startInc, 'YT'))} par dollar. Les dollars suivants ne rapportent que ${h.p(K.marginal(100000, 'YT'))}, jusqu'à ${h.m(FB[0])}. Pour l'épargne qui dépasse ce premier montant, le choix entre REER et CELI se joue alors sur le taux attendu à la retraite.</p>
${h.mini('reerCeli', { t: 'REER ou CELI au Yukon', p: ['rv', 'rr', 'dc'], d: { pr: 'YT', rv: 90000, rr: 35000 } })}
<h2>Deux retraites, deux réponses</h2>
<p>Gardons un revenu de ${h.m(90000)} et ${h.m(6000)} d'épargne par an pendant 25 ans. Si le revenu de retraite prévu, sans le REER, est de ${h.m(35000)}, les retraits seront imposés à ${h.p(low.rateLater)}, contre ${h.p(low.rateNow)} récupérés aujourd'hui : l'écart final est de ${h.m(Math.abs(low.gap))}, ${lead(low.gap, true)}. Si une rente porte ce revenu à ${h.m(75000)}, les retraits tombent dans la même tranche que le salaire actuel, au taux de ${h.p(high.rateLater)}, et le résultat devient ${lead(high.gap, true)}${Math.abs(high.gap) >= 1 ? ` de ${h.m(Math.abs(high.gap))}` : ''}. À égalité de chiffres, le CELI garde un avantage que le calcul ne mesure pas : on peut en retirer à tout moment sans impôt, et le montant retiré revient dans les droits de cotisation l'année suivante.</p>
`,
  },
  en: {
    slug: 'rrsp-vs-tfsa-yukon',
    nav: 'RRSP or TFSA in Yukon', card: `Brackets copied from the federal ones, five rates from ${E.r(T.rates[0])} to ${E.r(top)}: what an RRSP contribution saves in Yukon in ${Y}.`,
    title: `RRSP vs TFSA in Yukon ${Y}: brackets that match federal`,
    description: `RRSP or TFSA in Yukon ${Y}: five rates from ${E.r(T.rates[0])} to ${E.r(top)}, with brackets and a basic personal amount that match the federal ones up to ${E.m(zA)}. Refund and rates.`,
    h1: `RRSP or TFSA in Yukon in ${Y}: a table aligned with federal tax`,
    intro: 'In Yukon, territorial tax thresholds are the federal ones. The calculator works out what an RRSP contribution saves using both 2026 tax tables.',
    resume: `Yukon taxes ${Y} income at ${T.rates.map((r) => E.r(r)).join(', ')}, with thresholds at ${T.brackets.map((b) => E.m(b)).join(', ')}. The first three thresholds are exactly the federal ones, and the basic personal amount follows the federal amount too: ${E.m(FD.bpaMax)}, reduced gradually to ${E.m(FD.bpaMin)} between ${E.m(zA)} and ${E.m(zB)} of income. In practice, the combined marginal rate only changes in a few places, always the federal ones, plus the territorial threshold at ${E.m(topFrom)}. It is ${E.p(K.marginal(45000, 'YT'))} up to ${E.m(FB[0])}, ${E.p(K.marginal(80000, 'YT'))} up to ${E.m(FB[1])}, then ${E.p(K.marginal(150000, 'YT'))}. An RRSP contribution that brings income back under one of those thresholds saves the highest rate on every dollar deducted. Below ${E.m(FD.bpaMax)} of taxable income, no tax is owed to either Ottawa or Yukon, and an RRSP contribution saves nothing: the TFSA is the obvious account there.`,
    faqs: [
      { q: 'Does Yukon use the same tax brackets as the federal government?', a: `Up to ${E.m(zA)}, yes: the thresholds of ${E.m(FB[0])}, ${E.m(FB[1])} and ${E.m(FB[2])} are shared by both tables. Above that, Yukon has a single threshold, ${E.m(topFrom)}, where its rate moves from ${E.r(T.rates[3])} to ${E.r(top)}, while the federal rate moves to 33% from ${E.m(FB[3])}. Yukon's rates themselves are set by the territory.` },
      { q: 'Does the Yukon basic personal amount follow the federal one?', a: `It equals the federal amount: ${E.m(FD.bpaMax)} for net income up to ${E.m(zA)}, then it shrinks gradually to ${E.m(FD.bpaMin)} at ${E.m(zB)}. The credit is worked out at Yukon's lowest rate, ${E.r(T.rates[0])}. The CRA payroll guide states that Yukon personal amounts are harmonized with the federal values.` },
      { q: `Why is the Yukon marginal rate higher between ${E.m(zA)} and ${E.m(zB)}?`, a: `In that range, the basic personal amount shrinks both federally and in Yukon. Each extra dollar of income costs a little credit on both sides. At ${E.m(zMid)}, adding up the bracket rates gives ${E.p(listed)}, but the real rate is ${E.p(real)}. An RRSP deduction made there recovers that real rate.` },
      { q: `How much should I put in an RRSP to get below ${E.m(FB[1])} in Yukon?`, a: `Contribute the part of taxable income above the threshold. At ${E.m(startInc)}, a ${E.m(toLine)} contribution lowers tax by ${E.m(K.saving(startInc, toLine, 'YT'))}, at ${E.p(K.marginal(startInc, 'YT'))}. Each further dollar then saves only ${E.p(K.marginal(100000, 'YT'))}, down to the next threshold at ${E.m(FB[0])}. Any savings left after that can go to a TFSA instead.` },
    ],
    body: (h) => `
<h2>A tax table copied from the federal one</h2>
<p>Yukon has chosen to line up its brackets with Ottawa's. The ${h.src('cra_rates_2026', 'Canada Revenue Agency 2026 rates page')} lists five territorial rates, ${T.rates.map((r) => h.r(r)).join(', ')}, starting at ${T.brackets.map((b) => h.m(b)).join(', ')}. The first three thresholds match the federal ones to the dollar. The basic personal amount works the same way: the ${h.src('t4127_jan', 'January T4127 guide')} states that Yukon personal amounts are harmonized with the federal values, so they do not follow an indexing of their own. The ${Y} amount is therefore ${h.m(FD.bpaMax)}, and it shrinks above ${h.m(zA)} just like Ottawa's. The ${h.src('t4127_jul', 'July guide')} reports no mid-year change for the territory.</p>
<h2>Where the combined rate changes in Yukon</h2>
<p>Because the thresholds overlap, the combined rate has few steps, and they are tall ones. The table shows each of them up to and past the territorial threshold at ${h.m(topFrom)}.</p>
${h.table(['Taxable income from', 'Combined marginal rate'], steps.map((s) => [h.m(s.from), h.p(s.rate)]), `Combined federal and Yukon rates, ${Y}, ordinary income. Below about ${h.m(FD.bpaMax)}, no tax is owed.`, ['l', 'r'])}
<p>That makes the reading simpler than elsewhere: what an RRSP deduction is worth in Yukon depends almost entirely on which federal bracket you are in. There is no territorial threshold falling a few thousand dollars before or after Ottawa's, as there is in New Brunswick or British Columbia.</p>
<h2>Between ${h.m(zA)} and ${h.m(zB)}: more than the sum of the rates</h2>
<p>In this range, the federal basic personal amount shrinks, and since Yukon's follows it, the territorial amount shrinks too. Each dollar earned therefore costs a little credit on both sides, on top of bracket tax. At ${h.m(zMid)}, adding up the posted rates gives ${h.p(listed)}; the real rate is ${h.p(real)}. That real rate is what an RRSP contribution made in this range gets back. Above ${h.m(zB)}, the reduction stops and the combined rate moves to ${h.p(K.marginal(zB + 10000, 'YT'))}, then to ${h.p(K.marginal(topFrom + 10000, 'YT'))} above ${h.m(topFrom)}.</p>
<h2>Above ${h.m(topFrom)}</h2>
<p>Yukon's only threshold of its own is a very high one. Above ${h.m(topFrom)}, the territorial rate moves to ${h.r(top)} and the combined rate reaches ${h.p(K.marginal(topFrom + 10000, 'YT'))}. At those incomes, the limit is no longer the rate but the dollar cap: in ${Y}, new RRSP room cannot exceed ${h.m(K.rrspLimit(Y))}, plus any unused room from past years. A contribution at the cap only takes a small slice of income out of the top bracket, and the TFSA, with no deduction, then serves as extra savings on the side.</p>
<h2>Aiming for the ${h.m(FB[1])} line</h2>
<p>Because the steps are tall, the amount to contribute is easy to work out. Someone with ${h.m(startInc)} of taxable income has ${h.m(toLine)} above the second federal threshold. A contribution of that size lowers tax by ${h.m(K.saving(startInc, toLine, 'YT'))}, or ${h.p(K.marginal(startInc, 'YT'))} per dollar. The next dollars save only ${h.p(K.marginal(100000, 'YT'))}, down to ${h.m(FB[0])}. For savings beyond that first amount, the RRSP or TFSA choice then turns on the rate you expect in retirement.</p>
${h.mini('reerCeli', { t: 'RRSP or TFSA in Yukon', p: ['rv', 'rr', 'dc'], d: { pr: 'YT', rv: 90000, rr: 35000 } })}
<h2>Two retirements, two answers</h2>
<p>Keep an income of ${h.m(90000)} and ${h.m(6000)} saved a year for 25 years. If expected retirement income, before the RRSP, is ${h.m(35000)}, withdrawals will be taxed at ${h.p(low.rateLater)}, against ${h.p(low.rateNow)} recovered today: the final gap is ${h.m(Math.abs(low.gap))}, ${lead(low.gap, false)}. If a pension brings that income to ${h.m(75000)}, withdrawals land in the same bracket as today's salary, at ${h.p(high.rateLater)}, and the result becomes ${lead(high.gap, false)}${Math.abs(high.gap) >= 1 ? ` of ${h.m(Math.abs(high.gap))}` : ''}. When the figures tie, the TFSA keeps an edge the calculation does not measure: you can take money out at any time without tax, and the amount withdrawn comes back as contribution room the following year. A retiree whose income will sit near ${h.m(FB[0])} gains the most from keeping some savings in each account, drawing on the TFSA in the years when an RRSP withdrawal would cross that line.</p>
`,
  },
});
