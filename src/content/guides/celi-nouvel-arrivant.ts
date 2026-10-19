import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const lim = K.tfsaLimit(Y);
const room = (birthYear: number, arrival: number) => K.tfsaRoom({ birthYear, arrival, contribBefore: 0, withdrawBefore: 0, contribThisYear: 0, withdrawThisYear: 0 });
// Exemple principal : né en 1990, arrivé en 2023 (valeurs du simulateur en tête).
const a23 = room(1990, 2023);
// Étudiante née en 2007, arrivée en 2025 : droits depuis 2025, l'année de ses 18 ans.
const st = room(2007, 2025);
// Arrivée en cours d'année (exemple : novembre de l'année en cours).
const aNow = room(1990, Y);
const byArrival = [2015, 2018, 2020, 2022, 2023, 2024, 2025, Y].map((y) => ({ y, r: room(1990, y) }));
const preTax = K.excessTax(5000, 4);
const NEWC = { fr: 'https://www.canada.ca/fr/agence-revenu/services/impot/impot-international-non-residents/particuliers-depart-canada-entree-canada-non-residents/nouveaux-arrivants-canada-immigrants.html', en: 'https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/newcomers-canada-immigrants.html' };
const STUD = { fr: 'https://www.canada.ca/fr/agence-revenu/services/impot/impot-international-non-residents/particuliers-depart-canada-entree-canada-non-residents/etudiants-etrangers-canada.html', en: 'https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/international-students-studying-canada.html' };

