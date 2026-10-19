import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const FH = K.P.fhsa, HB = K.P.hbp;
// Premier retrait RAP en 2026 : début du remboursement selon l'allègement prolongé.
const plan = K.hbp(HB.limit, Y);
const one = FH.lifetime + HB.limit, two = one * 2;
// Exemple : 80 000 $ en Ontario, CELIAPP ouvert en 2026, 8 000 $ versés et déduits.
const svOn = K.saving(80000, FH.annual, 'ON');
// Versement RAP manqué : la tranche annuelle s'ajoute au revenu (80 000 $, Ontario).
const missed = K.wtax(80000, plan.annual, 'ON');
// Achat rapide : CELIAPP ouvert cette année, un seul versement possible avant l'achat.
const quick = K.fhsaRoom({ opened: Y, contrib: {} }).available;

export default defineGuide({
  id: 'celiapp-ou-rap', group: 'maison', order: 21, tool: 'celiapp',
  toolArg: { ou: '2026', rv: 80000 },
  related: ['celiapp', 'rap', 'reer-ou-celi', 'retrait-reer', 'taux-marginal'],
  sources: ['cra_fhsa', 'cra_hbp', 'cra_rates_2026'],
  fr: {
    slug: 'celiapp-ou-rap',
    nav: 'CELIAPP ou RAP', card: `Un retrait définitif et non imposé, ou un prêt de votre REER à rembourser sur ${HB.repayYears} ans : les deux se combinent pour la même maison.`,
    title: `CELIAPP ou RAP ${Y} : lequel choisir pour votre maison`,
    description: `CELIAPP ou RAP en ${Y} : ${F.m(FH.lifetime)} retirés sans impôt ni remboursement, ou ${F.m(HB.limit)} prêtés par le REER sur ${HB.repayYears} ans. Les deux se cumulent pour la même maison.`,
    h1: `CELIAPP ou RAP en ${Y} : faut-il choisir ?`,
    intro: 'Le simulateur part d’un CELIAPP ouvert cette année et d’un revenu de 80 000 $ : changez la province et le revenu pour voir ce que la déduction rapporte avant de toucher à votre REER.',
    resume: `Le CELIAPP et le RAP aident tous deux à acheter une première maison, mais ils ne fonctionnent pas du tout de la même façon. Le retrait admissible d'un CELIAPP, jusqu'à ${F.m(FH.lifetime)} de cotisations plus les rendements, n'est pas imposé et ne se rembourse jamais : c'est un retrait définitif. Le RAP permet de retirer jusqu'à ${F.m(HB.limit)} de vos REER sans impôt, mais c'est un prêt que vous vous faites : il se rembourse au REER sur ${HB.repayYears} ans, et chaque versement manqué est ajouté à votre revenu imposable. Pour un premier retrait en ${Y}, le remboursement commence en ${plan.start}. Vous n'avez pas à choisir : l'Agence du revenu du Canada permet un retrait RAP et un retrait admissible CELIAPP pour la même maison, si vous remplissez les conditions de chacun. Une personne peut ainsi mobiliser jusqu'à ${F.m(one)}, et un couple dont chacun est admissible jusqu'à ${F.m(two)}, avec deux CELIAPP et deux RAP.`,
    faqs: [
      { q: 'Peut-on utiliser le CELIAPP et le RAP pour la même maison ?', a: `Oui. L'Agence du revenu du Canada précise que vous pouvez retirer des sommes de votre REER au titre du RAP et faire un retrait admissible de votre CELIAPP pour la même habitation, tant que vous remplissez toutes les conditions au moment de chaque retrait. Les deux plafonds s'additionnent : ${F.m(FH.lifetime)} de cotisations au CELIAPP et ${F.m(HB.limit)} au RAP, par personne.` },
      { q: 'Vaut-il mieux utiliser le CELIAPP ou le RAP en premier ?', a: `Le CELIAPP coûte moins cher à utiliser, puisque son retrait est définitif : rien à remettre, aucun risque d'un versement manqué ajouté au revenu. Le RAP demande de rembourser ${F.m(plan.annual)} par année pendant ${HB.repayYears} ans pour un retrait de ${F.m(HB.limit)}. Quand les deux sont possibles, beaucoup puisent d'abord dans le CELIAPP et complètent avec le RAP. Ce n'est pas un conseil personnel : vos revenus futurs comptent.` },
      { q: 'Combien un couple peut-il retirer avec le CELIAPP et le RAP ?', a: `Chaque conjoint a ses propres plafonds. Si les deux remplissent les conditions, le couple peut réunir deux CELIAPP de ${F.m(FH.lifetime)} chacun au maximum, plus deux retraits RAP de ${F.m(HB.limit)}, soit ${F.m(two)} sans compter les rendements du CELIAPP. Chacun retire de ses propres comptes : on ne peut pas cotiser au CELIAPP d'un autre ni en déduire les cotisations.` },
      { q: 'Peut-on transférer son REER dans un CELIAPP ?', a: `Oui, un transfert direct d'un REER vers un CELIAPP est permis, mais il utilise vos droits CELIAPP de l'année, il n'est pas déductible et il ne vous redonne aucun droit REER. Il n'apporte donc pas de nouvelle déduction. Son intérêt : l'argent qui sortira ensuite du CELIAPP pour la maison n'aura pas à être remboursé, contrairement à un retrait RAP.` },
    ],
    body: (h) => `
<h2>La différence de fond : un prêt contre un retrait</h2>
<p>Le RAP, décrit sur la page ${h.src('cra_hbp', 'Régime d’accession à la propriété')} de l'Agence du revenu du Canada, vous laisse sortir de l'argent de vos REER pour acheter ou construire une habitation admissible, sans que ce retrait soit imposé. Mais cet argent reste de l'épargne-retraite : vous devez le remettre dans un REER sur ${h.n(HB.repayYears)} ans, et la part qui n'est pas remise à temps devient du revenu imposable. Le CELIAPP renverse la logique. Vous y versez de l'argent neuf, vous déduisez la cotisation, puis le retrait admissible pour la maison n'est ni imposé ni remboursable. Une fois cet argent sorti, l'affaire est close.</p>
<p>Cette différence a une conséquence pratique. Avec le RAP, votre budget des ${h.n(HB.repayYears)} années suivantes doit absorber un versement annuel au REER en plus de l'hypothèque. Avec le CELIAPP, rien ne suit l'achat. En contrepartie, le RAP ne demande aucune préparation si votre REER est déjà garni, alors que le CELIAPP ne contient que ce que vous y avez versé depuis l'ouverture.</p>
<h2>Les deux comptes côte à côte</h2>
${h.table(['', 'CELIAPP', 'RAP'], [
  ['D’où vient l’argent', 'Cotisations faites au CELIAPP', 'Sommes déjà placées dans vos REER'],
  ['Montant maximal', `${h.m(FH.annual)} par année, ${h.m(FH.lifetime)} à vie, plus les rendements`, `${h.m(HB.limit)} par personne`],
  ['Déduction', 'Oui, l’année du versement ou plus tard', 'Déjà prise quand vous avez cotisé au REER'],
  ['Impôt au retrait', 'Aucun pour un retrait admissible', `Aucun jusqu’à ${h.m(HB.limit)} ; l’excédent est ajouté au revenu`],
  ['Remboursement', 'Aucun', `Sur ${h.n(HB.repayYears)} ans, à partir de ${plan.start} pour un premier retrait en ${Y}`],
  ['Si un versement manque', 'Sans objet', 'Ajouté au revenu de l’année'],
  ['Pour la même maison', 'Oui, avec le RAP', 'Oui, avec le CELIAPP'],
], `Règles de ${Y} lues sur canada.ca.`, ['l', 'l', 'l'])}
<h2>Combiner les deux pour la même maison</h2>
<p>La note de l'Agence est explicite : vous pouvez retirer des sommes de votre REER au titre du RAP et faire un retrait admissible de votre CELIAPP pour la même habitation, pourvu que vous remplissiez toutes les conditions au moment de chaque retrait. Une personne seule peut donc réunir jusqu'à ${h.m(one)} de capital, soit ${h.m(FH.lifetime)} de cotisations au CELIAPP, avec leurs rendements, et ${h.m(HB.limit)} tirés du REER. Pour un couple, les plafonds sont individuels. Si les deux conjoints sont admissibles, chacun peut faire un retrait admissible de son propre CELIAPP pour la même habitation, et chacun peut participer au RAP avec ses propres REER : le total possible atteint ${h.m(two)}. Attention à la condition de premier acheteur du CELIAPP, qui tient compte d'une maison appartenant au conjoint.</p>
<h2>Ce que chaque formule coûte ou rapporte</h2>
<p>Prenons une personne qui gagne ${h.m(80000)} en Ontario et ouvre un CELIAPP cette année. Un versement de ${h.m(FH.annual)} déduit baisse son impôt de ${h.m(svOn)} aux tranches de ${Y}. Le même argent retiré plus tard pour la maison ne sera pas imposé : l'économie est acquise. Si elle utilise aussi le RAP pour ${h.m(HB.limit)}, elle devra remettre ${h.m(plan.annual)} par année dans son REER de ${plan.start} à ${plan.end}. Une année où elle ne le fait pas, cette somme s'ajoute à son revenu : à ${h.m(80000)} de revenu en Ontario, cela représente environ ${h.m(missed)} d'impôt de plus. Le mini-simulateur du RAP montre le calendrier selon l'année de votre premier retrait.</p>
${h.mini('rap', { t: 'Votre calendrier de remboursement du RAP', p: ['mt', 'an'], d: { mt: HB.limit, an: String(Y) }, c: 'Voir le détail du RAP' })}
<h2>Quand le RAP reste incontournable</h2>
<p>Le CELIAPP a un défaut : ses droits ne commencent qu'à l'ouverture. Une personne qui ouvre son compte cette année et achète dans quelques mois ne peut y verser que ${h.m(quick)} avant l'achat, ce qui pèse peu face à une mise de fonds. Si elle a déjà un REER bien garni, le RAP fournit l'essentiel de l'apport, et le CELIAPP le complète. Il est aussi possible de transférer directement un REER vers un CELIAPP : ce transfert utilise les droits CELIAPP, n'est pas déductible et ne redonne aucun droit REER, mais l'argent qui en ressortira pour la maison n'aura pas à être remboursé.</p>
<h2>Ce que ce comparatif ne remplace pas</h2>
<p>Chaque retrait a ses propres conditions, vérifiées au moment où vous le faites, et elles ne sont pas identiques pour les deux comptes. Les règles du CELIAPP sont détaillées sur la page ${h.a('celiapp', 'CELIAPP')} et celles du remboursement sur la page ${h.a('rap', 'RAP')}. Si vous hésitez encore sur l'usage de votre REER pour la retraite, la page ${h.a('reer-ou-celi', 'REER ou CELI')} compare les deux comptes selon votre taux marginal.</p>
`,
  },
  en: {
    slug: 'fhsa-vs-hbp',
    nav: 'FHSA vs HBP', card: `A final tax-free withdrawal, or a loan from your RRSP repaid over ${HB.repayYears} years: the two can be combined for the same home.`,
    title: `FHSA vs HBP ${Y}: which one to use for your first home`,
    description: `FHSA vs HBP in ${Y}: ${E.m(FH.lifetime)} out tax-free with nothing to repay, or ${E.m(HB.limit)} borrowed from your RRSP over ${HB.repayYears} years. You can use both for the same first home.`,
    h1: `FHSA vs HBP in ${Y}: do you have to choose?`,
    intro: 'The calculator starts from an FHSA opened this year and an $80,000 income: change the province and income to see what the deduction is worth before you touch your RRSP.',
    resume: `The FHSA and the HBP both help you buy a first home, but they work in completely different ways. A qualifying FHSA withdrawal, up to ${E.m(FH.lifetime)} of contributions plus growth, is not taxed and is never repaid: once the money is out, it is yours. The HBP lets you take up to ${E.m(HB.limit)} out of your RRSPs without tax, but it is a loan to yourself: it must go back into the RRSP over ${HB.repayYears} years, and any repayment you miss is added to your taxable income. For a first withdrawal in ${Y}, repayment starts in ${plan.start}. You do not have to pick one: the Canada Revenue Agency lets you make an HBP withdrawal and a qualifying FHSA withdrawal for the same home, as long as you meet the conditions of each. One person can bring up to ${E.m(one)} to the purchase, and a couple who both qualify up to ${E.m(two)}, with two FHSAs and two HBP withdrawals.`,
    faqs: [
      { q: 'Can I use the FHSA and the HBP for the same home?', a: `Yes. The Canada Revenue Agency states that you can withdraw from your RRSP under the HBP and make a qualifying withdrawal from your FHSA for the same qualifying home, as long as you meet all the conditions at the time of each withdrawal. The two limits add up: ${E.m(FH.lifetime)} of FHSA contributions and ${E.m(HB.limit)} under the HBP, per person.` },
      { q: 'Should I use my FHSA or the HBP first?', a: `The FHSA is cheaper to use because its withdrawal is final: nothing to put back and no risk of a missed repayment being added to income. The HBP requires repaying ${E.m(plan.annual)} a year for ${HB.repayYears} years on a ${E.m(HB.limit)} withdrawal. When both are available, many people draw on the FHSA first and top up with the HBP. This is not personal advice: your future income matters.` },
      { q: 'How much can a couple use from the FHSA and HBP combined?', a: `Each spouse has their own limits. If both qualify, a couple can bring two FHSAs with up to ${E.m(FH.lifetime)} of contributions each, plus two HBP withdrawals of ${E.m(HB.limit)}, for ${E.m(two)} before any FHSA growth. Each withdraws from their own accounts: you cannot contribute to someone else's FHSA or deduct their contributions.` },
      { q: 'Can I transfer money from my RRSP to my FHSA?', a: `Yes, a direct transfer from an RRSP to an FHSA is allowed, but it uses your FHSA room for the year, it is not deductible and it does not give you any RRSP room back. So it brings no new deduction. Its appeal is that the money later taken out of the FHSA for the home never has to be repaid, unlike an HBP withdrawal.` },
    ],
    body: (h) => `
<h2>The real difference: a loan versus a withdrawal</h2>
<p>The HBP, described on the CRA's ${h.src('cra_hbp', 'Home Buyers’ Plan')} page, lets you take money out of your RRSPs to buy or build a qualifying home without that withdrawal being taxed. But the money is still retirement savings: you have to put it back into an RRSP over ${h.n(HB.repayYears)} years, and whatever is not put back on time becomes taxable income. The FHSA flips that logic. You put new money in, deduct the contribution, and the qualifying withdrawal for the home is neither taxed nor repayable. Once the money is out, the matter is closed.</p>
<p>That difference shows up in your budget. With the HBP, the ${h.n(HB.repayYears)} years after the purchase must absorb an annual RRSP repayment on top of the mortgage. With the FHSA, nothing follows the purchase. On the other hand, the HBP needs no planning if your RRSP is already well funded, while the FHSA only holds what you have put in since you opened it.</p>
<h2>The two accounts side by side</h2>
${h.table(['', 'FHSA', 'HBP'], [
  ['Where the money comes from', 'Contributions made to the FHSA', 'Money already in your RRSPs'],
  ['Maximum amount', `${h.m(FH.annual)} a year, ${h.m(FH.lifetime)} for life, plus growth`, `${h.m(HB.limit)} per person`],
  ['Deduction', 'Yes, in the year you contribute or later', 'Already claimed when you contributed to the RRSP'],
  ['Tax on withdrawal', 'None on a qualifying withdrawal', `None up to ${h.m(HB.limit)}; any excess is reported as income`],
  ['Repayment', 'None', `Over ${h.n(HB.repayYears)} years, from ${plan.start} for a first withdrawal in ${Y}`],
  ['If a repayment is missed', 'Not applicable', 'Added to that year’s income'],
  ['For the same home', 'Yes, with the HBP', 'Yes, with the FHSA'],
], `${Y} rules as read on canada.ca.`, ['l', 'l', 'l'])}
<h2>Using both for the same home</h2>
<p>The CRA's note is explicit: you can withdraw amounts from your RRSP under the HBP and make a qualifying withdrawal from your FHSA for the same qualifying home, as long as you meet all of the conditions at the time of each withdrawal. A single buyer can therefore bring up to ${h.m(one)}: ${h.m(FH.lifetime)} of FHSA contributions, plus their growth, and ${h.m(HB.limit)} from the RRSP. For a couple the limits are individual. If both spouses qualify, each can make a qualifying withdrawal from their own FHSA for the same home, and each can use the HBP with their own RRSPs, for a possible total of ${h.m(two)}. Watch the FHSA first-time buyer test, which also looks at a home owned by your spouse.</p>
<h2>What each option costs or saves</h2>
<p>Take someone earning ${h.m(80000)} in Ontario who opens an FHSA this year. Contributing and deducting ${h.m(FH.annual)} cuts their tax by ${h.m(svOn)} at ${Y} rates. The same money taken out later for the home is not taxed, so the saving stays. If they also use the HBP for ${h.m(HB.limit)}, they must put ${h.m(plan.annual)} a year back into their RRSP from ${plan.start} to ${plan.end}. In a year they skip it, that amount is added to their income: at ${h.m(80000)} in Ontario, that is roughly ${h.m(missed)} of extra tax. The HBP mini calculator shows the schedule for the year of your first withdrawal.</p>
${h.mini('rap', { t: 'Your HBP repayment schedule', p: ['mt', 'an'], d: { mt: HB.limit, an: String(Y) }, c: 'See the HBP details' })}
<h2>When the HBP is still needed</h2>
<p>The FHSA has one weakness: its room only starts when you open it. Someone who opens an account this year and buys a few months later can only put in ${h.m(quick)} before the purchase, which is small next to a down payment. If they already have a sizeable RRSP, the HBP provides most of the money and the FHSA tops it up. You can also transfer directly from an RRSP to an FHSA: the transfer uses FHSA room, is not deductible and gives back no RRSP room, but the money that later comes out for the home never has to be repaid.</p>
<h2>What this comparison does not replace</h2>
<p>Each withdrawal has its own conditions, checked at the time you make it, and they are not the same for both accounts. The FHSA rules are on the ${h.a('celiapp', 'FHSA')} page and the repayment rules on the ${h.a('rap', 'HBP')} page. If you are still weighing what your RRSP should do for retirement, the ${h.a('reer-ou-celi', 'RRSP vs TFSA')} page compares both accounts at your marginal rate.</p>
`,
  },
});
