import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const A = K.jur('AB');
const low = A.rates[0], lowTo = A.brackets[0];
const incs = [40000, 60000, 90000, 130000, 200000];
const nb = (h: { m: (x: number) => string; p: (x: number, d?: number) => string }) => incs.map((i) => [h.m(i), h.p(K.marginal(i, 'AB')), h.p(K.marginal(i, 'BC')), h.p(K.marginal(i, 'SK'))]);
const zero = (p: 'AB' | 'ON') => { let x = 10000; while (K.taxDetail(x, p).provincial <= 0) x += 50; return x; };
const abZero = zero('AB'), onZero = zero('ON');
const stay = K.compare({ prov: 'AB', income: 110000, save: 7000, years: 20, growth: 0.03, retireIncome: 50000, spread: 20 });
const move = K.compare({ prov: 'AB', retireProv: 'NS', income: 110000, save: 7000, years: 20, growth: 0.03, retireIncome: 50000, spread: 20 });

export default defineGuide({
  id: 'prov-ab', group: 'prov', order: 43, tool: 'reerCeli',
  toolArg: { pr: 'AB', rv: 110000, rr: 50000 },
  related: ['reer-ou-celi', 'taux-marginal', 'retrait-reer', 'prov-bc', 'prov-sk'],
  sources: ['cra_rates_2026', 't4127_jul'],
  fr: {
    slug: 'reer-ou-celi-alberta',
    nav: 'REER ou CELI en Alberta', card: `Tranche de ${F.r(low)} jusqu'à ${F.m(lowTo)}, montant de base de ${F.m(A.bpa ?? 0)} : le calcul REER albertain de ${Y}.`,
    title: `REER ou CELI en Alberta ${Y} : tranche à 8 % et retrait`,
    description: `REER ou CELI en Alberta ${Y} : tranche à 8 % jusqu'à 61 200 $, montant de base de 22 769 $, taux combinés bas et effet d'une retraite dans une autre province.`,
    h1: `REER ou CELI en Alberta en ${Y} : des taux bas, un choix différent`,
    intro: 'L’Alberta impose peu les revenus moyens. Une déduction REER y vaut donc moins qu’ailleurs, et la province où vous prendrez votre retraite peut tout changer.',
    resume: `L'Alberta a créé en 2025 une tranche à ${F.r(low)} pour les premiers ${F.m(lowTo)} de revenu imposable, sous les taux de ${A.rates.slice(1).map((r) => F.r(r)).join(', ')}. Avec un montant personnel de base de ${F.m(A.bpa ?? 0)}, le plus élevé des provinces, aucun impôt provincial n'est dû sous environ ${F.m(abZero)} de revenu, contre ${F.m(onZero)} en Ontario. Résultat : à ${F.m(60000)}, le taux marginal combiné n'est que de ${F.p(K.marginal(60000, 'AB'))}, et une cotisation REER rembourse moins qu'en Colombie-Britannique ou en Saskatchewan pour la plupart des revenus moyens. Cela ne condamne pas le REER : si votre revenu de retraite sera faible, le retrait sera imposé encore moins. Mais le CELI gagne plus souvent ici qu'ailleurs au pays. Un point mérite attention : l'impôt d'un retrait se calcule selon la province où vous habitez le 31 décembre de l'année du retrait. Déduire en Alberta puis retirer dans une province plus imposée réduit l'avantage du REER.`,
    faqs: [
      { q: 'Depuis quand l’Alberta a-t-elle une tranche à 8 % ?', a: `Depuis l'année d'imposition 2025. Elle s'applique aux premiers ${F.m(lowTo)} de revenu imposable en ${Y} ; le taux de 10 % ne commence qu'au-delà. Comme le crédit du montant personnel de base se calcule au taux le plus bas, il vaut désormais ${F.p(low, 0)} de ${F.m(A.bpa ?? 0)}, soit environ ${F.m((A.bpa ?? 0) * low)}.` },
      { q: 'Un REER vaut-il la peine en Alberta avec des taux aussi bas ?', a: `Oui, si votre taux au retrait sera plus bas que votre taux d'aujourd'hui. À ${F.m(130000)}, la déduction vaut ${F.p(K.marginal(130000, 'AB'))} en Alberta, ce qui reste élevé. À ${F.m(45000)}, elle ne vaut que ${F.p(K.marginal(45000, 'AB'))}, et un retraité au même revenu paierait le même taux : le CELI est alors plus simple et plus souple.` },
      { q: 'Que se passe-t-il si je prends ma retraite hors de l’Alberta ?', a: 'Vos retraits de REER ou de FERR seront imposés selon les taux de la province où vous habitez le 31 décembre de chaque année de retrait, pas selon ceux de l’Alberta. Si cette province impose davantage, une partie de l’avantage obtenu en déduisant en Alberta disparaît. Les retraits de CELI, eux, ne sont imposés nulle part au Canada.' },
    ],
    body: (h) => `
<h2>Le barème albertain de ${Y}</h2>
<p>L'Alberta applique six taux : ${A.rates.map((r) => h.r(r)).join(', ')}, avec des seuils à ${A.brackets.map((b) => h.m(b)).join(', ')}, selon la ${h.src('cra_rates_2026', 'page des taux 2026 de canada.ca')}. La tranche à ${h.r(low)} a été ajoutée en 2025 sous l'ancien taux unique de départ de 10 %. Le montant personnel de base, ${h.m(A.bpa ?? 0)}, est le plus élevé des dix provinces ; il est crédité au taux le plus bas, ce que confirme le ${h.src('t4127_jul', 'guide T4127')}.</p>
<h2>Comparé aux voisins de l'Ouest</h2>
<p>La meilleure façon de voir ce que vaut une déduction REER en Alberta est de la comparer aux provinces voisines, au même revenu. Les écarts sont nets dans les revenus moyens, et se resserrent en haut de l'échelle.</p>
${h.table(['Revenu imposable', 'Alberta', 'Colombie-Britannique', 'Saskatchewan'], nb(h), `Taux marginal combiné (fédéral et provincial), ${Y}. C'est l'impôt économisé par dollar de cotisation REER.`, ['l', 'r', 'r', 'r'])}
<p>Jusqu'à ${h.m(lowTo)}, la tranche à ${h.r(low)} garde l'Alberta parmi les taux les plus bas. Au-delà de ${h.m(K.P.federal.brackets[1])}, c'est surtout le fédéral qui fait monter le taux, et l'écart avec les voisins se réduit.</p>
${h.mini('reerCeli', { t: 'REER ou CELI avec les taux de l’Alberta', p: ['rv', 'ep', 'rr'], d: { pr: 'AB', rv: 60000, rr: 40000 } })}
<h2>Déduire en Alberta, retirer ailleurs</h2>
<p>Beaucoup de personnes travaillent en Alberta une partie de leur carrière, puis s'installent dans une autre province. L'impôt sur un retrait de REER ou de FERR suit la province de résidence au 31 décembre de l'année du retrait. Prenons ${h.m(110000)} de revenu, ${h.m(7000)} d'épargne par an pendant 20 ans et ${h.m(50000)} de revenu de retraite. En restant en Alberta, le REER laisse ${h.m(stay.rrspNet)} après impôt contre ${h.m(stay.tfsaValue)} au CELI. Si la retraite se passe en Nouvelle-Écosse, le même REER ne laisse que ${h.m(move.rrspNet)}, parce que le taux au retrait passe de ${h.p(stay.rateLater)} à ${h.p(move.rateLater)}. Le simulateur ci-dessus a un champ « Province à la retraite » dans ses options pour faire ce calcul.</p>
<p>L'inverse est vrai aussi : déduire dans une province très imposée puis retirer en Alberta augmente l'avantage du REER. Le CELI ne dépend d'aucune de ces hypothèses, puisque ses retraits ne sont imposés nulle part.</p>
<h2>Quand le CELI l'emporte en Alberta</h2>
<p>Sous environ ${h.m(abZero)} de revenu imposable, l'impôt provincial est nul, et la déduction REER ne vaut que la part fédérale. Entre ce seuil et ${h.m(lowTo)}, elle vaut environ ${h.p(K.marginal(50000, 'AB'))}. Si vous prévoyez une rente de régime de retraite, le RPC et la Sécurité de la vieillesse qui vous placeront dans la même tranche à la retraite, le REER n'apporte alors qu'un report d'impôt sans gain, alors que le CELI garde l'argent accessible sans impôt à tout moment. C'est aussi le cas d'un jeune travailleur dont le revenu augmentera : mieux vaut souvent remplir le CELI maintenant et garder ses droits REER, qui se reportent, pour les années mieux payées.</p>
<h2>Une retraite modeste en Alberta</h2>
<p>Le montant personnel de base élevé a un effet utile à la retraite. Un retraité albertain dont le revenu total reste sous ${h.m(A.bpa ?? 0)} ne paie aucun impôt provincial, et sous ${h.m(K.P.federal.bpaMax)} aucun impôt fédéral, avant même le montant en raison de l'âge que le simulateur ne compte pas. Des retraits de REER modestes peuvent donc sortir presque sans impôt. La limite est ailleurs : sous ${h.m(K.P.benefits.gis.singleMax)} de revenu, chaque dollar retiré d'un REER réduit le Supplément de revenu garanti, ce qui n'est pas le cas d'un retrait de CELI.</p>
`,
  },
  en: {
    slug: 'rrsp-vs-tfsa-alberta',
    nav: 'RRSP or TFSA in Alberta', card: `An ${E.r(low)} bracket up to ${E.m(lowTo)} and a ${E.m(A.bpa ?? 0)} basic amount: the Alberta RRSP math for ${Y}.`,
    title: `RRSP vs TFSA in Alberta ${Y}: 8% bracket and withdrawals`,
    description: `RRSP or TFSA in Alberta ${Y}: 8% bracket up to $61,200, a $22,769 basic personal amount, low combined rates and what changes if you retire in another province.`,
    h1: `RRSP or TFSA in Alberta in ${Y}: low rates, a different choice`,
    intro: 'Alberta taxes middle incomes lightly. An RRSP deduction is therefore worth less here than elsewhere, and the province where you retire can change everything.',
    resume: `Alberta created an ${E.r(low)} bracket in 2025 for the first ${E.m(lowTo)} of taxable income, below rates of ${A.rates.slice(1).map((r) => E.r(r)).join(', ')}. With a basic personal amount of ${E.m(A.bpa ?? 0)}, the highest of the provinces, no provincial tax is due below about ${E.m(abZero)} of income, against ${E.m(onZero)} in Ontario. The result: at ${E.m(60000)}, the combined marginal rate is only ${E.p(K.marginal(60000, 'AB'))}, and an RRSP contribution saves less than in British Columbia or Saskatchewan for most middle incomes. That does not rule out the RRSP: if your retirement income will be low, the withdrawal will be taxed even less. But the TFSA wins more often here than elsewhere in Canada. One point deserves attention: tax on a withdrawal depends on the province where you live on December 31 of the year you withdraw. Deducting in Alberta and then withdrawing in a higher-tax province shrinks the RRSP's advantage.`,
    faqs: [
      { q: 'Since when has Alberta had an 8% tax bracket?', a: `Since the 2025 tax year. It applies to the first ${E.m(lowTo)} of taxable income in ${Y}; the 10% rate only starts above that. Because the basic personal credit is worked out at the lowest rate, it is now worth ${E.p(low, 0)} of ${E.m(A.bpa ?? 0)}, about ${E.m((A.bpa ?? 0) * low)}.` },
      { q: 'Is an RRSP worth it in Alberta with such low tax rates?', a: `Yes, if your rate on withdrawal will be lower than your rate today. At ${E.m(130000)}, the deduction is worth ${E.p(K.marginal(130000, 'AB'))} in Alberta, which is still high. At ${E.m(45000)}, it is worth only ${E.p(K.marginal(45000, 'AB'))}, and a retiree at the same income would pay the same rate: the TFSA is then simpler and more flexible.` },
      { q: 'What happens if I retire outside Alberta?', a: 'Your RRSP or RRIF withdrawals will be taxed at the rates of the province where you live on December 31 of each withdrawal year, not at Alberta’s. If that province taxes more, part of the advantage you gained by deducting in Alberta disappears. TFSA withdrawals are not taxed anywhere in Canada, so they carry no such risk.' },
    ],
    body: (h) => `
<h2>Alberta's ${Y} tax table</h2>
<p>Alberta applies six rates: ${A.rates.map((r) => h.r(r)).join(', ')}, with thresholds at ${A.brackets.map((b) => h.m(b)).join(', ')}, according to the ${h.src('cra_rates_2026', '2026 rates page on canada.ca')}. The ${h.r(low)} bracket was added in 2025 below what used to be a 10% starting rate. The basic personal amount, ${h.m(A.bpa ?? 0)}, is the highest of the ten provinces; it is credited at the lowest rate, as the ${h.src('t4127_jul', 'T4127 guide')} confirms.</p>
<h2>Compared with its western neighbours</h2>
<p>The clearest way to see what an RRSP deduction is worth in Alberta is to set it against neighbouring provinces at the same income. The gaps are wide in the middle and narrow at the top.</p>
${h.table(['Taxable income', 'Alberta', 'British Columbia', 'Saskatchewan'], nb(h), `Combined marginal rate (federal and provincial), ${Y}. This is the tax saved per dollar of RRSP contribution.`, ['l', 'r', 'r', 'r'])}
<p>Up to ${h.m(lowTo)}, the ${h.r(low)} bracket keeps Alberta among the lowest rates. Above ${h.m(K.P.federal.brackets[1])}, it is mostly the federal rate that pushes the combined rate up, and the gap with the neighbours narrows.</p>
${h.mini('reerCeli', { t: 'RRSP or TFSA with Alberta rates', p: ['rv', 'ep', 'rr'], d: { pr: 'AB', rv: 60000, rr: 40000 } })}
<h2>Deduct in Alberta, withdraw elsewhere</h2>
<p>Many people work in Alberta for part of their career and then settle in another province. Tax on an RRSP or RRIF withdrawal follows the province you live in on December 31 of the withdrawal year. Take ${h.m(110000)} of income, ${h.m(7000)} saved a year for 20 years and ${h.m(50000)} of retirement income. Staying in Alberta, the RRSP leaves ${h.m(stay.rrspNet)} after tax against ${h.m(stay.tfsaValue)} in the TFSA. Retiring in Nova Scotia, the same RRSP leaves only ${h.m(move.rrspNet)}, because the rate on withdrawal goes from ${h.p(stay.rateLater)} to ${h.p(move.rateLater)}. The calculator above has a "Province in retirement" field in its options to run this.</p>
<p>The reverse holds too: deducting in a high-tax province and withdrawing in Alberta increases the RRSP's advantage. The TFSA depends on none of these assumptions, since its withdrawals are taxed nowhere.</p>
<h2>When the TFSA wins in Alberta</h2>
<p>Below about ${h.m(abZero)} of taxable income, provincial tax is zero, and an RRSP deduction is worth only the federal part. Between that point and ${h.m(lowTo)}, it is worth about ${h.p(K.marginal(50000, 'AB'))}. If you expect a workplace pension, CPP and Old Age Security that will keep you in the same bracket in retirement, the RRSP only defers tax without a gain, while the TFSA keeps the money available tax-free at any time. The same goes for a young worker whose income will rise: it often makes sense to fill the TFSA now and keep RRSP room, which carries forward, for better-paid years.</p>
<h2>A modest retirement in Alberta</h2>
<p>The high basic personal amount has a useful effect in retirement. An Alberta retiree whose total income stays below ${h.m(A.bpa ?? 0)} pays no provincial tax, and below ${h.m(K.P.federal.bpaMax)} no federal tax, even before the age amount, which the calculator does not count. Modest RRSP withdrawals can therefore come out almost tax-free. The limit lies elsewhere: below ${h.m(K.P.benefits.gis.singleMax)} of income, every dollar drawn from an RRSP reduces the Guaranteed Income Supplement, which a TFSA withdrawal does not.</p>
<p>For someone still working, the practical rule is short. Check your marginal rate in the table above, estimate the income you will have at 65 or 70 from your pension statements, and compare the two. When the gap is small, the TFSA's flexibility usually settles it; when today's rate is clearly higher, the RRSP pays, as long as you save the refund rather than spend it.</p>
`,
  },
});
