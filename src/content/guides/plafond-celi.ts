import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const LIM = K.P.tfsa.limits as Record<string, number>;
const yrs = Object.keys(LIM).map(Number).sort((a, b) => a - b);
const first = yrs[0];
const lim = K.tfsaLimit(Y);
const cum = K.tfsaCum(Y);
const step = K.P.tfsa.indexedRoundTo;
const base = K.tfsaLimit(first);
// Paliers : années consécutives au même plafond.
const groups: Array<{ from: number; to: number; v: number }> = [];
for (const y of yrs) { const g = groups[groups.length - 1]; if (g && g.v === LIM[String(y)] && g.to === y - 1) g.to = y; else groups.push({ from: y, to: y, v: LIM[String(y)] }); }
const flatSince = groups[groups.length - 1].from;
const big = groups.find((g) => g.v === Math.max(...yrs.map((y) => LIM[String(y)])))!;
// Totaux périmés qui circulent encore : fin 2024 et fin 2025.
const cum24 = K.tfsaCum(Y - 2), cum25 = K.tfsaCum(Y - 1);
// Comparaison avec le REER, 2022 à 2027.
const cmpYears = [Y - 4, Y - 3, Y - 2, Y - 1, Y, Y + 1];
const rrMaxInc = K.rrspIncomeForMax(Y);
// Exemples : né en 2004 (droits depuis 2022), né en 1991 (droits depuis 2009).
const r2004 = K.tfsaRoom({ birthYear: 2004, arrival: 0, contribBefore: 0, withdrawBefore: 0, contribThisYear: 0, withdrawThisYear: 0 });

