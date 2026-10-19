import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const N = K.jur('NB');
const FB = K.P.federal.brackets;
type H = { m: (x: number) => string; p: (x: number, d?: number) => string };
// Effet d'une cotisation de 5 000 $ selon le revenu imposable.
const incs = [35000, 50000, 56000, 75000, 110000, 150000, 190000, 230000];
const byIncome = (h: H) => incs.map((i) => { const s = K.saving(i, 5000, 'NB'); return [h.m(i), h.p(K.marginal(i, 'NB')), h.m(s), h.p(s / 5000)]; });
// La zone entre le premier seuil du Nouveau-Brunswick et le premier seuil fédéral.
const zLow = N.brackets[0], zHigh = FB[0];
const back1 = 60000 - zHigh, back2 = 60000 - zLow;
const hi = K.compare({ prov: 'NB', income: 85000, save: 6000, years: 22, growth: 0.03, retireIncome: 40000, spread: 20 });
const lo = K.compare({ prov: 'NB', income: 54000, save: 3000, years: 30, growth: 0.03, retireIncome: 50000, spread: 20 });
const win = (g: number, fr: boolean) => (Math.abs(g) < 1 ? (fr ? 'aucun des deux' : 'neither') : g > 0 ? (fr ? 'le REER' : 'the RRSP') : (fr ? 'le CELI' : 'the TFSA'));
const top = N.rates[N.rates.length - 1], topFrom = N.brackets[N.brackets.length - 1];

