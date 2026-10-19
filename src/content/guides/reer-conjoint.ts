import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Prov } from '../../lib/engine/tax';

const F = K.fr, E = K.en, Y = K.YEAR;
const ATT = K.P.rrsp.spousalAttributionYears;
const free = K.spousalFree(Y);
// Couple à la retraite : 90 000 $ de revenu imposable à se partager, selon qui détient le REER.
const TOTAL = 90000;
const splits = [[70000, 20000], [60000, 30000], [50000, 40000], [45000, 45000]];
const pair = (a: number, b: number, p: Prov) => K.tax(a, p) + K.tax(b, p);
const onUneven = pair(70000, 20000, 'ON'), onEven = pair(45000, 45000, 'ON');
const qcUneven = pair(70000, 20000, 'QC'), qcEven = pair(45000, 45000, 'QC');
const gainOn = onUneven - onEven, gainQc = qcUneven - qcEven;
const rowsFor = (f: typeof F) => splits.map(([a, b]) => [`${f.m(a)} / ${f.m(b)}`, f.m(pair(a, b, 'ON')), f.m(pair(a, b, 'QC'))]);
// Taux marginaux des deux conjoints dans le cas inégal.
const mHigh = K.marginal(70000, 'ON'), mLow = K.marginal(20000, 'ON');
// Retrait de 20 000 $ trop tôt : imposé chez le cotisant (50 000 $ d'autres revenus) plutôt que chez le conjoint (20 000 $).
const early = K.wtax(50000, 20000, 'ON'), onTime = K.wtax(20000, 20000, 'ON');