export default defineGuide({
  id: 'celi-nouvel-arrivant', group: 'celi', order: 3, tool: 'celi',
  toolArg: { ar: '2023', na: '1990' },
  related: ['droits-celi', 'plafond-celi', 'celi-non-resident', 'excedent-celi', 'celiapp'],
  sources: ['rc4466', 'cra_limits'],
  fr: {
    slug: 'celi-nouvel-arrivant',
    nav: 'CELI pour nouvel arrivant', card: `Arrivé au Canada récemment ? Vos droits commencent l'année où vous devenez résident, sans prorata : ${F.m(lim)} pour ${Y}.`,
    title: `CELI nouvel arrivant ${Y} : droits dès l'année d'arrivée`,
    description: `CELI pour nouvel arrivant en ${Y} : droits ouverts l'année où vous devenez résident, plafond complet de ${F.m(lim)} sans prorata, NAS valide requis. Tableau.`,
    h1: `CELI pour nouvel arrivant en ${Y} : vos droits depuis votre arrivée`,
    intro: 'Choisissez votre année de naissance et l’année où vous êtes devenu résident du Canada : le simulateur additionne les plafonds des seules années qui comptent pour vous.',
    resume: `Un nouvel arrivant accumule des droits CELI à partir de l'année où il devient résident du Canada aux fins de l'impôt, s'il a au moins 18 ans, et il reçoit le plafond entier de cette année, sans prorata pour les mois vécus à l'étranger. Une personne née en 1990 arrivée en 2023 dispose ainsi de ${F.m(a23.available)} en ${Y} si elle n'a encore rien versé : les plafonds de 2023 à ${Y}. Quelqu'un qui s'installe en novembre ${Y} reçoit tout de même ${F.m(aNow.available)} pour ${Y}. Les années passées hors du Canada avant l'arrivée ne donnent rien, même si la personne avait déjà 18 ans en 2009. Pour ouvrir un compte, il faut un numéro d'assurance sociale (NAS) valide et au moins 18 ans. Ce qui compte est la résidence fiscale, pas le statut d'immigration : un étudiant ou un travailleur étranger peut être résident aux fins de l'impôt s'il a des liens de résidence importants au Canada. Une cotisation faite avant de devenir résident est imposée à 1 % par mois.`,
    faqs: [
      { q: `Un nouvel arrivant a-t-il droit au plafond CELI complet l'année de son arrivée ?`, a: `Oui. Le plafond annuel n'est pas réparti au prorata l'année où une personne devient résidente du Canada. Que vous arriviez en janvier ou en décembre ${Y}, vous recevez ${F.m(lim)} pour ${Y}, à condition d'avoir au moins 18 ans et un numéro d'assurance sociale valide. Vous pouvez verser ce montant dès que vous êtes résident.` },
      { q: 'Un étudiant étranger peut-il ouvrir un CELI ?', a: `Oui, s'il a 18 ans, un NAS valide et qu'il est résident du Canada aux fins de l'impôt. Le permis d'études ne règle pas la question : ce sont les liens de résidence qui comptent, comme un logement au Canada, un conjoint ou des personnes à charge ici. Un étudiant qui ne crée pas ces liens et reste moins de 183 jours est non-résident, et ses cotisations seraient imposées.` },
      { q: 'Les années avant mon arrivée au Canada comptent-elles pour le CELI ?', a: `Non. Une année entière vécue hors du Canada comme non-résident ne donne aucun droit, même si vous aviez 18 ans en 2009. Vos droits commencent l'année où vous devenez résident. Une personne arrivée en 2020 additionne donc les plafonds de 2020 à ${Y}, soit ${F.m(room(1990, 2020).available)}, et non le total de ${F.m(K.tfsaCum(Y))} depuis 2009.` },
      { q: 'Puis-je cotiser à mon CELI en devises étrangères ?', a: `Oui, un CELI peut recevoir des fonds en devises étrangères. L'institution convertit le montant en dollars canadiens au taux de change du jour de l'opération quand elle déclare la cotisation à l'Agence du revenu du Canada. C'est ce montant en dollars canadiens qui ne doit pas dépasser vos droits. Une variation du taux de change après coup ne change rien à vos droits.` },
    ],
    body: (h) => `
<h2>Ce qui déclenche vos premiers droits</h2>
<p>L’${h.src('rc4466', 'Agence du revenu du Canada')} pose deux conditions pour qu'une année vous donne le plafond CELI : avoir au moins 18 ans et être résident du Canada à un moment de l'année. Pour un nouvel arrivant, la première année admissible est donc celle où il devient résident aux fins de l'impôt. Selon la ${h.ext(NEWC[h.lang], 'page de l’Agence pour les nouveaux arrivants')}, cela commence pour la plupart des gens le premier jour où ils vivent au Canada, dès qu'ils y ont des liens de résidence suffisants.</p>
<p>Il faut aussi un numéro d'assurance sociale valide : l'institution l'inscrit, avec votre date de naissance, pour enregistrer le compte comme CELI. Sans ces renseignements, ou avec des renseignements erronés, l'enregistrement peut être refusé, et le revenu du compte devient alors imposable comme celui d'un compte ordinaire.</p>
<h2>Pas de prorata, même en décembre</h2>
<p>La règle est la même que pour l'année des 18 ans : le plafond de l'année d'arrivée est accordé en entier. Le guide le dit en toutes lettres pour l'année où une personne devient résidente ou cesse de l'être. Si vous vous installez à l'automne ${Y}, vous disposez de ${h.m(aNow.available)} dès que vous êtes résident, et vos droits de ${Y + 1} s'ajouteront le 1er janvier suivant. Il n'existe pas de date limite pour utiliser ces droits : ce qui n'est pas versé se reporte sans fin.</p>
<h2>Vos droits selon l'année d'arrivée</h2>
<p>Le tableau suivant vaut pour une personne née en 1990, donc adulte à son arrivée, qui n'a jamais cotisé. Il additionne les ${h.src('cra_limits', 'plafonds officiels')} depuis l'année d'arrivée incluse. Un adulte arrivé en 2023 dispose ainsi de ${h.m(a23.available)}, soit ${h.n(a23.years)} plafonds.</p>
${h.table(['Arrivée', 'Années comptées', `Droits en ${Y}`], byArrival.map((x) => [String(x.y), String(x.r.years), h.m(x.r.available)]), `Personne de plus de 18 ans à l'arrivée, aucune cotisation. Le total de ${h.m(K.tfsaCum(Y))} suppose une résidence depuis 2009.`, ['l', 'r', 'r'])}
<p>Pour un jeune arrivé avant ses 18 ans, c'est l'année des 18 ans qui compte, pas celle de l'arrivée. Une étudiante née en 2007 et arrivée en 2025 a ses premiers droits en 2025, l'année de ses 18 ans, soit ${h.m(st.available)} en ${Y}. Là où l'âge de la majorité est de 19 ans, elle ne pourra ouvrir le compte qu'à 19 ans, mais les droits de l'année des 18 ans sont reportés.</p>
<h2>Étudiants et travailleurs étrangers : la résidence fiscale décide</h2>
<p>Le statut d'immigration (permis d'études, permis de travail, résidence permanente) dit si vous pouvez vivre, travailler ou étudier au Canada. Il ne dit pas si vous êtes résident aux fins de l'impôt. L'Agence regarde vos liens de résidence : les liens importants sont un logement au Canada, un conjoint ou conjoint de fait au Canada et des personnes à charge au Canada ; d'autres liens peuvent jouer, comme une voiture, des comptes bancaires, un permis de conduire ou une assurance maladie provinciale.</p>
<p>La ${h.ext(STUD[h.lang], 'page sur les étudiants étrangers')} précise que beaucoup d'étudiants qui étudient ou font de la recherche au Canada y créent des liens importants et sont résidents, y compris pour une partie de l'année. Un étudiant qui retourne souvent dans son pays et reste moins de 183 jours sans liens importants est non-résident. Il existe aussi des cas de résident réputé et de non-résident réputé, liés au nombre de jours et aux conventions fiscales. Pour un avis de l'Agence, il faut remplir le formulaire NR74. Ce site ne peut pas trancher votre situation.</p>
<h2>Attention aux versements faits trop tôt</h2>
<p>Un non-résident qui a un NAS peut ouvrir un CELI, mais toute cotisation faite pendant qu'il n'est pas résident est imposée à 1 % par mois tant qu'elle reste dans le compte. Quelqu'un qui verserait ${h.m(5000)} quatre mois avant de devenir résident paierait ${h.m(preTax)}. Attendez d'être résident, puis versez dans la limite des droits de l'année.</p>
${h.mini('excedent', { t: 'Coût d’une cotisation faite avant la résidence', p: ['ex', 'mo'], d: { ex: 5000, mo: 4 }, c: 'Voir le détail de l’impôt de 1 %' })}
<h2>Et ensuite</h2>
<p>Vos droits évoluent ensuite comme ceux de tout résident : plafond ajouté chaque 1er janvier, retraits recrédités l'année suivante. Les détails sont sur la page ${h.a('droits-celi', 'droits de cotisation CELI')}. Si vous pensez acheter une première maison, le ${h.a('celiapp', 'CELIAPP')} demande lui aussi d'être résident, et ses droits ne commencent qu'à l'ouverture du compte : l'ouvrir tôt compte davantage que pour le CELI.</p>
`,
  },
  en: {
    slug: 'tfsa-newcomers',
    nav: 'TFSA for newcomers', card: `New to Canada? Your room starts the year you become a resident, with no proration: ${E.m(lim)} for ${Y}.`,
    title: `TFSA for newcomers ${Y}: room from your arrival year`,
    description: `TFSA for newcomers to Canada in ${Y}: room opens the year you become a resident, the full ${E.m(lim)} limit with no proration, valid SIN required. Table by year.`,
    h1: `TFSA for newcomers in ${Y}: your room since you arrived`,
    intro: 'Pick your year of birth and the year you became a resident of Canada: the calculator adds the limits for the years that count for you, and only those.',
    resume: `A newcomer builds TFSA room from the year they become a resident of Canada for tax purposes, if they are at least 18, and gets that year's full limit with no proration for the months spent abroad. Someone born in 1990 who arrived in 2023 therefore has ${E.m(a23.available)} in ${Y} if they have not contributed yet: the limits from 2023 to ${Y}. Someone who settles here in November ${Y} still gets ${E.m(aNow.available)} for ${Y}. Years spent outside Canada before arriving give nothing, even if the person was already 18 in 2009. Opening an account requires a valid social insurance number (SIN) and being at least 18. Tax residency is what matters, not immigration status: an international student or foreign worker can be a resident for tax purposes if they have significant residential ties in Canada. A contribution made before becoming a resident is taxed at 1% a month.`,
    faqs: [
      { q: 'Do newcomers get the full TFSA limit in their first year?', a: `Yes. The annual limit is not prorated in the year a person becomes a resident of Canada. Whether you arrive in January or December ${Y}, you get ${E.m(lim)} for ${Y}, as long as you are at least 18 and have a valid social insurance number. You can contribute that amount as soon as you are a resident.` },
      { q: 'Can international students open a TFSA?', a: `Yes, if they are 18, have a valid SIN and are residents of Canada for tax purposes. A study permit does not settle the question: residential ties do, such as a home in Canada or a spouse or dependants here. A student who does not build those ties and stays fewer than 183 days is a non-resident, and any contributions would be taxed.` },
      { q: 'Do years before I moved to Canada count for TFSA room?', a: `No. A full year lived outside Canada as a non-resident gives no room, even if you were 18 in 2009. Your room starts the year you become a resident. Someone who arrived in 2020 adds up the limits from 2020 to ${Y}, which is ${E.m(room(1990, 2020).available)}, not the ${E.m(K.tfsaCum(Y))} total since 2009.` },
      { q: 'Can I contribute foreign currency to a TFSA?', a: `Yes, a TFSA can take funds in a foreign currency. The institution converts the amount to Canadian dollars at the exchange rate on the day of the transaction when it reports the contribution to the Canada Revenue Agency. That Canadian dollar amount is what must stay within your room. Later moves in the exchange rate do not change your room.` },
    ],
    body: (h) => `
<h2>What starts your first room</h2>
<p>The ${h.src('rc4466', 'Canada Revenue Agency')} sets two conditions for a year to give you the TFSA limit: being at least 18 and being a resident of Canada at some point in the year. For a newcomer, the first eligible year is the one in which they become a resident for tax purposes. According to the Agency's ${h.ext(NEWC[h.lang], 'page for newcomers')}, for most people that starts on the first day they live in Canada, once they have enough residential ties here.</p>
<p>You also need a valid social insurance number: the institution records it, with your date of birth, to register the account as a TFSA. If that information is missing or wrong, registration can be refused, and the account's income then becomes taxable like that of an ordinary account.</p>
<h2>No proration, even in December</h2>
<p>The rule is the same as for the year you turn 18: the arrival year's limit is granted in full. The guide states it plainly for the year a person becomes, or stops being, a resident. If you settle here in the fall of ${Y}, you have ${h.m(aNow.available)} as soon as you are a resident, and your ${Y + 1} room is added the following January 1. There is no deadline to use that room: whatever you do not contribute carries forward indefinitely.</p>
<h2>Your room by year of arrival</h2>
<p>The table below is for someone born in 1990, so an adult on arrival, who has never contributed. It adds up the ${h.src('cra_limits', 'official limits')} from the arrival year on, that year included. An adult who arrived in 2023 has ${h.m(a23.available)}, which is ${h.n(a23.years)} annual limits.</p>
${h.table(['Arrived', 'Years counted', `Room in ${Y}`], byArrival.map((x) => [String(x.y), String(x.r.years), h.m(x.r.available)]), `Person over 18 on arrival, no contributions. The ${h.m(K.tfsaCum(Y))} total assumes residence since 2009.`, ['l', 'r', 'r'])}
<p>For someone who arrived before turning 18, the year they turn 18 is what counts, not the arrival year. A student born in 2007 who arrived in 2025 gets her first room in 2025, the year she turned 18, so ${h.m(st.available)} in ${Y}. Where the age of majority is 19, she can only open the account at 19, but the room for the year she turned 18 carries over.</p>
<h2>International students and foreign workers: tax residency decides</h2>
<p>Immigration status (study permit, work permit, permanent residence) tells you whether you can live, work or study in Canada. It does not tell you whether you are a resident for tax purposes. The Agency looks at residential ties: the significant ones are a home in Canada, a spouse or common-law partner in Canada and dependants in Canada; others can matter too, such as a car, bank accounts, a driver's licence or provincial health insurance.</p>
<p>The ${h.ext(STUD[h.lang], 'page on international students')} notes that many students who study or do research in Canada do build significant ties and are residents, including for part of the year. A student who goes home often and stays fewer than 183 days without significant ties is a non-resident. There are also deemed resident and deemed non-resident cases, tied to the number of days and to tax treaties. For the Agency's opinion, file Form NR74. This site cannot settle your own case.</p>
<h2>Watch out for contributing too early</h2>
<p>A non-resident with a SIN can open a TFSA, but any contribution made while not a resident is taxed at 1% a month for as long as it stays in the account. Someone who put in ${h.m(5000)} four months before becoming a resident would owe ${h.m(preTax)}. Wait until you are a resident, then contribute within the year's room.</p>
${h.mini('excedent', { t: 'Cost of contributing before residency', p: ['ex', 'mo'], d: { ex: 5000, mo: 4 }, c: 'See how the 1% tax works' })}
<h2>After that</h2>
<p>From then on your room changes like any resident's: the limit is added every January 1 and withdrawals come back the following year. The details are on the ${h.a('droits-celi', 'TFSA contribution room')} page. If you plan to buy a first home, the ${h.a('celiapp', 'FHSA')} also requires residency, and its room only starts once the account is open, so opening it early matters more than it does for a TFSA.</p>
`,
  },
});