export default defineGuide({
  id: 'plafond-celi', group: 'celi', order: 2, tool: 'celi',
  related: ['droits-celi', 'excedent-celi', 'retrait-celi', 'plafond-reer', 'reer-ou-celi'],
  sources: ['cra_limits', 'rc4466', 'cra_indexation', 'cra_rrsp_limit'],
  fr: {
    slug: 'plafond-celi',
    nav: 'Plafond CELI', card: `Le plafond annuel de ${Y} est de ${F.m(lim)} ; ${F.m(cum)} au total depuis ${first}. Tableau année par année.`,
    title: `Plafond CELI ${Y} : ${F.m(lim)} par an, ${F.m(cum)} cumulés`,
    description: `Plafond CELI ${Y} : ${F.m(lim)}, comme en ${Y - 1}, et ${F.m(cum)} cumulés depuis ${first}. Tableau de chaque année, indexation au palier arrondie à ${F.m(step)} et plafond ${Y + 1}.`,
    h1: `Plafond CELI ${Y} : ${F.m(lim)} pour l'année, ${F.m(cum)} depuis ${first}`,
    intro: 'Le plafond annuel est le montant que l’Agence du revenu du Canada ajoute à vos droits chaque 1er janvier. Le simulateur additionne ceux des années qui vous concernent.',
    resume: `Le plafond CELI de ${Y} est de ${F.m(lim)}, le même montant qu'en ${Y - 1} et en ${flatSince}. Additionnés de ${first} à ${Y}, les plafonds annuels donnent ${F.m(cum)} : c'est le maximum qu'une personne puisse avoir en droits cette année, à condition d'avoir eu 18 ans en ${first} ou avant, d'avoir résidé au Canada chaque année depuis et de n'avoir jamais cotisé. Le plafond est le même pour tout le monde ; ce sont les droits accumulés qui varient selon l'âge et les années de résidence. Le montant suit l'inflation, mais il est arrondi au ${F.m(step)} le plus près, ce qui explique les paliers de plusieurs années sans changement suivis d'une hausse d'un coup. Le plafond de ${Y + 1} n'est pas encore publié : l'Agence l'annonce d'habitude à la fin de novembre. Un total de ${F.m(cum25)} ou de ${F.m(cum24)} que vous verriez ailleurs correspond à la fin de ${Y - 1} ou de ${Y - 2}, pas à ${Y}.`,
    faqs: [
      { q: `Le plafond CELI a-t-il augmenté en ${Y} ?`, a: `Non : le plafond annuel de ${Y} reste à ${F.m(lim)}, comme en ${Y - 1} et en ${flatSince}. Il s'est ajouté le 1er janvier ${Y} aux droits de toute personne qui avait au moins 18 ans et résidait au Canada à un moment de l'année. Ce montant s'additionne à vos droits inutilisés des années passées et aux retraits faits en ${Y - 1}, ce qui donne souvent un chiffre bien plus élevé que ${F.m(lim)}.` },
      { q: 'Quel est le plafond CELI cumulatif depuis 2009 ?', a: `La somme des plafonds annuels de ${first} à ${Y} est de ${F.m(cum)}. Seule une personne née en ${first - 18} ou avant, résidente du Canada sans interruption depuis ${first} et qui n'a jamais rien versé, dispose de ce montant entier. Une personne née en 2004, par exemple, n'additionne que les plafonds depuis 2022, soit ${F.m(r2004.accrued)}.` },
      { q: `Quand sera annoncé le plafond CELI ${Y + 1} ?`, a: `L'Agence du revenu du Canada publie d'habitude le plafond de l'année suivante à la fin de novembre, en même temps que les autres montants indexés. Tant que l'annonce n'est pas faite, aucun chiffre pour ${Y + 1} n'est officiel. Le plafond ${Y + 1} s'ajoutera à vos droits le 1er janvier ${Y + 1}, avec vos retraits de ${Y}.` },
      { q: 'Le plafond CELI est-il le même pour tout le monde ?', a: `Oui. Le plafond annuel ne dépend ni du revenu, ni de la province, ni de l'emploi : en ${Y}, chaque personne admissible reçoit ${F.m(lim)}. Ce qui change d'une personne à l'autre, c'est le nombre d'années comptées depuis ${first}, selon l'année des 18 ans et les années de résidence au Canada, et ce qui a déjà été versé ou retiré.` },
    ],
    body: (h) => `
<h2>Les plafonds annuels, palier par palier</h2>
<p>Le tableau des ${h.src('cra_limits', 'plafonds publiés par l’Agence du revenu du Canada')} compte ${h.n(yrs.length)} années depuis la création du compte en ${first}. Plutôt que de répéter le montant ligne par ligne, voici les paliers : chaque groupe d'années au même plafond, ce qu'il représente au total et le cumul atteint à la fin du palier. La dernière colonne permet de vérifier n'importe quel total que vous croisez.</p>
${h.table(['Années', 'Plafond annuel', 'Années', 'Total du palier', 'Cumul à la fin'], groups.map((g) => [g.from === g.to ? String(g.from) : `${g.from} à ${g.to}`, h.m(g.v), String(g.to - g.from + 1), h.m(g.v * (g.to - g.from + 1)), h.m(K.tfsaCum(g.to))]), `Plafonds du CELI de ${first} à ${Y}. Cumul : ${h.m(cum)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>L'année ${big.from} se détache avec ${h.m(big.v)}, avant un retour à ${h.m(K.tfsaLimit(big.from + 1))} l'année suivante. Depuis, la courbe ne fait que monter par marches : ${h.m(K.tfsaLimit(Y - 4))} jusqu'en ${Y - 4}, ${h.m(K.tfsaLimit(Y - 3))} en ${Y - 3}, puis ${h.m(lim)} à partir de ${flatSince}.</p>
<h2>Pourquoi le plafond avance par marches de ${h.m(step)}</h2>
<p>Le plafond n'est pas fixé chaque année par une décision nouvelle. La ${h.src('cra_indexation', 'note de l’Agence sur les montants indexés')} explique la règle en vigueur depuis 2016 : on part de ${h.m(base)}, montant de ${first}, on l'indexe à l'inflation pour chaque année écoulée depuis, et on arrondit le résultat au ${h.m(step)} le plus près. Le même tableau indexe chaque année les tranches d'impôt et les crédits.</p>
<p>L'arrondi a un effet visible : tant que le montant indexé reste sous le seuil qui le ferait passer au palier suivant, le plafond publié ne bouge pas. C'est pourquoi ${h.m(lim)} vaut depuis ${flatSince}. L’${h.src('rc4466', 'Agence du revenu du Canada')} le rappelle en une phrase : le plafond annuel est indexé et arrondi au ${h.m(step)} le plus près. Une hausse, quand elle vient, est donc toujours d'au moins ${h.m(step)}.</p>
<h2>Qui a droit au cumul de ${h.m(cum)}</h2>
<p>Le cumul n'est pas un plafond personnel : c'est la somme de tous les plafonds annuels. Pour en avoir la totalité, il faut que chaque année de ${first} à ${Y} compte, donc avoir eu 18 ans en ${first} ou avant et avoir résidé au Canada à un moment de chacune de ces années. Une année entière à l'étranger comme non-résident retire son plafond du total. Une personne plus jeune additionne seulement les plafonds à partir de l'année de ses 18 ans. Pour refaire le compte avec votre âge, vos cotisations et vos retraits, servez-vous du simulateur en haut de page ou de la page ${h.a('droits-celi', 'droits de cotisation CELI')}.</p>
<h2>Le plafond ${Y + 1} : à venir</h2>
<p>${K.P.tfsa.limit2027Note.fr} Toute projection d'un montant pour ${Y + 1} reste une hypothèse : l'arrondi au ${h.m(step)} le plus près peut laisser le plafond inchangé ou le faire monter d'un palier. Ce qui est sûr, c'est la date d'effet : le plafond ${Y + 1} s'ajoutera aux droits le 1er janvier ${Y + 1}, en même temps que les retraits faits en ${Y}.</p>
<h2>Des totaux périmés circulent encore</h2>
<p>Beaucoup de tableaux en ligne n'ont pas été mis à jour. Un cumul de ${h.m(cum24)} s'arrête à ${Y - 2} ; ${h.m(cum25)} s'arrête à ${Y - 1}. Certains textes donnent aussi un plafond annuel et un total qui ne vont pas ensemble. Le contrôle est simple : ajoutez ${h.m(lim)} pour chaque année manquante au dernier cumul publié, ou comparez avec la colonne « Cumul à la fin » ci-dessus. En cas de doute, le tableau de l'Agence fait foi.</p>
<h2>Plafond CELI et plafond REER côte à côte</h2>
<p>Les deux plafonds n'obéissent pas à la même logique. Celui du CELI est un montant fixe pour tous. Celui du REER est un maximum : vos nouveaux droits valent 18 % de votre revenu gagné de l'année précédente, sans dépasser le ${h.src('cra_rrsp_limit', 'plafond en dollars de l’année')}. Pour atteindre le plafond REER de ${Y}, il faut un revenu gagné d'environ ${h.m(rrMaxInc)} en ${Y - 1}. Le plafond REER de ${Y + 1} est déjà publié ; celui du CELI ne l'est pas.</p>
${h.table(['Année', 'Plafond CELI', 'Plafond REER'], cmpYears.map((y) => [String(y), K.tfsaLimit(y) ? h.m(K.tfsaLimit(y)) : 'à venir', h.m(K.rrspLimit(y))]), 'Le plafond REER est un maximum lié au revenu ; le plafond CELI est le même pour tous.', ['l', 'r', 'r'])}
${h.mini('plafondReer', { t: `Vos nouveaux droits REER ${Y}`, p: ['rg', 'fe'], d: { rg: 80000 }, c: 'Voir le calcul complet du REER' })}
<p>Pour décider où placer une somme, regardez votre taux d'imposition d'aujourd'hui et celui prévu au retrait : la page ${h.a('reer-ou-celi', 'REER ou CELI')} fait la comparaison avec les tranches de votre province, et la page ${h.a('plafond-reer', 'plafond REER')} détaille le calcul du maximum déductible.</p>
`,
  },
  en: {
    slug: 'tfsa-limit',
    nav: 'TFSA limit', card: `The ${Y} annual limit is ${E.m(lim)}; ${E.m(cum)} in total since ${first}. Year-by-year table.`,
    title: `TFSA limit ${Y}: ${E.m(lim)} a year, ${E.m(cum)} cumulative`,
    description: `TFSA limit ${Y}: ${E.m(lim)}, same as ${Y - 1}, and ${E.m(cum)} cumulative since ${first}. Every year in a single table, indexation rounded to ${E.m(step)}, and the ${Y + 1} limit.`,
    h1: `TFSA limit ${Y}: ${E.m(lim)} for the year, ${E.m(cum)} since ${first}`,
    intro: 'The annual limit is the amount the Canada Revenue Agency adds to your room every January 1. The calculator adds up the ones that apply to you.',
    resume: `The ${Y} TFSA limit is ${E.m(lim)}, the same as in ${Y - 1} and ${flatSince}. Added up from ${first} to ${Y}, the annual limits come to ${E.m(cum)}: the most anyone can have in room this year, provided they were 18 by ${first}, lived in Canada in every year since and never contributed. The limit is the same for everyone; what varies is the room each person has built up, which depends on age and years of residence. The amount follows inflation but is rounded to the nearest ${E.m(step)}, which is why it stays flat for several years and then jumps in one step. The ${Y + 1} limit has not been published yet; the Canada Revenue Agency usually announces it in late November. If you see a total of ${E.m(cum25)} or ${E.m(cum24)} elsewhere, it stops at the end of ${Y - 1} or ${Y - 2}, not ${Y}.`,
    faqs: [
      { q: `Did the TFSA limit go up in ${Y}?`, a: `No: the ${Y} annual limit stays at ${E.m(lim)}, as in ${Y - 1} and ${flatSince}. It was added on January 1, ${Y} to the room of everyone who was at least 18 and a resident of Canada at some point in the year. It stacks on top of unused room from earlier years and on withdrawals made in ${Y - 1}, so most people's available room is well above ${E.m(lim)}.` },
      { q: 'What is the cumulative TFSA limit since 2009?', a: `The annual limits from ${first} to ${Y} add up to ${E.m(cum)}. Only someone born in ${first - 18} or earlier, resident in Canada every year since ${first} and who never contributed, has that full amount. Someone born in 2004, for example, only counts the limits from 2022 on, which is ${E.m(r2004.accrued)}.` },
      { q: `When will the ${Y + 1} TFSA limit be announced?`, a: `The Canada Revenue Agency usually publishes the next year's limit in late November, along with the other indexed amounts. Until then, no ${Y + 1} figure is official. Whatever it turns out to be, the ${Y + 1} limit will be added to your room on January 1, ${Y + 1}, together with any withdrawals you made in ${Y}.` },
      { q: 'Is the TFSA limit the same for everyone?', a: `Yes. The annual limit does not depend on income, province or job: in ${Y}, every eligible person gets ${E.m(lim)}. What differs from one person to the next is how many years count since ${first}, based on the year they turned 18 and the years they lived in Canada, and what they have already put in or taken out.` },
    ],
    body: (h) => `
<h2>Annual limits, step by step</h2>
<p>The table of ${h.src('cra_limits', 'limits published by the Canada Revenue Agency')} covers ${h.n(yrs.length)} years since the account was created in ${first}. Instead of one line per year, here are the steps: each run of years at the same limit, what it adds up to and the running total at the end of the run. The last column lets you check any total you come across.</p>
${h.table(['Years', 'Annual limit', 'Years', 'Total for the step', 'Running total'], groups.map((g) => [g.from === g.to ? String(g.from) : `${g.from} to ${g.to}`, h.m(g.v), String(g.to - g.from + 1), h.m(g.v * (g.to - g.from + 1)), h.m(K.tfsaCum(g.to))]), `TFSA limits from ${first} to ${Y}. Cumulative: ${h.m(cum)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>${big.from} stands out at ${h.m(big.v)}, before a return to ${h.m(K.tfsaLimit(big.from + 1))} the next year. Since then the line only climbs in steps: ${h.m(K.tfsaLimit(Y - 4))} through ${Y - 4}, ${h.m(K.tfsaLimit(Y - 3))} in ${Y - 3}, then ${h.m(lim)} from ${flatSince} on.</p>
<h2>Why the limit moves in ${h.m(step)} steps</h2>
<p>The limit is not set by a fresh decision every year. The ${h.src('cra_indexation', 'Agency note on indexed amounts')} gives the rule in force since 2016: start from ${h.m(base)}, the ${first} amount, index it to inflation for every year since, and round the result to the nearest ${h.m(step)}. The same table indexes the tax brackets and credits every year.</p>
<p>The rounding has a visible effect: as long as the indexed amount stays below the point that would push it to the next step, the published limit does not change. That is why ${h.m(lim)} has applied since ${flatSince}. The ${h.src('rc4466', 'Canada Revenue Agency')} puts it in one line: the annual limit is indexed to inflation and rounded to the nearest ${h.m(step)}. When an increase does come, it is always at least ${h.m(step)}.</p>
<h2>Who actually has the full ${h.m(cum)}</h2>
<p>The cumulative figure is not a personal cap; it is the sum of every annual limit. To have all of it, every year from ${first} to ${Y} must count, which means being 18 by ${first} and a resident of Canada at some point in each of those years. A full calendar year abroad as a non-resident removes that year's limit. Someone younger only adds the limits from the year they turned 18. To redo the count with your age, contributions and withdrawals, use the calculator at the top of the page or the ${h.a('droits-celi', 'TFSA contribution room')} page.</p>
<h2>The ${Y + 1} limit: not out yet</h2>
<p>${K.P.tfsa.limit2027Note.en} Any figure projected for ${Y + 1} is a guess: rounding to the nearest ${h.m(step)} can leave the limit where it is or move it up a step. What is certain is the effective date: the ${Y + 1} limit will be added to room on January 1, ${Y + 1}, at the same time as withdrawals made in ${Y}.</p>
<h2>Out-of-date totals are still around</h2>
<p>Many tables online have not been updated. A cumulative ${h.m(cum24)} stops at ${Y - 2}; ${h.m(cum25)} stops at ${Y - 1}. Some pages also quote an annual limit and a total that do not match each other. The check is quick: add ${h.m(lim)} for each missing year to the last total published, or compare with the "Running total" column above. When in doubt, the Agency's table is the reference.</p>
<h2>TFSA and RRSP limits side by side</h2>
<p>The two limits work differently. The TFSA limit is a flat amount for everyone. The RRSP figure is a ceiling: your new room is 18% of the previous year's earned income, up to the ${h.src('cra_rrsp_limit', 'dollar limit for the year')}. Reaching the ${Y} RRSP limit takes earned income of about ${h.m(rrMaxInc)} in ${Y - 1}. The ${Y + 1} RRSP limit is already published; the TFSA one is not.</p>
${h.table(['Year', 'TFSA limit', 'RRSP limit'], cmpYears.map((y) => [String(y), K.tfsaLimit(y) ? h.m(K.tfsaLimit(y)) : 'not yet published', h.m(K.rrspLimit(y))]), 'The RRSP limit is an income-based ceiling; the TFSA limit is the same for everyone.', ['l', 'r', 'r'])}
${h.mini('plafondReer', { t: `Your new ${Y} RRSP room`, p: ['rg', 'fe'], d: { rg: 80000 }, c: 'See the full RRSP calculation' })}
<p>To decide where a given amount should go, compare your tax rate today with the one you expect at withdrawal: the ${h.a('reer-ou-celi', 'RRSP vs TFSA')} page runs the numbers with your province's brackets, and the ${h.a('plafond-reer', 'RRSP limit')} page explains how the deduction limit is worked out.</p>
`,
  },
});