export default defineGuide({
  id: 'reer-conjoint', group: 'reer', order: 16, tool: 'conjoint',
  related: ['plafond-reer', 'retrait-reer', 'reer-sv-srg', 'taux-marginal', 'reer-ou-celi'],
  sources: ['cra_spousal', 'cra_rrsp_limit', 'cra_rates_2026'],
  fr: {
    slug: 'reer-conjoint',
    nav: 'REER de conjoint', card: `Cotiser au REER de son époux ou conjoint de fait avec ses propres droits, et la règle des ${ATT} années avant un retrait.`,
    title: `REER de conjoint ${Y} : règle des 3 ans et gain d'impôt`,
    description: `REER de conjoint ${Y} : vous cotisez avec vos droits, votre conjoint retire et paie l'impôt, sauf cotisation l'année du retrait ou les 2 années précédentes.`,
    h1: `REER de conjoint ${Y} : comment fonctionne la règle des trois ans ?`,
    intro: 'Choisissez l’année de votre dernière cotisation au REER de votre conjoint et l’année du retrait prévu : le simulateur dit qui sera imposé sur le retrait.',
    resume: `Un REER de conjoint appartient à votre époux ou conjoint de fait, mais c'est vous qui y versez l'argent et qui déduisez la cotisation, dans la limite de votre propre maximum déductible. Plus tard, les retraits sont imposés au nom du conjoint, souvent à un taux plus bas. Une exception freine les allers-retours : si vous avez cotisé à un REER de conjoint l'année du retrait ou l'une des deux années précédentes, le montant retiré est ajouté à votre revenu, pas au sien. Après une dernière cotisation en ${Y}, un retrait n'est imposé au conjoint qu'à partir de ${free}. Le gain vient de l'écart entre les deux revenus à la retraite : en Ontario, un couple qui touche ${F.m(70000)} et ${F.m(20000)} paie ${F.m(onUneven)} d'impôt en ${Y}, contre ${F.m(onEven)} s'il se partage ${F.m(TOTAL)} à parts égales, soit ${F.m(gainOn)} de moins chaque année. Au Québec, l'écart atteint ${F.m(gainQc)}.`,
    faqs: [
      { q: 'Qui paie l’impôt sur un retrait de REER de conjoint ?', a: `En principe le titulaire du régime, c'est-à-dire le conjoint qui reçoit l'argent. Mais si le cotisant a versé quoi que ce soit dans un REER de conjoint l'année du retrait ou l'une des deux années précédentes, tout ou partie du montant revient dans le revenu du cotisant. Le titulaire remplit le formulaire T2205 pour faire le partage. L'impôt retenu reste réclamé par la personne au nom de qui le feuillet est émis.` },
      { q: 'Combien de temps attendre avant de retirer d’un REER de conjoint ?', a: `Il faut que trois années civiles se suivent sans aucune cotisation de votre part à un REER de conjoint : l'année du retrait et les deux précédentes. Avec une dernière cotisation en ${Y}, le premier retrait imposé au conjoint peut se faire en ${free}. Une seule cotisation en ${Y + 1} repousse cette date à ${K.spousalFree(Y + 1)}. Ce sont les cotisations à tous les REER de conjoint qui comptent, pas seulement celles du compte dont on retire.` },
      { q: 'Peut-on cotiser au REER de son conjoint après 71 ans ?', a: `Oui, si votre conjoint est plus jeune. L'Agence du revenu du Canada admet les cotisations au REER d'un époux ou conjoint de fait jusqu'au 31 décembre de l'année de ses 71 ans à lui, et non des vôtres. Il faut encore avoir des droits : la cotisation est déduite de votre maximum, qui ne se renouvelle que si vous avez un revenu gagné l'année précédente.` },
      { q: 'Les retraits minimums d’un FERR de conjoint sont-ils visés par la règle des trois ans ?', a: `Non. Pour un FERR qui a reçu des sommes d'un REER de conjoint, seule la partie retirée au-delà du minimum de l'année peut revenir dans le revenu du cotisant. Le minimum est imposé au titulaire même si le cotisant a versé récemment à un REER de conjoint. C'est une façon de commencer à toucher l'épargne du couple sans attendre trois ans.` },
    ],
    body: (h) => `
<h2>Qui cotise, qui déduit, à qui appartient le compte</h2>
<p>Un REER de conjoint est un REER ouvert au nom de votre époux ou conjoint de fait, auquel vous versez de l'argent. Le compte et les placements sont les siens : lui seul peut faire des retraits. La déduction, elle, est la vôtre. Elle passe par votre maximum déductible, qui couvre ensemble vos cotisations à votre propre REER et au REER de votre conjoint, selon la ${h.src('cra_rrsp_limit', 'page de l’Agence sur le maximum déductible')}. Votre conjoint garde ses propres droits intacts pour son REER à lui. Si le total de vos versements dépasse votre maximum, l'excédent est traité comme pour un REER ordinaire : voir ${h.a('excedent-reer', 'cotisation excédentaire au REER')}.</p>
<p>Vous pouvez y cotiser jusqu'au 31 décembre de l'année des 71 ans de votre conjoint, même si vous êtes plus âgé. Au décès du cotisant, son représentant légal peut encore verser au REER du conjoint survivant dans l'année du décès ou les 60 jours suivants, et la cotisation se déduit dans la dernière déclaration du défunt.</p>
<h2>La règle des trois années</h2>
<p>Sans garde-fou, on pourrait verser au REER du conjoint en décembre, déduire à un taux élevé, puis le faire retirer en janvier à un taux bas. La loi l'empêche : selon la ${h.src('cra_spousal', 'page de l’Agence sur les REER de conjoint')}, un retrait est ajouté au revenu du cotisant s'il a cotisé à un REER de conjoint l'année du retrait ou l'une des deux années précédentes. Le conjoint qui retire remplit le formulaire T2205 pour calculer la part que chacun déclare.</p>
${h.table(['Dernière cotisation', 'Années « bloquées »', 'Premier retrait imposé au conjoint'], [Y - 1, Y, Y + 1].map((c) => [String(c), `${c}, ${c + 1}, ${c + 2}`, String(K.spousalFree(c))]), `Règle de ${ATT} années civiles : l'année du retrait et les deux précédentes ne doivent compter aucune cotisation.`, ['l', 'l', 'r'])}
<p>La règle vise toutes vos cotisations à un REER de conjoint, pas seulement le compte dont on retire. Elle touche aussi les sommes transférées d'un REER de conjoint vers le CELIAPP du conjoint, considérées comme un retrait imposable. Pour un FERR qui a reçu des fonds d'un REER de conjoint, seule la partie retirée au-delà du minimum annuel est visée.</p>
<h2>Ce qu'un retrait trop tôt coûte</h2>
<p>Prenons un cotisant de l'Ontario qui gagne ${h.m(50000)} et dont le conjoint a ${h.m(20000)} de revenu. Un retrait de ${h.m(20000)} fait dans la période bloquée s'ajoute au revenu du cotisant : environ ${h.m(early)} d'impôt en ${Y}. Fait une fois la période terminée, il est imposé chez le conjoint : ${h.m(onTime)}. L'écart, ${h.m(early - onTime)}, est tout l'intérêt du REER de conjoint, perdu par une simple question de calendrier.</p>
${h.mini('retrait', { t: 'L’impôt sur le retrait, chez l’un ou chez l’autre', p: ['pr', 'mt', 'au'], d: { pr: 'ON', mt: 20000, au: 20000 }, c: 'Comparer avec le revenu du cotisant' })}
<h2>Le gain de fractionnement, chiffré</h2>
<p>Le REER de conjoint sert surtout à la retraite, quand deux revenus inégaux se font face. Les tranches d'impôt sont progressives : deux revenus de ${h.m(45000)} paient moins que ${h.m(70000)} plus ${h.m(20000)}, pour la même somme de ${h.m(TOTAL)}. Le tableau applique le barème ${Y} des ${h.src('cra_rates_2026', 'taux fédéraux et provinciaux')} à plusieurs partages d'un même revenu de couple.</p>
${h.table(['Revenus des deux conjoints', `Impôt total, ${K.prov('ON', 'fr')}`, `Impôt total, ${K.prov('QC', 'fr')}`], rowsFor(h), `Couple à la retraite, ${h.m(TOTAL)} de revenu imposable en tout, barème ${Y}, crédits liés à l'âge et à la pension non comptés.`, ['l', 'r', 'r'])}
<p>En Ontario, le partage égal fait économiser ${h.m(gainOn)} par année par rapport au partage ${h.m(70000)} / ${h.m(20000)} ; au Québec, ${h.m(gainQc)}. La raison tient aux taux marginaux : à ${h.m(70000)}, chaque dollar de plus est imposé à ${h.p(mHigh)} en Ontario, contre ${h.p(mLow)} à ${h.m(20000)}. Déplacer des retraits du premier vers le second fait passer cet argent d'un taux à l'autre. Ce calcul ne compte pas les crédits liés à l'âge ni au revenu de pension, qui réduisent l'impôt des deux conjoints.</p>
<h2>Quand ce n'est pas utile</h2>
<p>Si les deux conjoints auront des revenus de retraite semblables, il n'y a rien à fractionner : cotiser chacun à son propre REER donne le même résultat. Le REER de conjoint ne crée pas non plus de droits : le couple ne déduit pas davantage. Il faut enfin penser aux prestations : un revenu plus élevé chez le conjoint peut toucher sa Sécurité de la vieillesse, ou son Supplément de revenu garanti s'il en reçoit ; voir ${h.a('reer-sv-srg', 'REER, SV et SRG')}.</p>
`,
  },
  en: {
    slug: 'spousal-rrsp',
    nav: 'Spousal RRSP', card: `Contributing to your spouse's or partner's RRSP with your own room, and the ${ATT}-year rule before a withdrawal.`,
    title: `Spousal RRSP ${Y}: the 3-year rule and the tax you save`,
    description: `Spousal RRSP ${Y}: you contribute with your own room, your spouse withdraws and pays the tax, unless you contributed that year or in the 2 years before.`,
    h1: `Spousal RRSP ${Y}: how does the three-year rule work?`,
    intro: 'Pick the year of your last contribution to your spouse’s RRSP and the year of the planned withdrawal: the calculator tells you who will be taxed on it.',
    resume: `A spousal RRSP belongs to your spouse or common-law partner, but you put the money in and you claim the deduction, within your own deduction limit. Later, withdrawals are taxed in your spouse's name, often at a lower rate. One exception stops quick round trips: if you contributed to any spousal RRSP in the year of the withdrawal or in either of the two years before, the amount is added to your income instead of theirs. After a last contribution in ${Y}, a withdrawal is taxed to your spouse only from ${free} on. The payoff comes from the gap between the two retirement incomes: in Ontario, a couple with ${E.m(70000)} and ${E.m(20000)} pays ${E.m(onUneven)} of tax in ${Y}, against ${E.m(onEven)} if they share ${E.m(TOTAL)} equally, which is ${E.m(gainOn)} less every year. In Quebec the gap reaches ${E.m(gainQc)}.`,
    faqs: [
      { q: 'Who pays the tax on a spousal RRSP withdrawal?', a: `Normally the plan holder, meaning the spouse who receives the money. But if the contributor paid anything into a spousal RRSP in the year of the withdrawal or in either of the two years before, all or part of the amount goes back into the contributor's income. The holder fills out Form T2205 to split it. Tax withheld is still claimed by the person named on the slip.` },
      { q: 'How long do you have to wait to withdraw from a spousal RRSP?', a: `You need three calendar years in a row with no contribution from you to any spousal RRSP: the year of the withdrawal and the two before it. With a last contribution in ${Y}, the first withdrawal taxed to your spouse can be made in ${free}. A single contribution in ${Y + 1} pushes that to ${K.spousalFree(Y + 1)}. Contributions to every spousal RRSP count, not only the one being drawn down.` },
      { q: 'Can I contribute to a spousal RRSP after age 71?', a: `Yes, if your spouse is younger. The CRA accepts contributions to a spouse's or common-law partner's RRSP until December 31 of the year they turn 71, not you. You still need room: the contribution comes out of your own deduction limit, which only grows if you had earned income in the previous year.` },
      { q: 'Does the three-year rule apply to spousal RRIF minimum payments?', a: `No. For a RRIF that received funds from a spousal RRSP, only the part withdrawn above the minimum for the year can be added back to the contributor's income. The minimum is taxed to the holder even if the contributor paid into a spousal RRSP recently. It is one way to start drawing on the couple's savings without waiting three years.` },
    ],
    body: (h) => `
<h2>Who contributes, who deducts, who owns the account</h2>
<p>A spousal RRSP is an RRSP in your spouse's or common-law partner's name that you pay into. The account and the investments are theirs, and only they can withdraw. The deduction is yours. It runs through your deduction limit, which covers contributions to your own RRSP and to your spouse's RRSP together, as the ${h.src('cra_rrsp_limit', 'CRA page on the deduction limit')} explains. Your spouse keeps their own room untouched for their own RRSP. If your total contributions go over your limit, the excess is treated as for any RRSP; see ${h.a('excedent-reer', 'RRSP over-contribution')}.</p>
<p>You can contribute until December 31 of the year your spouse turns 71, even if you are older. When the contributor dies, their legal representative can still pay into the surviving spouse's RRSP during the year of death or the first 60 days after it, and the contribution is claimed on the deceased person's final return.</p>
<h2>The three-year rule</h2>
<p>Without a safeguard, you could pay into your spouse's RRSP in December, deduct at a high rate, and have them withdraw in January at a low rate. The law blocks that: under the ${h.src('cra_spousal', 'CRA page on spousal RRSP withdrawals')}, a withdrawal is added to the contributor's income if they contributed to a spousal RRSP in the year of the withdrawal or either of the two preceding years. The spouse who withdraws fills out Form T2205 to work out the share each person reports.</p>
${h.table(['Last contribution', 'Years caught', 'First withdrawal taxed to the spouse'], [Y - 1, Y, Y + 1].map((c) => [String(c), `${c}, ${c + 1}, ${c + 2}`, String(K.spousalFree(c))]), `${ATT}-calendar-year rule: the year of the withdrawal and the two before it must have no contribution.`, ['l', 'l', 'r'])}
<p>The rule covers all your contributions to any spousal RRSP, not only the account being drawn down. It also catches amounts moved from a spousal RRSP to the spouse's FHSA, which count as a taxable withdrawal. For a RRIF that received funds from a spousal RRSP, only the part withdrawn above the annual minimum is caught.</p>
<h2>What withdrawing too early costs</h2>
<p>Take a contributor in Ontario earning ${h.m(50000)} whose spouse has ${h.m(20000)} of income. A ${h.m(20000)} withdrawal made inside the blocked period is added to the contributor's income: about ${h.m(early)} of tax in ${Y}. Made once the period is over, it is taxed to the spouse: ${h.m(onTime)}. The gap of ${h.m(early - onTime)} is the whole point of a spousal RRSP, lost over a matter of timing.</p>
${h.mini('retrait', { t: 'Tax on the withdrawal, in one name or the other', p: ['pr', 'mt', 'au'], d: { pr: 'ON', mt: 20000, au: 20000 }, c: 'Compare with the contributor’s income' })}
<h2>The income-splitting gain, in numbers</h2>
<p>A spousal RRSP mostly pays off in retirement, when two unequal incomes sit side by side. Tax brackets are progressive, so two incomes of ${h.m(45000)} pay less than ${h.m(70000)} plus ${h.m(20000)}, for the same ${h.m(TOTAL)} in total. The table applies the ${Y} ${h.src('cra_rates_2026', 'federal and provincial rates')} to several ways of splitting the same couple income.</p>
${h.table(['Incomes of the two spouses', `Total tax, ${K.prov('ON', 'en')}`, `Total tax, ${K.prov('QC', 'en')}`], rowsFor(h), `Retired couple, ${h.m(TOTAL)} of taxable income in all, ${Y} tax tables, age and pension credits not counted.`, ['l', 'r', 'r'])}
<p>In Ontario, an even split saves ${h.m(gainOn)} a year compared with ${h.m(70000)} / ${h.m(20000)}; in Quebec, ${h.m(gainQc)}. Marginal rates explain it: at ${h.m(70000)}, each extra dollar is taxed at ${h.p(mHigh)} in Ontario, against ${h.p(mLow)} at ${h.m(20000)}. Moving withdrawals from the first spouse to the second shifts that money from one rate to the other. The figures leave out the age and pension income credits, which lower both spouses' tax.</p>
<h2>When it does not help</h2>
<p>If both spouses will have similar retirement incomes, there is nothing to split, and each contributing to their own RRSP gives the same result. A spousal RRSP does not create room either: the couple deducts no more in total. Benefits matter too: a higher income in your spouse's hands can affect their Old Age Security, or their Guaranteed Income Supplement if they receive it; see ${h.a('reer-sv-srg', 'RRSP, OAS and GIS')}.</p>
`,
  },
});
