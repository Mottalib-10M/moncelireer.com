import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const N = K.jur('NS');
const top = N.rates[N.rates.length - 1];
const steps = K.steps('NS', 280000).filter((s) => s.from > 0);
const incomes = [40000, 60000, 80000, 100000, 130000, 170000];
type Fm = { m: (x: number) => string; p: (x: number, d?: number) => string };
const irows = (h: Fm) => incomes.map((i) => [h.m(i), h.p(K.marginal(i, 'NS')), h.m(K.saving(i, 5000, 'NS')), h.p(K.marginal(i, 'NB'))]);
// Une déduction de 20 000 $ sur 120 000 $ de revenu, découpée selon les seuils franchis.
const I0 = 120000, D0 = 20000;
const cuts = [I0 - D0, ...steps.map((s) => s.from).filter((x) => x > I0 - D0 && x < I0), I0].sort((a, b) => a - b);
const chunks = cuts.slice(0, -1).map((lo, k) => ({ lo, hi: cuts[k + 1], rate: K.marginal(lo + 50, 'NS'), save: K.tax(cuts[k + 1], 'NS') - K.tax(lo, 'NS') })).reverse();
const crows = (h: Fm, to: string) => chunks.map((c) => [`${h.m(c.lo)} ${to} ${h.m(c.hi)}`, h.m(c.hi - c.lo), h.p(c.rate), h.m(c.save)]);
const total = K.saving(I0, D0, 'NS');
const gaps = incomes.map((i) => K.marginal(i, 'NS') - K.marginal(i, 'NB'));
const gmin = Math.min(...gaps), gmax = Math.max(...gaps);
const c = K.compare({ prov: 'NS', income: 100000, save: 6000, years: 25, growth: 0.03, retireIncome: 45000, spread: 20 });

