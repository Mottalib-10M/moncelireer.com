import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const cum = K.tfsaCum(Y);
const lim = K.tfsaLimit(Y);
// Exemples : né en 2000 (droits depuis 2018) ; arrivée en 2021 ; retrait de 10 000 $ en 2025.
const b2000 = K.tfsaRoom({ birthYear: 2000, arrival: 0, contribBefore: 0, withdrawBefore: 0, contribThisYear: 0, withdrawThisYear: 0 });
const arr21 = K.tfsaRoom({ birthYear: 1988, arrival: 2021, contribBefore: 0, withdrawBefore: 0, contribThisYear: 0, withdrawThisYear: 0 });
const wd = K.tfsaRoom({ birthYear: 1985, arrival: 0, contribBefore: 60000, withdrawBefore: 10000, contribThisYear: 0, withdrawThisYear: 0 });
const byBirth = [1990, 1995, 2000, 2003, 2005, 2008].map((y) => ({ y, start: K.tfsaStart(y, 0), room: K.tfsaRoom({ birthYear: y, arrival: 0, contribBefore: 0, withdrawBefore: 0, contribThisYear: 0, withdrawThisYear: 0 }).available }));

export default defineGuide({
  id: 'droits-celi', group: 'celi', order: 1, tool: 'celi',
  toolArg: { na: 1995 },
  related: ['plafond-celi', 'celi-nouvel-arrivant', 'retrait-celi', 'excedent-celi', 'reer-ou-celi'],
  sources: ['cra_limits', 'rc4466'],
  fr: {
    slug: 'droits-cotisation-celi',
    nav: 'Droits de cotisation CELI', card: `Vos droits cumulés depuis 2009, l'année de vos 18 ans ou votre arrivée : jusqu'à ${F.m(cum)} en ${Y}.`,
    title: `Droits de cotisation CELI ${Y} : calcul selon votre âge`,
    description: `Droits de cotisation CELI ${Y} : ${F.m(cum)} au plus depuis 2009, selon l'année de vos 18 ans, votre arrivée au Canada et vos retraits. Calcul année par année.`,
    h1: `Droits de cotisation CELI ${Y} : combien pouvez-vous verser ?`,
    intro: 'Entrez votre année de naissance, votre arrivée au Canada et ce que vous avez déjà versé ou retiré : le simulateur refait le compte de l’Agence du revenu du Canada, année par année.',
    resume: `Vos droits de cotisation CELI en ${Y} sont la somme des plafonds annuels de chaque année où vous aviez au moins 18 ans et résidiez au Canada, depuis 2009, moins tout ce que vous avez versé, plus tout ce que vous avez retiré avant le 1er janvier ${Y}. Une personne née en 1991 ou avant, résidente depuis 2009 et qui n'a jamais cotisé dispose de ${F.m(cum)} cette année. Une personne née en 2000 n'accumule des droits qu'à partir de 2018 : ${F.m(b2000.available)}. Quelqu'un arrivé au Canada en 2021 commence cette année-là, sans prorata pour les mois passés à l'étranger : ${F.m(arr21.available)}. Le plafond de ${Y} est de ${F.m(lim)}. Un retrait ne libère pas de droits tout de suite : il s'ajoute à vos droits le 1er janvier de l'année suivante. Les intérêts, dividendes et gains réalisés dans le compte ne touchent pas vos droits, et les pertes non plus. Le plafond ${Y + 1} n'est pas encore publié.`,
    faqs: [
      { q: `Comment savoir combien j'ai de droits CELI en ${Y} ?`, a: `Additionnez les plafonds des années où vous aviez 18 ans et résidiez au Canada, retranchez vos cotisations et ajoutez vos retraits des années passées. Le simulateur le fait pour vous. Le chiffre de Mon dossier, à l'Agence du revenu du Canada, part de ce que les institutions ont déclaré au début de l'année : il ne voit pas encore vos opérations de ${Y}, d'où des écarts fréquents.` },
      { q: 'Est-ce que les rendements de mon CELI réduisent mes droits ?', a: `Non. Les droits ne dépendent que des sommes versées et retirées. Si vous avez placé ${F.m(20000)} qui valent aujourd'hui ${F.m(30000)}, vous avez utilisé ${F.m(20000)} de droits. Si vous retirez les ${F.m(30000)}, vous récupérez ${F.m(30000)} de droits le 1er janvier suivant. À l'inverse, une perte ne vous rend aucun droit : un placement tombé à ${F.m(12000)} reste compté pour ${F.m(20000)}.` },
      { q: 'Les droits CELI inutilisés se perdent-ils ?', a: `Jamais. Les droits non utilisés s'accumulent sans limite de temps et se reportent d'année en année. Une personne qui ouvre son premier CELI à 40 ans peut verser d'un coup tous les droits accumulés depuis ses 18 ans ou depuis 2009, soit jusqu'à ${F.m(cum)} en ${Y}. Il n'y a pas non plus d'âge maximal pour cotiser, contrairement au REER.` },
      { q: 'Mes droits CELI sont-ils partagés avec mon conjoint ?', a: `Non, chaque personne a ses propres droits. Un couple dont les deux conjoints sont nés avant 1992 et résident au Canada depuis 2009 dispose de ${F.m(cum * 2)} au total. Vous pouvez donner de l'argent à votre conjoint pour qu'il le verse dans son propre CELI : les règles d'attribution du revenu ne s'appliquent pas tant que l'argent reste dans le compte.` },
    ],
    body: (h) => `
<h2>Le calcul de l'Agence, en trois lignes</h2>
<p>L’${h.src('rc4466', 'Agence du revenu du Canada')} définit vos droits au début d'une année comme la somme de trois montants : le plafond de l'année, vos droits inutilisés de l'année précédente et les retraits faits l'année précédente. En déroulant ce calcul depuis votre première année admissible, on obtient une formule simple : plafonds cumulés, moins cotisations, plus retraits des années passées. Le simulateur ci-dessus l'applique avec le tableau officiel des ${h.src('cra_limits', 'plafonds publiés sur canada.ca')}.</p>
${h.table(['Année', 'Plafond'], Object.entries(K.P.tfsa.limits).map(([y, v]) => [y, h.m(v)]), `Plafonds annuels du CELI depuis sa création. Total de 2009 à ${Y} : ${h.m(cum)}.`, ['l', 'r'])}
<h2>À partir de quand vos droits commencent</h2>
<p>Trois conditions doivent être réunies pour qu'une année vous ouvre des droits : l'année doit être 2009 ou plus tard, vous devez avoir 18 ans à un moment de l'année, et vous devez être résident du Canada à un moment de l'année. La date exacte ne compte pas : une personne qui fête ses 18 ans le 31 décembre reçoit le plafond complet de l'année. Le tableau suivant montre ce que cela donne selon l'année de naissance, pour quelqu'un qui a toujours vécu au Canada et n'a jamais cotisé.</p>
${h.table(['Né en', 'Droits depuis', `Droits en ${Y}`], byBirth.map((x) => [String(x.y), x.start ? String(x.start) : '', h.m(x.room)]), 'Résident du Canada depuis la naissance, aucune cotisation.', ['l', 'l', 'r'])}
<p>Là où l'on ne peut signer un contrat qu'à 19 ans (c'est l'âge de la majorité en Colombie-Britannique, au Nouveau-Brunswick, en Nouvelle-Écosse, à Terre-Neuve-et-Labrador et dans les trois territoires), on ne peut pas ouvrir de CELI à 18 ans. Les droits de l'année des 18 ans ne sont pas perdus pour autant : le guide précise qu'ils sont reportés à l'année suivante.</p>
${h.mini('celi', { t: 'Vos droits selon votre année de naissance', p: ['na', 'cb'], c: 'Ajouter retraits et arrivée au Canada' })}
<h2>Les retraits reviennent, mais l'année suivante</h2>
<p>Un retrait du CELI n'est jamais imposé, mais il ne crée pas de droits immédiatement. Il s'ajoute à vos droits le 1er janvier qui suit. Prenons quelqu'un né en 1985 qui a versé ${h.m(60000)} au fil des ans et retiré ${h.m(10000)} en 2025 pour une voiture : ses droits au 1er janvier ${Y} sont de ${h.m(wd.roomJan1)}, retrait compris. S'il avait remis les ${h.m(10000)} dans son compte dès décembre 2025 sans avoir de droits libres, il aurait créé un excédent imposé à 1 % par mois. Le simulateur montre aussi ce qui reviendra le 1er janvier ${Y + 1} si vous retirez cette année.</p>
<p>Les transferts directs d'un CELI à un autre, faits par les institutions, ne sont ni des retraits ni des cotisations : ils ne touchent pas vos droits. Un retrait suivi d'un dépôt dans une autre banque, lui, compte comme un retrait puis une cotisation.</p>
<h2>Pourquoi votre chiffre diffère de Mon dossier</h2>
<p>Le montant affiché par l'Agence du revenu du Canada correspond à vos droits au 1er janvier, calculés avec les déclarations que les banques transmettent après la fin de chaque année. Il ne tient pas compte des cotisations et retraits de l'année en cours. Si vous avez cotisé en février, Mon dossier vous montrera encore vos droits de janvier jusqu'au printemps suivant. Tenez votre propre compte : vos relevés font foi, et le simulateur sert justement à refaire le calcul avec vos montants.</p>
<h2>Non-résidents et nouveaux arrivants</h2>
<p>Une année civile entière passée hors du Canada comme non-résident ne donne aucun droit. L'année du départ et celle du retour comptent en entier. Si vous étiez déjà au Canada en 2009 mais avez vécu à l'étranger de 2015 à 2017, ces trois plafonds manquent à votre total ; le champ « Années entières hors du Canada » des options les retire. Les règles propres aux personnes arrivées récemment sont détaillées sur la page ${h.a('celi-nouvel-arrivant', 'CELI pour nouvel arrivant')}, et celles des personnes qui quittent le pays sur la page ${h.a('celi-non-resident', 'CELI et non-résident')}.</p>
<h2>Que faire de ces droits</h2>
<p>Avoir des droits ne veut pas dire qu'il faut les remplir avant le REER. Le CELI convient mieux quand votre taux d'imposition est bas aujourd'hui ou quand vous prévoyez des prestations calculées sur le revenu à la retraite. La comparaison chiffrée, avec les tranches ${Y} de votre province, se trouve sur la page ${h.a('reer-ou-celi', 'REER ou CELI')}.</p>
`,
  },
  en: {
    slug: 'tfsa-contribution-room',
    nav: 'TFSA contribution room', card: `Your room since 2009, the year you turned 18 or the year you arrived: up to ${E.m(cum)} in ${Y}.`,
    title: `TFSA contribution room ${Y}: how much you can put in`,
    description: `TFSA contribution room in ${Y}: up to ${E.m(cum)} since 2009, based on the year you turned 18, your arrival in Canada and your withdrawals. Year-by-year count.`,
    h1: `TFSA contribution room ${Y}: how much can you contribute?`,
    intro: 'Enter your year of birth, when you became a resident and what you have put in or taken out: the calculator redoes the Canada Revenue Agency count, one year at a time.',
    resume: `Your ${Y} TFSA contribution room is the sum of the annual limits for every year since 2009 in which you were at least 18 and a resident of Canada, minus everything you have contributed, plus everything you withdrew before January 1, ${Y}. Someone born in 1991 or earlier, resident since 2009, who has never contributed has ${E.m(cum)} this year. Someone born in 2000 only builds room from 2018 on: ${E.m(b2000.available)}. A newcomer who arrived in 2021 starts that year, with no proration for the months spent abroad: ${E.m(arr21.available)}. The ${Y} annual limit is ${E.m(lim)}. A withdrawal does not free up room right away; it is added back on January 1 of the following year. Interest, dividends and gains earned inside the account do not change your room, and neither do losses. The ${Y + 1} limit has not been published yet.`,
    faqs: [
      { q: `How do I find out my TFSA room for ${Y}?`, a: `Add the limits for each year you were 18 and lived in Canada, subtract what you contributed and add back what you withdrew in earlier years. The calculator does it for you. The figure in the CRA's My Account starts from what financial institutions reported at the start of the year, so it cannot see your ${Y} transactions yet, which is why the two often differ.` },
      { q: 'Does investment growth in my TFSA use up contribution room?', a: `No. Room only depends on the money you put in and take out. If you deposited ${E.m(20000)} that is now worth ${E.m(30000)}, you have used ${E.m(20000)} of room. Withdraw the ${E.m(30000)} and you get ${E.m(30000)} of room back the next January 1. A loss gives nothing back: an investment that fell to ${E.m(12000)} still counts as ${E.m(20000)} used.` },
      { q: 'Does unused TFSA room expire?', a: `Never. Unused room carries forward indefinitely, year after year. Someone opening a first TFSA at 40 can deposit, at once, all the room accumulated since turning 18 or since 2009, up to ${E.m(cum)} in ${Y}. There is no maximum age to contribute either, unlike an RRSP, which must be closed by the end of the year you turn 71.` },
      { q: 'Can my spouse use my TFSA room?', a: `No, each person has separate room. A couple who were both born before 1992 and have lived in Canada since 2009 have ${E.m(cum * 2)} between them. You can give your spouse money to put in their own TFSA: the income attribution rules do not apply to income earned in the account while the money stays there.` },
    ],
    body: (h) => `
<h2>The CRA's formula, in three lines</h2>
<p>The ${h.src('rc4466', 'Canada Revenue Agency')} defines your room at the start of a year as the sum of three amounts: the annual limit, your unused room from the previous year, and the withdrawals you made in the previous year. Unroll that from your first eligible year and it becomes simple: limits added up, minus contributions, plus past withdrawals. The calculator above applies it with the official table of ${h.src('cra_limits', 'limits on canada.ca')}.</p>
${h.table(['Year', 'Limit'], Object.entries(K.P.tfsa.limits).map(([y, v]) => [y, h.m(v)]), `Annual TFSA limits since the account was created. Total from 2009 to ${Y}: ${h.m(cum)}.`, ['l', 'r'])}
<h2>When your room starts</h2>
<p>A year gives you room only if three conditions hold: it is 2009 or later, you are 18 at some point in the year, and you are a resident of Canada at some point in the year. The date does not matter. If your 18th birthday falls on December 31, you still get that year's full limit. Here is what that means by year of birth for someone who has always lived in Canada and never contributed.</p>
${h.table(['Born in', 'Room since', `Room in ${Y}`], byBirth.map((x) => [String(x.y), x.start ? String(x.start) : '', h.m(x.room)]), 'Resident of Canada since birth, no contributions.', ['l', 'l', 'r'])}
<p>Where you cannot sign a contract until 19 (the age of majority in British Columbia, New Brunswick, Nova Scotia, Newfoundland and Labrador and the three territories), you cannot open a TFSA at 18. The room for the year you turned 18 is not lost: the guide says it carries over to the following year.</p>
${h.mini('celi', { t: 'Your room by year of birth', p: ['na', 'cb'], c: 'Add withdrawals and arrival in Canada' })}
<h2>Withdrawals come back, but next year</h2>
<p>A TFSA withdrawal is never taxed, but it does not create room right away. It is added to your room on the following January 1. Take someone born in 1985 who has put in ${h.m(60000)} over the years and took out ${h.m(10000)} in 2025 for a car: their room on January 1, ${Y} is ${h.m(wd.roomJan1)}, with the withdrawal included. Had they put the ${h.m(10000)} back in December 2025 without free room, they would have created an excess taxed at 1% a month. The calculator also shows what comes back on January 1, ${Y + 1} if you withdraw this year.</p>
<p>Direct transfers between TFSAs, done by the institutions, are neither withdrawals nor contributions and leave your room untouched. Taking cash out and depositing it at another bank counts as a withdrawal followed by a contribution.</p>
<h2>Why your figure differs from My Account</h2>
<p>The amount the Canada Revenue Agency shows is your room on January 1, computed from the returns banks file after each year ends. It ignores contributions and withdrawals made during the current year. If you contributed in February, My Account will keep showing your January room until the following spring. Keep your own record: your statements are the reference, and the calculator is there to redo the count with your own numbers.</p>
<h2>Non-residents and newcomers</h2>
<p>A full calendar year spent outside Canada as a non-resident earns no room. The year you leave and the year you come back count in full. If you lived in Canada in 2009 but abroad from 2015 to 2017, those three limits are missing from your total; the "Full years living outside Canada" field in the options takes them out. Rules for people who arrived recently are on the ${h.a('celi-nouvel-arrivant', 'TFSA for newcomers')} page, and rules for those leaving the country on the ${h.a('celi-non-resident', 'TFSA for non-residents')} page.</p>
<h2>What to do with that room</h2>
<p>Having room does not mean you should fill it before an RRSP. A TFSA tends to win when your tax rate is low today or when you expect income-tested benefits in retirement. The side-by-side comparison, with the ${Y} brackets of your province, is on the ${h.a('reer-ou-celi', 'RRSP vs TFSA')} page.</p>
`,
  },
});
