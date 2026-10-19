import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const U = K.jur('NU');
const FD = K.P.federal;
const bpa = U.bpa ?? 0;
const top = U.rates[U.rates.length - 1], topFrom = U.brackets[U.brackets.length - 1];
// Juridiction au taux marginal le plus élevé à un revenu donné.
const maxAt = (x: number) => K.PROVS.reduce((a, p) => (K.marginal(x, p) > K.marginal(x, a) ? p : a), K.PROVS[0]);
const lowest = (x: number) => K.PROVS.every((p) => K.marginal(x, 'NU') <= K.marginal(x, p) + 1e-9);
const allLow = [45000, 70000, 130000].every(lowest);
const hi70 = maxAt(70000);
// Scénarios REER contre CELI : revenu actuel, revenu de retraite.
const cases: Array<[number, number]> = [[45000, 40000], [50000, 58000], [70000, 35000], [70000, 60000], [120000, 50000], [120000, 110000]];
const runs = cases.map(([i, r]) => ({ i, r, c: K.compare({ prov: 'NU', income: i, save: 5000, years: 25, growth: 0.03, retireIncome: r, spread: 20 }) }));
type H = { m: (x: number) => string; p: (x: number, d?: number) => string };
const label = (g: number, fr: boolean) => (Math.abs(g) < 1 ? (fr ? 'Égalité' : 'Tie') : g > 0 ? (fr ? 'REER' : 'RRSP') : (fr ? 'CELI' : 'TFSA'));
const rows = (h: H, fr: boolean) => runs.map(({ i, r, c }) => [h.m(i), h.m(r), h.p(c.rateNow), h.p(c.rateLater), label(c.gap, fr), h.m(Math.abs(c.gap))]);
const reerWins = runs.filter(({ c }) => c.gap >= 1).length, tfsaWins = runs.filter(({ c }) => c.gap <= -1).length, ties = runs.length - reerWins - tfsaWins;
const up = runs[1].c;

