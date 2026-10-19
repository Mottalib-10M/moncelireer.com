import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const W = K.P.rrsp.withholding;
const [b1, b2] = W.bands;
// Exemple principal : Ontario, 45 000 $ d'autres revenus.
const AU = 45000;
const w10 = K.withholding(10000, false), t10 = K.wtax(AU, 10000, 'ON');
const w20 = K.withholding(20000, false), t20 = K.wtax(AU, 20000, 'ON');
// Le même 20 000 $ en quatre retraits de 5 000 $ : retenue plus faible, impôt final identique.
const w4 = 4 * K.withholding(5000, false).withheld;
const owe4 = t20 - w4;
const q20 = K.withholding(20000, true);
const nr = W.nonResident;
// Retrait de 20 000 $ en Ontario selon les autres revenus.
const others = [0, 20000, 45000, 70000, 100000, 140000];
const rowsFor = (f: typeof F) => others.map((o) => { const t = K.wtax(o, 20000, 'ON'); return [f.m(o), f.m(w20.withheld), f.m(t), f.m(t - w20.withheld)]; });
const t0 = K.wtax(0, 20000, 'ON'), t140 = K.wtax(140000, 20000, 'ON');
const bandRows = (f: typeof F, up: string, mid: string, over: string) => [
  [up, f.p(W.rates[0], 0), f.p(W.ratesQcFederal[0], 0)],
  [mid, f.p(W.rates[1], 0), f.p(W.ratesQcFederal[1], 0)],
  [over, f.p(W.rates[2], 0), f.p(W.ratesQcFederal[2], 0)],
];