export default defineGuide({
  id: 'prov-ns', group: 'prov', order: 46, tool: 'reerCeli',
  toolArg: { pr: 'NS', rv: 100000, rr: 45000 },
  related: ['reer-ou-celi', 'taux-marginal', 'plafond-reer', 'prov-nb', 'prov-pe'],
  sources: ['cra_rates_2026', 't4127_jan', 't4127_jul'],
  fr: {
    slug: 'reer-ou-celi-nouvelle-ecosse',
    nav: 'REER ou CELI en Nouvelle-Écosse', card: `Cinq tranches, un taux de ${F.r(top)} au sommet et un montant de base de ${F.m(N.bpa ?? 0)} : le REER en Nouvelle-Écosse en ${Y}.`,
    title: `REER ou CELI en Nouvelle-Écosse ${Y} : taux et seuils`,
    description: `REER ou CELI en Nouvelle-Écosse ${Y} : cinq taux de 8,79 % à 21 %, montant de base de 11 932 $ pour tous, et ce que rapporte une cotisation selon le revenu.`,
    h1: `REER ou CELI en Nouvelle-Écosse en ${Y} : cinq tranches à franchir`,
    intro: 'La Nouvelle-Écosse a cinq taux et l’un des taux provinciaux les plus hauts au sommet. La valeur d’une cotisation REER y dépend beaucoup des seuils que la déduction vous fait redescendre.',
    resume: `La Nouvelle-Écosse impose le revenu à cinq taux en ${Y} : ${F.r(N.rates[0])} jusqu'à ${F.m(N.brackets[0])}, puis ${F.r(N.rates[1])}, ${F.r(N.rates[2])} et ${F.r(N.rates[3])}, et ${F.r(top)} au-delà de ${F.m(N.brackets[3])}. Son montant personnel de base est de ${F.m(N.bpa ?? 0)} et ne dépend plus du revenu. Avec le fédéral, le taux marginal combiné passe de ${F.p(K.marginal(40000, 'NS'))} à ${F.m(40000)} à ${F.p(K.marginal(100000, 'NS'))} à ${F.m(100000)}, puis ${F.p(K.marginal(170000, 'NS'))} à ${F.m(170000)}. Une cotisation REER de ${F.m(5000)} rapporte donc ${F.m(K.saving(40000, 5000, 'NS'))} au premier revenu et ${F.m(K.saving(170000, 5000, 'NS'))} au dernier. Pour une grosse déduction, comptez tranche par tranche : chaque dollar ne vaut que le taux de la tranche qu'il fait quitter. Le simulateur applique ce calcul exact et le compare au CELI selon votre revenu de retraite.`,
    faqs: [
      { q: 'Quel est le taux d’impôt le plus élevé en Nouvelle-Écosse en 2026 ?', a: `Le taux provincial maximal est de ${F.r(top)}, au-delà de ${F.m(N.brackets[3])} de revenu imposable. Ajouté au taux fédéral, il donne ${F.p(K.marginal(170000, 'NS'))} à ${F.m(170000)} et ${F.p(K.marginal(270000, 'NS'))} au-delà de ${F.m(K.P.federal.brackets[3])}. Chaque dollar déduit à ce niveau réduit l'impôt d'autant.` },
      { q: 'Le montant personnel de base de la Nouvelle-Écosse dépend-il encore du revenu ?', a: `Non. Le guide T4127 indique que la province a fixé le montant au maximum, quel que soit le revenu imposable. En ${Y}, il vaut ${F.m(N.bpa ?? 0)} pour tous. Une déduction REER ne change donc plus ce crédit, elle réduit seulement l'impôt au taux de vos tranches.` },
      { q: 'Combien rapporte une cotisation REER de 20 000 $ à 120 000 $ de revenu en Nouvelle-Écosse ?', a: `Environ ${F.m(total)} d'impôt en moins en ${Y}. La déduction fait redescendre le revenu sous le seuil fédéral de ${F.m(K.P.federal.brackets[1])}, si bien qu'une partie est économisée à ${F.p(chunks[0].rate)} et le reste à ${F.p(chunks[chunks.length - 1].rate)}. Le tableau de la page détaille chaque morceau.` },
    ],
    body: (h) => `
<h2>Cinq taux provinciaux</h2>
<p>Selon la ${h.src('cra_rates_2026', 'page des taux 2026 de canada.ca')}, la Nouvelle-Écosse applique ${h.r(N.rates[0])} jusqu'à ${h.m(N.brackets[0])}, ${h.r(N.rates[1])} jusqu'à ${h.m(N.brackets[1])}, ${h.r(N.rates[2])} jusqu'à ${h.m(N.brackets[2])}, ${h.r(N.rates[3])} jusqu'à ${h.m(N.brackets[3])}, puis ${h.r(top)}. Les tranches provinciales et fédérales tombent à des endroits différents, ce qui multiplie les marches du taux combiné :</p>
${h.table(['Revenu imposable à partir de', 'Taux marginal combiné'], steps.map((s) => [h.m(s.from), h.p(s.rate)]), `Taux combinés fédéral et Nouvelle-Écosse, ${Y}.`, ['l', 'r'])}
<p>Entre ${h.m(K.P.federal.brackets[0])} et ${h.m(N.brackets[2])}, le taux change trois fois en moins de ${h.m(40000)} de revenu. Pour votre cotisation REER, cela veut dire qu'une même somme ne rapporte pas la même chose selon l'endroit où se trouve votre revenu dans cet escalier.</p>
<h2>Ce que rapporte 5 000 $ au REER</h2>
<p>Le tableau suivant calcule l'impôt évité par une cotisation de ${h.m(5000)} pour six revenus. La dernière colonne donne, pour comparer, le taux marginal au même revenu au Nouveau-Brunswick voisin.</p>
${h.table(['Revenu imposable', 'Taux marginal', 'Impôt évité sur 5 000 $', 'Taux au Nouveau-Brunswick'], irows(h), `Nouvelle-Écosse, ${Y}, impôts fédéral et provincial.`, ['l', 'r', 'r', 'r'])}
<p>Selon le revenu, l'écart avec le Nouveau-Brunswick va de ${h.p(gmin)} à ${h.p(gmax)} au détriment de la Nouvelle-Écosse, car les deux barèmes n'ont pas leurs seuils aux mêmes endroits. Une même cotisation vaut donc un peu plus en Nouvelle-Écosse, ce qui joue en faveur du REER tant que les retraits se feront à un taux plus bas.</p>
<h2>Une grosse déduction, tranche par tranche</h2>
<p>Une déduction ne vaut pas le taux marginal multiplié par son montant : elle descend l'escalier. Prenez ${h.m(I0)} de revenu et une cotisation de ${h.m(D0)}. Le revenu imposable tombe à ${h.m(I0 - D0)}, et chaque morceau franchi est économisé au taux de sa propre tranche :</p>
${h.table(['Morceau du revenu', 'Montant', 'Taux', 'Impôt évité'], crows(h, 'à'), `Déduction REER de ${h.m(D0)} sur ${h.m(I0)}, Nouvelle-Écosse, ${Y}.`, ['l', 'r', 'r', 'r'])}
<p>Au total, l'impôt baisse d'environ ${h.m(total)}, soit ${h.p(total / D0)} de la cotisation, moins que le taux marginal de départ de ${h.p(K.marginal(I0, 'NS'))}. Si vous avez plus de droits que d'épargne, vous pouvez aussi cotiser maintenant et ne déduire qu'une partie, en gardant le reste pour une année où votre revenu sera plus haut.</p>
${h.mini('reerCeli', { t: 'Testez votre revenu de retraite', p: ['rr', 'ep'], d: { pr: 'NS', rv: 100000, rr: 45000 } })}
<h2>Le montant de base, désormais le même pour tous</h2>
<p>Avant 2025, le montant personnel de base néo-écossais variait selon le revenu imposable. Le ${h.src('t4127_jan', 'guide T4127 de janvier')} indique que la province l'a fixé au maximum, quel que soit le revenu, et que la formule de retenue qui le calculait disparaît en ${Y}. Le ${h.src('t4127_jul', 'guide T4127 de juillet')} donne ${h.m(N.bpa ?? 0)}. Pour votre épargne, la conséquence est simple : une déduction REER ne modifie plus le crédit de base, et le simulateur n'a qu'à suivre les tranches.</p>
<h2>Au moment du retrait</h2>
<p>Avec ${h.m(100000)} de revenu aujourd'hui, ${h.m(6000)} d'épargne par an pendant 25 ans et ${h.m(45000)} de revenu à la retraite, le REER laisse environ ${h.m(c.rrspNet)} après impôt, contre ${h.m(c.tfsaValue)} pour le CELI. Le retrait est imposé à environ ${h.p(c.rateLater)}, au lieu des ${h.p(c.rateNow)} économisés à la cotisation. Plus votre revenu de retraite se rapproche de votre salaire, plus cet avantage se réduit ; le simulateur vous laisse tester le vôtre.</p>
<p>Le CELI reprend l'avantage dans deux cas. D'abord, quand le revenu de retraite attendu vous placera dans une tranche aussi haute qu'aujourd'hui, par exemple avec une rente d'employeur généreuse. Ensuite, quand votre revenu actuel est sous le premier seuil fédéral de ${h.m(K.P.federal.brackets[0])} : l'impôt évité est alors faible, et l'argent du CELI reste disponible sans impôt pour un projet avant la retraite.</p>
`,
  },
  en: {
    slug: 'rrsp-vs-tfsa-nova-scotia',
    nav: 'RRSP or TFSA in Nova Scotia', card: `Five brackets, a ${E.r(top)} top rate and an ${E.m(N.bpa ?? 0)} basic amount: the RRSP in Nova Scotia for ${Y}.`,
    title: `RRSP vs TFSA in Nova Scotia ${Y}: rates and thresholds`,
    description: `RRSP or TFSA in Nova Scotia ${Y}: five rates from 8.79% to 21%, an $11,932 basic amount for everyone, and what a contribution saves at each income level.`,
    h1: `RRSP or TFSA in Nova Scotia in ${Y}: five brackets to cross`,
    intro: 'Nova Scotia has five rates and one of the highest provincial top rates. What an RRSP contribution is worth there depends a lot on the thresholds the deduction brings you back under.',
    resume: `Nova Scotia taxes income at five rates in ${Y}: ${E.r(N.rates[0])} up to ${E.m(N.brackets[0])}, then ${E.r(N.rates[1])}, ${E.r(N.rates[2])} and ${E.r(N.rates[3])}, and ${E.r(top)} above ${E.m(N.brackets[3])}. Its basic personal amount is ${E.m(N.bpa ?? 0)} and no longer depends on income. With the federal tax, the combined marginal rate goes from ${E.p(K.marginal(40000, 'NS'))} at ${E.m(40000)} to ${E.p(K.marginal(100000, 'NS'))} at ${E.m(100000)}, then ${E.p(K.marginal(170000, 'NS'))} at ${E.m(170000)}. A ${E.m(5000)} RRSP contribution therefore saves ${E.m(K.saving(40000, 5000, 'NS'))} at the first income and ${E.m(K.saving(170000, 5000, 'NS'))} at the last. For a large deduction, count bracket by bracket: each dollar is only worth the rate of the bracket it takes you out of. The calculator does this exact sum for you, slice by slice, and compares the result with the TFSA for the retirement income you expect to live on.`,
    faqs: [
      { q: 'What is the highest tax rate in Nova Scotia for 2026?', a: `The top provincial rate is ${E.r(top)}, above ${E.m(N.brackets[3])} of taxable income. Added to the federal rate, it gives ${E.p(K.marginal(170000, 'NS'))} at ${E.m(170000)} and ${E.p(K.marginal(270000, 'NS'))} above ${E.m(K.P.federal.brackets[3])}. Each dollar deducted at that level cuts your tax by the same share, as long as the deduction keeps you above the threshold.` },
      { q: 'Does the Nova Scotia basic personal amount still depend on income?', a: `No. The T4127 guide says the province set the amount at the maximum, whatever your taxable income. In ${Y} it is ${E.m(N.bpa ?? 0)} for everyone. An RRSP deduction therefore no longer changes this credit; it only cuts tax at the rate of your brackets.` },
      { q: 'How much does a $20,000 RRSP contribution save on $120,000 in Nova Scotia?', a: `About ${E.m(total)} less tax in ${Y}. The deduction brings income back under the ${E.m(K.P.federal.brackets[1])} federal threshold, so part of it is saved at ${E.p(chunks[0].rate)} and the rest at ${E.p(chunks[chunks.length - 1].rate)}. The table on this page breaks down each piece of the deduction.` },
    ],
    body: (h) => `
<h2>Five provincial rates</h2>
<p>According to the ${h.src('cra_rates_2026', '2026 rates page on canada.ca')}, Nova Scotia applies ${h.r(N.rates[0])} up to ${h.m(N.brackets[0])}, ${h.r(N.rates[1])} up to ${h.m(N.brackets[1])}, ${h.r(N.rates[2])} up to ${h.m(N.brackets[2])}, ${h.r(N.rates[3])} up to ${h.m(N.brackets[3])}, then ${h.r(top)}. The provincial and federal brackets fall in different places, which multiplies the steps of the combined rate:</p>
${h.table(['Taxable income from', 'Combined marginal rate'], steps.map((s) => [h.m(s.from), h.p(s.rate)]), `Combined federal and Nova Scotia rates, ${Y}.`, ['l', 'r'])}
<p>Between ${h.m(K.P.federal.brackets[0])} and ${h.m(N.brackets[2])}, the rate changes three times in less than ${h.m(40000)} of income. For your RRSP contribution, this means the same amount does not save the same tax depending on where your income sits on this staircase.</p>
<h2>What $5,000 in an RRSP saves</h2>
<p>The table below works out the tax avoided by a ${h.m(5000)} contribution at six incomes. The last column gives, for comparison, the marginal rate at the same income in neighbouring New Brunswick.</p>
${h.table(['Taxable income', 'Marginal rate', 'Tax avoided on $5,000', 'New Brunswick rate'], irows(h), `Nova Scotia, ${Y}, federal and provincial tax.`, ['l', 'r', 'r', 'r'])}
<p>Depending on income, the gap with New Brunswick ranges from ${h.p(gmin)} to ${h.p(gmax)}, always higher in Nova Scotia, because the two tables do not put their thresholds in the same places. The same contribution is therefore worth a little more in Nova Scotia, which favours the RRSP as long as withdrawals will be taxed at a lower rate.</p>
<h2>A large deduction, bracket by bracket</h2>
<p>A deduction is not worth the marginal rate times its amount: it walks down the staircase. Take ${h.m(I0)} of income and a ${h.m(D0)} contribution. Taxable income falls to ${h.m(I0 - D0)}, and each piece crossed is saved at the rate of its own bracket:</p>
${h.table(['Slice of income', 'Amount', 'Rate', 'Tax avoided'], crows(h, 'to'), `RRSP deduction of ${h.m(D0)} on ${h.m(I0)}, Nova Scotia, ${Y}.`, ['l', 'r', 'r', 'r'])}
<p>In total, tax drops by about ${h.m(total)}, or ${h.p(total / D0)} of the contribution, less than the starting marginal rate of ${h.p(K.marginal(I0, 'NS'))}. If you have more room than savings to deduct, you can also contribute now and deduct only part, keeping the rest for a year when your income is higher.</p>
${h.mini('reerCeli', { t: 'Test your retirement income', p: ['rr', 'ep'], d: { pr: 'NS', rv: 100000, rr: 45000 } })}
<h2>The basic amount, now the same for everyone</h2>
<p>Before 2025, the Nova Scotia basic personal amount varied with taxable income. The ${h.src('t4127_jan', 'January T4127 guide')} says the province set it at the maximum whatever the income, and that the payroll formula that worked it out is removed for ${Y}. The ${h.src('t4127_jul', 'July T4127 guide')} gives ${h.m(N.bpa ?? 0)}. For your savings, the result is simple: an RRSP deduction no longer changes the basic credit, and the calculator only has to follow the brackets.</p>
<h2>When you withdraw</h2>
<p>With ${h.m(100000)} of income today, ${h.m(6000)} saved a year for 25 years and ${h.m(45000)} of retirement income, the RRSP leaves about ${h.m(c.rrspNet)} after tax, against ${h.m(c.tfsaValue)} for the TFSA. The withdrawal is taxed at about ${h.p(c.rateLater)}, instead of the ${h.p(c.rateNow)} saved on the contribution. The closer your retirement income gets to your salary, the smaller this edge; the calculator lets you test your own.</p>
<p>The TFSA takes the lead back in two cases. First, when your expected retirement income will put you in a bracket as high as today, for example with a generous workplace pension. Second, when your current income is below the first federal threshold of ${h.m(K.P.federal.brackets[0])}: the tax avoided is then small, and TFSA money stays available tax-free for a project before retirement. Withdrawals from a TFSA are also left out of the income used for Old Age Security and the Guaranteed Income Supplement, which RRSP withdrawals are not. For a retiree whose income sits near those benefit thresholds, that difference can matter more than the rate itself.</p>
`,
  },
});