export default defineGuide({
  id: 'prov-nu', group: 'prov', order: 52, tool: 'remboursement',
  toolArg: { pr: 'NU', rv: 70000, mt: 5000 },
  related: ['reer-ou-celi', 'retrait-celi', 'reer-sv-srg', 'remboursement-reer', 'prov-nt'],
  sources: ['cra_rates_2026', 't4127_jul', 'rc4466'],
  fr: {
    slug: 'reer-ou-celi-nunavut',
    nav: 'REER ou CELI au Nunavut', card: `Les taux les plus bas du pays, de ${F.r(U.rates[0])} à ${F.r(top)} : une déduction REER rapporte moins, le CELI gagne plus souvent en ${Y}.`,
    title: `REER ou CELI au Nunavut ${Y} : les taux les plus bas du pays`,
    description: `REER ou CELI au Nunavut ${Y} : taux de ${F.r(U.rates[0])} à ${F.r(top)}, montant de base de ${F.m(bpa)}, une déduction REER qui rapporte moins et un CELI qui gagne plus souvent.`,
    h1: `REER ou CELI au Nunavut en ${Y} : quand l'impôt est bas`,
    intro: 'Le Nunavut impose le revenu moins que toute autre province ou territoire. Le simulateur montre ce que cela laisse à une cotisation REER, à votre revenu.',
    resume: `Le Nunavut a les taux d'impôt les plus bas du Canada : ${U.rates.map((r) => F.r(r)).join(', ')}, avec des seuils à ${U.brackets.map((b) => F.m(b)).join(', ')}, et un montant personnel de base de ${F.m(bpa)}. À ${F.m(70000)} de revenu imposable, le taux marginal combiné est de ${F.p(K.marginal(70000, 'NU'))}, contre ${F.p(K.marginal(70000, hi70))} ${K.provIn(hi70)}, le plus élevé à ce revenu. Une cotisation REER de ${F.m(5000)} y fait donc baisser l'impôt de ${F.m(K.saving(70000, 5000, 'NU'))} seulement. La conséquence est simple : l'écart entre le taux récupéré au moment de cotiser et le taux payé au retrait, qui fait tout l'avantage du REER, est plus étroit qu'ailleurs. Le REER garde l'avantage quand le revenu de retraite sera nettement plus bas que le salaire, surtout au-delà de ${F.m(FD.brackets[1])}. Mais dès que la retraite prévue se situe dans la même tranche que le revenu actuel, les deux comptes font jeu égal, et si elle est plus élevée, le CELI l'emporte, avec en prime des retraits non imposés et toujours disponibles.`,
    faqs: [
      { q: 'Quel est le taux marginal combiné au Nunavut à 70 000 $ de revenu ?', a: `Il est de ${F.p(K.marginal(70000, 'NU'))} en ${Y} : 20,5 % au fédéral et ${F.r(U.rates[1])} au Nunavut, puisque ce revenu dépasse à la fois le seuil fédéral de ${F.m(FD.brackets[0])} et le premier seuil territorial de ${F.m(U.brackets[0])}. C'est le taux le plus bas des 13 provinces et territoires à ce niveau de revenu.` },
      { q: 'Le CELI est-il plus avantageux que le REER au Nunavut ?', a: `Pas toujours, mais plus souvent qu'ailleurs. Avec un revenu de retraite dans la même tranche que le salaire actuel, les deux comptes arrivent à égalité, et le CELI garde sa souplesse. Si la retraite sera plus élevée, le CELI gagne. Le REER ne prend l'avantage que si le revenu baisse nettement à la retraite, par exemple de ${F.m(120000)} à ${F.m(50000)}.` },
      { q: 'Pourquoi le remboursement REER est-il plus petit au Nunavut qu’ailleurs ?', a: `Parce qu'il se calcule au taux marginal, et que la part territoriale de ce taux est la plus basse du pays. À ${F.m(70000)}, ${F.m(5000)} versés au REER font économiser ${F.m(K.saving(70000, 5000, 'NU'))} au Nunavut, contre ${F.m(K.saving(70000, 5000, hi70))} ${K.provIn(hi70)}. La part fédérale, elle, est la même partout hors Québec.` },
      { q: 'Sous quel revenu ne paie-t-on aucun impôt au Nunavut ?', a: `Sous ${F.m(FD.bpaMax)} de revenu imposable, ni impôt fédéral ni impôt territorial n'est dû, grâce aux montants personnels de base. L'impôt territorial ne commence qu'au-delà de ${F.m(bpa)}. Dans cette zone, une cotisation REER ne fait rien économiser ; le CELI permet d'épargner sans perdre les droits REER, qui se reportent.` },
    ],
    body: (h) => `
<h2>Les taux les plus bas du pays</h2>
<p>Le Nunavut applique quatre taux en ${Y} : ${U.rates.map((r) => h.r(r)).join(', ')}, à partir de ${U.brackets.map((b) => h.m(b)).join(', ')}, selon la ${h.src('cra_rates_2026', 'page des taux 2026 de l’Agence du revenu du Canada')}. Le montant personnel de base, ${h.m(bpa)}, est crédité au premier taux. Le ${h.src('t4127_jul', 'guide T4127 de juillet')} ne signale aucun changement en cours d'année. Combiné au fédéral, le taux marginal est de ${h.p(K.marginal(45000, 'NU'))} à ${h.m(45000)}, ${h.p(K.marginal(70000, 'NU'))} à ${h.m(70000)} et ${h.p(K.marginal(130000, 'NU'))} à ${h.m(130000)}${allLow ? ' : à chacun de ces revenus, c’est le taux le plus bas des 13 provinces et territoires' : ''}. Le dernier taux territorial, ${h.r(top)}, commence à ${h.m(topFrom)}, un dollar sous le seuil fédéral de ${h.m(FD.brackets[2])}.</p>
<h2>Une déduction qui rapporte moins</h2>
<p>La valeur d'une cotisation REER, c'est le taux marginal de la personne qui cotise. Au Nunavut, la part fédérale est la même qu'ailleurs, mais la part territoriale est la plus faible : ${h.r(U.rates[1])} entre ${h.m(U.brackets[0])} et ${h.m(U.brackets[1])}, là où les quatre provinces de l'Atlantique prélèvent près de deux fois plus. À ${h.m(70000)}, ${h.m(5000)} versés au REER font économiser ${h.m(K.saving(70000, 5000, 'NU'))}, contre ${h.m(K.saving(70000, 5000, hi70))} ${K.provIn(hi70)}. L'impôt payé plus tard sur les retraits sera bas lui aussi, si la personne reste au Nunavut. Ce qui compte n'est donc pas le niveau des taux, mais l'écart entre le taux d'aujourd'hui et celui de la retraite, et cet écart est étroit.</p>
<h2>Six cas comparés</h2>
<p>Le tableau applique le même effort d'épargne, ${h.m(5000)} par an après impôt pendant 25 ans à 3 % de rendement réel, à six combinaisons de revenu actuel et de revenu de retraite. Il indique le compte qui laisse le plus d'argent net d'impôt et l'écart entre les deux.</p>
${h.table(['Revenu actuel', 'Revenu de retraite', 'Taux récupéré', 'Taux au retrait', 'Compte gagnant', 'Écart'], rows(h, true), `REER contre CELI au Nunavut, barème ${Y} aux deux moments, retraits étalés sur 20 ans.`, ['l', 'r', 'r', 'r', 'l', 'r'])}
<p>Sur six cas, le REER l'emporte ${reerWins} fois, le CELI ${tfsaWins} fois, et ${ties} se terminent à égalité. Le REER gagne nettement quand le revenu chute à la retraite, en particulier pour un salaire au-dessus de ${h.m(FD.brackets[1])}. À ${h.m(50000)} de salaire avec ${h.m(58000)} de revenu de retraite, une rente et les prestations publiques suffisent à faire monter le taux au retrait à ${h.p(up.rateLater)}, au-dessus des ${h.p(up.rateNow)} récupérés : le CELI passe devant.</p>
${h.mini('reerCeli', { t: 'REER ou CELI au Nunavut', p: ['rv', 'rr', 'an'], d: { pr: 'NU', rv: 70000, rr: 60000 } })}
<h2>Pourquoi le CELI gagne plus souvent ici</h2>
<p>Dans une province aux taux élevés, même un petit recul du revenu à la retraite crée un écart de plusieurs points entre le taux de cotisation et le taux de retrait. Au Nunavut, les marches du barème sont plus basses : la première tranche combinée est à ${h.p(K.marginal(40000, 'NU'))}, la suivante à ${h.p(K.marginal(70000, 'NU'))}. Il faut changer de tranche entre la vie active et la retraite pour que le REER rapporte vraiment, et beaucoup de retraités qui ont une rente restent dans la même tranche qu'avant. Dans ce cas, le REER n'offre qu'un report d'impôt sans gain, alors que le CELI ne demande rien en retour. Les seuils de ${h.m(U.brackets[0])} et de ${h.m(FD.brackets[0])} méritent une attention particulière : un retraité dont la rente et les prestations publiques s'en approchent verra chaque retrait REER qui les dépasse imposé à ${h.p(K.marginal(60000, 'NU'))}. Garder une partie de l'épargne dans le CELI permet alors de compléter le revenu sans franchir la marche.</p>
<h2>La souplesse du CELI</h2>
<p>Le ${h.src('rc4466', 'guide RC4466')} rappelle trois règles qui pèsent dans la balance. Un retrait de CELI n'est jamais imposé. Le montant retiré s'ajoute aux droits de cotisation le 1er janvier suivant, alors qu'un retrait de REER ne redonne aucun droit. Et ni le revenu du CELI ni ses retraits ne réduisent la Sécurité de la vieillesse, le Supplément de revenu garanti ou l'allocation canadienne pour enfants. Là où l'avantage fiscal du REER est mince, ces trois règles suffisent souvent à faire pencher le choix vers le CELI, du moins jusqu'à ce que le revenu dépasse ${h.m(FD.brackets[1])}.</p>
`,
  },
  en: {
    slug: 'rrsp-vs-tfsa-nunavut',
    nav: 'RRSP or TFSA in Nunavut', card: `The lowest rates in Canada, from ${E.r(U.rates[0])} to ${E.r(top)}: an RRSP deduction saves less and the TFSA wins more often in ${Y}.`,
    title: `RRSP vs TFSA in Nunavut ${Y}: Canada's lowest tax rates`,
    description: `RRSP or TFSA in Nunavut ${Y}: rates from ${E.r(U.rates[0])} to ${E.r(top)}, a ${E.m(bpa)} basic personal amount, an RRSP deduction that saves less and a TFSA that wins more often.`,
    h1: `RRSP or TFSA in Nunavut in ${Y}: when tax is low`,
    intro: 'Nunavut taxes income less than any other province or territory. The calculator shows what that leaves for an RRSP contribution at your income.',
    resume: `Nunavut has the lowest income tax rates in Canada: ${U.rates.map((r) => E.r(r)).join(', ')}, with thresholds at ${U.brackets.map((b) => E.m(b)).join(', ')}, and a basic personal amount of ${E.m(bpa)}. At ${E.m(70000)} of taxable income, the combined marginal rate is ${E.p(K.marginal(70000, 'NU'))}, against ${E.p(K.marginal(70000, hi70))} in ${K.prov(hi70, 'en')}, the highest at that income. A ${E.m(5000)} RRSP contribution therefore cuts tax by only ${E.m(K.saving(70000, 5000, 'NU'))}. The consequence is simple: the gap between the rate recovered when you contribute and the rate paid on withdrawal, which is the whole RRSP advantage, is narrower than elsewhere. The RRSP keeps the edge when retirement income will be well below your salary, especially above ${E.m(FD.brackets[1])}. But as soon as expected retirement income sits in the same bracket as current income, the two accounts tie, and if it is higher, the TFSA wins, with tax-free withdrawals that stay available as a bonus.`,
    faqs: [
      { q: 'What is the combined marginal tax rate in Nunavut at $70,000?', a: `It is ${E.p(K.marginal(70000, 'NU'))} in ${Y}: 20.5% federal and ${E.r(U.rates[1])} territorial, since that income is above both the ${E.m(FD.brackets[0])} federal threshold and the first territorial threshold of ${E.m(U.brackets[0])}. It is the lowest rate of all 13 provinces and territories at that income.` },
      { q: 'Is a TFSA better than an RRSP in Nunavut?', a: `Not always, but more often than elsewhere. With retirement income in the same bracket as your current salary, the two accounts tie, and the TFSA keeps its flexibility. If retirement income will be higher, the TFSA wins. The RRSP only takes the lead when income drops sharply in retirement, for example from ${E.m(120000)} to ${E.m(50000)}.` },
      { q: 'Why is the RRSP refund smaller in Nunavut than in other provinces?', a: `Because it is worked out at your marginal rate, and the territorial part of that rate is the lowest in the country. At ${E.m(70000)}, putting ${E.m(5000)} into an RRSP saves ${E.m(K.saving(70000, 5000, 'NU'))} in Nunavut, against ${E.m(K.saving(70000, 5000, hi70))} in ${K.prov(hi70, 'en')}. The federal part is the same everywhere outside Quebec.` },
      { q: 'Below what income do you pay no tax at all in Nunavut?', a: `Below ${E.m(FD.bpaMax)} of taxable income, neither federal nor territorial tax is owed, thanks to the basic personal amounts. Territorial tax only starts above ${E.m(bpa)}. In that range, an RRSP contribution saves nothing; the TFSA lets you save without losing RRSP room, which carries forward.` },
    ],
    body: (h) => `
<h2>The lowest rates in the country</h2>
<p>Nunavut applies four rates in ${Y}: ${U.rates.map((r) => h.r(r)).join(', ')}, starting at ${U.brackets.map((b) => h.m(b)).join(', ')}, according to the ${h.src('cra_rates_2026', 'Canada Revenue Agency 2026 rates page')}. The basic personal amount, ${h.m(bpa)}, is credited at the lowest rate. The ${h.src('t4127_jul', 'July T4127 guide')} reports no mid-year change. Combined with the federal rate, the marginal rate is ${h.p(K.marginal(45000, 'NU'))} at ${h.m(45000)}, ${h.p(K.marginal(70000, 'NU'))} at ${h.m(70000)} and ${h.p(K.marginal(130000, 'NU'))} at ${h.m(130000)}${allLow ? ': at each of those incomes, it is the lowest rate of all 13 provinces and territories' : ''}. The top territorial rate, ${h.r(top)}, starts at ${h.m(topFrom)}, one dollar below the ${h.m(FD.brackets[2])} federal threshold.</p>
<h2>A deduction that saves less</h2>
<p>What an RRSP contribution is worth is the contributor's marginal rate. In Nunavut, the federal part is the same as elsewhere, but the territorial part is the smallest: ${h.r(U.rates[1])} between ${h.m(U.brackets[0])} and ${h.m(U.brackets[1])}, where the four Atlantic provinces take close to twice as much. At ${h.m(70000)}, ${h.m(5000)} put into an RRSP saves ${h.m(K.saving(70000, 5000, 'NU'))}, against ${h.m(K.saving(70000, 5000, hi70))} in ${K.prov(hi70, 'en')}. Tax paid later on withdrawals will be low too, if the person stays in Nunavut. What matters is therefore not the level of the rates but the gap between today's rate and the retirement rate, and that gap is narrow.</p>
<h2>Six cases side by side</h2>
<p>The table applies the same saving effort, ${h.m(5000)} a year after tax for 25 years at a 3% real return, to six combinations of current income and retirement income. It shows which account leaves more money after tax and the gap between the two.</p>
${h.table(['Current income', 'Retirement income', 'Rate recovered', 'Rate on withdrawal', 'Winner', 'Gap'], rows(h, false), `RRSP against TFSA in Nunavut, ${Y} tax table at both ends, withdrawals spread over 20 years.`, ['l', 'r', 'r', 'r', 'l', 'r'])}
<p>Out of six cases, the RRSP wins ${reerWins} times, the TFSA ${tfsaWins} times, and ${ties} end in a tie. The RRSP wins clearly when income falls in retirement, particularly for a salary above ${h.m(FD.brackets[1])}. On a ${h.m(50000)} salary with ${h.m(58000)} of retirement income, a pension and public benefits are enough to lift the withdrawal rate to ${h.p(up.rateLater)}, above the ${h.p(up.rateNow)} recovered: the TFSA moves ahead.</p>
${h.mini('reerCeli', { t: 'RRSP or TFSA in Nunavut', p: ['rv', 'rr', 'an'], d: { pr: 'NU', rv: 70000, rr: 60000 } })}
<h2>Why the TFSA wins more often here</h2>
<p>In a high-tax province, even a small drop in income at retirement opens a gap of several points between the contribution rate and the withdrawal rate. In Nunavut, the steps of the table are lower: the first combined bracket is at ${h.p(K.marginal(40000, 'NU'))}, the next at ${h.p(K.marginal(70000, 'NU'))}. You need to change brackets between working life and retirement for the RRSP to really pay, and many retirees with a pension stay in the same bracket as before. In that case, the RRSP only defers tax with no gain, while the TFSA asks nothing in return. The thresholds at ${h.m(U.brackets[0])} and ${h.m(FD.brackets[0])} deserve special attention: a retiree whose pension and public benefits come close to them will see every RRSP withdrawal above them taxed at ${h.p(K.marginal(60000, 'NU'))}. Keeping part of the savings in a TFSA then makes it possible to top up income without climbing that step.</p>
<h2>The flexibility of the TFSA</h2>
<p>${h.src('rc4466', 'Guide RC4466')} sets out three rules that weigh in the balance. A TFSA withdrawal is never taxed. The amount withdrawn is added back to contribution room on the following January 1, while an RRSP withdrawal gives no room back. And neither TFSA income nor TFSA withdrawals reduce Old Age Security, the Guaranteed Income Supplement or the Canada child benefit. Where the RRSP's tax edge is thin, those three rules are often enough to tip the choice toward the TFSA, at least until income rises above ${h.m(FD.brackets[1])}.</p>
`,
  },
});