export default defineGuide({
  id: 'prov-nb', group: 'prov', order: 47, tool: 'remboursement',
  toolArg: { pr: 'NB', rv: 75000, mt: 5000 },
  related: ['reer-ou-celi', 'remboursement-reer', 'taux-marginal', 'plafond-reer', 'date-limite-reer', 'prov-ns'],
  sources: ['cra_rates_2026', 't4127_jul', 'cra_rrsp_limit'],
  fr: {
    slug: 'reer-ou-celi-nouveau-brunswick',
    nav: 'REER ou CELI au Nouveau-Brunswick', card: `Quatre taux de ${F.r(N.rates[0])} à ${F.r(top)}, montant de base de ${F.m(N.bpa ?? 0)} : ce que rapporte une cotisation REER en ${Y}.`,
    title: `REER ou CELI au Nouveau-Brunswick ${Y} : gain par revenu`,
    description: `REER ou CELI au Nouveau-Brunswick ${Y} : taux de ${F.r(N.rates[0])} à ${F.r(top)}, montant de base de ${F.m(N.bpa ?? 0)}, et gain d'une cotisation de ${F.m(5000)} selon le revenu imposable.`,
    h1: `REER ou CELI au Nouveau-Brunswick en ${Y} : le gain selon votre revenu`,
    intro: 'Entrez votre revenu imposable et le montant que vous pensez verser au REER : le simulateur calcule la baisse de l’impôt fédéral et de l’impôt du Nouveau-Brunswick, avec le barème 2026.',
    resume: `Au Nouveau-Brunswick, l'impôt provincial de ${Y} compte quatre taux : ${N.rates.map((r) => F.r(r)).join(', ')}, avec des seuils à ${N.brackets.map((b) => F.m(b)).join(', ')}, et un montant personnel de base de ${F.m(N.bpa ?? 0)}. Une cotisation REER de ${F.m(5000)} fait baisser l'impôt total de ${F.m(K.saving(50000, 5000, 'NB'))} à ${F.m(50000)} de revenu imposable, de ${F.m(K.saving(75000, 5000, 'NB'))} à ${F.m(75000)} et de ${F.m(K.saving(150000, 5000, 'NB'))} à ${F.m(150000)}. Le taux marginal combiné passe de ${F.p(K.marginal(40000, 'NB'))} dans la première tranche à ${F.p(K.marginal(300000, 'NB'))} au sommet. Une particularité : le premier seuil provincial, ${F.m(zLow)}, arrive avant le premier seuil fédéral, ${F.m(zHigh)}, ce qui crée une courte zone où le taux combiné est de ${F.p(K.marginal(56000, 'NB'))}. Le CELI ne donne aucune déduction, mais ses retraits ne sont jamais imposés : il fait au moins aussi bien quand le taux payé à la retraite sera aussi élevé que le taux récupéré aujourd'hui, et mieux quand il sera plus élevé.`,
    faqs: [
      { q: 'Quels sont les taux d’impôt du Nouveau-Brunswick en 2026 ?', a: `Le Nouveau-Brunswick applique ${F.r(N.rates[0])} jusqu'à ${F.m(N.brackets[0])} de revenu imposable, ${F.r(N.rates[1])} jusqu'à ${F.m(N.brackets[1])}, ${F.r(N.rates[2])} jusqu'à ${F.m(N.brackets[2])}, puis ${F.r(top)} au-delà. Le montant personnel de base est de ${F.m(N.bpa ?? 0)}. Ces taux s'ajoutent à ceux du fédéral, de 14 % à 33 %.` },
      { q: 'Combien rapporte une cotisation REER de 10 000 $ au Nouveau-Brunswick ?', a: `Tout dépend du revenu. À ${F.m(70000)} de revenu imposable, ${F.m(10000)} versés au REER font baisser l'impôt de ${F.m(K.saving(70000, 10000, 'NB'))}. À ${F.m(120000)}, l'économie monte à ${F.m(K.saving(120000, 10000, 'NB'))}, parce qu'une partie de la cotisation sort de la tranche fédérale à 26 %. Le simulateur en haut de page refait le calcul avec vos montants.` },
      { q: 'Une cotisation REER peut-elle me faire changer de tranche au Nouveau-Brunswick ?', a: `Oui, elle réduit le revenu imposable. Une personne à ${F.m(60000)} qui verse ${F.m(back1)} redescend sous le seuil fédéral de ${F.m(zHigh)} ; avec ${F.m(back2)}, elle repasse aussi sous le premier seuil provincial de ${F.m(zLow)}. Chaque dollar déduit est remboursé au taux de la tranche qu'il quitte, pas au taux moyen.` },
      { q: 'À partir de quel revenu paie-t-on 19,5 % au Nouveau-Brunswick ?', a: `Le taux provincial de ${F.r(top)} s'applique à la partie du revenu imposable qui dépasse ${F.m(topFrom)}. Combiné au fédéral, le taux marginal y atteint ${F.p(K.marginal(topFrom + 10000, 'NB'))}, puis ${F.p(K.marginal(270000, 'NB'))} au-delà de ${F.m(FB[3])}. Seule la partie qui dépasse le seuil est imposée à ce taux, jamais le revenu entier.` },
    ],
    body: (h) => `
<h2>Le barème néo-brunswickois de ${Y}</h2>
<p>Le Nouveau-Brunswick a l'un des barèmes les plus simples des provinces de l'Atlantique : quatre taux, ${N.rates.map((r) => h.r(r)).join(', ')}, et trois seuils, ${N.brackets.map((b) => h.m(b)).join(', ')}, d'après la ${h.src('cra_rates_2026', 'page des taux 2026 de l’Agence du revenu du Canada')}. Le montant personnel de base est de ${h.m(N.bpa ?? 0)}, crédité au taux le plus bas. Le ${h.src('t4127_jul', 'guide T4127 de juillet')} n'annonce aucun changement en cours d'année pour la province, si bien que les retenues sur la paie suivent le même barème depuis janvier.</p>
<p>Pour la personne qui épargne, ce barème se lit d'une seule façon : chaque dollar versé au REER fait économiser le taux de la tranche d'où il sort, fédéral et provincial ensemble. C'est ce taux, et non le taux moyen, qui donne la valeur de la déduction.</p>
<h2>Ce que rapportent 5 000 $, revenu par revenu</h2>
<p>Le tableau applique une même cotisation à huit revenus imposables. La dernière colonne divise l'économie par la cotisation : c'est le « rendement immédiat » de la déduction, avant même que l'argent fructifie.</p>
${h.table(['Revenu imposable', 'Taux marginal combiné', `Économie sur ${h.m(5000)}`, 'Taux moyen de l’économie'], byIncome(h), `Baisse de l'impôt fédéral et du Nouveau-Brunswick pour une cotisation REER de ${h.m(5000)}, ${Y}.`, ['l', 'r', 'r', 'r'])}
<p>Deux sauts ressortent. Le premier se produit entre ${h.m(50000)} et ${h.m(75000)}, quand le revenu entre à la fois dans la deuxième tranche provinciale et dans la tranche fédérale à 20,5 %. Le second arrive au-dessus de ${h.m(FB[1])}, où le fédéral passe à 26 %. Une cotisation qui chevauche un seuil, comme à ${h.m(56000)}, rapporte un taux intermédiaire, puisqu'une partie sort d'une tranche et le reste de la suivante.</p>
<h2>Deux seuils à quelques milliers de dollars d'écart</h2>
<p>Le premier seuil du Nouveau-Brunswick, ${h.m(zLow)}, précède de peu le premier seuil fédéral, ${h.m(zHigh)}. Entre les deux, le taux combiné est de ${h.p(K.marginal(56000, 'NB'))} ; au-dessus, il grimpe à ${h.p(K.marginal(62000, 'NB'))}. Prenons un revenu imposable de ${h.m(60000)}. Les ${h.m(back1)} qui dépassent le seuil fédéral sont les plus « chers » : une cotisation de ce montant les fait disparaître et récupère ${h.m(K.saving(60000, back1, 'NB'))}. Pour revenir sous ${h.m(zLow)}, il faut verser ${h.m(back2)}, ce qui fait économiser ${h.m(K.saving(60000, back2, 'NB'))} en tout. Plus bas, chaque dollar ne rapporte plus que ${h.p(K.marginal(45000, 'NB'))}.</p>
<p>Ce découpage sert à doser la cotisation. La partie qui sort des tranches hautes va au REER ; ce qui ne ferait économiser que le premier taux peut aller au CELI, où il restera disponible sans impôt.</p>
${h.mini('reerCeli', { t: 'REER ou CELI avec le barème du Nouveau-Brunswick', p: ['rv', 'ep', 'an'], d: { pr: 'NB', rv: 85000, rr: 40000 } })}
<h2>Le taux à la sortie</h2>
<p>La déduction n'est qu'une moitié du calcul. L'autre est l'impôt payé au retrait, quand l'argent du REER ou du FERR s'ajoute au revenu de retraite. Deux cas néo-brunswickois le montrent. Avec ${h.m(85000)} de revenu, ${h.m(6000)} d'épargne par an pendant 22 ans et ${h.m(40000)} de revenu prévu à la retraite, le REER récupère ${h.p(hi.rateNow)} aujourd'hui et ne paie que ${h.p(hi.rateLater)} plus tard : il laisse ${h.m(hi.rrspNet)} après impôt contre ${h.m(hi.tfsaValue)} au CELI, un avantage de ${h.m(Math.abs(hi.gap))} pour ${win(hi.gap, true)}.</p>
<p>À ${h.m(54000)} de revenu, avec une retraite prévue à ${h.m(50000)}, l'image change. Le taux récupéré n'est que de ${h.p(lo.rateNow)}, et le retrait sera imposé à ${h.p(lo.rateLater)}. L'écart final n'est que de ${h.m(Math.abs(lo.gap))} pour ${win(lo.gap, true)}, alors que le CELI laisse l'argent accessible à tout moment sans toucher au revenu imposable de l'année du retrait.</p>
<h2>Avant de verser : trois chiffres à vérifier</h2>
<p>Le premier est votre maximum déductible au titre des REER, inscrit sur l'avis de cotisation et dans Mon dossier. Il additionne les droits inutilisés et le moins élevé de 18 % du revenu gagné de 2025 et du plafond de ${h.m(K.rrspLimit(Y))}, moins le facteur d'équivalence si vous participez à un régime de retraite, comme l'explique la ${h.src('cra_rrsp_limit', 'page de l’Agence sur le maximum déductible')}. Le deuxième est la date limite : pour l'année ${Y}, 60 jours après la fin de l'année, soit le 1er mars ${Y + 1}. Le troisième est vos droits CELI, que la page ${h.a('reer-ou-celi', 'REER ou CELI')} met en regard du REER pour toutes les provinces.</p>
`,
  },
  en: {
    slug: 'rrsp-vs-tfsa-new-brunswick',
    nav: 'RRSP or TFSA in New Brunswick', card: `Four rates from ${E.r(N.rates[0])} to ${E.r(top)}, a ${E.m(N.bpa ?? 0)} basic amount: what an RRSP contribution saves in ${Y}.`,
    title: `RRSP vs TFSA in New Brunswick ${Y}: tax saved by income`,
    description: `RRSP or TFSA in New Brunswick ${Y}: rates from ${E.r(N.rates[0])} to ${E.r(top)}, a ${E.m(N.bpa ?? 0)} basic personal amount, and what a ${E.m(5000)} RRSP contribution saves at your income.`,
    h1: `RRSP or TFSA in New Brunswick in ${Y}: the saving at each income`,
    intro: 'Enter your taxable income and the amount you plan to put in an RRSP: the calculator works out the drop in federal and New Brunswick tax with the 2026 tax tables.',
    resume: `New Brunswick's ${Y} provincial tax has four rates: ${N.rates.map((r) => E.r(r)).join(', ')}, with thresholds at ${N.brackets.map((b) => E.m(b)).join(', ')}, and a basic personal amount of ${E.m(N.bpa ?? 0)}. A ${E.m(5000)} RRSP contribution cuts total tax by ${E.m(K.saving(50000, 5000, 'NB'))} at ${E.m(50000)} of taxable income, by ${E.m(K.saving(75000, 5000, 'NB'))} at ${E.m(75000)} and by ${E.m(K.saving(150000, 5000, 'NB'))} at ${E.m(150000)}. The combined marginal rate climbs from ${E.p(K.marginal(40000, 'NB'))} in the first bracket to ${E.p(K.marginal(300000, 'NB'))} at the top. One quirk: the first provincial threshold, ${E.m(zLow)}, comes before the first federal threshold, ${E.m(zHigh)}, which creates a short band where the combined rate is ${E.p(K.marginal(56000, 'NB'))}. A TFSA gives no deduction, but its withdrawals are never taxed: it does at least as well when the rate you will pay in retirement is as high as the rate you get back today, and better when it is higher.`,
    faqs: [
      { q: 'What are the New Brunswick income tax rates for 2026?', a: `New Brunswick charges ${E.r(N.rates[0])} up to ${E.m(N.brackets[0])} of taxable income, ${E.r(N.rates[1])} up to ${E.m(N.brackets[1])}, ${E.r(N.rates[2])} up to ${E.m(N.brackets[2])}, then ${E.r(top)} above that. The basic personal amount is ${E.m(N.bpa ?? 0)}. These rates come on top of the federal rates, which run from 14% to 33%.` },
      { q: 'How much tax does a $10,000 RRSP contribution save in New Brunswick?', a: `It depends on income. At ${E.m(70000)} of taxable income, ${E.m(10000)} put into an RRSP lowers tax by ${E.m(K.saving(70000, 10000, 'NB'))}. At ${E.m(120000)}, the saving rises to ${E.m(K.saving(120000, 10000, 'NB'))}, because part of the contribution comes out of the 26% federal bracket. The calculator at the top of the page redoes the sum with your own figures.` },
      { q: 'Can an RRSP contribution move me into a lower bracket in New Brunswick?', a: `Yes, because it reduces taxable income. Someone at ${E.m(60000)} who contributes ${E.m(back1)} drops below the ${E.m(zHigh)} federal threshold; with ${E.m(back2)}, they also fall back under the ${E.m(zLow)} provincial threshold. Each dollar deducted is refunded at the rate of the bracket it leaves, not at your average rate.` },
      { q: 'At what income do you pay 19.5% in New Brunswick?', a: `The ${E.r(top)} provincial rate applies to the part of taxable income above ${E.m(topFrom)}. Combined with the federal rate, the marginal rate there reaches ${E.p(K.marginal(topFrom + 10000, 'NB'))}, then ${E.p(K.marginal(270000, 'NB'))} above ${E.m(FB[3])}. Only the part above the threshold is taxed at that rate, never the whole income.` },
    ],
    body: (h) => `
<h2>New Brunswick's ${Y} tax table</h2>
<p>New Brunswick has one of the simplest tax tables in Atlantic Canada: four rates, ${N.rates.map((r) => h.r(r)).join(', ')}, and three thresholds, ${N.brackets.map((b) => h.m(b)).join(', ')}, according to the ${h.src('cra_rates_2026', 'Canada Revenue Agency 2026 rates page')}. The basic personal amount is ${h.m(N.bpa ?? 0)}, credited at the lowest rate. The ${h.src('t4127_jul', 'July T4127 guide')} lists no mid-year change for the province, so payroll withholding has followed the same table since January.</p>
<p>For a saver, the table reads one way: every dollar put into an RRSP saves the rate of the bracket it comes out of, federal and provincial together. That rate, not your average rate, is what the deduction is worth.</p>
<h2>What $5,000 saves, income by income</h2>
<p>The table applies the same contribution at eight taxable incomes. The last column divides the saving by the contribution: it is the instant return of the deduction, before the money earns anything.</p>
${h.table(['Taxable income', 'Combined marginal rate', `Saved on ${h.m(5000)}`, 'Average rate saved'], byIncome(h), `Drop in federal and New Brunswick tax for a ${h.m(5000)} RRSP contribution, ${Y}.`, ['l', 'r', 'r', 'r'])}
<p>Two jumps stand out. The first comes between ${h.m(50000)} and ${h.m(75000)}, when income enters both the second provincial bracket and the 20.5% federal bracket. The second comes above ${h.m(FB[1])}, where the federal rate moves to 26%. A contribution that straddles a threshold, as at ${h.m(56000)}, earns an in-between rate, since part of it leaves one bracket and the rest leaves the next.</p>
<h2>Two thresholds a few thousand dollars apart</h2>
<p>New Brunswick's first threshold, ${h.m(zLow)}, sits just below the first federal threshold, ${h.m(zHigh)}. Between them, the combined rate is ${h.p(K.marginal(56000, 'NB'))}; above, it climbs to ${h.p(K.marginal(62000, 'NB'))}. Take a taxable income of ${h.m(60000)}. The ${h.m(back1)} above the federal threshold are the most expensive dollars: a contribution of that size removes them and gets back ${h.m(K.saving(60000, back1, 'NB'))}. To get under ${h.m(zLow)}, you would contribute ${h.m(back2)}, saving ${h.m(K.saving(60000, back2, 'NB'))} in all. Below that point, each further dollar only saves ${h.p(K.marginal(45000, 'NB'))}.</p>
<p>That split helps size the contribution. The part that comes out of the higher brackets goes to the RRSP; whatever would only save the lowest rate can go to the TFSA, where it stays available tax-free.</p>
${h.mini('reerCeli', { t: 'RRSP or TFSA with New Brunswick rates', p: ['rv', 'ep', 'an'], d: { pr: 'NB', rv: 85000, rr: 40000 } })}
<h2>The rate on the way out</h2>
<p>The deduction is only half the sum. The other half is the tax paid on withdrawal, when RRSP or RRIF money is added to retirement income. Two New Brunswick cases show it. With ${h.m(85000)} of income, ${h.m(6000)} saved a year for 22 years and ${h.m(40000)} of expected retirement income, the RRSP gets back ${h.p(hi.rateNow)} today and pays only ${h.p(hi.rateLater)} later: it leaves ${h.m(hi.rrspNet)} after tax against ${h.m(hi.tfsaValue)} in the TFSA, an edge of ${h.m(Math.abs(hi.gap))} for ${win(hi.gap, false)}.</p>
<p>At ${h.m(54000)} of income, with retirement income expected at ${h.m(50000)}, the picture shifts. The rate recovered is only ${h.p(lo.rateNow)}, and the withdrawal will be taxed at ${h.p(lo.rateLater)}. The final gap is just ${h.m(Math.abs(lo.gap))} for ${win(lo.gap, false)}, while the TFSA keeps the money available at any time without adding to taxable income in the year you take it out.</p>
<h2>Before you contribute: three figures to check</h2>
<p>The first is your RRSP deduction limit, shown on your notice of assessment and in My Account. It adds unused room to the lesser of 18% of your 2025 earned income and the ${h.m(K.rrspLimit(Y))} dollar limit, minus any pension adjustment if you belong to a workplace plan, as the ${h.src('cra_rrsp_limit', 'CRA page on the deduction limit')} explains. The second is the deadline: for the ${Y} tax year, 60 days after the end of the year, which is March 1, ${Y + 1}. The third is your TFSA room, which the ${h.a('reer-ou-celi', 'RRSP vs TFSA')} page weighs against the RRSP for every province.</p>
`,
  },
});
