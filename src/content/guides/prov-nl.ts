import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const L = K.jur('NL');
const PF = K.P.provinceFacts;
const bpaNow = L.bpa ?? 0, bpaOld = PF.nlBpaBefore, r0 = L.rates[0];
const fedBpa = K.P.federal.bpaMax;
type H = { m: (x: number) => string };
// Impôt provincial avant crédits, sur le barème de Terre-Neuve-et-Labrador.
const gross = (x: number) => { let t = 0, low = 0; for (let i = 0; i < L.rates.length; i++) { const high = i < L.brackets.length ? L.brackets[i] : Infinity; if (x <= low) break; t += (Math.min(x, high) - low) * L.rates[i]; low = high; } return t; };
const provWith = (x: number, bpa: number) => Math.max(0, gross(x) - r0 * bpa);
const incs = [12000, 13000, 16000, 25000, 45000, 90000];
const beforeAfter = (h: H) => incs.map((i) => { const b = provWith(i, bpaOld), a = K.taxDetail(i, 'NL').provincial; return [h.m(i), h.m(b), h.m(a), h.m(b - a)]; });
const maxGain = r0 * (bpaNow - bpaOld);
const top = L.rates[L.rates.length - 1], topFrom = L.brackets[L.brackets.length - 1];
const ex = K.compare({ prov: 'NL', income: 95000, save: 7000, years: 20, growth: 0.03, retireIncome: 45000, spread: 20 });
const zeroAll = (() => { let x = 5000; while (K.tax(x, 'NL') <= 0) x += 50; return x; })();

