import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const B = K.jur('BC');
const PF = K.P.provinceFacts;
const before = PF.bcLowestBefore, now = B.rates[0];
// Effet de la hausse du premier taux : écart de taux sur la partie de la première tranche au-delà du montant de base.
const extra = (i: number) => Math.max(0, Math.min(i, B.brackets[0]) - (B.bpa ?? 0)) * (now - before);
const incs = [30000, 50000, 80000, 150000];
const top = B.rates[B.rates.length - 1], topFrom = B.brackets[B.brackets.length - 1];
const steps = K.steps('BC', 300000);
const c = K.compare({ prov: 'BC', income: 72000, save: 4000, years: 30, growth: 0.03, retireIncome: 45000, spread: 20 });

export default defineGuide({
  id: 'prov-bc', group: 'prov', order: 42, tool: 'reerCeli',
  toolArg: { pr: 'BC', rv: 72000, rr: 45000 },
  related: ['reer-ou-celi', 'droits-celi', 'taux-marginal', 'remboursement-reer', 'prov-ab'],
  sources: ['t4127_jul', 'cra_rates_2026', 'rc4466'],
  fr: {
    slug: 'reer-ou-celi-colombie-britannique',
    nav: 'REER ou CELI en Colombie-Britannique', card: `Premier taux relevé à ${F.r(now)}, sept tranches jusqu'à ${F.r(top)} : le REER et le CELI en C.-B. en ${Y}.`,
    title: `REER ou CELI en Colombie-Britannique ${Y} : taux et choix`,
    description: `REER ou CELI en Colombie-Britannique ${Y} : premier taux passé de 5,06 % à 5,6 %, sept tranches jusqu'à 20,5 %, indexation suspendue dès 2027. Calcul gratuit.`,
    h1: `REER ou CELI en Colombie-Britannique en ${Y}`,
    intro: 'La Colombie-Britannique a relevé son premier taux d’impôt en 2026 et gèlera ses tranches à partir de 2027. Deux changements qui jouent sur la valeur d’une déduction REER.',
    resume: `En Colombie-Britannique, le premier taux d'impôt provincial est passé de ${F.r(before)} à ${F.r(now)} en ${Y}, une hausse annoncée le 17 février ${Y}. Le barème compte sept taux, de ${F.r(now)} à ${F.r(top)} au-delà de ${F.m(topFrom)}, avec un montant personnel de base de ${F.m(B.bpa ?? 0)}. La hausse coûte au plus ${F.m(extra(B.brackets[0]))} par an, à partir d'environ ${F.m(B.brackets[0])} de revenu imposable ; elle ne change presque pas le taux marginal des revenus moyens, qui se trouvent dans des tranches plus élevées. Le second changement compte davantage à long terme : la province a suspendu l'indexation de ses tranches de 2027 à 2030. Avec des seuils figés et des salaires qui montent, une part croissante du revenu passera dans les tranches supérieures, ce qui augmentera la valeur d'une déduction REER pendant ces années. Le CELI, lui, n'est touché par aucun des deux changements. À ${F.m(72000)}, le taux marginal combiné est de ${F.p(K.marginal(72000, 'BC'))}.`,
    faqs: [
      { q: 'Pourquoi l’impôt provincial a-t-il augmenté en Colombie-Britannique en 2026 ?', a: `Le gouvernement a relevé le taux de la première tranche de ${F.r(before)} à ${F.r(now)}, annonce faite le 17 février ${Y}. Comme le crédit du montant personnel de base se calcule aussi à ce taux, la hausse ne touche que le revenu situé entre ${F.m(B.bpa ?? 0)} et ${F.m(B.brackets[0])}. Le surplus maximal est d'environ ${F.m(extra(B.brackets[0]))} par année.` },
      { q: 'Les tranches d’impôt de la C.-B. seront-elles indexées en 2027 ?', a: `Non. La province a suspendu l'indexation de ses tranches de 2027 à 2030. Les seuils de ${Y} resteront donc en place pendant ces années, alors que les tranches fédérales continueront d'être indexées chaque janvier. Le plafond REER, lui, monte déjà à ${F.m(K.rrspLimit(Y + 1))} en ${Y + 1}.` },
      { q: 'Quel est le taux marginal le plus élevé en Colombie-Britannique ?', a: `Au-delà de ${F.m(topFrom)}, le taux provincial atteint ${F.r(top)}. Ajouté au taux fédéral de 33 % au-delà de ${F.m(K.P.federal.brackets[3])}, le taux combiné atteint ${F.p(K.marginal(300000, 'BC'))}. C'est dans cette zone qu'une cotisation REER rapporte le plus, à condition de payer moins d'impôt au moment du retrait.` },
      { q: 'Peut-on ouvrir un CELI à 18 ans en Colombie-Britannique ?', a: `La majorité y est fixée à 19 ans, et l'on ne peut pas signer de contrat avant. Le CELI s'ouvre donc à 19 ans. Les droits de l'année des 18 ans ne sont pas perdus : ils sont reportés à l'année suivante, si bien qu'un jeune de 19 ans peut verser deux plafonds d'un coup, soit ${F.m(2 * K.tfsaLimit(Y))} en ${Y}.` },
    ],
    body: (h) => `
<h2>Ce qui a changé en ${Y}</h2>
<p>Le premier taux provincial est passé de ${h.r(before)} à ${h.r(now)}. Le ${h.src('t4127_jul', 'guide T4127 de juillet')} applique ce taux à toute l'année ${Y}. Le crédit pour le montant personnel de base se calcule au même taux, ce qui en atténue l'effet sur les petits revenus : la hausse ne frappe que la partie du revenu comprise entre ${h.m(B.bpa ?? 0)} et ${h.m(B.brackets[0])}.</p>
${h.table(['Revenu imposable', 'Hausse annuelle', 'Taux marginal combiné'], incs.map((i) => [h.m(i), h.m(extra(i)), h.p(K.marginal(i, 'BC'))]), `Effet de la hausse du premier taux provincial en Colombie-Britannique, ${Y}.`, ['l', 'r', 'r'])}
<p>Pour le choix entre REER et CELI, cette hausse ne compte que pour les revenus de la première tranche, où une déduction REER rapporte un peu plus qu'avant. Au-dessus de ${h.m(B.brackets[0])}, le taux marginal ne bouge pas.</p>
<h2>Sept tranches, des marches serrées</h2>
<p>La Colombie-Britannique a l'un des barèmes les plus découpés du pays. Les marches se resserrent entre ${h.m(B.brackets[1])} et ${h.m(B.brackets[4])}, ce qui fait varier le taux combiné rapidement dans cette zone de revenus.</p>
${h.table(['Revenu imposable à partir de', 'Taux marginal combiné'], steps.map((s) => [h.m(s.from), h.p(s.rate)]), `Taux combinés fédéral et Colombie-Britannique, ${Y}, revenu ordinaire.`, ['l', 'r'])}
<h2>Le gel de 2027 à 2030</h2>
<p>Chaque année, la plupart des gouvernements relèvent leurs seuils au rythme de l'inflation, pour qu'une hausse de salaire qui suit les prix ne fasse pas monter d'une tranche. La Colombie-Britannique a suspendu ce mécanisme de 2027 à 2030. Concrètement, une personne dont le salaire suit l'inflation verra une part croissante de son revenu passer dans une tranche plus haute. Pour l'épargne, cela favorise le REER pendant ces années : la déduction vaudra davantage, alors que le taux à la retraite dépendra des tranches en vigueur plus tard, qui ne sont pas connues. Le simulateur n'en tient pas compte et applique le barème ${Y} aux deux moments.</p>
${h.mini('taux', { t: 'Votre taux marginal en Colombie-Britannique', p: ['rv'], d: { pr: 'BC', rv: 72000 } })}
<h2>Un exemple en C.-B.</h2>
<p>À ${h.m(72000)} de revenu, avec ${h.m(4000)} d'épargne par an pendant 30 ans et ${h.m(45000)} de revenu prévu à la retraite, le REER permet de verser ${h.m(c.contribution)} pour le même effort. À l'arrivée, il laisse ${h.m(c.rrspNet)} après impôt contre ${h.m(c.tfsaValue)} pour le CELI, un écart de ${h.m(Math.abs(c.gap))} en faveur du ${c.gap > 0 ? 'REER' : 'CELI'}. Le taux récupéré aujourd'hui est de ${h.p(c.rateNow)}, celui payé au retrait de ${h.p(c.rateLater)}.</p>
<h2>Quel compte selon votre revenu</h2>
<p>Trois situations reviennent souvent. Sous ${h.m(45000)} de revenu imposable, le taux combiné est de ${h.p(K.marginal(40000, 'BC'))} : une cotisation REER rapporte peu, et un retrait à la retraite risque d'être imposé autant, voire de réduire le Supplément de revenu garanti. Le CELI est le compte de départ. Entre ${h.m(B.brackets[1])} et ${h.m(B.brackets[3])}, le taux combiné passe de ${h.p(K.marginal(B.brackets[1] + 1000, 'BC'))} à ${h.p(K.marginal(B.brackets[3] - 1000, 'BC'))} : le REER prend l'avantage si vous prévoyez un revenu de retraite nettement plus bas que votre salaire. Au-delà de ${h.m(150000)}, le taux dépasse ${h.p(K.marginal(160000, 'BC'), 0)} et le REER gagne presque toujours, sauf pour un retraité qui disposera d'une rente de régime de retraite élevée. Dans tous les cas, rien n'empêche de faire les deux : verser au REER le montant qui fait redescendre votre revenu sous la tranche supérieure, puis le reste au CELI.</p>
<p>Un couple peut aller plus loin. Chaque conjoint a son propre montant personnel de base et ses propres tranches, si bien que deux revenus de ${h.m(60000)} paient moins d'impôt qu'un seul de ${h.m(120000)}. Constituer l'épargne de retraite au nom du conjoint qui aura le revenu le plus bas, par un REER de conjoint ou simplement par le CELI de ce conjoint, répartit les retraits futurs sur deux séries de tranches.</p>
<h2>Le CELI à 19 ans</h2>
<p>En Colombie-Britannique, la majorité est fixée à 19 ans, et l’${h.src('rc4466', 'Agence du revenu du Canada')} précise que là où l'on ne peut pas contracter avant 19 ans, les droits CELI de l'année des 18 ans sont reportés. Un jeune né en ${Y - 19} peut donc verser ${h.m(2 * K.tfsaLimit(Y))} cette année. Pour un étudiant au revenu faible, le CELI reste de loin le meilleur compte : la déduction REER ne rapporterait presque rien, alors que les droits REER, eux, s'accumulent pour plus tard dès qu'il y a un revenu gagné et une déclaration produite.</p>
`,
  },
  en: {
    slug: 'rrsp-vs-tfsa-british-columbia',
    nav: 'RRSP or TFSA in British Columbia', card: `Lowest rate raised to ${E.r(now)}, seven brackets up to ${E.r(top)}: RRSP and TFSA in BC for ${Y}.`,
    title: `RRSP vs TFSA in British Columbia ${Y}: rates and choice`,
    description: `RRSP or TFSA in British Columbia ${Y}: lowest rate up from 5.06% to 5.6%, seven brackets up to 20.5%, indexing paused from 2027. Run it with your own numbers.`,
    h1: `RRSP or TFSA in British Columbia in ${Y}`,
    intro: 'British Columbia raised its lowest income tax rate in 2026 and will freeze its brackets from 2027. Both changes affect what an RRSP deduction is worth.',
    resume: `In British Columbia, the lowest provincial tax rate went from ${E.r(before)} to ${E.r(now)} in ${Y}, a change announced on February 17, ${Y}. The table has seven rates, from ${E.r(now)} to ${E.r(top)} above ${E.m(topFrom)}, with a basic personal amount of ${E.m(B.bpa ?? 0)}. The increase costs at most ${E.m(extra(B.brackets[0]))} a year, from about ${E.m(B.brackets[0])} of taxable income; it barely changes the marginal rate of middle incomes, which sit in higher brackets. The second change matters more over time: the province has paused the indexing of its brackets from 2027 to 2030. With frozen thresholds and rising wages, a growing share of income will move into higher brackets, which will make an RRSP deduction worth more during those years. The TFSA is affected by neither change. At ${E.m(72000)}, the combined marginal rate is ${E.p(K.marginal(72000, 'BC'))}.`,
    faqs: [
      { q: 'Why did provincial income tax go up in British Columbia in 2026?', a: `The government raised the lowest bracket rate from ${E.r(before)} to ${E.r(now)}, announced on February 17, ${Y}. Because the basic personal credit is also worked out at that rate, the increase only reaches income between ${E.m(B.bpa ?? 0)} and ${E.m(B.brackets[0])}. The most anyone pays extra is about ${E.m(extra(B.brackets[0]))} a year.` },
      { q: 'Will BC tax brackets be indexed in 2027?', a: `No. The province has paused the indexing of its brackets from 2027 to 2030. The ${Y} thresholds will therefore stay in place during those years, while federal brackets keep being indexed every January. The RRSP dollar limit, for its part, is already set to rise to ${E.m(K.rrspLimit(Y + 1))} in ${Y + 1}.` },
      { q: 'What is the top marginal tax rate in British Columbia?', a: `Above ${E.m(topFrom)}, the provincial rate reaches ${E.r(top)}. Added to the 33% federal rate above ${E.m(K.P.federal.brackets[3])}, the combined rate reaches ${E.p(K.marginal(300000, 'BC'))}. That is where an RRSP contribution saves the most per dollar, provided you pay less tax when the money comes out.` },
      { q: 'Can you open a TFSA at 18 in British Columbia?', a: `The age of majority there is 19, and you cannot sign a contract before then. A TFSA therefore opens at 19. The room for the year you turned 18 is not lost: it carries over to the next year, so a 19-year-old can put in two years of limits at once, ${E.m(2 * K.tfsaLimit(Y))} in ${Y}.` },
    ],
    body: (h) => `
<h2>What changed in ${Y}</h2>
<p>The lowest provincial rate went from ${h.r(before)} to ${h.r(now)}. The ${h.src('t4127_jul', 'July T4127 guide')} applies that rate to the whole of ${Y}. The basic personal credit is worked out at the same rate, which softens the effect on small incomes: the increase only reaches the part of income between ${h.m(B.bpa ?? 0)} and ${h.m(B.brackets[0])}.</p>
${h.table(['Taxable income', 'Extra tax a year', 'Combined marginal rate'], incs.map((i) => [h.m(i), h.m(extra(i)), h.p(K.marginal(i, 'BC'))]), `Effect of the higher lowest provincial rate in British Columbia, ${Y}.`, ['l', 'r', 'r'])}
<p>For the RRSP or TFSA choice, the increase only matters for incomes in the first bracket, where an RRSP deduction now saves slightly more than before. Above ${h.m(B.brackets[0])}, the marginal rate does not move.</p>
<h2>Seven brackets, closely spaced</h2>
<p>British Columbia has one of the most finely cut tax tables in the country. The steps tighten between ${h.m(B.brackets[1])} and ${h.m(B.brackets[4])}, so the combined rate changes quickly across that income range.</p>
${h.table(['Taxable income from', 'Combined marginal rate'], steps.map((s) => [h.m(s.from), h.p(s.rate)]), `Combined federal and British Columbia rates, ${Y}, ordinary income.`, ['l', 'r'])}
<h2>The 2027 to 2030 freeze</h2>
<p>Each year, most governments raise their thresholds in line with inflation, so that a raise that only keeps up with prices does not push you into a higher bracket. British Columbia has paused that mechanism from 2027 to 2030. In practice, someone whose pay tracks inflation will see a growing share of income move into a higher bracket. For saving, that tilts toward the RRSP during those years: the deduction will be worth more, while the rate in retirement will depend on brackets in force later, which nobody knows yet. The calculator does not model this and uses the ${Y} table at both ends.</p>
${h.mini('taux', { t: 'Your marginal rate in British Columbia', p: ['rv'], d: { pr: 'BC', rv: 72000 } })}
<h2>A BC example</h2>
<p>On ${h.m(72000)} of income, saving ${h.m(4000)} a year for 30 years with ${h.m(45000)} of expected retirement income, the RRSP lets you put in ${h.m(c.contribution)} for the same effort. At the end, it leaves ${h.m(c.rrspNet)} after tax against ${h.m(c.tfsaValue)} in the TFSA, a gap of ${h.m(Math.abs(c.gap))} in favour of the ${c.gap > 0 ? 'RRSP' : 'TFSA'}. The rate saved today is ${h.p(c.rateNow)}, the rate paid on withdrawal ${h.p(c.rateLater)}.</p>
<h2>Which account at which income</h2>
<p>Three situations come up often. Below ${h.m(45000)} of taxable income, the combined rate is ${h.p(K.marginal(40000, 'BC'))}: an RRSP contribution saves little, and a withdrawal in retirement may be taxed as much, or even cut the Guaranteed Income Supplement. The TFSA is the place to start. Between ${h.m(B.brackets[1])} and ${h.m(B.brackets[3])}, the combined rate moves from ${h.p(K.marginal(B.brackets[1] + 1000, 'BC'))} to ${h.p(K.marginal(B.brackets[3] - 1000, 'BC'))}: the RRSP takes the lead if you expect retirement income well below your salary. Above ${h.m(150000)}, the rate passes ${h.p(K.marginal(160000, 'BC'), 0)} and the RRSP nearly always wins, except for a retiree who will have a large workplace pension. Nothing stops you from doing both: put into the RRSP the amount that brings your income back below the higher bracket, then the rest into the TFSA.</p>
<p>A couple can push the same idea further. Each spouse has a separate basic personal amount and separate brackets, so two incomes of ${h.m(60000)} pay less tax than one of ${h.m(120000)}. Building retirement savings in the name of the spouse who will have the lower income, through a spousal RRSP or simply through that spouse's own TFSA, spreads future withdrawals across two sets of brackets.</p>
<h2>The TFSA at 19</h2>
<p>In British Columbia, the age of majority is 19, and the ${h.src('rc4466', 'Canada Revenue Agency')} states that where you cannot contract before 19, the TFSA room for the year you turned 18 carries over. Someone born in ${Y - 19} can therefore put in ${h.m(2 * K.tfsaLimit(Y))} this year. For a student on a low income, the TFSA is by far the better account: an RRSP deduction would save almost nothing, while RRSP room keeps building for later as long as there is earned income and a tax return is filed.</p>
`,
  },
});
