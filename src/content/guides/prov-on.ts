import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const O = K.jur('ON');
const sur = (O.surtax ?? []) as number[][];
// Revenu imposable où chaque palier de surtaxe commence (recherche par pas de 10 $).
const startOf = (thr: number) => { let x = 50000; while (x < 300000 && Math.max(0, K.taxDetail(x, 'ON').provincial - K.taxDetail(x, 'ON').surtax) <= thr) x += 10; return Math.round(x / 10) * 10; };
const s1 = startOf(sur[0][0]), s2 = startOf(sur[1][0]);
const steps = [...K.steps('ON', 260000).map((x) => x.from), s1, s2].sort((a, b) => a - b).map((from) => ({ from, rate: K.marginal(from + 50, 'ON', 50) }));
const ex = [100000, 115000, 130000, 160000];
const contrib10 = (h: { m: (x: number) => string; p: (x: number, d?: number) => string }) => ex.map((i) => { const d = K.taxDetail(i, 'ON'), a = K.taxDetail(i - 10000, 'ON'); return [h.m(i), h.p(K.marginal(i, 'ON')), h.m(d.surtax - a.surtax), h.m(K.saving(i, 10000, 'ON'))]; });
const m130 = K.marginal(130000, 'ON'), b130 = 0.26 + O.rates[2];
const ret = K.compare({ prov: 'ON', income: 130000, save: 8000, years: 20, growth: 0.03, retireIncome: 70000, spread: 20 });

