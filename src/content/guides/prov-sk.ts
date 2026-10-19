import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const S = K.jur('SK');
const step = K.P.provinceFacts.skBpaStep;
const steps = K.steps('SK', 280000);
const rets = [25000, 40000, 55000, 70000, 90000];
const scen = rets.map((r) => ({ r, c: K.compare({ prov: 'SK', income: 90000, save: 6000, years: 25, growth: 0.03, retireIncome: r, spread: 20 }) }));
const srows = (h: { m: (x: number) => string; p: (x: number, d?: number) => string }, l: 'fr' | 'en') => scen.map(({ r, c }) => [h.m(r), h.p(c.rateLater), h.m(c.rrspNet), h.m(c.tfsaValue), c.gap > 0 ? (l === 'fr' ? 'REER' : 'RRSP') : (l === 'fr' ? 'CELI' : 'TFSA')]);
const plateau = [S.brackets[0], K.P.federal.brackets[1]];

export default defineGuide({
  id: 'prov-sk', group: 'prov', order: 45, tool: 'reerCeli',
  toolArg: { pr: 'SK', rv: 90000, rr: 45000 },
  related: ['reer-ou-celi', 'taux-marginal', 'reer-sv-srg', 'prov-mb', 'prov-ab'],
  sources: ['cra_rates_2026', 't4127_jul', 't4127_jan'],
  fr: {
    slug: 'reer-ou-celi-saskatchewan',
    nav: 'REER ou CELI en Saskatchewan', card: `Trois taux, de larges tranches et un montant de base de ${F.m(S.bpa ?? 0)} : le REER en Saskatchewan en ${Y}.`,
    title: `REER ou CELI en Saskatchewan ${Y} : taux et retraite`,
    description: `REER ou CELI en Saskatchewan ${Y} : trois taux de 10,5 % à 14,5 %, tranches larges, montant de base de 20 381 $. Le bon compte selon votre revenu à la retraite.`,
    h1: `REER ou CELI en Saskatchewan en ${Y} : tout dépend de la retraite`,
    intro: 'Avec trois taux et des tranches très larges, la Saskatchewan donne un taux marginal stable sur une grande plage de revenus. Le revenu de retraite décide alors presque seul.',
    resume: `La Saskatchewan impose le revenu à trois taux en ${Y} : ${F.r(S.rates[0])} jusqu'à ${F.m(S.brackets[0])}, ${F.r(S.rates[1])} jusqu'à ${F.m(S.brackets[1])}, puis ${F.r(S.rates[2])}. Son montant personnel de base, ${F.m(S.bpa ?? 0)}, est l'un des plus élevés du pays et la loi provinciale sur l'abordabilité le relève de ${F.m(step)} par année pendant quatre ans, en plus de l'indexation. Comme les tranches provinciales sont larges, le taux marginal combiné reste le même sur de grandes plages : ${F.p(K.marginal(plateau[0] + 5000, 'SK'))} de ${F.m(plateau[0])} à ${F.m(plateau[1])}, par exemple. Une cotisation REER rapporte donc le même taux par dollar, qu'on gagne ${F.m(65000)} ou ${F.m(110000)}. La vraie question devient le revenu de retraite. Pour ${F.m(90000)} de revenu aujourd'hui, le REER l'emporte nettement si la retraite se vit avec ${F.m(40000)}, mais l'avantage fond si elle atteint ${F.m(90000)}. Le simulateur fait varier ce revenu de retraite ; le tableau plus bas montre cinq cas.`,
    faqs: [
      { q: 'Quel est le montant personnel de base en Saskatchewan en 2026 ?', a: `Il s'élève à ${F.m(S.bpa ?? 0)} en ${Y}, et la province l'augmente de ${F.m(step)} par année pendant quatre années d'imposition, en plus de l'indexation. Le crédit se calcule au taux le plus bas, ${F.r(S.rates[0])}, ce qui fait environ ${F.m((S.bpa ?? 0) * S.rates[0])} d'impôt en moins. Chaque hausse de ${F.m(step)} vaut donc environ ${F.m(step * S.rates[0])} par an.` },
      { q: 'Quel revenu de retraite rend le CELI préférable en Saskatchewan ?', a: `Celui qui vous place dans la même tranche qu'aujourd'hui ou plus haut. Pour un revenu actuel de ${F.m(90000)}, le REER perd son avance lorsque le revenu de retraite approche de votre salaire. Sous ${F.m(S.brackets[0])} à la retraite, le REER gagne nettement. Le tableau de la page compare cinq revenus de retraite.` },
      { q: 'Pourquoi le taux marginal change-t-il peu en Saskatchewan ?', a: `Parce que la province n'a que trois taux et que sa deuxième tranche couvre plus de ${F.m(S.brackets[1] - S.brackets[0])} de revenu. Le taux combiné ne bouge alors qu'aux seuils fédéraux. Entre ${F.m(plateau[0])} et ${F.m(plateau[1])}, il reste à ${F.p(K.marginal(plateau[0] + 5000, 'SK'))}, ce qui simplifie le calcul d'une cotisation REER.` },
    ],
    body: (h) => `
<h2>Un barème à trois marches</h2>
<p>Selon la ${h.src('cra_rates_2026', 'page des taux 2026 de canada.ca')}, la Saskatchewan applique ${h.r(S.rates[0])}, ${h.r(S.rates[1])} et ${h.r(S.rates[2])}, avec des seuils à ${h.m(S.brackets[0])} et ${h.m(S.brackets[1])}. Le ${h.src('t4127_jul', 'guide T4127')} donne un montant personnel de base de ${h.m(S.bpa ?? 0)}. Combiné au fédéral, cela donne un escalier aux marches longues :</p>
${h.table(['Revenu imposable à partir de', 'Taux marginal combiné'], steps.map((s) => [h.m(s.from), h.p(s.rate)]), `Taux combinés fédéral et Saskatchewan, ${Y}.`, ['l', 'r'])}
<p>Entre ${h.m(plateau[0])} et ${h.m(plateau[1])}, le taux reste à ${h.p(K.marginal(plateau[0] + 5000, 'SK'))} : chaque dollar versé au REER rapporte la même chose dans toute cette zone. Ce n'est pas le cas en Colombie-Britannique ou en Ontario, où le taux change plusieurs fois dans le même intervalle.</p>
<h2>Le revenu de retraite décide</h2>
<p>Puisque le taux d'aujourd'hui varie peu, le choix entre REER et CELI dépend presque entièrement du taux que vous paierez au retrait. Le tableau suivant garde la même personne (${h.m(90000)} de revenu, ${h.m(6000)} d'épargne par an pendant 25 ans, 20 ans de retraits) et fait varier son revenu de retraite.</p>
${h.table(['Revenu de retraite', 'Taux au retrait', 'REER après impôt', 'CELI', 'Gagnant'], srows(h, 'fr'), `REER contre CELI en Saskatchewan, ${Y}, même effort d'épargne, rendement réel de 3 %.`, ['l', 'r', 'r', 'r', 'l'])}
<p>Le seuil de bascule se trouve là où le taux au retrait rejoint le taux récupéré aujourd'hui. Pour estimer votre revenu de retraite, additionnez la rente d'un régime de retraite d'employeur s'il y en a une, le RPC et la Sécurité de la vieillesse attendus : les relevés de Service Canada et de votre employeur donnent ces montants. Si une partie de ce revenu viendra d'un CELI, laissez-la de côté : les retraits du CELI ne sont pas imposables et ne font pas monter le taux payé sur les retraits du REER.</p>
${h.mini('reerCeli', { t: 'Faites varier votre revenu de retraite', p: ['rr', 'ep'], d: { pr: 'SK', rv: 90000, rr: 45000 } })}
<h2>Le montant de base qui augmente</h2>
<p>Selon le ${h.src('t4127_jan', 'guide T4127 de janvier')}, la loi de la Saskatchewan sur l'abordabilité relève le montant personnel de base de ${h.m(step)} pour chacune de quatre années d'imposition, en plus de l'indexation annuelle. Pour un contribuable, cela représente environ ${h.m(step * S.rates[0])} d'impôt en moins par an, quel que soit son revenu. L'effet sur le choix entre REER et CELI est faible : il abaisse un peu l'impôt des petits revenus de retraite, ce qui favorise légèrement le REER pour un retraité modeste. Le simulateur applique le montant de ${Y} aux deux moments, sans projeter les hausses futures.</p>
<h2>Les petits revenus en Saskatchewan</h2>
<p>Avec un montant de base de ${h.m(S.bpa ?? 0)}, aucun impôt provincial n'est dû sous ce niveau de revenu, et l'impôt fédéral ne commence qu'au-delà de ${h.m(K.P.federal.bpaMax)}. Sous ${h.m(30000)} de revenu, une cotisation REER rapporte peu, et les retraits futurs risquent de réduire le Supplément de revenu garanti. Le CELI est alors le compte naturel. Les droits REER s'accumulent quand même chaque année où vous avez un revenu gagné, à condition de produire la déclaration qui permet de les calculer, et ils resteront disponibles si votre situation change.</p>
<h2>Les autres montants relevés et le conjoint</h2>
<p>La même loi ne touche pas seulement le montant de base. Le montant pour conjoint ou pour personne à charge admissible, le montant pour enfant à charge et le supplément pour aînés augmentent eux aussi de ${h.m(step)} pour chacune des quatre années. Le montant pour conjoint diminue à mesure que le revenu net du conjoint augmente. Une cotisation REER faite par le conjoint qui gagne peu réduit son revenu net, ce qui peut augmenter le crédit de l'autre. À l'inverse, un retrait REER du conjoint au revenu modeste fait monter son revenu net et peut réduire ce crédit. Ce lien n'existe pas avec le CELI : ni les cotisations ni les retraits ne changent le revenu net.</p>
<p>Pour un couple de la Saskatchewan, le calcul se fait donc personne par personne. Le simulateur traite une seule personne ; refaites-le pour chacun avec son propre revenu, puis comparez où un dollar d'épargne rapporte le plus.</p>
`,
  },
  en: {
    slug: 'rrsp-vs-tfsa-saskatchewan',
    nav: 'RRSP or TFSA in Saskatchewan', card: `Three rates, wide brackets and a ${E.m(S.bpa ?? 0)} basic amount: the RRSP in Saskatchewan for ${Y}.`,
    title: `RRSP vs TFSA in Saskatchewan ${Y}: rates and retirement`,
    description: `RRSP or TFSA in Saskatchewan ${Y}: three rates from 10.5% to 14.5%, wide brackets, a $20,381 basic amount. Find the account that fits your retirement income.`,
    h1: `RRSP or TFSA in Saskatchewan in ${Y}: retirement income decides`,
    intro: 'With three rates and very wide brackets, Saskatchewan keeps the marginal rate steady across a broad range of incomes. Retirement income then settles the question almost on its own.',
    resume: `Saskatchewan taxes income at three rates in ${Y}: ${E.r(S.rates[0])} up to ${E.m(S.brackets[0])}, ${E.r(S.rates[1])} up to ${E.m(S.brackets[1])}, then ${E.r(S.rates[2])}. Its basic personal amount, ${E.m(S.bpa ?? 0)}, is one of the highest in the country, and the provincial Affordability Act raises it by ${E.m(step)} a year for four years, on top of indexing. Because the provincial brackets are wide, the combined marginal rate stays the same over long stretches: ${E.p(K.marginal(plateau[0] + 5000, 'SK'))} from ${E.m(plateau[0])} to ${E.m(plateau[1])}, for example. An RRSP contribution therefore saves the same rate per dollar whether you earn ${E.m(65000)} or ${E.m(110000)}. The real question becomes retirement income. On ${E.m(90000)} of income today, the RRSP clearly wins if retirement is lived on ${E.m(40000)}, but the edge melts if retirement income reaches ${E.m(90000)}. The calculator lets you vary retirement income; the table below shows five cases.`,
    faqs: [
      { q: 'What is the Saskatchewan basic personal amount for 2026?', a: `It is ${E.m(S.bpa ?? 0)} in ${Y}, and the province raises it by ${E.m(step)} a year for four taxation years, on top of indexing. The credit is worked out at the lowest rate, ${E.r(S.rates[0])}, which takes about ${E.m((S.bpa ?? 0) * S.rates[0])} off tax. Each ${E.m(step)} increase is therefore worth about ${E.m(step * S.rates[0])} a year.` },
      { q: 'What retirement income makes the TFSA the better choice in Saskatchewan?', a: `One that puts you in the same bracket as today or higher. On a current income of ${E.m(90000)}, the RRSP loses its lead as retirement income approaches your salary. Below ${E.m(S.brackets[0])} in retirement, the RRSP wins clearly. The table on this page compares five retirement incomes.` },
      { q: 'Why does the marginal rate change so little in Saskatchewan?', a: `Because the province has only three rates and its second bracket covers more than ${E.m(S.brackets[1] - S.brackets[0])} of income. The combined rate then only moves at the federal thresholds. Between ${E.m(plateau[0])} and ${E.m(plateau[1])}, it stays at ${E.p(K.marginal(plateau[0] + 5000, 'SK'))}, which makes an RRSP contribution easy to value.` },
    ],
    body: (h) => `
<h2>A three-step tax table</h2>
<p>According to the ${h.src('cra_rates_2026', '2026 rates page on canada.ca')}, Saskatchewan applies ${h.r(S.rates[0])}, ${h.r(S.rates[1])} and ${h.r(S.rates[2])}, with thresholds at ${h.m(S.brackets[0])} and ${h.m(S.brackets[1])}. The ${h.src('t4127_jul', 'T4127 guide')} gives a basic personal amount of ${h.m(S.bpa ?? 0)}. Combined with the federal rates, that makes a staircase with long steps:</p>
${h.table(['Taxable income from', 'Combined marginal rate'], steps.map((s) => [h.m(s.from), h.p(s.rate)]), `Combined federal and Saskatchewan rates, ${Y}.`, ['l', 'r'])}
<p>Between ${h.m(plateau[0])} and ${h.m(plateau[1])}, the rate stays at ${h.p(K.marginal(plateau[0] + 5000, 'SK'))}: every dollar put in an RRSP saves the same across that whole range. That is not the case in British Columbia or Ontario, where the rate changes several times over the same span.</p>
<h2>Retirement income decides</h2>
<p>Since today's rate barely moves, the RRSP or TFSA choice depends almost entirely on the rate you will pay on withdrawal. The table below keeps the same person (${h.m(90000)} of income, ${h.m(6000)} saved a year for 25 years, 20 years of withdrawals) and changes only their retirement income.</p>
${h.table(['Retirement income', 'Rate on withdrawal', 'RRSP after tax', 'TFSA', 'Winner'], srows(h, 'en'), `RRSP vs TFSA in Saskatchewan, ${Y}, same saving effort, 3% real return.`, ['l', 'r', 'r', 'r', 'l'])}
<p>The tipping point is where the rate on withdrawal meets the rate saved today. To estimate your retirement income, add up any workplace pension, the CPP and the Old Age Security you expect: your Service Canada and employer statements give those amounts. If part of that income will come from a TFSA, leave it out: TFSA withdrawals are not taxable and do not raise the rate paid on RRSP withdrawals. A larger retirement income from pensions alone is what pushes the result toward the TFSA.</p>
${h.mini('reerCeli', { t: 'Change your retirement income', p: ['rr', 'ep'], d: { pr: 'SK', rv: 90000, rr: 45000 } })}
<h2>A basic amount that keeps rising</h2>
<p>According to the ${h.src('t4127_jan', 'January T4127 guide')}, The Saskatchewan Affordability Act raises the basic personal amount by ${h.m(step)} in each of four taxation years, on top of yearly indexing. For a taxpayer, that is about ${h.m(step * S.rates[0])} less tax a year, whatever the income. Its effect on the RRSP or TFSA choice is small: it slightly lowers tax on small retirement incomes, which tilts a little toward the RRSP for a modest retiree. The calculator applies the ${Y} amount at both ends and does not project future increases.</p>
<h2>Low incomes in Saskatchewan</h2>
<p>With a ${h.m(S.bpa ?? 0)} basic amount, no provincial tax is due below that income, and federal tax only starts above ${h.m(K.P.federal.bpaMax)}. Below ${h.m(30000)} of income, an RRSP contribution saves little, and future withdrawals could reduce the Guaranteed Income Supplement. The TFSA is then the natural account. RRSP room still builds every year you have earned income, as long as you file the return that lets it be worked out, and it stays available if your situation changes.</p>
<h2>The other amounts raised, and your spouse</h2>
<p>The same Act does not only touch the basic amount. The spousal and equivalent-to-spouse amount, the dependent child amount and the senior supplementary amount also rise by ${h.m(step)} in each of the four years. The spousal amount shrinks as the spouse's net income grows. An RRSP contribution made by the lower-earning spouse lowers their net income, which can raise the other spouse's credit. The reverse holds too: an RRSP withdrawal by the spouse with the modest income raises their net income and can cut that credit. There is no such link with the TFSA: neither contributions nor withdrawals change net income.</p>
<p>For a Saskatchewan couple, the sums are therefore done person by person. The calculator handles one person; run it for each spouse with their own income, then compare where a dollar of savings does the most.</p>
`,
  },
});
