import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const lim = K.tfsaLimit(Y);
const cushion = K.P.rrsp.overCushion;
const tx = K.excessTax;
// Grille : excédent x durée.
const amounts = [1000, 3000, lim, 10000];
const months = [1, 3, 6, 12];
// Cas 1 : retrait de 7 000 $ en février, redépôt en mars sans droits libres, laissé jusqu'à décembre (10 mois).
const redep = tx(lim, 10);
// Cas 2 : excédent de 3 000 $ créé en mai, retiré en août : mai, juin, juillet, août.
const quick = tx(3000, 4);
// Cas 3 : 20 000 $ retirés puis redéposés dans une autre institution en juin, sans droits : juin à décembre.
const moved = tx(20000, 7);
// Cas 4 : excédent de 2 500 $ en octobre corrigé dans le même mois.
const sameMonth = tx(2500, 1);

export default defineGuide({
  id: 'excedent-celi', group: 'celi', order: 4, tool: 'excedent',
  related: ['droits-celi', 'retrait-celi', 'plafond-celi', 'excedent-reer', 'celiapp'],
  sources: ['rc4466', 'cra_rrsp_excess'],
  fr: {
    slug: 'cotisation-excedentaire-celi',
    nav: 'Excédent CELI', card: `Verser plus que vos droits coûte 1 % par mois sur l'excédent le plus élevé du mois. Calcul et façon de corriger.`,
    title: `Cotisation excédentaire CELI ${Y} : impôt de 1 % par mois`,
    description: `Cotisation excédentaire CELI en ${Y} : 1 % par mois sur l'excédent le plus élevé du mois, dès le premier dollar. Coût par durée, retrait pour corriger, RC243.`,
    h1: `Cotisation excédentaire au CELI en ${Y} : le coût et la correction`,
    intro: 'Entrez le montant versé en trop et le nombre de mois avant de le retirer : le simulateur applique l’impôt de 1 % par mois que prévoit l’Agence du revenu du Canada.',
    resume: `Une cotisation excédentaire au CELI coûte 1 % par mois sur l'excédent le plus élevé de chaque mois, tant qu'il reste dans le compte. Un excédent de ${F.m(3000)} gardé six mois coûte ${F.m(tx(3000, 6))} ; ${F.m(lim)} gardés un an coûtent ${F.m(tx(lim, 12))}. Contrairement au REER, il n'y a aucune marge de tolérance : l'impôt s'applique dès le premier dollar, et il est dû pour le mois entier même si vous retirez l'excédent quelques jours après l'avoir versé. La façon de l'arrêter est de retirer le montant en trop ; sinon, il fond le 1er janvier suivant, quand le nouveau plafond et vos retraits de l'année s'ajoutent à vos droits. Les deux causes les plus fréquentes sont le redépôt d'un retrait dans la même année et le changement d'institution fait par vous-même plutôt que par transfert direct. Pour toute année où cet impôt est dû, il faut produire le formulaire RC243 et son annexe A au plus tard le 30 juin de l'année suivante.`,
    faqs: [
      { q: 'Combien coûte une cotisation excédentaire au CELI ?', a: `L'impôt est de 1 % par mois sur l'excédent le plus élevé du mois. Un excédent de ${F.m(5000)} laissé trois mois coûte ${F.m(tx(5000, 3))}. Le mois où l'excédent apparaît compte en entier, et celui où vous le retirez aussi. Le revenu tiré d'un excédent versé volontairement peut en plus être traité comme un avantage, imposé à part.` },
      { q: 'Comment corriger un excédent CELI ?', a: `Retirez le montant en trop dès que vous le constatez. Le retrait arrête l'impôt à partir du mois suivant. Ne remettez pas cet argent dans le compte la même année : le retrait ne vous redonne des droits que le 1er janvier suivant. Si vous attendez, l'excédent finira par être absorbé par les nouveaux droits de janvier, mais l'impôt court jusque-là.` },
      { q: 'Faut-il remplir le formulaire RC243 pour un excédent CELI ?', a: `Oui. Pour toute année où vous devez l'impôt sur un excédent, il faut produire le formulaire RC243, déclaration CELI, avec l'annexe A (RC243-SCH-A), au plus tard le 30 juin de l'année suivante, et payer l'impôt à cette date. Si vous ne le faites pas, l'Agence peut calculer l'impôt avec les renseignements transmis par vos institutions.` },
      { q: `L'Agence peut-elle annuler l'impôt sur un excédent CELI ?`, a: `Elle peut renoncer à tout ou partie de l'impôt, ou l'annuler, si elle juge que c'est équitable, notamment quand l'excédent vient d'une erreur raisonnable et a été retiré. Il faut envoyer une lettre qui explique comment l'excédent s'est produit et pourquoi l'annulation serait juste, par la poste ou avec le service « Soumettre des documents » de Mon dossier.` },
    ],
    body: (h) => `
<h2>Comment l'impôt se calcule</h2>
<p>L’${h.src('rc4466', 'Agence du revenu du Canada')} définit l'excédent comme la part de vos cotisations de l'année qui dépasse vos droits du début de l'année, plus la part d'un retrait qui a servi à réduire un excédent déjà créé. Dès qu'un excédent existe à un moment du mois, vous devez 1 % de l'excédent le plus élevé de ce mois. Le calcul se fait mois par mois : si l'excédent baisse en cours de route, l'impôt baisse à partir du mois suivant.</p>
${h.table(['Excédent', '1 mois', '3 mois', '6 mois', '12 mois'], amounts.map((a) => [h.m(a), ...months.map((m) => h.m(tx(a, m)))]), 'Impôt de 1 % par mois sur un excédent qui reste constant.', ['l', 'r', 'r', 'r', 'r'])}
<p>Le mois compte en entier. Une personne qui crée un excédent de ${h.m(2500)} le 30 octobre et le retire le 31 doit quand même ${h.m(sameMonth)} pour octobre. À l'inverse, il n'y a pas d'intérêt composé : l'impôt est simple, proportionnel au montant et au nombre de mois.</p>
<h2>Aucune marge, contrairement au REER</h2>
<p>Le REER tolère un excédent cumulatif de ${h.m(cushion)} avant d'appliquer son ${h.src('cra_rrsp_excess', 'impôt de 1 % par mois')}. Le CELI n'a rien de tel : le guide précise que l'impôt s'applique dès le premier dollar en trop. Un dépassement de quelques centaines de dollars, causé par un virement automatique oublié par exemple, est donc imposé comme les autres. Le CELIAPP suit la même logique, avec son propre impôt de 1 % par mois sur l'excédent.</p>
<h2>Retirer pour corriger</h2>
<p>Un retrait fait après la création de l'excédent le réduit d'autant, jusqu'à l'effacer. Si une personne a un excédent de ${h.m(3000)} depuis mai et le retire en août, elle paie quatre mois, de mai à août : ${h.m(quick)}. Ce qui dépasse l'excédent dans le retrait ne sert à rien la même année : il ne peut pas compenser un nouvel excédent créé plus tard dans l'année. Cette part s'ajoute simplement à vos droits le 1er janvier suivant.</p>
<p>Sans retrait, l'excédent reste jusqu'à ce que de nouveaux droits l'absorbent. Le 1er janvier, le plafond de l'année et les retraits de l'année précédente s'ajoutent ; si leur total couvre l'excédent, l'impôt s'arrête. Sinon, le reste continue d'être imposé toute l'année suivante.</p>
<h2>Les erreurs qui créent un excédent</h2>
<p><strong>Le redépôt dans la même année.</strong> C'est l'erreur la plus courante. Quelqu'un qui a déjà rempli ses droits retire ${h.m(lim)} en février pour une dépense, change d'avis et remet la somme en mars. Le retrait ne revient en droits que le 1er janvier suivant : en mars, il crée un excédent de ${h.m(lim)}. Laissé jusqu'à la fin de l'année, il coûte ${h.m(redep)}.</p>
<p><strong>Le changement d'institution fait à la main.</strong> Seul un transfert direct entre institutions est neutre. Retirer ${h.m(20000)} d'un CELI en juin pour les déposer dans un CELI ailleurs compte comme un retrait suivi d'une cotisation. Sans droits libres, la cotisation est un excédent de ${h.m(20000)} : ${h.m(moved)} de juin à décembre.</p>
<p><strong>Se fier au chiffre de Mon dossier en janvier.</strong> Les institutions transmettent les opérations d'une année à la fin de février de l'année suivante. Au 1er janvier, le chiffre affiché ignore donc ce que vous avez versé l'année précédente. Plusieurs comptes chez plusieurs institutions compliquent encore le compte : vos droits sont communs à tous vos CELI.</p>
${h.mini('celi', { t: 'Refaire le compte de vos droits', p: ['na', 'cb', 'cn'], d: { cb: 60000, cn: 7000 }, c: 'Ajouter vos retraits' })}
<h2>Déclarer et payer</h2>
<p>Pour toute année où l'impôt est dû, il faut remplir le formulaire RC243, déclaration CELI, avec son annexe A (RC243-SCH-A) sur les excédents, et l'envoyer au plus tard le 30 juin de l'année suivante, date où l'impôt doit aussi être payé. L'Agence envoie de son côté une lettre d'information ou un avis de cotisation, d'habitude l'année qui suit l'excédent, une fois qu'elle a reçu les relevés des institutions. L'excédent peut donc courir plusieurs mois avant que vous en soyez avisé : tenez votre propre registre.</p>
<h2>Demander l'annulation</h2>
<p>L'Agence peut renoncer à l'impôt ou l'annuler en tout ou en partie si c'est équitable, en tenant compte notamment d'une erreur raisonnable et des retraits faits pour corriger. La demande se fait par lettre, en expliquant pourquoi l'excédent est apparu et pourquoi l'annulation serait juste. Si vous êtes en désaccord avec un avis, l'opposition se fait dans les 90 jours, mais l'Agence recommande de commencer par la demande d'annulation. Un excédent versé délibérément est traité plus durement : le revenu qu'il produit est un avantage imposé à part. Pour savoir combien vous pouvez verser sans risque, partez de la page ${h.a('droits-celi', 'droits de cotisation CELI')}, et pour l'effet d'un retrait sur vos droits, de la page ${h.a('retrait-celi', 'retrait CELI')}.</p>
`,
  },
  en: {
    slug: 'tfsa-over-contribution',
    nav: 'TFSA over-contribution', card: `Putting in more than your room costs 1% a month on the month's highest excess. The math and how to fix it.`,
    title: `TFSA over-contribution ${Y}: the 1% monthly tax and fix`,
    description: `TFSA over-contribution in ${Y}: 1% a month on the highest excess in each month, from the first dollar. Cost by duration, how to withdraw it, and Form RC243.`,
    h1: `TFSA over-contribution in ${Y}: what it costs and how to fix it`,
    intro: 'Enter the amount you put in over your room and the months before you take it out: the calculator applies the Canada Revenue Agency’s 1% monthly tax.',
    resume: `A TFSA over-contribution costs 1% a month on the highest excess amount in each month, for as long as it stays in the account. A ${E.m(3000)} excess left for six months costs ${E.m(tx(3000, 6))}; ${E.m(lim)} left for a year costs ${E.m(tx(lim, 12))}. Unlike an RRSP, there is no cushion: the tax applies from the first dollar, and a whole month is charged even if you take the excess out a few days after putting it in. The way to stop it is to withdraw the extra amount; otherwise it melts away on the following January 1, when the new limit and that year's withdrawals are added to your room. The two most common causes are putting a withdrawal back in the same year and moving money between institutions yourself instead of by direct transfer. For any year in which the tax is owed, you must file Form RC243 and its Schedule A by June 30 of the following year.`,
    faqs: [
      { q: 'How much is the penalty for over-contributing to a TFSA?', a: `The tax is 1% a month on the highest excess amount in the month. A ${E.m(5000)} excess left for three months costs ${E.m(tx(5000, 3))}. The month the excess appears counts in full, and so does the month you remove it. Income earned on an excess made on purpose can also be treated as an advantage and taxed separately.` },
      { q: 'How do I fix a TFSA over-contribution?', a: `Withdraw the extra amount as soon as you notice it. The withdrawal stops the tax from the following month. Do not put that money back in the same year: a withdrawal only gives you room on the next January 1. If you wait, the excess will eventually be absorbed by the new January room, but the tax keeps running until then.` },
      { q: 'Do I need to file Form RC243 for a TFSA excess?', a: `Yes. For any year in which you owe tax on an excess, you must file Form RC243, the TFSA return, with Schedule A (RC243-SCH-A), by June 30 of the following year, and pay the tax by that date. If you do not, the Agency can work out the tax from the information your institutions sent in.` },
      { q: 'Can the CRA waive the TFSA over-contribution tax?', a: `It can waive or cancel all or part of the tax if it finds that fair, in particular when the excess came from a reasonable error and was taken out. You send a letter explaining how the excess happened and why relief would be fair, by mail or through the "Submit documents" service in My Account.` },
    ],
    body: (h) => `
<h2>How the tax is worked out</h2>
<p>The ${h.src('rc4466', 'Canada Revenue Agency')} defines the excess as the part of your contributions for the year that goes beyond your room at the start of the year, plus the part of any withdrawal that went to reduce an excess already created. Whenever an excess exists at any point in a month, you owe 1% of the highest excess in that month. The count runs month by month: if the excess shrinks along the way, the tax drops from the following month.</p>
${h.table(['Excess', '1 month', '3 months', '6 months', '12 months'], amounts.map((a) => [h.m(a), ...months.map((m) => h.m(tx(a, m)))]), 'Tax of 1% a month on an excess that stays the same.', ['l', 'r', 'r', 'r', 'r'])}
<p>The month counts in full. Someone who creates a ${h.m(2500)} excess on October 30 and takes it out on the 31st still owes ${h.m(sameMonth)} for October. On the other hand, nothing compounds: the tax is simple, in proportion to the amount and the number of months.</p>
<h2>No cushion, unlike an RRSP</h2>
<p>An RRSP tolerates a cumulative excess of ${h.m(cushion)} before its ${h.src('cra_rrsp_excess', '1% monthly tax')} kicks in. A TFSA has nothing like that: the guide says the tax applies from the first dollar over. Going over by a few hundred dollars, because of a forgotten automatic transfer for instance, is taxed like any other excess. The FHSA works the same way, with its own 1% monthly tax on excess amounts.</p>
<h2>Withdrawing to fix it</h2>
<p>A withdrawal made after the excess was created reduces it by the same amount, until it is gone. If someone has had a ${h.m(3000)} excess since May and takes it out in August, they pay four months, May to August: ${h.m(quick)}. Whatever part of the withdrawal goes beyond the excess does nothing that year: it cannot offset a new excess created later in the year. That part is simply added to your room on the following January 1.</p>
<p>Without a withdrawal, the excess stays until new room absorbs it. On January 1, the year's limit and the previous year's withdrawals are added; if together they cover the excess, the tax stops. If not, what is left keeps being taxed through the following year.</p>
<h2>The mistakes that create an excess</h2>
<p><strong>Putting money back in the same year.</strong> This is the classic one. Someone who has already used up their room takes out ${h.m(lim)} in February for an expense, changes their mind and puts it back in March. The withdrawal only turns into room on the next January 1, so in March it creates a ${h.m(lim)} excess. Left until year end, it costs ${h.m(redep)}.</p>
<p><strong>Switching institutions by hand.</strong> Only a direct transfer between institutions is neutral. Taking ${h.m(20000)} out of a TFSA in June to deposit it in a TFSA elsewhere counts as a withdrawal followed by a contribution. With no free room, that contribution is a ${h.m(20000)} excess: ${h.m(moved)} from June to December.</p>
<p><strong>Trusting the My Account figure in January.</strong> Institutions report a year's transactions at the end of February of the following year. On January 1, the figure shown therefore leaves out what you put in the year before. Several accounts at several institutions make it harder still: your room is shared across all your TFSAs.</p>
${h.mini('celi', { t: 'Redo your room count', p: ['na', 'cb', 'cn'], d: { cb: 60000, cn: 7000 }, c: 'Add your withdrawals' })}
<h2>Filing and paying</h2>
<p>For any year in which the tax is owed, you fill out Form RC243, the TFSA return, with Schedule A (RC243-SCH-A) for excess amounts, and send it by June 30 of the following year, which is also when the tax must be paid. The Agency, for its part, sends an educational letter or a notice of assessment, usually the year after the excess, once it has the institutions' records. An excess can therefore run for months before you hear about it: keep your own record.</p>
<h2>Asking for the tax to be waived</h2>
<p>The Agency can waive or cancel the tax in whole or in part if it is fair to do so, looking in particular at whether there was a reasonable error and at withdrawals made to fix it. The request is a letter explaining why the excess happened and why relief would be fair. If you disagree with an assessment, an objection must be filed within 90 days, but the Agency recommends starting with the waiver request. A deliberate over-contribution is treated more harshly: the income it earns is an advantage taxed separately. To know how much you can safely put in, start from the ${h.a('droits-celi', 'TFSA contribution room')} page, and for how a withdrawal affects your room, the ${h.a('retrait-celi', 'TFSA withdrawal')} page.</p>
`,
  },
});