export default defineGuide({
  id: 'prov-nl', group: 'prov', order: 48, tool: 'remboursement',
  toolArg: { pr: 'NL', rv: 95000, mt: 7000 },
  related: ['remboursement-reer', 'reer-ou-celi', 'taux-marginal', 'plafond-reer', 'prov-pe'],
  sources: ['t4127_jul', 'cra_rates_2026'],
  fr: {
    slug: 'reer-ou-celi-terre-neuve-et-labrador',
    nav: 'REER ou CELI à Terre-Neuve-et-Labrador', card: `Montant de base relevé à ${F.m(bpaNow)}, huit taux jusqu'à ${F.r(top)} : le REER et le CELI à T.-N.-L. en ${Y}.`,
    title: `REER ou CELI à Terre-Neuve-et-Labrador ${Y} : impôt et REER`,
    description: `REER ou CELI à Terre-Neuve-et-Labrador ${Y} : montant de base relevé de ${F.m(bpaOld)} à ${F.m(bpaNow)}, huit taux de ${F.r(r0)} à ${F.r(top)}, et l'effet sur votre impôt réel.`,
    h1: `REER ou CELI à Terre-Neuve-et-Labrador en ${Y}`,
    intro: 'Le montant personnel de base de Terre-Neuve-et-Labrador a été relevé au printemps, avec effet au 1er janvier. Le simulateur applique le nouveau montant à votre cotisation REER.',
    resume: `À Terre-Neuve-et-Labrador, le montant personnel de base de ${Y} est passé de ${F.m(bpaOld)} à ${F.m(bpaNow)}, une hausse annoncée le 29 avril ${Y} et applicable dès le 1er janvier. Comme ce montant est crédité au premier taux, ${F.r(r0)}, la baisse d'impôt atteint au plus ${F.m(maxGain)} par année, pour toute personne dont le revenu imposable dépasse ${F.m(bpaNow)}. Le barème lui-même ne change pas : huit taux, de ${F.r(r0)} jusqu'à ${F.r(top)} sur la partie du revenu qui dépasse ${F.m(topFrom)}, le nombre de tranches le plus élevé du pays. Pour le choix entre REER et CELI, la hausse joue surtout au bas de l'échelle : sous ${F.m(bpaNow)} de revenu, il n'y a plus d'impôt provincial, donc rien à récupérer côté province avec une déduction REER. Dès ${F.m(50000)}, le taux marginal combiné est de ${F.p(K.marginal(50000, 'NL'))}, et il atteint ${F.p(K.marginal(100000, 'NL'))} à ${F.m(100000)} : c'est là qu'une cotisation REER commence à bien rapporter.`,
    faqs: [
      { q: 'Quel est le montant personnel de base à Terre-Neuve-et-Labrador en 2026 ?', a: `Il est de ${F.m(bpaNow)} pour l'année ${Y}, contre ${F.m(bpaOld)} appliqués par les employeurs en début d'année. Le gouvernement a annoncé la hausse le 29 avril ${Y}, avec effet au 1er janvier. Le crédit se calcule au taux de ${F.r(r0)}, si bien que la hausse réduit l'impôt provincial d'au plus ${F.m(maxGain)} sur l'année.` },
      { q: 'Pourquoi ma retenue d’impôt a-t-elle baissé en juillet à Terre-Neuve ?', a: `Les employeurs ont appliqué l'ancien montant de base pendant les six premiers mois. Pour rattraper l'écart, le guide T4127 de juillet leur fait utiliser un montant proratisé de ${F.m(15000)} à partir de la première paie de juillet. Dans la déclaration de revenus, c'est le montant annuel de ${F.m(bpaNow)} qui compte.` },
      { q: 'Combien de tranches d’impôt compte Terre-Neuve-et-Labrador ?', a: `Huit taux, séparés par sept seuils : ${L.brackets.map((b) => F.m(b)).join(', ')}. Les trois derniers taux, ${L.rates.slice(5).map((r) => F.r(r)).join(', ')}, ne touchent que les revenus au-delà de ${F.m(L.brackets[4])}. Pour la grande majorité des contribuables, seuls les trois ou quatre premiers taux comptent dans le calcul d'une cotisation REER.` },
      { q: 'Faut-il cotiser au REER avec un revenu de 20 000 $ à Terre-Neuve-et-Labrador ?', a: `La déduction rapporte peu à ce niveau. À ${F.m(20000)}, ${F.m(2000)} versés au REER ne font baisser l'impôt que de ${F.m(K.saving(20000, 2000, 'NL'))}, et sous environ ${F.m(zeroAll)} il n'y a aucun impôt à réduire. Les droits REER, eux, s'accumulent avec le revenu gagné et se reportent : on peut verser au CELI maintenant et garder ces droits pour plus tard.` },
    ],
    body: (h) => `
<h2>Ce que l'annonce du 29 avril a changé</h2>
<p>Le ${h.src('t4127_jul', 'guide T4127 du 1er juillet')} reprend la décision : le montant personnel de base de Terre-Neuve-et-Labrador passe de ${h.m(bpaOld)} à ${h.m(bpaNow)}, avec effet au 1er janvier ${Y}. Rien d'autre ne bouge dans le barème provincial. Comme l'annonce est arrivée au printemps, les employeurs ont prélevé trop d'impôt pendant le premier semestre ; le guide leur fait appliquer un montant proratisé de ${h.m(15000)} à partir de la première paie de juillet, pour que les retenues de l'année se rapprochent de l'impôt réel. Dans la déclaration de ${Y}, c'est le montant annuel de ${h.m(bpaNow)} qui s'applique.</p>
<h2>L'impôt provincial avant et après la hausse</h2>
<p>Le crédit se calcule au premier taux, ${h.r(r0)}. Le gain est donc le même, ${h.m(maxGain)}, pour tous ceux qui payaient déjà de l'impôt provincial au-delà du nouveau montant. Il est plus petit pour les revenus situés entre les deux montants, qui passent simplement à zéro.</p>
${h.table(['Revenu imposable', `Impôt provincial avec ${h.m(bpaOld)}`, `Avec ${h.m(bpaNow)}`, 'Baisse'], beforeAfter(h), `Impôt de Terre-Neuve-et-Labrador avant les autres crédits, ${Y}, ancien et nouveau montant personnel de base.`, ['l', 'r', 'r', 'r'])}
<p>Ce tableau ne compte que le montant de base. Les crédits pour les cotisations au RPC et à l'assurance-emploi, que le simulateur n'applique pas, réduisent encore l'impôt réel des salariés.</p>
<h2>Une déduction qui ne vaut rien sous ${h.m(bpaNow)}</h2>
<p>Pour l'épargne, la hausse déplace un seuil. Sous ${h.m(bpaNow)} de revenu imposable, il n'y a plus d'impôt provincial, et sous le montant fédéral de ${h.m(fedBpa)}, plus d'impôt fédéral non plus. Une cotisation REER faite dans cette zone ne fait rien économiser. Les étudiants, les personnes qui travaillent à temps partiel ou qui reprennent un emploi en cours d'année y sont souvent. Pour elles, le CELI est le compte naturel : l'argent y fructifie sans impôt et reste disponible.</p>
<p>Cela ne veut pas dire renoncer au REER. Les droits de cotisation s'accumulent chaque année à hauteur de 18 % du revenu gagné de l'année précédente, jusqu'au plafond, qui est de ${h.m(K.rrspLimit(Y))} en ${Y}. Ils restent disponibles, sans limite de temps, pour une année où le revenu sera assez élevé pour que la déduction rapporte ${h.p(K.marginal(60000, 'NL'))} ou plus.</p>
<h2>Huit taux, dont trois pour les très hauts revenus</h2>
<p>Terre-Neuve-et-Labrador découpe son barème plus finement que toute autre province : ${L.rates.map((r) => h.r(r)).join(', ')}, avec des seuils à ${L.brackets.map((b) => h.m(b)).join(', ')}, selon la ${h.src('cra_rates_2026', 'page des taux 2026')}. Les trois derniers taux ne concernent que les revenus au-delà de ${h.m(L.brackets[4])}, et le dernier ne s'applique qu'à la partie qui dépasse ${h.m(topFrom)}. Combiné au fédéral, le taux marginal monte alors à ${h.p(K.marginal(topFrom + 10000, 'NL'))}. Pour un salarié, ce sont les premiers seuils qui comptent : à ${h.m(L.brackets[0])}, le taux combiné passe de ${h.p(K.marginal(L.brackets[0] - 1000, 'NL'))} à ${h.p(K.marginal(L.brackets[0] + 1000, 'NL'))}, et à ${h.m(L.brackets[1])}, il atteint ${h.p(K.marginal(L.brackets[1] + 1000, 'NL'))}.</p>
${h.mini('reerCeli', { t: 'REER ou CELI à Terre-Neuve-et-Labrador', p: ['rv', 'rr'], d: { pr: 'NL', rv: 95000, rr: 45000 } })}
<h2>Exemple : un salaire de 95 000 $</h2>
<p>Une personne gagne ${h.m(95000)}, peut mettre de côté ${h.m(7000)} par année après impôt pendant 20 ans et prévoit ${h.m(45000)} de revenu à la retraite. Avec le REER, l'effort de ${h.m(7000)} permet de verser ${h.m(ex.contribution)}, dont ${h.m(ex.refund)} viennent du remboursement. Après 20 ans à 3 % de rendement réel, le REER laisse ${h.m(ex.rrspNet)} une fois l'impôt des retraits payé, contre ${h.m(ex.tfsaValue)} dans le CELI. L'écart, ${h.m(Math.abs(ex.gap))} en faveur du ${ex.gap > 0 ? 'REER' : 'CELI'}, vient de la différence entre le taux récupéré aujourd'hui, ${h.p(ex.rateNow)}, et le taux payé plus tard, ${h.p(ex.rateLater)}. Si cette personne prévoyait une rente qui la garderait au-dessus de ${h.m(L.brackets[1])} à la retraite, l'avantage fondrait.</p>
<p>Ce calcul suppose une chose que l'on oublie souvent : le remboursement de ${h.m(ex.refund)} doit lui aussi être épargné. Soit on verse dès maintenant le montant brut de ${h.m(ex.contribution)}, en avançant la différence, soit on place le remboursement au REER ou au CELI dès qu'il arrive au printemps. S'il est dépensé, le REER ne contient plus que ${h.m(7000)}, et comme ses retraits seront imposés, il finira derrière un CELI alimenté du même montant. Cette discipline compte plus que la taille du montant de base : c'est du remboursement que vient l'avantage du REER.</p>
`,
  },
  en: {
    slug: 'rrsp-vs-tfsa-newfoundland-and-labrador',
    nav: 'RRSP or TFSA in Newfoundland and Labrador', card: `Basic amount raised to ${E.m(bpaNow)}, eight rates up to ${E.r(top)}: RRSP and TFSA in Newfoundland and Labrador for ${Y}.`,
    title: `RRSP vs TFSA in Newfoundland and Labrador ${Y}: new BPA`,
    description: `RRSP or TFSA in Newfoundland and Labrador ${Y}: basic personal amount raised from ${E.m(bpaOld)} to ${E.m(bpaNow)}, eight rates up to ${E.r(top)}, and what it means for you.`,
    h1: `RRSP or TFSA in Newfoundland and Labrador in ${Y}`,
    intro: 'Newfoundland and Labrador raised its basic personal amount in the spring, effective January 1. The calculator applies the new amount to your RRSP contribution.',
    resume: `In Newfoundland and Labrador, the ${Y} basic personal amount went from ${E.m(bpaOld)} to ${E.m(bpaNow)}, an increase announced on April 29, ${Y} and effective January 1. Because the amount is credited at the lowest rate, ${E.r(r0)}, the tax cut is at most ${E.m(maxGain)} a year, for anyone whose taxable income is above ${E.m(bpaNow)}. The tax table itself is unchanged: eight rates, from ${E.r(r0)} up to ${E.r(top)} on the part of income above ${E.m(topFrom)}, the largest number of brackets in the country. For the RRSP or TFSA choice, the increase matters mostly at the bottom: below ${E.m(bpaNow)} of income there is no provincial tax left, so an RRSP deduction recovers nothing on the provincial side. From ${E.m(50000)}, the combined marginal rate is ${E.p(K.marginal(50000, 'NL'))}, and it reaches ${E.p(K.marginal(100000, 'NL'))} at ${E.m(100000)}: that is where an RRSP contribution starts to pay off well.`,
    faqs: [
      { q: 'What is the Newfoundland and Labrador basic personal amount for 2026?', a: `It is ${E.m(bpaNow)} for the ${Y} tax year, up from the ${E.m(bpaOld)} employers applied at the start of the year. The government announced the increase on April 29, ${Y}, effective January 1. The credit is worked out at ${E.r(r0)}, so the increase lowers provincial tax by at most ${E.m(maxGain)} over the year.` },
      { q: 'Why did my income tax deduction drop in July in Newfoundland?', a: `Employers used the old basic amount for the first six months. To make up the difference, the July T4127 guide has them use a prorated amount of ${E.m(15000)} from the first payroll in July. On your tax return, the annual amount of ${E.m(bpaNow)} is what counts.` },
      { q: 'How many tax brackets does Newfoundland and Labrador have?', a: `Eight rates, separated by seven thresholds: ${L.brackets.map((b) => E.m(b)).join(', ')}. The last three rates, ${L.rates.slice(5).map((r) => E.r(r)).join(', ')}, only reach income above ${E.m(L.brackets[4])}. For most taxpayers, only the first three or four rates matter when working out what an RRSP contribution is worth.` },
      { q: 'Should I contribute to an RRSP on $20,000 a year in Newfoundland and Labrador?', a: `The deduction saves little at that level. At ${E.m(20000)}, putting ${E.m(2000)} into an RRSP lowers tax by only ${E.m(K.saving(20000, 2000, 'NL'))}, and below about ${E.m(zeroAll)} there is no tax to reduce at all. RRSP room still builds with earned income and carries forward: you can use the TFSA now and keep that room for later.` },
    ],
    body: (h) => `
<h2>What the April 29 announcement changed</h2>
<p>The ${h.src('t4127_jul', 'July 1 T4127 guide')} sets out the decision: Newfoundland and Labrador's basic personal amount goes from ${h.m(bpaOld)} to ${h.m(bpaNow)}, effective January 1, ${Y}. Nothing else moves in the provincial table. Because the announcement came in the spring, employers withheld too much tax in the first half of the year; the guide has them apply a prorated amount of ${h.m(15000)} from the first payroll in July, so that the year's deductions end up closer to the real tax. On the ${Y} return, the annual amount of ${h.m(bpaNow)} applies.</p>
<h2>Provincial tax before and after the increase</h2>
<p>The credit is worked out at the lowest rate, ${h.r(r0)}. The gain is therefore the same, ${h.m(maxGain)}, for everyone who already paid provincial tax above the new amount. It is smaller for incomes between the two amounts, which simply drop to zero.</p>
${h.table(['Taxable income', `Provincial tax with ${h.m(bpaOld)}`, `With ${h.m(bpaNow)}`, 'Cut'], beforeAfter(h), `Newfoundland and Labrador tax before other credits, ${Y}, old and new basic personal amount.`, ['l', 'r', 'r', 'r'])}
<p>The table only counts the basic amount. The credits for CPP contributions and employment insurance premiums, which the calculator leaves out, lower an employee's real tax further.</p>
<h2>A deduction worth nothing below ${h.m(bpaNow)}</h2>
<p>For saving, the increase moves a threshold. Below ${h.m(bpaNow)} of taxable income there is no provincial tax left, and below the federal amount of ${h.m(fedBpa)} no federal tax either. An RRSP contribution made in that range saves nothing. Students, part-time workers and people who start a job partway through the year are often there. For them, the TFSA is the natural account: money grows tax-free and stays available.</p>
<p>That does not mean giving up on the RRSP. Contribution room builds every year at 18% of the previous year's earned income, up to the dollar limit, which is ${h.m(K.rrspLimit(Y))} in ${Y}. It stays available, with no time limit, for a year when income is high enough for the deduction to save ${h.p(K.marginal(60000, 'NL'))} or more.</p>
<h2>Eight rates, three of them for very high incomes</h2>
<p>Newfoundland and Labrador cuts its table more finely than any other province: ${L.rates.map((r) => h.r(r)).join(', ')}, with thresholds at ${L.brackets.map((b) => h.m(b)).join(', ')}, according to the ${h.src('cra_rates_2026', '2026 rates page')}. The last three rates only reach income above ${h.m(L.brackets[4])}, and the very last one only applies to the part above ${h.m(topFrom)}. Combined with the federal rate, the marginal rate then reaches ${h.p(K.marginal(topFrom + 10000, 'NL'))}. For an employee, the early thresholds are the ones that matter: at ${h.m(L.brackets[0])}, the combined rate moves from ${h.p(K.marginal(L.brackets[0] - 1000, 'NL'))} to ${h.p(K.marginal(L.brackets[0] + 1000, 'NL'))}, and at ${h.m(L.brackets[1])} it reaches ${h.p(K.marginal(L.brackets[1] + 1000, 'NL'))}.</p>
${h.mini('reerCeli', { t: 'RRSP or TFSA in Newfoundland and Labrador', p: ['rv', 'rr'], d: { pr: 'NL', rv: 95000, rr: 45000 } })}
<h2>Example: a $95,000 salary</h2>
<p>Someone earns ${h.m(95000)}, can set aside ${h.m(7000)} a year after tax for 20 years and expects ${h.m(45000)} of income in retirement. With an RRSP, the ${h.m(7000)} effort lets them contribute ${h.m(ex.contribution)}, of which ${h.m(ex.refund)} comes from the refund. After 20 years at a 3% real return, the RRSP leaves ${h.m(ex.rrspNet)} once tax on withdrawals is paid, against ${h.m(ex.tfsaValue)} in the TFSA. The gap, ${h.m(Math.abs(ex.gap))} in favour of the ${ex.gap > 0 ? 'RRSP' : 'TFSA'}, comes from the difference between the rate recovered today, ${h.p(ex.rateNow)}, and the rate paid later, ${h.p(ex.rateLater)}. If this person expected a pension that kept them above ${h.m(L.brackets[1])} in retirement, the advantage would melt away.</p>
<p>The calculation assumes something people often forget: the ${h.m(ex.refund)} refund has to be saved too. Either you contribute the gross ${h.m(ex.contribution)} right away, fronting the difference, or you put the refund into the RRSP or the TFSA as soon as it arrives in the spring. If it is spent, the RRSP only holds ${h.m(7000)}, and because its withdrawals will be taxed, it will end up behind a TFSA funded with the same amount. Keeping that discipline matters more in Newfoundland and Labrador than the size of the basic amount: the refund is where the RRSP's edge comes from.</p>
`,
  },
});
