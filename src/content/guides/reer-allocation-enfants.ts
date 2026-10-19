import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const C = K.P.benefits.ccb;
const [s1, s2] = C.thresholds;
const R = C.rates as Record<string, number[]>;
// Exemple principal : Ontario, revenu familial net de 60 000 $, deux enfants, parent à 40 000 $ qui déduit 5 000 $.
const AF = 60000, DED = 5000, OWN = 40000;
const g = K.ccbGain(AF, DED, 2), t = K.saving(OWN, DED, 'ON');
// Famille qui chevauche le second seuil : 85 000 $, deux enfants, parent à 55 000 $.
const g85 = K.ccbGain(85000, DED, 2), t85 = K.saving(55000, DED, 'ON');
// Gain sur l'allocation pour 6 000 $ déduits, selon le nombre d'enfants et le revenu familial.
const kids = ['1', '2', '3', '4'];
const rateRows = (l: 'fr' | 'en') => kids.map((k) => [k === '4' ? (l === 'fr' ? '4 ou plus' : '4 or more') : k, K[l].p(R[k][0]), K[l].p(R[k][1]), K[l].m(K.ccbGain(70000, 6000, Number(k))), K[l].m(K.ccbGain(110000, 6000, Number(k)))]);

export default defineGuide({
  id: 'reer-allocation-enfants', group: 'impot', order: 31, tool: 'ace',
  related: ['remboursement-reer', 'reer-ou-celi', 'celiapp', 'taux-marginal', 'retrait-celi'],
  sources: ['cra_ccb', 'cra_rates_2026'],
  fr: {
    slug: 'reer-allocation-canadienne-enfants',
    nav: 'REER et allocation pour enfants', card: `Une déduction REER ou CELIAPP baisse le revenu familial net et relève l'allocation canadienne pour enfants de juillet suivant.`,
    title: `REER et allocation canadienne pour enfants ${Y} : le gain`,
    description: `REER et allocation canadienne pour enfants ${Y} : la déduction baisse le revenu familial, et l'ACE remonte de ${F.p(R['1'][1])} à ${F.p(R['4'][0], 0)} du montant selon le nombre d'enfants.`,
    h1: `REER et allocation canadienne pour enfants ${Y} : combien de plus ?`,
    intro: 'Entrez votre province, le revenu familial net, la déduction REER ou CELIAPP et le nombre d’enfants : le simulateur additionne la baisse d’impôt et l’allocation en plus.',
    resume: `Une déduction REER ou CELIAPP fait baisser votre revenu net, donc le revenu familial net rajusté qui sert à calculer l'allocation canadienne pour enfants. L'allocation est réduite d'un pourcentage du revenu familial au-delà de ${F.m(s1)}, puis d'un autre pourcentage au-delà de ${F.m(s2)} : de ${F.p(R['1'][0], 0)} et ${F.p(R['1'][1])} pour un enfant jusqu'à ${F.p(R['4'][0], 0)} et ${F.p(R['4'][1])} pour quatre enfants ou plus. Chaque dollar déduit rend ce pourcentage, en plus de la baisse d'impôt. En Ontario, une famille de deux enfants dont le revenu familial net est de ${F.m(AF)} et dont un parent gagne ${F.m(OWN)} gagne ${F.m(t)} d'impôt et ${F.m(g)} d'allocation en déduisant ${F.m(DED)}, soit ${F.p((g + t) / DED)} de la cotisation. Le décalage est d'un an : une déduction de ${Y} relève l'allocation versée de juillet ${Y + 1} à juin ${Y + 2}. Les seuils utilisés sont ceux de la période ${C.period.fr}, indexés chaque année.`,
    faqs: [
      { q: 'Une cotisation REER augmente-t-elle l’allocation canadienne pour enfants ?', a: `Oui, si votre revenu familial net rajusté dépasse ${F.m(s1)} et que vous déduisez la cotisation. La déduction baisse le revenu net, et l'allocation remonte du taux de réduction qui s'applique à votre famille : ${F.p(R['2'][0])} du montant déduit pour deux enfants sous ${F.m(s2)}, par exemple. Sous ${F.m(s1)}, vous recevez déjà le maximum et la déduction ne change rien à l'allocation.` },
      { q: 'Quand l’allocation augmente-t-elle après une déduction REER ?', a: `En juillet de l'année qui suit la déclaration. L'allocation est recalculée chaque juillet avec le revenu familial net rajusté de l'année précédente : une cotisation déduite dans la déclaration de ${Y} touche les versements de juillet ${Y + 1} à juin ${Y + 2}. C'est en produisant la déclaration que l'Agence du revenu du Canada établit chaque année le droit à l'allocation, en tenant compte du revenu net des deux conjoints.` },
      { q: 'La cotisation REER de mon conjoint compte-t-elle pour l’ACE ?', a: `Oui. Le revenu familial net rajusté additionne le revenu net de la ligne 23600 des deux conjoints. Une déduction REER de l'un ou de l'autre baisse ce total de la même façon et relève l'allocation du même montant. La baisse d'impôt, elle, dépend du taux marginal de celui qui déduit : à cotisation égale, c'est souvent le conjoint au revenu le plus élevé qui gagne le plus en impôt.` },
      { q: 'La déduction CELIAPP augmente-t-elle aussi l’allocation pour enfants ?', a: `Oui, de la même façon qu'une déduction REER : elle est retranchée du revenu et baisse le revenu familial net rajusté. Une cotisation au CELI, elle, n'est pas déductible et ne change rien à l'allocation. Les retraits du CELI ne la réduisent pas non plus, alors qu'un retrait REER imposable fait monter le revenu familial et peut faire baisser l'allocation de l'année suivante.` },
    ],
    body: (h) => `
<h2>Le revenu qui fixe l'allocation</h2>
<p>L'allocation canadienne pour enfants n'est pas imposable, mais elle baisse quand le revenu de la famille monte. Selon le ${h.src('cra_ccb', 'calcul de l’Agence du revenu du Canada')}, le chiffre qui compte est le revenu familial net rajusté : le revenu net de la ligne 23600 de votre déclaration, plus celui de votre époux ou conjoint de fait, avec quelques ajustements rares. Une déduction REER ou CELIAPP réduit ce revenu net. Elle fait donc baisser la réduction de l'allocation, au même titre qu'une baisse de salaire, sans que vous gagniez moins.</p>
<p>Pour la période ${C.period.fr}, calculée sur le revenu de ${C.incomeYear}, le maximum est de ${h.m(C.maxUnder6)} par enfant de moins de 6 ans et de ${h.m(C.max6to17)} par enfant de 6 à 17 ans. Il n'est pas réduit sous ${h.m(s1)} de revenu familial net rajusté. Entre ${h.m(s1)} et ${h.m(s2)}, il baisse d'un premier pourcentage de l'excédent ; au-delà de ${h.m(s2)}, d'un montant fixe plus un second pourcentage, plus faible.</p>
<h2>Les taux de réduction selon le nombre d'enfants</h2>
${h.table(['Enfants', `Taux de ${h.m(s1)} à ${h.m(s2)}`, `Taux au-delà de ${h.m(s2)}`, `Gain pour ${h.m(6000)} déduits à ${h.m(70000)}`, `Gain à ${h.m(110000)}`], rateRows('fr'), `Allocation en plus sur une année, revenu familial net rajusté avant la déduction ; seuils et taux de la période ${C.period.fr}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Le taux de réduction agit comme un impôt de plus sur le revenu familial. Une famille de quatre enfants à ${h.m(70000)} perd ${h.p(R['4'][0], 0)} d'allocation sur chaque dollar de revenu supplémentaire, en plus de l'impôt. À l'inverse, chaque dollar déduit lui en rend autant. Au-delà de ${h.m(s2)}, le taux tombe, et le gain aussi.</p>
<h2>Un exemple complet</h2>
<p>Une famille de l'Ontario a deux enfants et un revenu familial net rajusté de ${h.m(AF)}. Le parent qui gagne ${h.m(OWN)} cotise ${h.m(DED)} à son REER et déduit la cotisation dans sa déclaration de ${Y}. Son impôt baisse de ${h.m(t)}, calculé avec les ${h.src('cra_rates_2026', 'tranches de ' + Y)}. Le revenu familial tombe à ${h.m(AF - DED)}, et l'allocation versée de juillet ${Y + 1} à juin ${Y + 2} augmente d'environ ${h.m(g)}. Au total, la cotisation rapporte ${h.m(g + t)}, soit ${h.p((g + t) / DED)} de son montant, bien plus que le seul taux marginal du parent.</p>
<p>Une famille qui chevauche le second seuil gagne moins : à ${h.m(85000)} de revenu familial, avec un parent à ${h.m(55000)}, la même déduction rapporte ${h.m(t85)} d'impôt et ${h.m(g85)} d'allocation, parce qu'une partie seulement des dollars déduits repasse sous ${h.m(s2)}. Le simulateur fait le partage pour votre revenu.</p>
${h.mini('remboursement', { t: 'La baisse d’impôt seule, sans l’allocation', p: ['pr', 'rv', 'mt'], d: { pr: 'ON', rv: OWN, mt: DED }, c: 'Voir le détail fédéral et provincial' })}
<h2>Ce qu'il faut savoir avant de compter dessus</h2>
<p>Le gain arrive avec un an de décalage. L'allocation est recalculée chaque juillet avec le revenu de l'année précédente : une déduction de ${Y} ne change rien aux versements en cours. Les seuils de la période suivante seront indexés, si bien que le chiffre exact sera un peu différent. En garde partagée, chaque parent reçoit la moitié de ce qu'il toucherait en garde complète, calculée sur son propre revenu familial net rajusté : le gain d'une déduction est alors à peu près divisé par deux.</p>
<p>Le mouvement joue aussi dans l'autre sens. Un retrait REER imposable fait monter le revenu familial et baisse l'allocation de la période suivante, alors qu'un ${h.a('retrait-celi', 'retrait CELI')} n'a aucun effet. C'est un des arguments à peser dans le choix entre ${h.a('reer-ou-celi', 'REER ou CELI')} quand on a des enfants. La déduction du ${h.a('celiapp', 'CELIAPP')} a le même effet que celle du REER.</p>
<h2>Au Québec et dans les provinces</h2>
<p>L'Agence administre aussi des prestations pour enfants et familles de certaines provinces et territoires, parfois versées avec l'allocation fédérale dans un même paiement mensuel, parfois à part. Au Québec, l'Allocation famille s'ajoute à l'allocation fédérale avec son propre calcul. Le simulateur ne compte aucune de ces prestations : il ne chiffre que l'allocation fédérale et l'impôt, et le gain réel d'une déduction peut différer de celui affiché.</p>
`,
  },
  en: {
    slug: 'rrsp-canada-child-benefit',
    nav: 'RRSP and child benefit', card: `An RRSP or FHSA deduction lowers family net income and raises the Canada child benefit from the following July.`,
    title: `RRSP and Canada child benefit ${Y}: the extra you get`,
    description: `RRSP and Canada child benefit ${Y}: the deduction lowers family net income, and the CCB rises by ${E.p(R['1'][1])} to ${E.p(R['4'][0], 0)} of the amount depending on the number of children.`,
    h1: `RRSP and Canada child benefit ${Y}: how much more will you get?`,
    intro: 'Enter your province, family net income, RRSP or FHSA deduction and number of children: the calculator adds up the tax saved and the extra child benefit.',
    resume: `An RRSP or FHSA deduction lowers your net income, and with it the adjusted family net income used to calculate the Canada child benefit. The benefit is reduced by a percentage of family income above ${E.m(s1)}, then by another percentage above ${E.m(s2)}: from ${E.p(R['1'][0], 0)} and ${E.p(R['1'][1])} for one child to ${E.p(R['4'][0], 0)} and ${E.p(R['4'][1])} for four or more. Each dollar deducted gives that percentage back, on top of the tax saved. In Ontario, a family with two children, ${E.m(AF)} of family net income and one parent earning ${E.m(OWN)} gains ${E.m(t)} in tax and ${E.m(g)} in benefit by deducting ${E.m(DED)}, or ${E.p((g + t) / DED)} of the contribution. There is a one-year lag: a ${Y} deduction raises the benefit paid from July ${Y + 1} to June ${Y + 2}. The thresholds used are those for ${C.period.en}, indexed every year.`,
    faqs: [
      { q: 'Does an RRSP contribution increase the Canada child benefit?', a: `Yes, if your adjusted family net income is above ${E.m(s1)} and you deduct the contribution. The deduction lowers net income, and the benefit goes back up by the reduction rate that applies to your family: ${E.p(R['2'][0])} of the amount deducted for two children below ${E.m(s2)}, for example. Below ${E.m(s1)} you already get the maximum, and the deduction does not change the benefit.` },
      { q: 'When does the CCB go up after an RRSP deduction?', a: `In July of the year after you file. The benefit is recalculated every July using the previous year's adjusted family net income, so a contribution deducted on your ${Y} return affects payments from July ${Y + 1} to June ${Y + 2}. The Canada Revenue Agency sets your entitlement each year when you file, using the net income of both spouses.` },
      { q: 'Does my spouse’s RRSP deduction count for the CCB?', a: `Yes. Adjusted family net income adds up line 23600 net income for both spouses. An RRSP deduction by either one lowers that total in the same way and raises the benefit by the same amount. The tax saving, on the other hand, depends on the marginal rate of the person deducting: for the same contribution, the higher-income spouse often saves more tax.` },
      { q: 'Does an FHSA deduction also raise the child benefit?', a: `Yes, in the same way as an RRSP deduction: it is subtracted from income and lowers adjusted family net income. A TFSA contribution is not deductible and does nothing for the benefit. TFSA withdrawals do not reduce it either, whereas a taxable RRSP withdrawal raises family income and can lower the next year's benefit.` },
    ],
    body: (h) => `
<h2>The income that sets the benefit</h2>
<p>The Canada child benefit is not taxable, but it shrinks as family income rises. Under the ${h.src('cra_ccb', 'Canada Revenue Agency calculation')}, the figure that counts is adjusted family net income: the net income on line 23600 of your return, plus your spouse's or common-law partner's, with a few uncommon adjustments. An RRSP or FHSA deduction lowers that net income. It therefore lowers the benefit reduction, just as a drop in pay would, without you earning any less.</p>
<p>For ${C.period.en}, based on ${C.incomeYear} income, the maximum is ${h.m(C.maxUnder6)} per child under 6 and ${h.m(C.max6to17)} per child aged 6 to 17. It is not reduced below ${h.m(s1)} of adjusted family net income. Between ${h.m(s1)} and ${h.m(s2)}, it drops by a first percentage of the excess; above ${h.m(s2)}, by a fixed amount plus a second, smaller percentage.</p>
<h2>Reduction rates by number of children</h2>
${h.table(['Children', `Rate from ${h.m(s1)} to ${h.m(s2)}`, `Rate above ${h.m(s2)}`, `Gain for ${h.m(6000)} deducted at ${h.m(70000)}`, `Gain at ${h.m(110000)}`], rateRows('en'), `Extra benefit over one year, adjusted family net income before the deduction; thresholds and rates for ${C.period.en}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The reduction rate works like an extra tax on family income. A family with four children at ${h.m(70000)} loses ${h.p(R['4'][0], 0)} of benefit on each extra dollar of income, on top of tax. Each dollar deducted gives the same amount back. Above ${h.m(s2)} the rate falls, and so does the gain.</p>
<h2>A full example</h2>
<p>An Ontario family has two children and ${h.m(AF)} of adjusted family net income. The parent earning ${h.m(OWN)} puts ${h.m(DED)} into an RRSP and deducts it on the ${Y} return. Their tax drops by ${h.m(t)}, worked out with the ${h.src('cra_rates_2026', Y + ' brackets')}. Family income falls to ${h.m(AF - DED)}, and the benefit paid from July ${Y + 1} to June ${Y + 2} rises by about ${h.m(g)}. In all, the contribution brings in ${h.m(g + t)}, or ${h.p((g + t) / DED)} of its amount, well above the parent's marginal rate alone.</p>
<p>A family straddling the second threshold gains less: at ${h.m(85000)} of family income, with one parent at ${h.m(55000)}, the same deduction brings ${h.m(t85)} in tax and ${h.m(g85)} in benefit, because only part of the dollars deducted fall back below ${h.m(s2)}. The calculator does the split for your income.</p>
${h.mini('remboursement', { t: 'The tax saving alone, without the benefit', p: ['pr', 'rv', 'mt'], d: { pr: 'ON', rv: OWN, mt: DED }, c: 'See the federal and provincial detail' })}
<h2>What to know before counting on it</h2>
<p>The gain comes a year late. The benefit is recalculated every July using the previous year's income, so a ${Y} deduction changes nothing in current payments. Next period's thresholds will be indexed, so the exact figure will differ slightly. With shared custody, each parent gets half of what they would receive with full custody, based on their own adjusted family net income, so the gain from a deduction is roughly halved.</p>
<p>The effect also runs the other way. A taxable RRSP withdrawal raises family income and lowers the next period's benefit, whereas a ${h.a('retrait-celi', 'TFSA withdrawal')} has no effect. It is one of the points to weigh in the ${h.a('reer-ou-celi', 'RRSP vs TFSA')} choice for parents. An ${h.a('celiapp', 'FHSA')} deduction has the same effect as an RRSP deduction.</p>
<h2>Quebec and the provinces</h2>
<p>The CRA also administers child and family benefits for some provinces and territories, sometimes combined with the federal benefit in a single monthly payment, sometimes paid separately. In Quebec, the Family Allowance comes on top of the federal benefit, with its own calculation. The calculator counts none of these: it only works out the federal benefit and tax, so the real gain from a deduction may differ from the one shown.</p>
`,
  },
});