export default defineGuide({
  id: 'prov-on', group: 'prov', order: 41, tool: 'reerCeli',
  toolArg: { pr: 'ON', rv: 130000, rr: 70000 },
  related: ['reer-ou-celi', 'taux-marginal', 'plafond-reer', 'reer-sv-srg', 'prov-qc'],
  sources: ['cra_rates_2026', 't4127_jul'],
  fr: {
    slug: 'reer-ou-celi-ontario',
    nav: 'REER ou CELI en Ontario', card: `La surtaxe de l'Ontario fait grimper le taux marginal au-delà d'environ ${F.m(s1)} : le REER y gagne en ${Y}.`,
    title: `REER ou CELI en Ontario ${Y} : surtaxe et taux marginal`,
    description: `REER ou CELI en Ontario ${Y} : taux de 5,05 % à 13,16 %, surtaxe de 20 % et 36 % qui relève le taux marginal dès environ ${F.m(s1)}. Calcul avec vos chiffres.`,
    h1: `REER ou CELI en Ontario en ${Y} : l'effet de la surtaxe`,
    intro: 'L’Ontario a les taux d’impôt de base parmi les plus bas du pays, mais une surtaxe s’ajoute dès que l’impôt provincial dépasse un seuil. Le simulateur l’applique à votre revenu.',
    resume: `En Ontario, l'impôt provincial de ${Y} part de ${F.r(O.rates[0])} et monte à ${F.r(O.rates[O.rates.length - 1])}, avec un montant personnel de base de ${F.m(O.bpa ?? 0)}. Ces taux affichés ne disent pas tout : une surtaxe de ${F.p(sur[0][1], 0)} s'applique sur l'impôt de base de l'Ontario qui dépasse ${F.m(sur[0][0])}, puis de ${F.p(sur[1][1], 0)} de plus au-delà de ${F.m(sur[1][0])}. En revenu imposable, le premier palier commence vers ${F.m(s1)} et le second vers ${F.m(s2)}. À ${F.m(130000)}, le taux marginal réel atteint ${F.p(m130)}, alors que l'addition des taux de tranche ne donne que ${F.p(b130)}. Pour une cotisation REER, c'est une bonne nouvelle : chaque dollar déduit dans cette zone économise aussi de la surtaxe. Pour un retrait à la retraite, c'est l'inverse : un retraité ontarien dont le revenu dépasse ces seuils paie la surtaxe sur ses retraits de REER ou de FERR, pas sur ceux de son CELI.`,
    faqs: [
      { q: 'Qu’est-ce que la surtaxe de l’Ontario ?', a: `C'est un impôt calculé sur l'impôt. Une fois l'impôt de base de l'Ontario établi, on ajoute ${F.p(sur[0][1], 0)} de la partie qui dépasse ${F.m(sur[0][0])}, puis ${F.p(sur[1][1], 0)} de la partie qui dépasse ${F.m(sur[1][0])}. En ${Y}, cela touche les revenus imposables à partir d'environ ${F.m(s1)}. Elle relève le taux marginal provincial bien au-dessus du taux de tranche affiché.` },
      { q: 'À partir de quel revenu un REER rapporte-t-il le plus en Ontario ?', a: `Le gain par dollar augmente à chaque palier : à ${F.m(60000)} une cotisation économise ${F.p(K.marginal(60000, 'ON'))}, à ${F.m(130000)} elle économise ${F.p(m130)}, surtaxe comprise. Au-delà de ${F.m(K.P.federal.brackets[3])}, le taux fédéral passe à 33 % et l'économie dépasse ${F.p(K.marginal(270000, 'ON'), 0)}.` },
      { q: 'La contribution santé de l’Ontario baisse-t-elle avec une cotisation REER ?', a: 'Oui, en partie. Cette contribution est calculée sur le revenu imposable, qu’une cotisation REER réduit. Elle plafonne toutefois à un montant fixe pour les revenus moyens et élevés, si bien que l’effet disparaît souvent. Le simulateur ne la calcule pas : le gain réel peut être légèrement supérieur au chiffre affiché pour certains revenus modestes.' },
    ],
    body: (h) => `
<h2>Les taux de tranche ne sont pas le taux réel</h2>
<p>Le barème ontarien de ${Y} compte cinq taux : ${O.rates.map((r) => h.r(r)).join(', ')}, avec des seuils à ${O.brackets.map((b) => h.m(b)).join(', ')}. Ajouté au fédéral, il donne des taux combinés modérés jusqu'à un revenu moyen. Puis la surtaxe entre en jeu. Elle ne se lit pas dans le barème : il faut d'abord calculer l'impôt de base de l'Ontario, retrancher le crédit du montant personnel, puis appliquer ${h.p(sur[0][1], 0)} et ${h.p(sur[1][1], 0)} sur les parties qui dépassent ${h.m(sur[0][0])} et ${h.m(sur[1][0])}. Les montants viennent de la ${h.src('cra_rates_2026', 'page des taux 2026 de canada.ca')} et du ${h.src('t4127_jul', 'guide T4127')}.</p>
${h.table(['Revenu imposable à partir de', 'Taux marginal combiné'], steps.map((s) => [h.m(s.from), h.p(s.rate)]), `Où le taux combiné change en Ontario, ${Y}, surtaxe comprise. Les paliers de la surtaxe (vers ${h.m(s1)} et ${h.m(s2)}) sont ajoutés aux seuils officiels des tranches.`, ['l', 'r'])}
<p>Les deux lignes qui ne correspondent à aucun seuil officiel sont celles de la surtaxe : c'est là que le taux saute sans que le barème le montre. À ${h.m(130000)}, par exemple, on est dans la troisième tranche ontarienne et dans la tranche fédérale à 26 %, soit ${h.p(b130)} en additionnant, mais le taux réel est de ${h.p(m130)}.</p>
<h2>Ce que vaut une cotisation de 10 000 $ dans la zone de la surtaxe</h2>
<p>Pour un revenu élevé, la question n'est pas tant REER ou CELI que la taille de la déduction. Une grosse cotisation fait redescendre le revenu sous un palier de surtaxe, et chaque dollar qui en sort rapporte le taux le plus fort.</p>
${h.table(['Revenu imposable', 'Taux marginal', 'Surtaxe évitée', 'Économie totale'], contrib10(h), `Effet d'une cotisation REER de ${h.m(10000)} en Ontario, ${Y}.`, ['l', 'r', 'r', 'r'])}
${h.mini('remboursement', { t: 'Votre remboursement en Ontario', p: ['rv', 'mt'], d: { pr: 'ON', rv: 130000, mt: 10000 } })}
<h2>Le revers à la retraite</h2>
<p>La surtaxe touche aussi les retraités. Une personne qui touche une rente de régime de retraite, le RPC et la Sécurité de la vieillesse, et qui retire en plus de son FERR, peut se retrouver au-dessus du premier palier. Dans l'exemple du simulateur (${h.m(130000)} de revenu aujourd'hui, ${h.m(70000)} prévus à la retraite, ${h.m(8000)} d'épargne par an pendant 20 ans), le REER récupère ${h.p(ret.rateNow)} et ne paie que ${h.p(ret.rateLater)} au retrait : il laisse ${h.m(ret.gap)} de plus que le CELI. Si la retraite prévue était aussi élevée que le revenu actuel, l'écart disparaîtrait. Pour un retraité aisé, retirer plus tôt et étaler les retraits, avant que les rentes ne s'additionnent, évite parfois la zone de surtaxe.</p>
<h2>Cotiser maintenant, déduire plus tard</h2>
<p>Une cotisation REER n'a pas à être déduite l'année où elle est versée : la partie non déduite se reporte, sans limite de temps, à une année où votre revenu sera plus élevé. En Ontario, ce report a une valeur particulière. Une personne qui gagne ${h.m(90000)} cette année, sous le premier palier de surtaxe, et qui attend une promotion à ${h.m(130000)} peut verser dès maintenant et garder la déduction pour l'année de la promotion : elle économisera ${h.p(m130)} par dollar au lieu de ${h.p(K.marginal(90000, 'ON'))}. Pendant ce temps, l'argent croît à l'abri de l'impôt dans le REER.</p>
<h2>Les revenus modestes en Ontario</h2>
<p>Au bas de l'échelle, l'Ontario applique une réduction d'impôt pour les faibles revenus et une contribution santé qui commence à partir d'un revenu modeste. Le simulateur ne calcule ni l'une ni l'autre. Pour un revenu de moins de ${h.m(30000)} environ, le gain réel d'une cotisation REER peut donc différer du chiffre affiché ; c'est aussi le niveau de revenu où le CELI gagne presque toujours, puisque l'impôt économisé est faible.</p>
<h2>À retenir pour l'Ontario</h2>
<p>Entre ${h.m(60000)} et ${h.m(s1)} de revenu, le taux combiné reste proche de celui des autres provinces, et le choix entre REER et CELI dépend surtout du revenu de retraite. Au-delà, la surtaxe rend le REER plus attrayant qu'ailleurs, à condition de prévoir un revenu de retraite qui reste sous les mêmes paliers. Le ${h.a('taux-marginal', 'simulateur de taux marginal')} montre la décomposition fédéral et provincial à votre revenu.</p>
`,
  },
  en: {
    slug: 'rrsp-vs-tfsa-ontario',
    nav: 'RRSP or TFSA in Ontario', card: `Ontario's surtax pushes the marginal rate up from about ${E.m(s1)}: an RRSP gains from it in ${Y}.`,
    title: `RRSP vs TFSA in Ontario ${Y}: surtax and marginal rate`,
    description: `RRSP or TFSA in Ontario ${Y}: rates from 5.05% to 13.16%, plus a 20% and 36% surtax that lifts the marginal rate from about ${E.m(s1)}. Run it with your numbers.`,
    h1: `RRSP or TFSA in Ontario in ${Y}: what the surtax changes`,
    intro: 'Ontario has some of the lowest basic tax rates in the country, but a surtax kicks in once provincial tax passes a threshold. The calculator applies it to your income.',
    resume: `In Ontario, ${Y} provincial tax starts at ${E.r(O.rates[0])} and rises to ${E.r(O.rates[O.rates.length - 1])}, with a basic personal amount of ${E.m(O.bpa ?? 0)}. Those headline rates are not the whole story: a ${E.p(sur[0][1], 0)} surtax applies to Ontario basic tax above ${E.m(sur[0][0])}, and a further ${E.p(sur[1][1], 0)} above ${E.m(sur[1][0])}. In taxable income terms, the first step starts around ${E.m(s1)} and the second around ${E.m(s2)}. At ${E.m(130000)}, the real marginal rate reaches ${E.p(m130)}, while adding up the bracket rates gives only ${E.p(b130)}. For an RRSP contribution, that is good news: every dollar deducted in that zone also saves surtax. For a withdrawal in retirement, it cuts the other way: an Ontario retiree whose income passes those thresholds pays the surtax on RRSP or RRIF withdrawals, not on TFSA withdrawals.`,
    faqs: [
      { q: 'What is the Ontario surtax?', a: `It is a tax on tax. Once Ontario basic tax is worked out, ${E.p(sur[0][1], 0)} of the part above ${E.m(sur[0][0])} is added, then ${E.p(sur[1][1], 0)} of the part above ${E.m(sur[1][0])}. In ${Y}, that affects taxable incomes from about ${E.m(s1)}. It lifts the provincial marginal rate well above the bracket rate you see in the tables.` },
      { q: 'At what income does an RRSP pay off most in Ontario?', a: `The saving per dollar rises at each step of the tax table and of the surtax: at ${E.m(60000)} a contribution saves ${E.p(K.marginal(60000, 'ON'))}, at ${E.m(130000)} it saves ${E.p(m130)}, surtax included. Above ${E.m(K.P.federal.brackets[3])}, the federal rate moves to 33% and the saving goes above ${E.p(K.marginal(270000, 'ON'), 0)}.` },
      { q: 'Does an RRSP contribution lower the Ontario Health Premium?', a: 'Partly. The premium is based on taxable income, which an RRSP contribution reduces. It levels off at a fixed amount for middle and higher incomes, though, so the effect often disappears. The calculator does not compute it: the real saving can be slightly above the figure shown for some modest incomes.' },
    ],
    body: (h) => `
<h2>Bracket rates are not the real rate</h2>
<p>Ontario's ${Y} table has five rates: ${O.rates.map((r) => h.r(r)).join(', ')}, with thresholds at ${O.brackets.map((b) => h.m(b)).join(', ')}. Added to the federal rates, it gives moderate combined rates up to a middle income. Then the surtax comes in. It does not show in the table: you first work out Ontario basic tax, subtract the basic personal credit, then apply ${h.p(sur[0][1], 0)} and ${h.p(sur[1][1], 0)} to the parts above ${h.m(sur[0][0])} and ${h.m(sur[1][0])}. The amounts come from the ${h.src('cra_rates_2026', '2026 rates page on canada.ca')} and the ${h.src('t4127_jul', 'T4127 guide')}.</p>
${h.table(['Taxable income from', 'Combined marginal rate'], steps.map((s) => [h.m(s.from), h.p(s.rate)]), `Where the combined rate changes in Ontario, ${Y}, surtax included. The surtax steps (around ${h.m(s1)} and ${h.m(s2)}) are added to the official bracket thresholds.`, ['l', 'r'])}
<p>The two rows that match no official threshold are the surtax steps: that is where the rate jumps without the table showing it. At ${h.m(130000)}, for example, you are in Ontario's third bracket and the 26% federal bracket, ${h.p(b130)} when added up, but the real rate is ${h.p(m130)}.</p>
<h2>What a $10,000 contribution is worth in the surtax zone</h2>
<p>At higher incomes, the question is less RRSP or TFSA than the size of the deduction. A large contribution pulls income back under a surtax step, and every dollar taken out of it saves the highest rate.</p>
${h.table(['Taxable income', 'Marginal rate', 'Surtax avoided', 'Total saved'], contrib10(h), `Effect of a ${h.m(10000)} RRSP contribution in Ontario, ${Y}.`, ['l', 'r', 'r', 'r'])}
${h.mini('remboursement', { t: 'Your refund in Ontario', p: ['rv', 'mt'], d: { pr: 'ON', rv: 130000, mt: 10000 } })}
<h2>The flip side in retirement</h2>
<p>The surtax reaches retirees too. Someone with a workplace pension, CPP and Old Age Security who also draws on a RRIF can end up above the first step. In the calculator's example (${h.m(130000)} of income now, ${h.m(70000)} expected in retirement, ${h.m(8000)} saved a year for 20 years), the RRSP saves ${h.p(ret.rateNow)} and pays only ${h.p(ret.rateLater)} on withdrawal, leaving ${h.m(ret.gap)} more than the TFSA. If retirement income were as high as today's, the gap would vanish. For a well-off retiree, withdrawing earlier and spreading withdrawals out, before pensions stack up, sometimes keeps income out of the surtax zone.</p>
<h2>Contribute now, deduct later</h2>
<p>An RRSP contribution does not have to be deducted in the year you make it: the undeducted part carries forward, with no time limit, to a year when your income is higher. In Ontario, that carry-forward is worth more than elsewhere. Someone earning ${h.m(90000)} this year, below the first surtax step, who expects a promotion to ${h.m(130000)} can contribute now and keep the deduction for the promotion year: it will save ${h.p(m130)} a dollar instead of ${h.p(K.marginal(90000, 'ON'))}. Meanwhile, the money grows sheltered from tax inside the RRSP. The same logic applies to a bonus year, a year with a large severance payment or a year when a rental property is sold.</p>
<p>The reverse case matters too. In a year with unusually low income, such as parental leave, a sabbatical or a gap between jobs, the deduction is worth far less, and a TFSA contribution keeps more flexibility.</p>
<h2>Modest incomes in Ontario</h2>
<p>At the low end, Ontario applies a low-income tax reduction and a health premium that starts at a modest income. The calculator computes neither. Below roughly ${h.m(30000)} of income, the real saving from an RRSP contribution can therefore differ from the figure shown; that is also the income level where the TFSA nearly always wins, since the tax saved is small.</p>
<h2>The Ontario takeaway</h2>
<p>Between ${h.m(60000)} and ${h.m(s1)} of income, the combined rate stays close to other provinces, and the RRSP or TFSA choice depends mostly on retirement income. Above that, the surtax makes the RRSP more attractive than elsewhere, provided retirement income stays below the same steps. The ${h.a('taux-marginal', 'marginal tax rate calculator')} shows the federal and provincial split at your income.</p>
`,
  },
});
