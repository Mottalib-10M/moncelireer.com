import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Prov } from '../../lib/engine/tax';

const F = K.fr, E = K.en, Y = K.YEAR;
const FED = K.P.federal;
const abat = FED.qcAbatement;
const INC = [50000, 75000, 100000, 150000];
const rowsFor = (l: 'fr' | 'en') => K.PROVS.map((p) => [K.prov(p, l), ...INC.map((i) => K[l].p(K.marginal(i, p)))]);
// Exemple principal : Ontario, 75 000 $.
const m75 = K.marginal(75000, 'ON'), a75 = K.tax(75000, 'ON') / 75000, t75 = K.tax(75000, 'ON');
// Plus bas et plus haut taux combiné à 100 000 $.
const at100 = [...K.PROVS].sort((a, b) => K.marginal(100000, a) - K.marginal(100000, b));
const lo = at100[0] as Prov, hi = at100[at100.length - 1] as Prov;
// Québec : part fédérale après abattement, à 100 000 $.
const q100 = K.split(100000, 'QC');
// Ontario : la surtaxe relève le taux entre 75 000 $ et 100 000 $ sans changement de tranche.
const on100 = K.split(100000, 'ON');
const onBase2 = K.jur('ON').rates[1];
const [[, sur1], [, sur2]] = K.jur('ON').surtax as number[][];
// Déduction REER de 5 000 $ à 50 000 $ et à 100 000 $ en Ontario.
const s50 = K.saving(50000, 5000, 'ON'), s100 = K.saving(100000, 5000, 'ON');
// Réduction du montant personnel de base fédéral : taux plus élevé entre les deux dernières tranches.
const bpaZone = K.marginal(200000, 'AB');