export default defineGuide({
  id: 'retrait-reer', group: 'reer', order: 15, tool: 'retrait',
  toolArg: { pr: 'ON' },
  related: ['taux-marginal', 'reer-sv-srg', 'reer-conjoint', 'rap', 'reep', 'retrait-celi'],
  sources: ['cra_withholding', 'cra_rates_2026'],
  fr: {
    slug: 'retrait-reer',
    nav: 'Retrait REER et impôt', card: `Retenue de ${F.p(W.rates[0], 0)} à ${F.p(W.rates[2], 0)} à la source, puis l'impôt réel à votre taux marginal dans la déclaration.`,
    title: `Retrait REER ${Y} : retenue à la source et impôt réel`,
    description: `Retrait REER ${Y} : retenue de ${F.p(W.rates[0], 0)}, ${F.p(W.rates[1], 0)} ou ${F.p(W.rates[2], 0)} selon le montant, puis impôt réel à votre taux marginal. Calcul du solde à payer ou du remboursement.`,
    h1: `Retrait REER ${Y} : combien d'impôt allez-vous vraiment payer ?`,
    intro: 'Entrez votre province, le montant retiré et vos autres revenus de l’année : le simulateur donne la retenue prise par l’institution et l’impôt réellement dû sur le retrait.',
    resume: `Un retrait REER subit deux prélèvements qui n'ont pas le même montant. L'institution retient d'abord l'impôt à la source : ${F.p(W.rates[0], 0)} jusqu'à ${F.m(b1)}, ${F.p(W.rates[1], 0)} jusqu'à ${F.m(b2)} et ${F.p(W.rates[2], 0)} au-delà, ou ${F.p(W.ratesQcFederal[0], 0)}, ${F.p(W.ratesQcFederal[1], 0)} et ${F.p(W.ratesQcFederal[2], 0)} au fédéral au Québec, plus la retenue du Québec. Puis le retrait s'ajoute à votre revenu de l'année et l'impôt réel se calcule à votre taux marginal dans la déclaration. En Ontario, avec ${F.m(AU)} d'autres revenus, un retrait de ${F.m(20000)} donne lieu à une retenue de ${F.m(w20.withheld)}, alors que l'impôt dû en ${Y} est de ${F.m(t20)}. Fractionner le retrait en petits montants abaisse la retenue, pas l'impôt final : le solde se paie au printemps. Un non-résident subit ${F.p(nr, 0)} de retenue, sauf taux réduit par une convention fiscale. Les droits de cotisation utilisés ne reviennent pas après un retrait.`,
    faqs: [
      { q: 'Combien d’impôt sur un retrait REER de 10 000 $ ?', a: `La retenue est de ${F.p(w10.rate, 0)}, soit ${F.m(w10.withheld)}, hors Québec. L'impôt réel dépend de vos autres revenus : en Ontario, avec ${F.m(AU)} de salaire, il est de ${F.m(t10)} pour ${Y}. Avec un revenu plus élevé, le retrait tombe dans une tranche plus imposée et la retenue ne suffit plus. Le simulateur fait le calcul avec votre province et votre revenu.` },
      { q: 'Peut-on retirer de son REER sans payer d’impôt ?', a: `Oui dans trois cas : un retrait au titre du Régime d'accession à la propriété ou du Régime d'encouragement à l'éducation permanente, à condition de rembourser selon le calendrier, et un transfert direct vers un autre REER, qui n'est pas un retrait. Hors de ces cas, le montant est ajouté au revenu. Une année sans autre revenu, l'impôt final peut être faible, mais la retenue s'applique quand même.` },
      { q: 'Pourquoi dois-je payer de l’impôt après un retrait REER ?', a: `Parce que la retenue ne dépend que du montant de chaque retrait, pas de votre revenu. L'Agence du revenu du Canada le précise : l'impôt retenu peut ne pas suffire selon votre tranche. En Ontario, ${F.m(20000)} retirés en quatre fois ${F.m(5000)} ne subissent que ${F.m(w4)} de retenue, pour un impôt réel de ${F.m(t20)} à ${F.m(AU)} d'autres revenus : il reste ${F.m(owe4)} à payer.` },
      { q: 'Un retrait REER redonne-t-il des droits de cotisation ?', a: `Non. Au contraire du CELI, l'argent sorti d'un REER ne recrée aucun droit, ni l'année même ni le 1er janvier suivant. Les droits utilisés au moment de la cotisation sont perdus pour de bon. Avant de retirer d'un REER pour un besoin ponctuel, il vaut donc la peine de regarder si un CELI peut jouer ce rôle, puisque ses retraits reviennent dans vos droits.` },
    ],
    body: (h) => `
<h2>Les taux de retenue de ${Y}</h2>
<p>Quand vous retirez de l'argent d'un REER, l'institution financière retient l'impôt avant de vous verser le reste. Le taux dépend de votre lieu de résidence et du montant du retrait, selon la ${h.src('cra_withholding', 'page de l’Agence sur les taux de retenue')}. Au Québec, la part fédérale est réduite de moitié, et l'institution retient en plus l'impôt du Québec selon les règles de Revenu Québec, que le simulateur ne chiffre pas.</p>
${h.table(['Montant de chaque retrait', 'Hors Québec', 'Québec (part fédérale)'], bandRows(h, `Jusqu'à ${h.m(b1)}`, `De ${h.m(b1)} à ${h.m(b2)}`, `Plus de ${h.m(b2)}`), `Retenue à la source sur un retrait d'un REER, résidents du Canada. Non-résidents : ${h.p(nr, 0)}, sauf convention fiscale.`, ['l', 'r', 'r'])}
<p>Ces taux ne sont qu'un acompte. Ils ne connaissent ni votre salaire ni vos autres retraits de l'année. Au Québec, un retrait de ${h.m(20000)} donne une retenue fédérale de ${h.p(q20.rate, 0)}, soit ${h.m(q20.withheld)}, à laquelle s'ajoute la retenue du Québec.</p>
<h2>L'impôt réel se calcule dans la déclaration</h2>
<p>Le montant retiré figure sur un feuillet et s'ajoute à votre revenu de l'année, comme un salaire. Il est donc imposé au taux des tranches où il tombe, fédéral et provincial réunis, d'après les ${h.src('cra_rates_2026', 'taux de ' + Y)}. La retenue est ensuite portée à votre crédit : si elle dépasse l'impôt dû, la différence vous revient ; sinon, vous payez le solde au printemps. Le tableau montre un retrait de ${h.m(20000)} en Ontario, retenue de ${h.m(w20.withheld)}, à six niveaux d'autres revenus.</p>
${h.table(['Autres revenus', 'Retenue', 'Impôt réel', 'Écart'], rowsFor(h), `Retrait de ${h.m(20000)} en Ontario, barème ${Y}. Un écart négatif revient en remboursement, un écart positif se paie dans la déclaration.`, ['l', 'r', 'r', 'r'])}
<p>Sans autre revenu, le retrait profite des montants personnels de base et de la première tranche : l'impôt réel n'est que de ${h.m(t0)}, et presque toute la retenue revient. À ${h.m(140000)} d'autres revenus, il grimpe à ${h.m(t140)}, bien plus que les ${h.m(w20.withheld)} retenus. C'est la même mécanique que pour une cotisation, à l'envers : le taux qui compte est votre ${h.a('taux-marginal', 'taux marginal')}.</p>
${h.mini('taux', { t: 'Le taux qui s’appliquera à votre retrait', p: ['pr', 'rv'], d: { pr: 'ON', rv: AU }, c: 'Voir les seuils de votre province' })}
<h2>Fractionner les retraits ne baisse pas l'impôt</h2>
<p>La retenue se fixe retrait par retrait. Quatre retraits de ${h.m(5000)} restent chacun dans la première bande et ne subissent que ${h.p(W.rates[0], 0)}, soit ${h.m(w4)} en tout, au lieu de ${h.m(w20.withheld)} pour un seul retrait de ${h.m(20000)}. L'impôt final, lui, ne change pas d'un dollar : il dépend du total retiré dans l'année. Avec ${h.m(AU)} d'autres revenus en Ontario, il reste ${h.m(owe4)} à payer au moment de la déclaration. Fractionner sert à garder plus d'argent tout de suite, à condition de mettre le solde de côté.</p>
<p>Ce qui peut réellement faire baisser l'impôt, c'est de répartir les retraits sur plusieurs années civiles, pour que chacun tombe dans une tranche moins imposée. Retirer ${h.m(10000)} en décembre et ${h.m(10000)} en janvier, c'est deux revenus de deux années différentes.</p>
<h2>Ce qu'un retrait vous fait perdre</h2>
<p>Un retrait REER ne redonne pas de droits de cotisation. Les droits utilisés pour verser cet argent sont consommés pour de bon, alors qu'un ${h.a('retrait-celi', 'retrait CELI')} revient dans vos droits le 1er janvier suivant. Le retrait fait aussi monter votre revenu net, ce qui peut réduire des prestations calculées sur le revenu. À la retraite, il compte pour la Sécurité de la vieillesse et le Supplément de revenu garanti : le détail est sur la page ${h.a('reer-sv-srg', 'REER, SV et SRG')}.</p>
<p>Certains REER sont immobilisés, parce qu'ils viennent d'un régime de retraite d'employeur : on ne peut en général rien en retirer. Un transfert direct d'un REER à un autre, fait par les institutions, n'est pas un retrait et n'entraîne aucune retenue.</p>
<h2>Les retraits qui ne sont pas imposés</h2>
<p>Deux programmes permettent de sortir de l'argent sans l'ajouter au revenu : le ${h.a('rap', 'Régime d’accession à la propriété')}, pour acheter ou construire une habitation admissible, et le ${h.a('reep', 'Régime d’encouragement à l’éducation permanente')}, pour financer des études ou une formation. Pour le REEP, l'institution ne retient même pas d'impôt. Il faut rembourser les montants selon un calendrier fixé ; un versement manqué est ajouté au revenu de l'année. Pour un REER au nom de l'époux ou du conjoint de fait, le retrait peut être imposé au cotisant plutôt qu'au titulaire : voir ${h.a('reer-conjoint', 'REER de conjoint')}.</p>
<h2>Non-résidents</h2>
<p>Une personne qui a quitté le Canada subit une retenue de ${h.p(nr, 0)} sur ses retraits, sauf si une convention fiscale entre le Canada et son pays de résidence prévoit un taux plus bas. La règle des trois bandes ne s'applique pas à elle.</p>
`,
  },
  en: {
    slug: 'rrsp-withdrawal-tax',
    nav: 'RRSP withdrawal tax', card: `${E.p(W.rates[0], 0)} to ${E.p(W.rates[2], 0)} withheld at source, then the real tax at your marginal rate when you file.`,
    title: `RRSP withdrawal tax ${Y}: withholding vs the real bill`,
    description: `RRSP withdrawal tax in ${Y}: ${E.p(W.rates[0], 0)}, ${E.p(W.rates[1], 0)} or ${E.p(W.rates[2], 0)} withheld by amount, then the real tax at your marginal rate on the return. See the balance owing or refund.`,
    h1: `RRSP withdrawal tax ${Y}: how much will you really pay?`,
    intro: 'Enter your province, the amount you take out and your other income for the year: the calculator shows the tax your institution withholds and the tax you actually owe on the withdrawal.',
    resume: `An RRSP withdrawal is taxed twice over, in amounts that do not match. Your institution first withholds tax at source: ${E.p(W.rates[0], 0)} up to ${E.m(b1)}, ${E.p(W.rates[1], 0)} up to ${E.m(b2)} and ${E.p(W.rates[2], 0)} above that, or ${E.p(W.ratesQcFederal[0], 0)}, ${E.p(W.ratesQcFederal[1], 0)} and ${E.p(W.ratesQcFederal[2], 0)} federally in Quebec, plus Quebec withholding. The withdrawal is then added to your income for the year, and the real tax is worked out at your marginal rate on your return. In Ontario, with ${E.m(AU)} of other income, a ${E.m(20000)} withdrawal has ${E.m(w20.withheld)} withheld, while the ${Y} tax owed on it is ${E.m(t20)}. Splitting the withdrawal into small amounts lowers the withholding, not the final tax: the balance is due in the spring. A non-resident has ${E.p(nr, 0)} withheld unless a tax treaty sets a lower rate. The contribution room you used does not come back after a withdrawal.`,
    faqs: [
      { q: 'How much tax do I pay on a $10,000 RRSP withdrawal?', a: `Withholding is ${E.p(w10.rate, 0)}, or ${E.m(w10.withheld)}, outside Quebec. The real tax depends on your other income: in Ontario, with a ${E.m(AU)} salary, it comes to ${E.m(t10)} for ${Y}. With a higher income the withdrawal lands in a more heavily taxed bracket and the withholding falls short. The calculator runs the numbers for your province and income.` },
      { q: 'Can I withdraw from my RRSP without paying tax?', a: `Yes, in three cases: a withdrawal under the Home Buyers' Plan or the Lifelong Learning Plan, as long as you repay on schedule, and a direct transfer to another RRSP, which is not a withdrawal at all. Otherwise the amount is added to your income. In a year with no other income the final tax can be small, but withholding still applies.` },
      { q: 'Why do I owe tax after an RRSP withdrawal?', a: `Because withholding only looks at the size of each withdrawal, not at your income. The CRA says so itself: the tax withheld may not be enough for your bracket. In Ontario, ${E.m(20000)} taken out as four withdrawals of ${E.m(5000)} has only ${E.m(w4)} withheld, against real tax of ${E.m(t20)} with ${E.m(AU)} of other income: ${E.m(owe4)} is left to pay.` },
      { q: 'Do I get RRSP room back after a withdrawal?', a: `No. Unlike a TFSA, money taken out of an RRSP creates no new room, neither in the same year nor the next January 1. The room you used when you contributed is gone for good. Before taking RRSP money for a one-off need, it is worth checking whether a TFSA could play that role, since its withdrawals come back as room.` },
    ],
    body: (h) => `
<h2>Withholding rates for ${Y}</h2>
<p>When you take money out of an RRSP, the financial institution withholds tax before paying you the rest. The rate depends on where you live and on the amount withdrawn, as set out on the ${h.src('cra_withholding', 'CRA page on withdrawal tax rates')}. In Quebec the federal share is cut in half, and the institution also withholds Quebec tax under Revenu Québec rules, which the calculator does not estimate.</p>
${h.table(['Size of each withdrawal', 'Outside Quebec', 'Quebec (federal share)'], bandRows(h, `Up to ${h.m(b1)}`, `${h.m(b1)} to ${h.m(b2)}`, `Over ${h.m(b2)}`), `Tax withheld on an RRSP withdrawal, residents of Canada. Non-residents: ${h.p(nr, 0)} unless a tax treaty applies.`, ['l', 'r', 'r'])}
<p>These rates are only a down payment. They know nothing about your salary or your other withdrawals in the year. In Quebec, a ${h.m(20000)} withdrawal has ${h.p(q20.rate, 0)} federal tax withheld, or ${h.m(q20.withheld)}, with Quebec withholding on top.</p>
<h2>The real tax is settled on your return</h2>
<p>The amount you withdraw appears on a slip and is added to your income for the year, just like wages. It is taxed at the rates of the brackets it falls into, federal and provincial combined, using the ${h.src('cra_rates_2026', Y + ' rates')}. The tax withheld is then credited to you: if it is more than the tax owed, you get the difference back; if not, you pay the balance in the spring. The table follows a ${h.m(20000)} withdrawal in Ontario, with ${h.m(w20.withheld)} withheld, at six levels of other income.</p>
${h.table(['Other income', 'Withheld', 'Real tax', 'Gap'], rowsFor(h), `${h.m(20000)} withdrawal in Ontario, ${Y} tax tables. A negative gap comes back as a refund; a positive gap is paid when you file.`, ['l', 'r', 'r', 'r'])}
<p>With no other income, the withdrawal is sheltered by the basic personal amounts and the lowest bracket: the real tax is only ${h.m(t0)}, and nearly all the withholding comes back. With ${h.m(140000)} of other income it climbs to ${h.m(t140)}, far above the ${h.m(w20.withheld)} withheld. It is the same mechanism as a contribution, run backwards: the rate that matters is your ${h.a('taux-marginal', 'marginal tax rate')}.</p>
${h.mini('taux', { t: 'The rate your withdrawal will be taxed at', p: ['pr', 'rv'], d: { pr: 'ON', rv: AU }, c: 'See the thresholds in your province' })}
<h2>Splitting withdrawals does not cut the tax</h2>
<p>Withholding is set one withdrawal at a time. Four withdrawals of ${h.m(5000)} each stay in the lowest band and have only ${h.p(W.rates[0], 0)} withheld, ${h.m(w4)} in all, instead of ${h.m(w20.withheld)} on a single ${h.m(20000)} withdrawal. The final tax does not move by a dollar, because it depends on the total taken out in the year. With ${h.m(AU)} of other income in Ontario, ${h.m(owe4)} is still owing when you file. Splitting only keeps more cash in your hands now, so set the balance aside.</p>
<p>What can genuinely lower the tax is spreading withdrawals over several calendar years, so that each one lands in a lower bracket. Taking ${h.m(10000)} in December and ${h.m(10000)} in January means two incomes in two different years.</p>
<h2>What a withdrawal costs you beyond tax</h2>
<p>An RRSP withdrawal does not restore contribution room. The room used when the money went in is spent for good, whereas a ${h.a('retrait-celi', 'TFSA withdrawal')} comes back as room on the next January 1. The withdrawal also raises your net income, which can reduce income-tested benefits. In retirement it counts for Old Age Security and the Guaranteed Income Supplement; see ${h.a('reer-sv-srg', 'RRSP, OAS and GIS')}.</p>
<p>Some RRSPs are locked in because they come from an employer pension plan, and you generally cannot withdraw from them. A direct transfer from one RRSP to another, handled by the institutions, is not a withdrawal and has no tax withheld.</p>
<h2>Withdrawals that are not taxed</h2>
<p>Two programs let you take money out without adding it to income: the ${h.a('rap', 'Home Buyers’ Plan')}, to buy or build a qualifying home, and the ${h.a('reep', 'Lifelong Learning Plan')}, to pay for training or education. Under the LLP, the institution does not even withhold tax. The amounts must be repaid on a set schedule, and a missed payment is added to income for that year. For an RRSP held by a spouse or common-law partner, the withdrawal may be taxed to the contributor instead of the holder; see ${h.a('reer-conjoint', 'spousal RRSP')}.</p>
<h2>Non-residents</h2>
<p>Someone who has left Canada has ${h.p(nr, 0)} withheld on withdrawals, unless a tax treaty between Canada and their country of residence sets a lower rate. The three-band rule does not apply to them.</p>
`,
  },
});
