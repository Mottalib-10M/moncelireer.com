import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const D = K.P.rrsp.deadline as Record<string, string>;
const dPrev = D[String(Y - 1)], dCur = D[String(Y)];
// Fenêtre de l'année 2025 lue sur canada.ca : du 4 mars 2025 au 2 mars 2026.
const startPrev = '2025-03-04', startCur = '2026-03-03';
const age = K.P.rrsp.lastContributionAge;
// Exemple du simulateur : Ontario, 85 000 $, 6 000 $ déduits.
const sv = K.saving(85000, 6000, 'ON'), mr = K.marginal(85000, 'ON');
// Report : 6 000 $ versés en février, déduits l'année où le revenu passe de 85 000 $ à 120 000 $.
const svHigh = K.saving(120000, 6000, 'ON');
const cushion = K.P.rrsp.overCushion;

export default defineGuide({
  id: 'date-limite-reer', group: 'reer', order: 13, tool: 'remboursement',
  toolArg: { pr: 'ON', rv: 85000, mt: 6000 },
  related: ['plafond-reer', 'remboursement-reer', 'excedent-reer', 'reer-conjoint', 'reer-ou-celi'],
  sources: ['cra_rrsp_dates', 'cra_rrsp_limit', 'cra_rrsp_excess'],
  fr: {
    slug: 'date-limite-reer',
    nav: 'Date limite REER', card: `${F.day(dPrev)} pour l'année ${Y - 1}, ${F.day(dCur)} pour l'année ${Y} : la règle des 60 jours et ce qui arrive après.`,
    title: `Date limite REER ${Y} : jusqu'à quand cotiser pour déduire`,
    description: `Date limite REER : ${F.day(dPrev)} pour l'année ${Y - 1}, et ${F.day(dCur)} pour l'année ${Y}, 60 jours après la fin de l'année. Cotisations de janvier et février.`,
    h1: `Date limite REER : jusqu'à quand cotiser pour l'année ${Y} ?`,
    intro: 'La date limite fixe l’année où une cotisation peut être déduite. Entrez votre province, votre revenu et le montant versé : le simulateur montre la baisse d’impôt que vous obtiendrez.',
    resume: `La date limite pour cotiser à un REER et déduire la cotisation de l'année ${Y - 1} était le ${F.day(dPrev)}. Pour l'année ${Y}, la loi admet les cotisations versées dans les 60 jours qui suivent la fin de l'année, soit jusqu'au ${F.day(dCur)} ; l'Agence du revenu du Canada confirmera la date officielle plus tard. Une cotisation faite entre le 1er janvier et cette date peut être déduite pour l'année précédente, pour l'année en cours ou pour une année plus tardive, à votre choix, tant qu'elle n'a pas déjà été déduite. Rater la date ne fait rien perdre : la cotisation reste disponible et sera déduite plus tard, dans la limite de votre maximum déductible. Pour quelqu'un de l'Ontario qui gagne ${F.m(85000)}, ${F.m(6000)} déduits font baisser l'impôt de ${F.m(sv)}. La seule date sans rattrapage est le 31 décembre de l'année de vos ${age} ans, dernier jour pour cotiser à votre propre REER.`,
    faqs: [
      { q: `Jusqu'à quand peut-on cotiser au REER pour l'année ${Y} ?`, a: `Jusqu'au 60e jour de ${Y + 1}, soit le ${F.day(dCur)}, selon la règle prévue par la loi. L'Agence du revenu du Canada confirme la date officielle sur sa page des dates importantes ; pour l'année ${Y - 1}, c'était le ${F.day(dPrev)}. Les cotisations versées pendant l'année ${Y} comptent aussi, de même que les cotisations des années passées qui n'ont jamais été déduites.` },
      { q: 'Une cotisation REER faite en février compte-t-elle pour l’année précédente ?', a: `Elle peut compter pour l'année précédente si elle est versée au plus tard à la date limite, mais rien ne vous y oblige. Vous pouvez aussi la déduire pour l'année en cours ou une année plus tardive. Si vous ne la déduisez pas tout de suite, il faut la déclarer à l'annexe 7 de la déclaration de l'année précédente, pour que l'Agence la garde en dossier.` },
      { q: 'Que se passe-t-il si je cotise au REER après la date limite ?', a: `La cotisation reste valable ; elle ne peut simplement plus réduire l'impôt de l'année précédente. Elle sera déduite sur la déclaration de l'année en cours ou d'une année plus tardive. Seul risque : si vos cotisations non déduites dépassent votre maximum déductible de plus de ${F.m(cushion)}, l'excédent est imposé à 1 % par mois. Vérifiez votre maximum avant de verser une grosse somme.` },
      { q: 'Jusqu’à quel âge peut-on cotiser à un REER ?', a: `Jusqu'au 31 décembre de l'année de vos ${age} ans pour votre propre REER. La période de 60 jours qui suit n'aide pas ici : passé le 31 décembre, plus aucune cotisation à votre REER n'est possible. Vous pouvez toutefois cotiser au REER de votre conjoint jusqu'à la fin de l'année de ses ${age} ans, avec vos propres droits, et déduire plus tard les cotisations non déduites.` },
    ],
    body: (h) => `
<h2>Les dates limites ${Y - 1} et ${Y}</h2>
<p>Une cotisation REER se rattache à une année d'imposition selon sa date de versement. La ${h.src('cra_rrsp_dates', 'page des dates importantes de l’Agence du revenu du Canada')} indique le ${h.day(dPrev)} comme dernier jour pour cotiser au titre de l'année ${Y - 1}. Pour l'année ${Y}, la Loi de l'impôt sur le revenu admet les cotisations versées dans les 60 jours qui suivent la fin de l'année : le 60e jour de ${Y + 1} tombe le ${h.day(dCur)}. L'Agence confirmera la date officielle sur cette même page ; c'est elle qui fera foi.</p>
${h.table(['Année de la déduction', 'Versements de la période', 'Date limite'], [[String(Y - 1), `${h.day(startPrev)} au ${h.day(dPrev)}`, h.day(dPrev)], [String(Y), `${h.day(startCur)} au ${h.day(dCur)}`, `${h.day(dCur)} (règle des 60 jours)`]], 'Plus les cotisations des années passées jamais déduites, dans la limite du maximum déductible.', ['l', 'l', 'l'])}
<p>La période de l'année ${Y - 1} vient de la ${h.src('cra_rrsp_limit', 'page de l’Agence sur le maximum déductible')}, qui admet les versements du ${h.day(startPrev)} au ${h.day(dPrev)}. Celle de ${Y} commence le lendemain de la date limite précédente.</p>
<h2>Les 60 premiers jours : un choix, pas une obligation</h2>
<p>Une cotisation versée en janvier ou en février peut servir à deux années. Le guide T4040 permet de déduire pour ${Y - 1} toutes les cotisations faites jusqu'au ${h.day(dPrev)} qui n'ont pas été déduites pour une autre année. Vous pouvez donc la réclamer sur la déclaration de l'année précédente, ou la garder pour l'année en cours ou plus tard. Le choix se fait au moment de remplir la déclaration, pas au moment du versement.</p>
<p>Le bon choix dépend du taux. En Ontario, à ${h.m(85000)} de revenu imposable, le taux marginal est de ${h.p(mr)} et ${h.m(6000)} déduits font économiser ${h.m(sv)}. Si votre revenu passe à ${h.m(120000)} l'année suivante, la même déduction ferait économiser ${h.m(svHigh)}. Une cotisation non déduite continue de croître à l'abri de l'impôt en attendant.</p>
<h2>Déclarer une cotisation que vous ne déduisez pas</h2>
<p>Si vous ne déduisez pas tout ce que vous avez versé pendant l'année et les 60 premiers jours de la suivante, l'Agence demande de remplir l'annexe 7 avec la déclaration de l'année précédente. Les cotisations ainsi déclarées apparaissent ensuite sur votre avis de cotisation, à la ligne des cotisations inutilisées disponibles. Si la déclaration est déjà produite, l'annexe 7 accompagne un formulaire T1-ADJ, Demande de redressement d'une T1, envoyé à votre centre fiscal avec vos reçus.</p>
${h.mini('plafondReer', { t: 'Votre maximum déductible de l’année', p: ['rg', 'fe'], c: 'Ajouter vos droits inutilisés' })}
<h2>Après la date limite</h2>
<p>Manquer la date ne fait rien perdre. Une cotisation versée le lendemain se déduit simplement pour l'année suivante, ou plus tard. Vos droits ne disparaissent pas non plus : les droits inutilisés s'ajoutent au maximum de l'année suivante. Ce qui coûte, c'est l'année d'attente avant la baisse d'impôt. Si la cotisation visait un but précis, comme baisser le revenu qui sert au calcul d'une prestation, le moment compte alors plus que l'impôt lui-même.</p>
<p>Le vrai piège est l'excédent. Les cotisations non déduites restent comptées : si elles dépassent votre maximum déductible de plus de ${h.m(cushion)}, l'excédent paie 1 % par mois, selon la ${h.src('cra_rrsp_excess', 'page des cotisations excédentaires')}. Quand l'Agence ne connaît pas le mois exact des versements, elle place ceux des 60 premiers jours en janvier. La page ${h.a('excedent-reer', 'cotisation excédentaire REER')} explique comment corriger.</p>
<h2>L'année de vos ${age} ans</h2>
<p>Le 31 décembre de l'année de vos ${age} ans est le dernier jour pour cotiser à votre propre REER. La période de 60 jours ne prolonge pas ce délai. Si votre conjoint est plus jeune, vous pouvez continuer à cotiser à son REER jusqu'à la fin de l'année de ses ${age} ans, avec vos propres droits ; le fonctionnement est décrit sur la page ${h.a('reer-conjoint', 'REER de conjoint')}. Les cotisations inutilisées restent déductibles après cet âge, dans la limite de votre maximum.</p>
<p>Un cas particulier : après un décès, plus personne ne peut cotiser au REER de la personne décédée, mais son liquidateur peut verser au REER du conjoint survivant pendant l'année du décès ou les 60 premiers jours de l'année suivante, et la déduire dans la déclaration de l'année du décès, jusqu'au maximum déductible de la personne décédée.</p>
`,
  },
  en: {
    slug: 'rrsp-deadline',
    nav: 'RRSP deadline', card: `${E.day(dPrev)} for the ${Y - 1} tax year, ${E.day(dCur)} for ${Y}: the 60-day rule and what happens after.`,
    title: `RRSP deadline ${Y}: last day to contribute and deduct`,
    description: `RRSP deadline: ${E.day(dPrev)} for the ${Y - 1} tax year and ${E.day(dCur)} for ${Y}, 60 days after the year ends. How January and February contributions count.`,
    h1: `RRSP deadline: how long do you have to contribute for ${Y}?`,
    intro: 'The deadline decides which year a contribution can be deducted for. Enter your province, your income and the amount you put in: the calculator shows the tax you will save.',
    resume: `The deadline to contribute to an RRSP and deduct it for the ${Y - 1} tax year was ${E.day(dPrev)}. For ${Y}, the law accepts contributions made in the 60 days after the end of the year, which means up to ${E.day(dCur)}; the Canada Revenue Agency will confirm the official date later. A contribution made between January 1 and that date can be deducted for the previous year, for the current year or for a later year, as you choose, as long as it has not been deducted already. Missing the deadline costs you nothing permanent: the contribution stays available and is deducted later, within your deduction limit. For an Ontario resident earning ${E.m(85000)}, a ${E.m(6000)} deduction cuts tax by ${E.m(sv)}. The one date with no second chance is December 31 of the year you turn ${age}, the last day to contribute to your own RRSP.`,
    faqs: [
      { q: `When is the last day to contribute to an RRSP for ${Y}?`, a: `The 60th day of ${Y + 1}, which is ${E.day(dCur)}, under the rule set in the law. The Canada Revenue Agency confirms the official date on its important dates page; for ${Y - 1}, it was ${E.day(dPrev)}. Contributions made during ${Y} count too, and so do contributions from past years that were never deducted.` },
      { q: 'Does an RRSP contribution made in February count for the previous year?', a: `It can, if it is made by the deadline, but you do not have to use it that way. You can also deduct it for the current year or a later one. If you do not deduct it right away, you report it on Schedule 7 of the previous year's return so the CRA keeps it on file.` },
      { q: 'What happens if I contribute to my RRSP after the deadline?', a: `The contribution is still valid; it simply can no longer reduce the previous year's tax. You deduct it on the current year's return or a later one. The only risk: if your undeducted contributions exceed your deduction limit by more than ${E.m(cushion)}, the excess is taxed at 1% a month. Check your limit before putting in a large amount.` },
      { q: 'Until what age can you contribute to an RRSP?', a: `Until December 31 of the year you turn ${age} for your own RRSP. The 60-day window that follows does not help here: after December 31, no more contributions to your RRSP are possible. You can still contribute to your spouse's RRSP until the end of the year they turn ${age}, using your own room, and deduct unused contributions later.` },
    ],
    body: (h) => `
<h2>The ${Y - 1} and ${Y} deadlines</h2>
<p>An RRSP contribution is tied to a tax year by the date it is made. The ${h.src('cra_rrsp_dates', 'Canada Revenue Agency page of important dates')} gives ${h.day(dPrev)} as the last day to contribute for ${Y - 1}. For ${Y}, the Income Tax Act accepts contributions made in the 60 days after the end of the year: the 60th day of ${Y + 1} is ${h.day(dCur)}. The CRA will confirm the official date on that same page, and that is the one that counts.</p>
${h.table(['Deduction year', 'Contributions made', 'Deadline'], [[String(Y - 1), `${h.day(startPrev)} to ${h.day(dPrev)}`, h.day(dPrev)], [String(Y), `${h.day(startCur)} to ${h.day(dCur)}`, `${h.day(dCur)} (60-day rule)`]], 'Plus contributions from past years never deducted, within your deduction limit.', ['l', 'l', 'l'])}
<p>The ${Y - 1} window comes from the ${h.src('cra_rrsp_limit', 'CRA page on the deduction limit')}, which accepts contributions from ${h.day(startPrev)} to ${h.day(dPrev)}. The ${Y} window starts the day after the previous deadline.</p>
<h2>The first 60 days: a choice, not an obligation</h2>
<p>A contribution made in January or February can serve two years. Guide T4040 lets you deduct for ${Y - 1} every contribution made up to ${h.day(dPrev)} that was not deducted for another year. So you can claim it on the previous year's return, or keep it for the current year or later. You choose when you file the return, not when you make the contribution.</p>
<p>The right choice depends on the rate. In Ontario, at ${h.m(85000)} of taxable income, the marginal rate is ${h.p(mr)} and a ${h.m(6000)} deduction saves ${h.m(sv)}. If your income rises to ${h.m(120000)} the next year, the same deduction would save ${h.m(svHigh)}. An undeducted contribution keeps growing sheltered from tax in the meantime.</p>
<h2>Reporting a contribution you do not deduct</h2>
<p>If you are not deducting everything you contributed during the year and the first 60 days of the next, the CRA asks you to fill out Schedule 7 with the previous year's return. Contributions reported that way then show up on your notice of assessment, on the line for unused contributions available to deduct. If the return is already filed, send Schedule 7 with Form T1-ADJ, T1 Adjustment Request, to your tax centre along with your receipts.</p>
${h.mini('plafondReer', { t: 'Your deduction limit for the year', p: ['rg', 'fe'], c: 'Add your unused room' })}
<h2>After the deadline</h2>
<p>Missing the date costs you nothing permanent. A contribution made the next day is simply deducted for the following year, or later. Your room does not vanish either: unused room is added to the next year's limit. What it costs you is a year of waiting for the tax saving. If the contribution was made for a precise reason, such as lowering the income used for a benefit, the timing matters more than the tax itself.</p>
<p>The real trap is an excess. Undeducted contributions still count: if they exceed your deduction limit by more than ${h.m(cushion)}, the excess pays 1% a month, according to the ${h.src('cra_rrsp_excess', 'excess contributions page')}. When the CRA does not know the exact month of your contributions, it places those from the first 60 days in January. The ${h.a('excedent-reer', 'RRSP over-contribution')} page explains how to fix it.</p>
<h2>The year you turn ${age}</h2>
<p>December 31 of the year you turn ${age} is the last day to contribute to your own RRSP. The 60-day window does not extend it. If your spouse is younger, you can keep contributing to their RRSP until the end of the year they turn ${age}, using your own room; the ${h.a('reer-conjoint', 'spousal RRSP')} page explains how it works. Unused contributions stay deductible after that age, within your limit.</p>
<p>One special case: after a death, nobody can contribute to the deceased person's RRSP, but their legal representative can contribute to the surviving spouse's RRSP during the year of death or the first 60 days of the next year, and claim it on the return for the year of death, up to the deceased person's deduction limit.</p>
`,
  },
});