export default defineGuide({
  id: 'taux-marginal', group: 'impot', order: 30, tool: 'taux',
  toolArg: { pr: 'ON', rv: 75000 },
  related: ['remboursement-reer', 'reer-ou-celi', 'retrait-reer', 'prov-qc', 'prov-on', 'reer-allocation-enfants'],
  sources: ['cra_rates_2026', 't4127_jul', 'rq_rates'],
  fr: {
    slug: 'taux-marginal-impot',
    nav: 'Taux marginal d’imposition', card: `Le taux combiné fédéral et provincial sur votre prochain dollar, dans les 13 provinces et territoires, comparé au taux moyen.`,
    title: `Taux marginal d'imposition ${Y} : fédéral et provincial`,
    description: `Taux marginal d'imposition ${Y} : le taux combiné sur votre prochain dollar, de ${F.p(K.marginal(50000, 'NU'))} à ${F.p(K.marginal(150000, 'QC'))} selon la province et le revenu. Tableau des 13 juridictions.`,
    h1: `Taux marginal d'imposition ${Y} : combien sur votre prochain dollar ?`,
    intro: 'Entrez votre province et votre revenu imposable : le simulateur donne le taux combiné qui s’applique au dollar suivant, sa part fédérale et provinciale, et les seuils où il change.',
    resume: `Votre taux marginal d'imposition est l'impôt, fédéral et provincial réunis, que vous payez sur le prochain dollar de revenu. Ce n'est pas le taux de tout votre revenu : celui-là s'appelle le taux moyen, et il est toujours plus bas. En Ontario, à ${F.m(75000)} de revenu imposable, le taux marginal est de ${F.p(m75)} en ${Y}, alors que l'impôt total de ${F.m(t75)} ne représente que ${F.p(a75)} du revenu. Le taux marginal combiné varie beaucoup d'une province à l'autre : à ${F.m(100000)}, il va de ${F.p(K.marginal(100000, lo))} ${K.provIn(lo)} à ${F.p(K.marginal(100000, hi))} ${K.provIn(hi)}. C'est lui qui fixe la valeur d'une déduction REER ou CELIAPP et le coût d'un retrait REER : chaque dollar déduit vous fait économiser ce taux, tant que la déduction ne vous fait pas descendre d'une tranche. Le tableau ci-dessous donne les taux des 13 provinces et territoires à quatre niveaux de revenu.`,
    faqs: [
      { q: 'Quelle est la différence entre taux marginal et taux moyen d’imposition ?', a: `Le taux marginal s'applique au dernier dollar gagné ; le taux moyen est l'impôt total divisé par le revenu. En Ontario, à ${F.m(75000)}, le premier est de ${F.p(m75)} et le second de ${F.p(a75)}. Le taux moyen sert à savoir quelle part de votre revenu part en impôt. Le taux marginal sert à décider : une heure supplémentaire, une prime, une cotisation REER ou un retrait.` },
      { q: 'Passer à une tranche d’imposition supérieure fait-il baisser mon revenu net ?', a: `Non. Le taux plus élevé ne s'applique qu'aux dollars situés au-dessus du seuil, jamais à l'ensemble du revenu. Si une augmentation vous fait franchir le seuil de ${F.m(FED.brackets[0])} au fédéral, seuls les dollars au-delà sont imposés à ${F.p(FED.rates[1])} au lieu de ${F.p(FED.rates[0], 0)}. Votre revenu après impôt augmente toujours, même si chaque dollar supplémentaire en rapporte un peu moins.` },
      { q: 'Quelle province a le taux marginal le plus bas à 100 000 $ ?', a: `Avec le barème ${Y} appliqué par le simulateur, c'est ${K.prov(lo, 'fr')}, à ${F.p(K.marginal(100000, lo))}, et le plus élevé est ${K.prov(hi, 'fr')}, à ${F.p(K.marginal(100000, hi))}. L'écart vient des taux provinciaux et des seuils de tranche, très différents d'une juridiction à l'autre. Le classement change selon le revenu : refaites le calcul à votre niveau avec le simulateur.` },
      { q: 'Le taux marginal s’applique-t-il aux dividendes et aux gains en capital ?', a: `Pas tel quel. Le taux affiché vaut pour le revenu ordinaire : salaire, intérêts, rentes et retraits REER ou FERR. Les dividendes de sociétés canadiennes et les gains en capital suivent leurs propres règles de calcul, et leur taux marginal effectif est différent. Le simulateur ne le calcule pas : il vise les décisions liées au REER, au CELI et au CELIAPP, où tout se joue en revenu ordinaire.` },
    ],
    body: (h) => `
<h2>Marginal et moyen, deux taux pour deux questions</h2>
<p>L'impôt canadien est progressif : le revenu est découpé en tranches, et chaque tranche a son taux. Le taux marginal est celui de la tranche où tombe votre prochain dollar, fédéral et provincial additionnés. Le taux moyen est l'impôt total divisé par le revenu. En Ontario, à ${h.m(75000)} de revenu imposable, l'impôt de ${Y} est de ${h.m(t75)} : un taux moyen de ${h.p(a75)}. Mais un dollar de plus est imposé à ${h.p(m75)}. Le simulateur mesure ce taux sur les ${h.m(100)} suivants, avec les ${h.src('cra_rates_2026', 'tranches publiées par l’Agence du revenu du Canada')}.</p>
<p>Au fédéral, les taux de ${Y} vont de ${h.p(FED.rates[0], 0)} jusqu'à ${h.m(FED.brackets[0])} à ${h.p(FED.rates[4], 0)} au-delà de ${h.m(FED.brackets[3])}. Chaque province et territoire ajoute son propre barème, avec ses seuils à lui : c'est pourquoi le taux combiné change souvent à des revenus qui ne correspondent à aucune tranche fédérale.</p>
<h2>Les taux combinés de ${Y} dans les 13 juridictions</h2>
${h.table(['Province ou territoire', h.m(50000), h.m(75000), h.m(100000), h.m(150000)], rowsFor('fr'), `Taux marginal combiné ${Y} sur les ${h.m(100)} suivants, revenu ordinaire. À ${h.m(150000)}, certains taux sont ceux de la tranche qui commence à ce montant.`, ['l', 'r', 'r', 'r', 'r'])}
<p>À ${h.m(100000)}, l'écart entre ${K.prov(lo, 'fr')} et ${K.prov(hi, 'fr')} dépasse ${h.n(Math.floor((K.marginal(100000, hi) - K.marginal(100000, lo)) * 100))} points. Les seuils du Québec viennent de ${h.src('rq_rates', 'Revenu Québec')} ; ceux des autres provinces, du ${h.src('t4127_jul', 'guide T4127')} et de la page des taux de l'Agence.</p>
${h.mini('remboursement', { t: 'Ce que votre taux marginal vaut sur une cotisation', p: ['pr', 'rv', 'mt'], d: { pr: 'ON', rv: 75000, mt: 5000 }, c: 'Comparer les 13 provinces' })}
<h2>Deux particularités : l'abattement du Québec et la surtaxe de l'Ontario</h2>
<p>Les résidents du Québec reçoivent un abattement de ${h.r(abat)} de leur impôt fédéral de base. Leur taux fédéral est donc réduit d'autant : à ${h.m(100000)}, la part fédérale du taux marginal est de ${h.p(q100.federal)} au lieu de ${h.p(FED.rates[1])}, et la part du Québec de ${h.p(q100.provincial)}. Le taux combiné reste parmi les plus élevés parce que les taux du Québec sont plus hauts que ceux des autres provinces.</p>
<p>En Ontario, une surtaxe s'ajoute quand l'impôt de base de l'Ontario dépasse deux seuils : ${h.p(sur1, 0)} de l'impôt au-delà du premier et ${h.p(sur2, 0)} au-delà du second. Elle se déclenche selon l'impôt, pas selon le revenu, si bien que le taux marginal monte sans changement de tranche. À ${h.m(100000)}, la tranche de l'Ontario est toujours à ${h.r(onBase2)}, mais la part provinciale du taux marginal atteint ${h.p(on100.provincial)}, surtaxe comprise.</p>
<h2>Pourquoi le taux marginal décide du gain d'une cotisation REER</h2>
<p>Une déduction REER retire des dollars du haut de votre revenu, là où s'applique le taux marginal. En Ontario, ${h.m(5000)} déduits font économiser ${h.m(s50)} à ${h.m(50000)} de revenu, et ${h.m(s100)} à ${h.m(100000)}. Le même raisonnement joue à l'envers pour un retrait : il est imposé au taux marginal de l'année où il est fait. Le gain réel d'un REER dépend donc de l'écart entre le taux au moment de la cotisation et le taux au moment du retrait ; la page ${h.a('reer-ou-celi', 'REER ou CELI')} fait ce calcul, et la page ${h.a('remboursement-reer', 'remboursement REER')} détaille l'économie de l'année.</p>
<p>Une grosse déduction peut traverser un seuil : la partie située sous le seuil n'est alors récupérée qu'au taux inférieur. Le montant personnel de base joue aussi : au fédéral, il diminue entre ${h.m(FED.brackets[2])} et ${h.m(FED.brackets[3])}, ce qui relève le taux marginal dans cette zone ; en Alberta, à ${h.m(200000)}, le taux combiné est de ${h.p(bpaZone)}. Au Manitoba, le montant de base de la province s'efface aussi à haut revenu.</p>
<h2>Ce que le calcul ne compte pas</h2>
<p>Le simulateur applique les tranches, les montants personnels de base, l'abattement du Québec et la surtaxe de l'Ontario. Il laisse de côté les crédits pour cotisations au RPC ou au RRQ et à l'assurance-emploi, le montant canadien pour emploi, les montants pour âge et pour revenu de pension, les réductions d'impôt des bas revenus de l'Ontario et de la Colombie-Britannique, la contribution santé de l'Ontario et l'impôt minimum de remplacement. Ces éléments pèsent surtout sous ${h.m(30000)} de revenu. Il ne compte pas non plus la baisse de prestations liées au revenu, qui agit comme un impôt de plus : voir ${h.a('reer-allocation-enfants', 'REER et allocation pour enfants')}.</p>
`,
  },
  en: {
    slug: 'marginal-tax-rate',
    nav: 'Marginal tax rate', card: `The combined federal and provincial rate on your next dollar, in all 13 provinces and territories, compared with your average rate.`,
    title: `Marginal tax rate ${Y}: federal plus provincial, by province`,
    description: `Marginal tax rate ${Y}: the combined rate on your next dollar, from ${E.p(K.marginal(50000, 'NU'))} to ${E.p(K.marginal(150000, 'QC'))} by province and income. Table for all 13 provinces and territories.`,
    h1: `Marginal tax rate ${Y}: how much tax on your next dollar?`,
    intro: 'Enter your province and taxable income: the calculator shows the combined rate on the next dollar, its federal and provincial parts, and the income levels where it changes.',
    resume: `Your marginal tax rate is the tax, federal and provincial combined, that you pay on your next dollar of income. It is not the rate on all your income: that one is the average rate, and it is always lower. In Ontario, at ${E.m(75000)} of taxable income, the marginal rate is ${E.p(m75)} in ${Y}, while total tax of ${E.m(t75)} is only ${E.p(a75)} of income. The combined marginal rate varies a lot between provinces: at ${E.m(100000)} it runs from ${E.p(K.marginal(100000, lo))} in ${K.prov(lo, 'en')} to ${E.p(K.marginal(100000, hi))} in ${K.prov(hi, 'en')}. It is the rate that sets the value of an RRSP or FHSA deduction and the cost of an RRSP withdrawal: each dollar deducted saves you that rate, as long as the deduction does not drop you into a lower bracket. The table below gives the rates for all 13 provinces and territories at four income levels.`,
    faqs: [
      { q: 'What is the difference between marginal and average tax rate?', a: `The marginal rate applies to the last dollar you earn; the average rate is total tax divided by income. In Ontario at ${E.m(75000)}, the first is ${E.p(m75)} and the second ${E.p(a75)}. The average rate tells you what share of your income goes to tax. The marginal rate is the one for decisions: an extra shift, a bonus, an RRSP contribution or a withdrawal.` },
      { q: 'Will moving into a higher tax bracket lower my take-home pay?', a: `No. The higher rate only applies to the dollars above the threshold, never to your whole income. If a raise takes you past the federal threshold of ${E.m(FED.brackets[0])}, only the dollars above it are taxed at ${E.p(FED.rates[1])} instead of ${E.p(FED.rates[0], 0)}. Your after-tax income always goes up, even if each extra dollar leaves you a little less.` },
      { q: 'Which province has the lowest marginal tax rate at $100,000?', a: `With the ${Y} tax tables used by the calculator, it is ${K.prov(lo, 'en')}, at ${E.p(K.marginal(100000, lo))}, and the highest is ${K.prov(hi, 'en')}, at ${E.p(K.marginal(100000, hi))}. The gap comes from provincial rates and bracket thresholds, which differ widely between jurisdictions. The ranking changes with income, so rerun the numbers at your own level with the calculator.` },
      { q: 'Does the marginal rate apply to dividends and capital gains?', a: `Not as shown. The rate displayed is for ordinary income: wages, interest, pensions and RRSP or RRIF withdrawals. Dividends from Canadian corporations and capital gains follow their own calculation rules, and their effective marginal rate is different. The calculator does not work it out: it is built for RRSP, TFSA and FHSA decisions, which all turn on ordinary income.` },
    ],
    body: (h) => `
<h2>Marginal and average: two rates for two questions</h2>
<p>Canadian income tax is progressive: income is cut into brackets, each with its own rate. Your marginal rate is the rate of the bracket your next dollar falls into, federal and provincial added together. Your average rate is total tax divided by income. In Ontario, at ${h.m(75000)} of taxable income, ${Y} tax comes to ${h.m(t75)}, an average rate of ${h.p(a75)}. But one more dollar is taxed at ${h.p(m75)}. The calculator measures that rate on the next ${h.m(100)}, using the ${h.src('cra_rates_2026', 'brackets published by the Canada Revenue Agency')}.</p>
<p>Federally, ${Y} rates run from ${h.p(FED.rates[0], 0)} up to ${h.m(FED.brackets[0])} to ${h.p(FED.rates[4], 0)} above ${h.m(FED.brackets[3])}. Each province and territory adds its own schedule with its own thresholds, which is why the combined rate often changes at income levels that match no federal bracket.</p>
<h2>Combined ${Y} rates in all 13 jurisdictions</h2>
${h.table(['Province or territory', h.m(50000), h.m(75000), h.m(100000), h.m(150000)], rowsFor('en'), `${Y} combined marginal rate on the next ${h.m(100)}, ordinary income. At ${h.m(150000)}, some rates are those of the bracket that starts at that amount.`, ['l', 'r', 'r', 'r', 'r'])}
<p>At ${h.m(100000)}, the gap between ${K.prov(lo, 'en')} and ${K.prov(hi, 'en')} is more than ${h.n(Math.floor((K.marginal(100000, hi) - K.marginal(100000, lo)) * 100))} points. Quebec thresholds come from ${h.src('rq_rates', 'Revenu Québec')}; those of the other provinces from ${h.src('t4127_jul', 'guide T4127')} and the CRA rates page.</p>
${h.mini('remboursement', { t: 'What your marginal rate is worth on a contribution', p: ['pr', 'rv', 'mt'], d: { pr: 'ON', rv: 75000, mt: 5000 }, c: 'Compare all 13 provinces' })}
<h2>Two special cases: the Quebec abatement and the Ontario surtax</h2>
<p>Quebec residents get an abatement of ${h.r(abat)} of their basic federal tax. Their federal rate is reduced by that much: at ${h.m(100000)}, the federal part of the marginal rate is ${h.p(q100.federal)} instead of ${h.p(FED.rates[1])}, and the Quebec part is ${h.p(q100.provincial)}. The combined rate is still among the highest because Quebec's own rates are higher than other provinces'.</p>
<p>In Ontario, a surtax is added when basic Ontario tax goes over two thresholds: ${h.p(sur1, 0)} of the tax above the first and ${h.p(sur2, 0)} above the second. It is triggered by tax, not by income, so the marginal rate climbs without any change of bracket. At ${h.m(100000)}, the Ontario bracket rate is still ${h.r(onBase2)}, but the provincial part of the marginal rate reaches ${h.p(on100.provincial)}, surtax included.</p>
<h2>Why the marginal rate decides what an RRSP contribution is worth</h2>
<p>An RRSP deduction takes dollars off the top of your income, where the marginal rate applies. In Ontario, ${h.m(5000)} deducted saves ${h.m(s50)} at ${h.m(50000)} of income and ${h.m(s100)} at ${h.m(100000)}. The same logic runs in reverse for a withdrawal: it is taxed at the marginal rate of the year it is made. The real gain from an RRSP therefore depends on the gap between your rate when you contribute and your rate when you withdraw; the ${h.a('reer-ou-celi', 'RRSP vs TFSA')} page runs that comparison, and the ${h.a('remboursement-reer', 'RRSP refund')} page details the saving for the year.</p>
<p>A large deduction can cross a threshold, and the part below it is only recovered at the lower rate. The basic personal amount plays a role too: federally it shrinks between ${h.m(FED.brackets[2])} and ${h.m(FED.brackets[3])}, which raises the marginal rate in that range; in Alberta at ${h.m(200000)}, the combined rate is ${h.p(bpaZone)}. In Manitoba, the provincial basic amount also phases out at high incomes.</p>
<h2>What the calculation leaves out</h2>
<p>The calculator applies brackets, basic personal amounts, the Quebec abatement and the Ontario surtax. It leaves out the credits for CPP or QPP and EI contributions, the Canada employment amount, the age and pension income amounts, the low-income tax reductions in Ontario and British Columbia, the Ontario Health Premium and the alternative minimum tax. These matter mostly below ${h.m(30000)} of income. Nor does it count the loss of income-tested benefits, which works like an extra tax; see ${h.a('reer-allocation-enfants', 'RRSP and the Canada child benefit')}.</p>
`,
  },
});
