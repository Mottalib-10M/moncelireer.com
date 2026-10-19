import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const M = K.jur('MB');
const [ph0, ph1] = M.bpaPhase ?? [200000, 400000];
const extraRate = ((M.bpa ?? 0) * M.rates[0]) / (ph1 - ph0);
const zone = [150000, 190000, 250000, 350000, 420000];
const zrows = (h: { m: (x: number) => string; p: (x: number, d?: number) => string }) => zone.map((i) => {
  const shown = K.split(i, 'MB').total - (i > ph0 && i < ph1 ? extraRate : 0);
  return [h.m(i), h.p(shown), h.p(K.marginal(i, 'MB')), h.m(K.saving(i, 20000, 'MB'))];
});
const c = K.compare({ prov: 'MB', income: 68000, save: 5000, years: 25, growth: 0.03, retireIncome: 42000, spread: 20 });
const top = M.rates[M.rates.length - 1];

export default defineGuide({
  id: 'prov-mb', group: 'prov', order: 44, tool: 'reerCeli',
  toolArg: { pr: 'MB', rv: 68000, rr: 42000 },
  related: ['reer-ou-celi', 'taux-marginal', 'plafond-reer', 'prov-sk', 'prov-on'],
  sources: ['t4127_jan', 't4127_jul', 'mb_budget_2026', 'cra_rates_2026'],
  fr: {
    slug: 'reer-ou-celi-manitoba',
    nav: 'REER ou CELI au Manitoba', card: `Tranches gelées à ${F.m(M.brackets[0])} et ${F.m(M.brackets[1])}, taux de ${F.r(M.rates[0])} à ${F.r(top)} : le REER au Manitoba en ${Y}.`,
    title: `REER ou CELI au Manitoba ${Y} : tranches gelées et taux`,
    description: `REER ou CELI au Manitoba ${Y} : tranches gelées à 47 000 $ et 100 000 $ depuis 2025, taux de 10,8 % à 17,4 %, montant de base réduit au-delà de 200 000 $.`,
    h1: `REER ou CELI au Manitoba en ${Y} : l'effet du gel des tranches`,
    intro: 'Le Manitoba a cessé d’indexer ses tranches d’impôt en 2025 et retire peu à peu le montant de base aux revenus élevés. Le simulateur applique ces deux règles.',
    resume: `Au Manitoba, l'impôt provincial de ${Y} applique trois taux : ${F.r(M.rates[0])} jusqu'à ${F.m(M.brackets[0])}, ${F.r(M.rates[1])} jusqu'à ${F.m(M.brackets[1])}, puis ${F.r(top)}. Ces seuils ne sont plus indexés depuis 2025 : alors que les tranches fédérales montent chaque année avec l'inflation, celles du Manitoba restent fixes, et une part croissante des salaires passe au taux supérieur. Le montant personnel de base de ${F.m(M.bpa ?? 0)} est aussi réduit progressivement entre ${F.m(ph0)} et ${F.m(ph1)} de revenu net, jusqu'à disparaître. Dans cette zone, chaque dollar gagné coûte environ ${F.p(extraRate, 2)} de plus que le taux affiché, et chaque dollar déduit au REER rapporte autant de plus. À ${F.m(68000)}, le taux marginal combiné est de ${F.p(K.marginal(68000, 'MB'))}, l'un des plus élevés de l'Ouest à ce revenu. Une cotisation REER y rapporte donc davantage qu'en Alberta ou en Saskatchewan, et le CELI garde son intérêt pour les revenus sous ${F.m(M.brackets[0])}.`,
    faqs: [
      { q: 'Les tranches d’impôt du Manitoba sont-elles indexées en 2026 ?', a: `Non. Depuis 2025, le Manitoba n'indexe plus ses tranches : elles restent à ${F.m(M.brackets[0])} et ${F.m(M.brackets[1])}, ce que confirment le guide T4127 et le budget provincial de ${Y}. Certaines pages affichent des seuils indexés ; le simulateur retient les seuils non indexés publiés par le Manitoba.` },
      { q: 'Pourquoi mon taux marginal dépasse-t-il le taux de la tranche au Manitoba ?', a: `Entre ${F.m(ph0)} et ${F.m(ph1)} de revenu net, le Manitoba réduit le montant personnel de base de ${F.m(M.bpa ?? 0)} jusqu'à zéro. Le crédit fondant avec chaque dollar gagné, le taux marginal réel dépasse d'environ ${F.p(extraRate, 2)} le taux affiché. Une déduction REER fait l'effet inverse et rapporte ce supplément.` },
      { q: 'À partir de quel revenu paie-t-on 17,4 % au Manitoba ?', a: `Au-delà de ${F.m(M.brackets[1])} de revenu imposable, sans indexation depuis 2025. Ajouté au taux fédéral de 20,5 %, cela donne ${F.p(K.marginal(110000, 'MB'))} à ${F.m(110000)}. Une cotisation REER qui ramène le revenu sous ${F.m(M.brackets[1])} économise ce taux sur chaque dollar déduit.` },
    ],
    body: (h) => `
<h2>Trois taux et des seuils figés</h2>
<p>Le barème manitobain est l'un des plus simples du pays : ${h.r(M.rates[0])}, ${h.r(M.rates[1])} et ${h.r(top)}. Ses seuils, ${h.m(M.brackets[0])} et ${h.m(M.brackets[1])}, sont des chiffres ronds, signe qu'ils ne sont plus indexés. Le ${h.src('t4127_jan', 'guide T4127 de janvier')} l'indique pour ${Y}, et le ${h.src('mb_budget_2026', 'budget 2026 du Manitoba')} n'annonce aucune reprise de l'indexation. La ${h.src('cra_rates_2026', 'page des taux de canada.ca')} affiche pourtant des seuils indexés ; nous avons retenu ceux du gouvernement du Manitoba et du guide de retenues à la source, et le signalons sur la page de méthode.</p>
<h2>Ce que le gel change pour votre épargne</h2>
<p>Quand les tranches fédérales montent avec l'inflation et que celles du Manitoba restent fixes, un salaire qui suit les prix glisse peu à peu vers le taux de ${h.r(M.rates[1])}, puis vers ${h.r(top)}. Pour l'épargne, cela pousse dans le sens du REER : la déduction d'aujourd'hui vaut un peu plus chaque année, et rien n'indique quel sera le barème quand vous retirerez. Le CELI n'est pas touché, ni à l'entrée ni à la sortie.</p>
<h2>La zone de 200 000 $ à 400 000 $</h2>
<p>Au-delà de ${h.m(ph0)} de revenu net, le Manitoba retire progressivement le montant personnel de base, qui s'annule à ${h.m(ph1)}. Le crédit perdu, au taux de ${h.r(M.rates[0])}, s'étale sur ${h.m(ph1 - ph0)} de revenu : environ ${h.p(extraRate, 2)} de taux supplémentaire. C'est peu par dollar, mais c'est un supplément que le barème n'affiche pas.</p>
${h.table(['Revenu imposable', 'Sans la réduction du Manitoba', 'Taux réel', 'Économie sur 20 000 $'], zrows(h), `Taux marginal combiné au Manitoba, ${Y}, avec et sans l'effet de la réduction du montant de base, et économie d'une cotisation REER de ${h.m(20000)}.`, ['l', 'r', 'r', 'r'])}
<p>Une cotisation REER importante, pour un revenu dans cette zone, rapporte le taux le plus élevé du fédéral et du Manitoba, plus ce supplément. Si le revenu de retraite prévu se situe nettement plus bas, le REER est presque toujours le meilleur choix.</p>
${h.mini('remboursement', { t: 'Votre remboursement REER au Manitoba', p: ['rv', 'mt'], d: { pr: 'MB', rv: 120000, mt: 10000 } })}
<h2>Un revenu moyen au Manitoba</h2>
<p>Pour ${h.m(68000)} de revenu, ${h.m(5000)} d'épargne par an pendant 25 ans et ${h.m(42000)} de revenu de retraite prévu, le REER permet de verser ${h.m(c.contribution)} pour le même effort, grâce à un remboursement de ${h.m(c.refund)}. Il laisse à la fin ${h.m(c.rrspNet)} après impôt, contre ${h.m(c.tfsaValue)} pour le CELI. Le taux récupéré est de ${h.p(c.rateNow)}, celui payé au retrait de ${h.p(c.rateLater)}. L'écart vient surtout de la tranche à ${h.r(M.rates[1])} que franchit le salaire, alors que le revenu de retraite reste dans la première.</p>
<h2>Un retraité au Manitoba</h2>
<p>Le gel joue aussi pour les retraités. Une rente de régime de retraite, le RPC et la Sécurité de la vieillesse peuvent, à eux seuls, dépasser le seuil de ${h.m(M.brackets[0])}, qui ne bougera pas. Chaque retrait de FERR est alors imposé à ${h.p(K.marginal(55000, 'MB'))} au lieu de ${h.p(K.marginal(40000, 'MB'))}. Pour un retraité qui dispose à la fois d'un FERR et d'un CELI, puiser dans le CELI les années où le revenu frôle ce seuil évite de franchir la tranche.</p>
<h2>Sous 47 000 $ de revenu</h2>
<p>Dans la première tranche, le taux combiné reste modéré : ${h.p(K.marginal(40000, 'MB'))} à ${h.m(40000)}. Pour une personne qui prévoit un revenu de retraite comparable, une déduction REER ne fait que déplacer l'impôt dans le temps, et le CELI, plus souple, est préférable. C'est aussi le cas de la plupart des jeunes travailleurs, dont le revenu augmentera : les droits REER se reportent, et seront plus utiles une fois la tranche à ${h.r(M.rates[1])} atteinte.</p>
`,
  },
  en: {
    slug: 'rrsp-vs-tfsa-manitoba',
    nav: 'RRSP or TFSA in Manitoba', card: `Brackets frozen at ${E.m(M.brackets[0])} and ${E.m(M.brackets[1])}, rates from ${E.r(M.rates[0])} to ${E.r(top)}: the RRSP in Manitoba for ${Y}.`,
    title: `RRSP vs TFSA in Manitoba ${Y}: frozen brackets and rates`,
    description: `RRSP or TFSA in Manitoba ${Y}: brackets frozen at $47,000 and $100,000 since 2025, rates from 10.8% to 17.4%, and a basic amount clawed back above $200,000.`,
    h1: `RRSP or TFSA in Manitoba in ${Y}: what frozen brackets do`,
    intro: 'Manitoba stopped indexing its tax brackets in 2025 and gradually takes the basic amount away from high incomes. The calculator applies both rules.',
    resume: `In Manitoba, ${Y} provincial tax has three rates: ${E.r(M.rates[0])} up to ${E.m(M.brackets[0])}, ${E.r(M.rates[1])} up to ${E.m(M.brackets[1])}, then ${E.r(top)}. Those thresholds have not been indexed since 2025: while federal brackets rise with inflation every year, Manitoba's stay put, and a growing share of wages moves into the higher rate. On top of that, the ${E.m(M.bpa ?? 0)} basic personal amount is phased out between ${E.m(ph0)} and ${E.m(ph1)} of net income, until it disappears. In that range, each dollar earned costs about ${E.p(extraRate, 2)} more than the headline rate, and each dollar deducted in an RRSP saves that much more. At ${E.m(68000)}, the combined marginal rate is ${E.p(K.marginal(68000, 'MB'))}, one of the highest in the West at that income. An RRSP contribution therefore saves more than in Alberta or Saskatchewan, while the TFSA keeps its appeal for incomes under ${E.m(M.brackets[0])}.`,
    faqs: [
      { q: 'Are Manitoba tax brackets indexed in 2026?', a: `No. Since 2025, Manitoba no longer indexes its brackets: they stay at ${E.m(M.brackets[0])} and ${E.m(M.brackets[1])}, as the T4127 guide and the ${Y} provincial budget confirm. Some pages, including a canada.ca rates page, show indexed thresholds; the calculator uses the unindexed thresholds published by Manitoba.` },
      { q: 'Why is my marginal rate above the bracket rate in Manitoba?', a: `Between ${E.m(ph0)} and ${E.m(ph1)} of net income, Manitoba reduces the ${E.m(M.bpa ?? 0)} basic personal amount to zero. As the credit shrinks with each dollar earned, the real marginal rate runs about ${E.p(extraRate, 2)} above the headline rate. An RRSP deduction works the other way and saves that extra.` },
      { q: 'At what income do you pay 17.4% in Manitoba?', a: `Above ${E.m(M.brackets[1])} of taxable income, with no indexing since 2025. Added to the 20.5% federal rate, that gives ${E.p(K.marginal(110000, 'MB'))} at ${E.m(110000)}. An RRSP contribution that brings taxable income back under ${E.m(M.brackets[1])} saves that full combined rate on every dollar deducted.` },
    ],
    body: (h) => `
<h2>Three rates and fixed thresholds</h2>
<p>Manitoba's table is one of the simplest in the country: ${h.r(M.rates[0])}, ${h.r(M.rates[1])} and ${h.r(top)}. Its thresholds, ${h.m(M.brackets[0])} and ${h.m(M.brackets[1])}, are round numbers, a sign that they are no longer indexed. The ${h.src('t4127_jan', 'January T4127 guide')} says so for ${Y}, and the ${h.src('mb_budget_2026', 'Manitoba 2026 budget')} announces no return to indexing. The ${h.src('cra_rates_2026', 'canada.ca rates page')} nevertheless shows indexed thresholds; we use those of the Manitoba government and the payroll guide, and flag the point on the method page.</p>
<h2>What the freeze means for your savings</h2>
<p>When federal brackets rise with inflation and Manitoba's stay fixed, a salary that keeps pace with prices slides toward the ${h.r(M.rates[1])} rate, then toward ${h.r(top)}. For saving, that tilts toward the RRSP: today's deduction is worth a little more each year, and nobody knows what the table will be when you withdraw. The TFSA is unaffected, going in or coming out.</p>
<h2>The $200,000 to $400,000 range</h2>
<p>Above ${h.m(ph0)} of net income, Manitoba gradually takes away the basic personal amount, which reaches zero at ${h.m(ph1)}. The lost credit, at the ${h.r(M.rates[0])} rate, is spread over ${h.m(ph1 - ph0)} of income: about ${h.p(extraRate, 2)} of extra rate. Small per dollar, but it is an extra the tax table does not show.</p>
${h.table(['Taxable income', 'Without Manitoba’s phase-out', 'Real rate', 'Saved on $20,000'], zrows(h), `Combined marginal rate in Manitoba, ${Y}, with and without the basic amount phase-out, and the tax saved by a ${h.m(20000)} RRSP contribution.`, ['l', 'r', 'r', 'r'])}
<p>A large RRSP contribution, for an income in that range, saves the top federal and Manitoba rates plus that extra. If expected retirement income sits well below, the RRSP is almost always the better choice.</p>
${h.mini('remboursement', { t: 'Your RRSP refund in Manitoba', p: ['rv', 'mt'], d: { pr: 'MB', rv: 120000, mt: 10000 } })}
<h2>A middle income in Manitoba</h2>
<p>On ${h.m(68000)} of income, saving ${h.m(5000)} a year for 25 years with ${h.m(42000)} of expected retirement income, the RRSP lets you put in ${h.m(c.contribution)} for the same effort, thanks to a ${h.m(c.refund)} refund. At the end it leaves ${h.m(c.rrspNet)} after tax, against ${h.m(c.tfsaValue)} in the TFSA. The rate saved is ${h.p(c.rateNow)}, the rate paid on withdrawal ${h.p(c.rateLater)}. Most of the gap comes from the ${h.r(M.rates[1])} bracket the salary reaches, while retirement income stays in the first one.</p>
<h2>Retired in Manitoba</h2>
<p>The freeze matters for retirees too. A workplace pension, CPP and Old Age Security can on their own pass the ${h.m(M.brackets[0])} threshold, which will not move. Each RRIF withdrawal is then taxed at ${h.p(K.marginal(55000, 'MB'))} instead of ${h.p(K.marginal(40000, 'MB'))}. For a retiree with both a RRIF and a TFSA, drawing on the TFSA in years when income sits just under that threshold avoids crossing into the next bracket. Minimum RRIF withdrawals still have to come out each year, so the room to manoeuvre lies in any amount above the minimum.</p>
<p>The same reasoning applies before retirement, in reverse. Someone whose salary is just above ${h.m(M.brackets[1])} can bring taxable income back under it with an RRSP contribution and save ${h.p(K.marginal(105000, 'MB'))} on each dollar, one of the highest rates for that income band in the West. Because the threshold is frozen, the band between it and your salary is likely to widen year after year if your pay rises with prices.</p>
<h2>Below $47,000 of income</h2>
<p>In the first bracket, the combined rate stays moderate: ${h.p(K.marginal(40000, 'MB'))} at ${h.m(40000)}. For someone who expects a similar retirement income, an RRSP deduction only shifts tax in time, and the more flexible TFSA is the better fit. The same goes for most young workers whose pay will rise: RRSP room carries forward and will be more useful once the ${h.r(M.rates[1])} bracket is reached.</p>
`,
  },
});
