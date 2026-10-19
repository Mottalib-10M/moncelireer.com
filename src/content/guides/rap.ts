import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const HB = K.P.hbp;
const now = K.hbp(HB.limit, Y);
// Calendrier d'un retrait de 60 000 $ selon l'année du premier retrait.
const years = [2021, HB.reliefFrom, 2025, Y, HB.reliefTo, HB.reliefTo + 1];
const sched = years.map((y) => ({ y, p: K.hbp(HB.limit, y) }));
const after = K.hbp(HB.limit, HB.reliefTo + 1);
// Exemple : retrait de 35 000 $ en 2026 (versement minimum annuel).
const mid = K.hbp(35000, Y);
// Versement manqué : la tranche s'ajoute au revenu (60 000 $ de revenu, Ontario et Québec).
const missOn = K.wtax(60000, now.annual, 'ON'), missQc = K.wtax(60000, now.annual, 'QC');
const WD_FR = 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/reer-regimes-connexes/est-regime-accession-a-propriete/comment-retirer-fonds-reer-cadre-regime-accession-a-propriete.html';
const WD_EN = 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan/withdraw-funds-rrsp-s-under-home-buyers-plan.html';

export default defineGuide({
  id: 'rap', group: 'maison', order: 22, tool: 'rap',
  related: ['celiapp-ou-rap', 'celiapp', 'retrait-reer', 'plafond-reer', 'taux-marginal'],
  sources: ['cra_hbp', 'cra_rates_2026'],
  fr: {
    slug: 'rap-reer',
    nav: 'RAP', card: `Jusqu'à ${F.m(HB.limit)} tirés de votre REER pour une première maison, remboursés sur ${HB.repayYears} ans : à partir de ${now.start} pour un retrait en ${Y}.`,
    title: `RAP ${Y} : retirer ${F.m(HB.limit)} du REER et le rembourser`,
    description: `RAP ${Y} : jusqu'à ${F.m(HB.limit)} retirés du REER pour une maison, remboursés sur ${HB.repayYears} ans à partir de ${now.start} pour un premier retrait en ${Y}. Calendrier exact.`,
    h1: `RAP ${Y} : combien retirer du REER et quand rembourser`,
    intro: 'Entrez le montant retiré de vos REER au titre du RAP et l’année de votre premier retrait : le simulateur donne le versement minimum à remettre chaque année et la période de remboursement.',
    resume: `Le Régime d'accession à la propriété (RAP) permet de retirer jusqu'à ${F.m(HB.limit)} de vos REER pour acheter ou construire une habitation admissible, pour vous ou pour une personne handicapée déterminée. Cet argent n'est pas un cadeau fiscal mais un prêt à vous-même : il se rembourse dans un REER sur ${HB.repayYears} ans, soit au moins ${F.m(now.annual)} par année pour un retrait de ${F.m(HB.limit)}. Le remboursement commence normalement la 2e année suivant celle du premier retrait. Un allègement temporaire repousse ce début à la 5e année pour un premier retrait fait de ${HB.reliefFrom} à ${HB.reliefTo} : l'exemple officiel de l'Agence du revenu du Canada est un premier retrait en ${Y}, avec une première année de remboursement en ${now.start}. Un versement qui manque est ajouté à votre revenu de l'année, donc imposé à votre taux marginal. La partie d'un retrait qui dépasse ${F.m(HB.limit)} est imposée comme un retrait REER ordinaire.`,
    faqs: [
      { q: `Combien peut-on retirer du REER pour acheter une maison en ${Y} ?`, a: `La limite du RAP est de ${F.m(HB.limit)} par personne. Tout ce qui dépasse cette somme doit être déclaré comme revenu de l'année du retrait, et l'émetteur du REER retient de l'impôt sur l'excédent. Les retraits peuvent se faire en plusieurs fois, mais seulement dans l'année civile du premier retrait et en janvier de l'année suivante, avec un formulaire T1036 par retrait.` },
      { q: 'Quand commence le remboursement du RAP ?', a: `Normalement la 2e année qui suit l'année du premier retrait. Pour un premier retrait fait entre le 1er janvier ${HB.reliefFrom} et le 31 décembre ${HB.reliefTo}, le début est repoussé à la 5e année. L'Agence donne l'exemple d'un premier retrait en ${Y} : première année de remboursement en ${now.start}. La période dure ensuite ${HB.repayYears} ans, soit jusqu'en ${now.end} dans cet exemple.` },
      { q: 'Que se passe-t-il si on ne rembourse pas le RAP ?', a: `La somme qui devait être remise cette année-là est ajoutée à votre revenu imposable. Pour un retrait de ${F.m(HB.limit)} en ${Y}, c'est ${F.m(now.annual)} par année à partir de ${now.start}. À ${F.m(60000)} de revenu, ce montant ajouté coûterait environ ${F.m(missOn)} d'impôt en Ontario et ${F.m(missQc)} au Québec, aux tranches de ${Y}. Rembourser à temps évite cet impôt et remet l'argent à l'abri dans le REER.` },
      { q: 'L’allègement du remboursement du RAP a-t-il été prolongé ?', a: `Oui. L'allègement introduit par le budget de 2024 visait les premiers retraits faits du 1er janvier ${HB.reliefFrom} au 31 décembre 2025. Il a été prolongé aux premiers retraits faits du 1er janvier ${Y} au 31 décembre ${HB.reliefTo}. Dans les deux cas, la période de remboursement de ${HB.repayYears} ans commence la 5e année suivant le premier retrait, au lieu de la 2e.` },
    ],
    body: (h) => `
<h2>Ce que permet le RAP</h2>
<p>D'après la page ${h.src('cra_hbp', 'Régime d’accession à la propriété')} de l'Agence du revenu du Canada, le RAP vous laisse retirer des sommes de vos REER pour acheter ou construire une habitation admissible, pour vous-même ou pour une personne handicapée déterminée. La limite est de ${h.m(HB.limit)}. Les conditions détaillées, y compris celles qui définissent le premier acheteur, figurent sur la page d'admissibilité de l'Agence : vérifiez-les avant de remplir le formulaire T1036, qui sert à demander chaque retrait à l'émetteur de votre REER.</p>
<p>Selon la page ${h.ext(WD_FR, 'Comment retirer des fonds de vos REER dans le cadre du RAP')}, vous pouvez faire plusieurs retraits, mais seulement pendant l'année civile du premier retrait et en janvier de l'année suivante. La partie qui dépasse ${h.m(HB.limit)} doit être déclarée comme revenu de l'année où vous la recevez, et l'émetteur retient de l'impôt sur cet excédent. Le même logement peut aussi être payé en partie par un retrait du ${h.a('celiapp', 'CELIAPP')} : les deux régimes se combinent.</p>
<h2>Le calendrier de remboursement</h2>
<p>Le retrait se rembourse dans vos REER sur ${h.n(HB.repayYears)} ans. Réparti sur cette durée, un retrait de ${h.m(HB.limit)} représente ${h.m(now.annual)} par année, et un retrait de ${h.m(35000)} environ ${h.m(mid.annual)}. La règle normale fait commencer la période la 2e année suivant le premier retrait. L'allègement temporaire, introduit pour les premiers retraits de ${HB.reliefFrom} à 2025 puis prolongé jusqu'au 31 décembre ${HB.reliefTo}, la repousse à la 5e année.</p>
${h.table(['Premier retrait en', 'Début du remboursement', 'Dernière année', `Minimum par année pour ${h.m(HB.limit)}`], sched.map((s) => [String(s.y), String(s.p.start), String(s.p.end), h.m(s.p.annual)]), `Pour un premier retrait à partir de ${HB.reliefTo + 1}, la règle normale s'applique selon les règles publiées à ce jour.`, ['l', 'l', 'l', 'r'])}
<p>Le tableau montre l'effet de l'allègement : un premier retrait en ${HB.reliefTo} fait commencer le remboursement en ${K.hbp(HB.limit, HB.reliefTo).start}, alors qu'un premier retrait en ${HB.reliefTo + 1} le ferait commencer dès ${after.start}, si les règles ne changent pas d'ici là. L'exemple officiel de l'Agence correspond à la ligne ${Y} : remboursement à partir de ${now.start}.</p>
<h2>Si un versement manque</h2>
<p>La somme qui devait être remise pour l'année est ajoutée à votre revenu imposable de cette année-là. Le coût dépend donc de votre taux marginal. À ${h.m(60000)} de revenu, ajouter ${h.m(now.annual)} au revenu coûte environ ${h.m(missOn)} d'impôt en Ontario et ${h.m(missQc)} au Québec, aux ${h.src('cra_rates_2026', `tranches ${Y}`)}. L'argent reste à vous, mais il ne retourne pas à l'abri dans le REER, et vous perdez la croissance à l'abri de l'impôt qu'il aurait eue jusqu'à la retraite.</p>
<p>Les remboursements se déclarent à l'annexe 7 de la déclaration de revenus. L'Agence prévoit aussi un formulaire RC471 pour annuler une participation dans certaines situations, et un formulaire RC98 qui permet à l'époux ou au conjoint de fait survivant de reprendre le solde du RAP au décès.</p>
<h2>Le RAP comparé à un retrait REER ordinaire</h2>
<p>Sans le RAP, sortir de l'argent du REER fait l'objet d'une retenue d'impôt à la source, et le montant entier s'ajoute au revenu de l'année. Avec le RAP, seule la partie qui dépasse ${h.m(HB.limit)} doit être déclarée comme revenu l'année du retrait ; le reste ne devient imposable que si un versement manque. Le mini-simulateur suivant montre ce que coûterait le même argent sorti hors du RAP, selon votre province et vos autres revenus.</p>
${h.mini('retrait', { t: 'Ce que coûterait un retrait REER ordinaire', p: ['pr', 'mt', 'au'], d: { mt: 35000, au: 60000 }, c: 'Voir le détail de la retenue et de l’impôt' })}
<h2>Avant de puiser dans le REER</h2>
<p>Le RAP vide une partie de votre épargne-retraite pendant des années, et l'obligation de rembourser pèse sur votre budget en même temps que l'hypothèque. Le CELIAPP, lui, ne se rembourse pas. Si vous êtes admissible aux deux, la page ${h.a('celiapp-ou-rap', 'CELIAPP ou RAP')} compare leur coût et montre comment les combiner. Pour mesurer ce qu'un retrait REER imposable coûterait vraiment, voyez aussi ${h.a('retrait-reer', 'Retrait REER')}.</p>
`,
  },
  en: {
    slug: 'rrsp-home-buyers-plan',
    nav: 'Home Buyers’ Plan', card: `Up to ${E.m(HB.limit)} from your RRSP for a first home, repaid over ${HB.repayYears} years: starting in ${now.start} for a ${Y} withdrawal.`,
    title: `Home Buyers' Plan ${Y}: ${E.m(HB.limit)} from your RRSP, repayment`,
    description: `Home Buyers' Plan ${Y}: up to ${E.m(HB.limit)} out of your RRSP for a home, repaid over ${HB.repayYears} years from ${now.start} for a first withdrawal in ${Y}. Full repayment schedule.`,
    h1: `Home Buyers' Plan ${Y}: how much to withdraw and when to repay`,
    intro: 'Enter the amount you took out of your RRSPs under the HBP and the year of your first withdrawal: the calculator gives the minimum repayment for each year and the repayment period.',
    resume: `The Home Buyers' Plan (HBP) lets you withdraw up to ${E.m(HB.limit)} from your RRSPs to buy or build a qualifying home, for yourself or for a specified disabled person. The money is not a tax gift but a loan to yourself: it goes back into an RRSP over ${HB.repayYears} years, at least ${E.m(now.annual)} a year on a ${E.m(HB.limit)} withdrawal. Repayment normally starts in the 2nd year after the year of your first withdrawal. Temporary relief pushes that start to the 5th year for a first withdrawal made from ${HB.reliefFrom} to ${HB.reliefTo}: the Canada Revenue Agency's own example is a first withdrawal in ${Y}, with a first repayment year of ${now.start}. A missed repayment is added to your income for the year and taxed at your marginal rate. Any part of a withdrawal above ${E.m(HB.limit)} is taxed like an ordinary RRSP withdrawal.`,
    faqs: [
      { q: `How much can I take out of my RRSP to buy a home in ${Y}?`, a: `The HBP limit is ${E.m(HB.limit)} per person. Anything above that must be reported as income for the year of the withdrawal, and your RRSP issuer withholds tax on the excess. You can make several withdrawals, but only in the calendar year of your first withdrawal and in January of the next year, with a separate Form T1036 for each one.` },
      { q: 'When do I start repaying the HBP?', a: `Normally in the 2nd year after the year of your first withdrawal. For a first withdrawal made between January 1, ${HB.reliefFrom} and December 31, ${HB.reliefTo}, the start moves to the 5th year. The CRA's example is a first withdrawal in ${Y}, with a first repayment year of ${now.start}. The period then runs ${HB.repayYears} years, to ${now.end} in that example.` },
      { q: 'What happens if I miss an HBP repayment?', a: `The amount you were due to repay that year is added to your taxable income. On a ${E.m(HB.limit)} withdrawal in ${Y}, that is ${E.m(now.annual)} a year from ${now.start}. At ${E.m(60000)} of income, adding that amount would cost roughly ${E.m(missOn)} of tax in Ontario and ${E.m(missQc)} in Quebec at ${Y} rates. Repaying on time avoids that tax and puts the money back inside the RRSP shelter.` },
      { q: 'Was the HBP repayment relief extended?', a: `Yes. The relief introduced in Budget 2024 covered first withdrawals made from January 1, ${HB.reliefFrom} to December 31, 2025. It has been extended to first withdrawals made from January 1, ${Y} to December 31, ${HB.reliefTo}. In both cases the ${HB.repayYears}-year repayment period starts in the 5th year after the first withdrawal instead of the 2nd.` },
    ],
    body: (h) => `
<h2>What the HBP allows</h2>
<p>According to the CRA's ${h.src('cra_hbp', 'Home Buyers’ Plan')} page, the HBP lets you withdraw from your RRSPs to buy or build a qualifying home for yourself or for a specified disabled person. The limit is ${h.m(HB.limit)}. The detailed conditions, including the ones that define a first-time buyer, are on the CRA's eligibility page: check them before filling out Form T1036, which you use to request each withdrawal from your RRSP issuer.</p>
<p>According to the ${h.ext(WD_EN, 'How to make withdrawals from your RRSPs under the HBP')} page, you can make several withdrawals, but only during the calendar year of your first withdrawal and in January of the following year. Any part above ${h.m(HB.limit)} must be reported as income for the year you receive it, and the issuer withholds tax on that excess. The same home can also be paid for in part with a withdrawal from your ${h.a('celiapp', 'FHSA')}: the two plans can be combined.</p>
<h2>The repayment schedule</h2>
<p>The withdrawal is repaid into your RRSPs over ${h.n(HB.repayYears)} years. Spread over that period, a ${h.m(HB.limit)} withdrawal means ${h.m(now.annual)} a year, and a ${h.m(35000)} withdrawal about ${h.m(mid.annual)}. Under the normal rule the period starts in the 2nd year after the first withdrawal. The temporary relief, introduced for first withdrawals from ${HB.reliefFrom} to 2025 and then extended to December 31, ${HB.reliefTo}, pushes it to the 5th year.</p>
${h.table(['First withdrawal in', 'Repayment starts', 'Last year', `Minimum a year on ${h.m(HB.limit)}`], sched.map((s) => [String(s.y), String(s.p.start), String(s.p.end), h.m(s.p.annual)]), `For a first withdrawal from ${HB.reliefTo + 1} on, the normal rule applies under the rules published so far.`, ['l', 'l', 'l', 'r'])}
<p>The table shows what the relief does: a first withdrawal in ${HB.reliefTo} starts repayment in ${K.hbp(HB.limit, HB.reliefTo).start}, while a first withdrawal in ${HB.reliefTo + 1} would start it as early as ${after.start}, unless the rules change by then. The CRA's own example matches the ${Y} row: repayments from ${now.start}.</p>
<h2>If you miss a repayment</h2>
<p>The amount you were due to repay for the year is added to your taxable income for that year. The cost therefore depends on your marginal rate. At ${h.m(60000)} of income, adding ${h.m(now.annual)} to income costs roughly ${h.m(missOn)} of tax in Ontario and ${h.m(missQc)} in Quebec, using the ${h.src('cra_rates_2026', `${Y} brackets`)}. The money is still yours, but it does not go back into the shelter of the RRSP, and you lose the tax-sheltered growth it would have had until retirement.</p>
<p>Repayments are reported on Schedule 7 of your tax return. The CRA also has Form RC471 to cancel a participation in certain situations, and Form RC98, which lets a surviving spouse or common-law partner take over the HBP balance at death.</p>
<h2>The HBP versus an ordinary RRSP withdrawal</h2>
<p>Without the HBP, taking money out of an RRSP triggers tax withheld at source, and the full amount is added to your income for the year. With the HBP, only the part above ${h.m(HB.limit)} has to be reported as income in the year of the withdrawal; the rest only becomes taxable if a repayment is missed. The mini calculator below shows what the same money would cost if taken out outside the HBP, based on your province and other income.</p>
${h.mini('retrait', { t: 'What an ordinary RRSP withdrawal would cost', p: ['pr', 'mt', 'au'], d: { mt: 35000, au: 60000 }, c: 'See withholding and actual tax' })}
<h2>Before you dip into your RRSP</h2>
<p>The HBP drains part of your retirement savings for years, and the duty to repay weighs on your budget at the same time as the mortgage. The FHSA, by contrast, is never repaid. If you qualify for both, the ${h.a('celiapp-ou-rap', 'FHSA vs HBP')} page compares their cost and shows how to combine them. To see what a taxable RRSP withdrawal would really cost, see also ${h.a('retrait-reer', 'RRSP withdrawal')}.</p>
`,
  },
});
