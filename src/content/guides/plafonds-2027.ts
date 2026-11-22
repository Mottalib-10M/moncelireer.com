import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

// Page millésime 2027 (campagne du 2026-11-22) : seuls les montants publiés ou fixés par la loi.
const F = K.fr, E = K.en, Y = K.YEAR, N = Y + 1;
const P = K.P;
const r26 = K.rrspLimit(Y), r27 = K.rrspLimit(N), r28 = K.rrspLimit(N + 1);
const need27 = K.rrspIncomeForMax(N), need28 = K.rrspIncomeForMax(N + 1);
const up = r27 - r26, upPct = up / r26;
const cum = K.tfsaCum(Y);
const step = P.tfsa.indexedRoundTo;
const FH = P.fhsa, HB = P.hbp, LL = P.llp;
const dl = P.rrsp.deadline as Record<string, string>;
const d26 = dl[String(Y)], d27 = dl[String(N)];
const hbp27 = K.hbp(HB.limit, N);
const F27 = P.federal2027, F26 = P.federal;
const brRows = (h: { m: (x: number) => string; p: (x: number, d?: number) => string }) => F27.rates.map((r: number, i: number) => [h.p(r, 1), i === 0 ? h.m(0) : h.m(F26.brackets[i - 1]), i === 0 ? h.m(0) : h.m(F27.brackets[i - 1])]);
// Exemple : 120 000 $ de revenu gagné en 2026, sans régime de retraite.
const ex = K.rrspRoom({ earnedPrevYear: 120000, year: N });

const rowsFr = (h: { m: (x: number) => string }) => [
  ['Plafond REER', h.m(r26), h.m(r27), 'Publié (ARC)'],
  ['Revenu gagné pour atteindre le plafond', h.m(K.rrspIncomeForMax(Y)), h.m(need27), 'Calculé : plafond ÷ 18 %'],
  ['Plafond CELI', h.m(K.tfsaLimit(Y)), 'pas encore publié', 'Annonce de l’ARC attendue'],
  ['CELIAPP : plafond annuel / à vie', `${h.m(FH.annual)} / ${h.m(FH.lifetime)}`, `${h.m(FH.annual)} / ${h.m(FH.lifetime)}`, 'Fixé par la loi, non indexé'],
  ['RAP : retrait maximum', h.m(HB.limit), h.m(HB.limit), 'Fixé par la loi, non indexé'],
  ['REEP : par année / au total', `${h.m(LL.annual)} / ${h.m(LL.total)}`, `${h.m(LL.annual)} / ${h.m(LL.total)}`, 'Fixé par la loi, non indexé'],
];
const rowsEn = (h: { m: (x: number) => string }) => [
  ['RRSP dollar limit', h.m(r26), h.m(r27), 'Published (CRA)'],
  ['Earned income needed for the full limit', h.m(K.rrspIncomeForMax(Y)), h.m(need27), 'Calculated: limit ÷ 18%'],
  ['TFSA annual limit', h.m(K.tfsaLimit(Y)), 'not yet published', 'CRA announcement pending'],
  ['FHSA: annual / lifetime', `${h.m(FH.annual)} / ${h.m(FH.lifetime)}`, `${h.m(FH.annual)} / ${h.m(FH.lifetime)}`, 'Set in law, not indexed'],
  ['HBP: maximum withdrawal', h.m(HB.limit), h.m(HB.limit), 'Set in law, not indexed'],
  ['LLP: per year / total', `${h.m(LL.annual)} / ${h.m(LL.total)}`, `${h.m(LL.annual)} / ${h.m(LL.total)}`, 'Set in law, not indexed'],
];

export default defineGuide({
  id: 'plafonds-2027', group: 'reer', order: 18, tool: 'plafondReer', toolArg: { an: N, rg: 120000 },
  related: ['plafond-reer', 'plafond-celi', 'date-limite-reer', 'celiapp', 'rap'],
  sources: ['cra_limits', 't4127_jan27', 'cra_rrsp_dates', 'cra_indexation', 'cra_fhsa', 'cra_hbp', 'cra_llp'],
  fr: {
    slug: 'plafonds-2027',
    nav: 'Plafonds 2027', card: `REER ${N} à ${F.m(r27)}, CELI ${N} pas encore annoncé, CELIAPP et RAP inchangés : le tableau ${Y} et ${N}.`,
    title: `Plafond REER ${N} : ${F.m(r27)}, CELI et CELIAPP vs ${Y}`,
    description: `Plafond REER ${N} : ${F.m(r27)} (${F.m(r26)} en ${Y}), revenu requis ${F.m(need27)}. CELI ${N} en attente, CELIAPP et RAP inchangés, date limite au ${F.day(d27)}.`,
    h1: `Plafonds ${N} : REER à ${F.m(r27)}, CELI en attente, CELIAPP et RAP inchangés`,
    intro: `Ce qui change au 1er janvier ${N} pour vos comptes enregistrés, montant par montant, avec la source de chacun. Le simulateur calcule votre maximum déductible REER ${N}.`,
    resume: `Le plafond REER ${N} est de ${F.m(r27)}, soit ${F.m(up)} de plus qu'en ${Y} (${F.m(r26)}), une hausse de ${F.p(upPct, 1)}. Pour y avoir droit, il faut ${F.m(need27)} de revenu gagné en ${Y}, puisque les droits valent 18 % du revenu de l'année précédente. L'Agence du revenu du Canada a aussi publié le plafond ${N + 1} : ${F.m(r28)}. Le plafond CELI ${N}, lui, n'était pas encore annoncé au 22 novembre ${Y} : il découle de l'inflation, arrondie au ${F.m(step)} le plus proche, et s'ajoutera le 1er janvier ${N} aux ${F.m(cum)} cumulés depuis 2009. Les montants du CELIAPP (${F.m(FH.annual)} par année, ${F.m(FH.lifetime)} à vie), du RAP (${F.m(HB.limit)}) et du REEP sont écrits dans la loi sans indexation : ils restent les mêmes en ${N}. Pour l'année ${Y}, la date limite de cotisation REER est le ${F.day(d26)}.`,
    faqs: [
      { q: `Quel est le plafond REER pour ${N} ?`, a: `Le plafond en dollars du REER pour ${N} est de ${F.m(r27)}, publié par l'Agence du revenu du Canada. Il ne s'applique qu'à un revenu gagné d'au moins ${F.m(need27)} en ${Y}. Sous ce revenu, vos nouveaux droits ${N} valent 18 % de ce que vous avez gagné en ${Y}, moins votre facteur d'équivalence. Les droits inutilisés des années passées s'ajoutent.` },
      { q: `Le plafond CELI ${N} est-il connu ?`, a: `Pas au 22 novembre ${Y}. L'Agence publie le plafond de l'année suivante à la fin de l'automne, avec les autres montants indexés. Le calcul part de ${F.m(5000)} indexé à l'inflation depuis 2009, arrondi au ${F.m(step)} le plus proche : le plafond peut donc rester à ${F.m(K.tfsaLimit(Y))} ou monter d'un palier. Aucun chiffre n'est officiel avant l'annonce.` },
      { q: `Quelle est la date limite pour cotiser au REER pour l'année ${N} ?`, a: `La loi accepte les cotisations versées dans les 60 jours qui suivent la fin de l'année. ${N + 1} étant bissextile, le 60e jour tombe le ${F.day(d27)} : c'est notre calcul selon cette règle, que l'Agence confirme chaque année sur sa page des dates importantes. Pour l'année ${Y}, la limite est le ${F.day(d26)}.` },
      { q: `Le CELIAPP et le RAP changent-ils en ${N} ?`, a: `Non. Le CELIAPP ouvre ${F.m(FH.annual)} de droits par année, avec un report d'au plus ${F.m(FH.carryMax)} et un maximum de ${F.m(FH.lifetime)} à vie, et le RAP permet de retirer ${F.m(HB.limit)} de vos REER. Ces montants sont fixés par la Loi de l'impôt sur le revenu et ne sont pas indexés : seule une nouvelle loi les ferait bouger.` },
    ],
    body: (h) => `
<h2>Le tableau ${Y} et ${N}</h2>
<p>Chaque ligne indique le montant de ${Y}, celui de ${N} et son statut. Un montant « publié » vient du ${h.src('cra_limits', 'tableau des plafonds de l’Agence du revenu du Canada')} ; un montant « calculé » découle d'une règle de la loi appliquée par nous ; « fixé par la loi » signifie que la Loi de l'impôt sur le revenu donne un chiffre sans indexation.</p>
${h.table(['Montant', String(Y), String(N), 'Statut'], rowsFr(h), `État au 22 novembre ${Y}. Le plafond CELI ${N} sera ajouté le jour de l'annonce officielle.`, ['l', 'r', 'r', 'l'])}
<h2>REER : ${h.m(r27)} en ${N}, ${h.m(r28)} en ${N + 1}</h2>
<p>Le plafond REER d'une année est égal au plafond des cotisations à un régime de retraite à cotisations déterminées de l'année précédente. C'est pourquoi il est connu longtemps d'avance : le montant de ${N} est publié depuis plus d'un an, et celui de ${N + 1}, ${h.m(r28)}, figure déjà sur la page de l'Agence. Il suit la croissance du salaire moyen, pas l'inflation, ce qui explique une hausse de ${h.m(up)} cette fois.</p>
<p>Ce plafond est un maximum. Vos nouveaux droits ${N} valent 18 % de votre revenu gagné de ${Y}, salaire et revenu d'entreprise surtout, sans dépasser ${h.m(r27)}. Le seuil est donc ${h.m(need27)} de revenu gagné en ${Y} ; il sera de ${h.m(need28)} en ${N} pour le plafond ${N + 1}. Avec ${h.m(120000)} gagnés en ${Y} et aucun régime de retraite d'employeur, les nouveaux droits ${N} sont de ${h.m(ex.newRoom)}. Un participant à un régime d'employeur retire son facteur d'équivalence, inscrit à la case 52 du T4. Le chiffre qui fait foi reste celui de votre avis de cotisation ${Y}, que l'Agence envoie au printemps ${N}.</p>
<h2>Deux dates limites à ne pas confondre</h2>
<p>Les cotisations versées en janvier et en février ${N} peuvent encore être déduites pour l'année ${Y}. La ${h.src('cra_rrsp_dates', 'page des dates importantes')} fixe cette limite au ${h.day(d26)}. Pour l'année ${N}, la règle des 60 jours donne le ${h.day(d27)}, puisque février ${N + 1} compte 29 jours : ce jour est calculé par nous, l'Agence l'affichera dans sa propre page à l'automne ${N}. Une cotisation faite après la date limite n'est pas perdue, elle compte simplement pour l'année suivante.</p>
<h2>CELI ${N} : ce qui est sûr, ce qui ne l'est pas</h2>
<p>Le plafond annuel du CELI n'était pas encore annoncé au moment de la mise à jour de cette page. La ${h.src('cra_indexation', 'note de l’Agence sur l’indexation')} décrit la règle : ${h.m(5000)} indexé chaque année à l'inflation depuis 2009, arrondi au ${h.m(step)} le plus proche. Le résultat ne peut donc être que ${h.m(K.tfsaLimit(Y))} ou un palier au-dessus ; nous n'affichons aucun des deux tant que l'Agence n'a pas tranché. Ce qui ne dépend pas de l'annonce : les droits s'ajoutent le 1er janvier ${N} aux ${h.m(cum)} cumulés de 2009 à ${Y}, et tout retrait fait en ${Y} est rajouté à vos droits le même jour.</p>
<h2>CELIAPP, RAP et REEP : mêmes montants qu'en ${Y}</h2>
<p>Ces trois montants sont des chiffres ronds écrits dans la loi. Le ${h.src('cra_fhsa', 'CELIAPP')} donne toujours ${h.m(FH.annual)} de droits par année, jusqu'à ${h.m(FH.lifetime)}. Le ${h.src('cra_hbp', 'RAP')} permet de retirer ${h.m(HB.limit)} de vos REER pour une première habitation. Pour un premier retrait fait en ${N}, l'allègement prolongé repousse le début du remboursement à ${hbp27.start}, et la période court jusqu'en ${hbp27.end}. Le ${h.src('cra_llp', 'REEP')} reste à ${h.m(LL.annual)} par année et ${h.m(LL.total)} au total.</p>
${h.mini('rap', { t: `Remboursement d'un RAP retiré en ${N}`, p: ['mt', 'an'], d: { mt: HB.limit, an: String(N) }, c: 'Voir le détail du RAP' })}
<h2>Tranches fédérales ${N} : déjà publiées</h2>
<p>Le ${h.src('t4127_jan27', 'guide T4127 du 1er janvier 2027')}, mis en ligne par l'Agence le 19 novembre ${Y}, donne les tranches fédérales de ${N}, indexées de ${h.p(F27.index, 1)}. Les taux ne changent pas ; les seuils montent. Le montant personnel de base fédéral passe à ${h.m(F27.bpaMax)} (${h.m(F26.bpaMax)} en ${Y}), et à ${h.m(F27.bpaMin)} au minimum pour les revenus les plus élevés.</p>
${h.table(['Taux fédéral', `Le taux commence à (${Y})`, `Le taux commence à (${N})`], brRows(h), `Tranches fédérales ${Y} et ${N}. Source : guide T4127, 124e édition.`, ['l', 'r', 'r'])}
<h2>Ce qui reste à intégrer pour ${N}</h2>
<p>Les calculs d'économie d'impôt de ce site, qui combinent tranches fédérales et provinciales, restent sur les barèmes de ${Y} jusqu'à leur mise à jour complète en janvier : un remboursement REER calculé pour une cotisation de ${N} peut donc être un peu surestimé, puisque les seuils plus hauts de ${N} font tomber une partie du revenu dans une tranche plus basse. Pour le détail du maximum déductible, la page ${h.a('plafond-reer', 'plafond REER')} reprend le calcul pas à pas, et la page ${h.a('plafond-celi', 'plafond CELI')} garde l'historique depuis 2009.</p>
`,
  },
  en: {
    slug: 'contribution-limits-2027',
    nav: '2027 limits', card: `${N} RRSP limit of ${E.m(r27)}, ${N} TFSA limit not yet announced, FHSA and HBP unchanged: the ${Y} and ${N} table.`,
    title: `RRSP limit ${N}: ${E.m(r27)}, plus TFSA and FHSA vs ${Y}`,
    description: `RRSP limit ${N}: ${E.m(r27)} (${E.m(r26)} in ${Y}), earned income needed ${E.m(need27)}. TFSA ${N} still pending, FHSA and HBP unchanged, deadline ${E.day(d27)}.`,
    h1: `${N} limits: RRSP at ${E.m(r27)}, TFSA pending, FHSA and HBP unchanged`,
    intro: `What changes on January 1, ${N} for your registered accounts, figure by figure, with the source of each. The calculator works out your ${N} RRSP deduction limit.`,
    resume: `The ${N} RRSP dollar limit is ${E.m(r27)}, ${E.m(up)} more than the ${Y} limit of ${E.m(r26)}, an increase of ${E.p(upPct, 1)}. Reaching it takes ${E.m(need27)} of earned income in ${Y}, because new room is 18% of the previous year's earned income. The Canada Revenue Agency has also published the ${N + 1} limit: ${E.m(r28)}. The ${N} TFSA limit had not been announced as of November 22, ${Y}: it comes from inflation, rounded to the nearest ${E.m(step)}, and will be added on January 1, ${N} to the ${E.m(cum)} accumulated since 2009. The FHSA amounts (${E.m(FH.annual)} a year, ${E.m(FH.lifetime)} for life), the HBP withdrawal limit (${E.m(HB.limit)}) and the LLP limits are written into the law with no indexation, so they stay the same in ${N}. For the ${Y} tax year, the RRSP contribution deadline is ${E.day(d26)}.`,
    faqs: [
      { q: `What is the RRSP limit for ${N}?`, a: `The ${N} RRSP dollar limit is ${E.m(r27)}, as published by the Canada Revenue Agency. It only applies if you earned at least ${E.m(need27)} in ${Y}. Below that, your new ${N} room is 18% of your ${Y} earned income, minus any pension adjustment. Unused room from earlier years is added on top.` },
      { q: `Has the ${N} TFSA limit been announced?`, a: `Not as of November 22, ${Y}. The agency publishes the next year's limit late in the fall, together with the other indexed amounts. The formula starts from ${E.m(5000)} indexed to inflation since 2009 and rounded to the nearest ${E.m(step)}, so the limit either stays at ${E.m(K.tfsaLimit(Y))} or moves up one step. No figure is official before the announcement.` },
      { q: `What is the RRSP deadline for the ${N} tax year?`, a: `The law accepts contributions made in the 60 days after the year ends. Since ${N + 1} is a leap year, the 60th day is ${E.day(d27)}: that is our own count under the rule, and the agency confirms it every year on its important dates page. For the ${Y} tax year, the deadline is ${E.day(d26)}.` },
      { q: `Do the FHSA and HBP limits change in ${N}?`, a: `No. The FHSA gives ${E.m(FH.annual)} of room a year, with at most ${E.m(FH.carryMax)} carried forward and ${E.m(FH.lifetime)} for life, and the HBP lets you take ${E.m(HB.limit)} out of your RRSPs. Both amounts are set in the Income Tax Act and are not indexed: only new legislation would change them.` },
    ],
    body: (h) => `
<h2>The ${Y} and ${N} table</h2>
<p>Each line shows the ${Y} amount, the ${N} amount and where it stands. "Published" means it comes from the ${h.src('cra_limits', 'Canada Revenue Agency limits table')}; "calculated" means we applied a rule from the law ourselves; "set in law" means the Income Tax Act states a figure that is not indexed.</p>
${h.table(['Amount', String(Y), String(N), 'Status'], rowsEn(h), `As of November 22, ${Y}. The ${N} TFSA limit will be added on the day it is officially announced.`, ['l', 'r', 'r', 'l'])}
<h2>RRSP: ${h.m(r27)} in ${N}, ${h.m(r28)} in ${N + 1}</h2>
<p>The RRSP dollar limit for a year equals the money purchase pension limit of the year before. That is why it is known so far ahead: the ${N} amount has been public for over a year, and the ${N + 1} figure, ${h.m(r28)}, is already on the agency's page. It tracks growth in the average wage rather than prices, which is why it rose by ${h.m(up)} this time.</p>
<p>The limit is a ceiling. Your new ${N} room is 18% of your ${Y} earned income, mostly salary and business income, capped at ${h.m(r27)}. The threshold is therefore ${h.m(need27)} of ${Y} earned income, and it will be ${h.m(need28)} of ${N} earned income for the ${N + 1} limit. Someone who earned ${h.m(120000)} in ${Y} with no workplace pension gets ${h.m(ex.newRoom)} of new ${N} room. A member of an employer plan subtracts the pension adjustment shown in box 52 of the T4. The figure that counts is the one on your ${Y} notice of assessment, which the agency sends in the spring of ${N}.</p>
<h2>Two deadlines that are easy to mix up</h2>
<p>Contributions made in January and February ${N} can still be deducted for ${Y}. The ${h.src('cra_rrsp_dates', 'important dates page')} sets that cutoff at ${h.day(d26)}. For the ${N} tax year, the 60-day rule lands on ${h.day(d27)}, because February ${N + 1} has 29 days: that date is our own calculation, and the agency will post it on its page in the fall of ${N}. A contribution made after the deadline is not lost; it simply counts toward the following year.</p>
<h2>TFSA ${N}: what is settled and what is not</h2>
<p>The annual TFSA limit had not been announced when this page was last updated. The ${h.src('cra_indexation', 'agency note on indexation')} sets out the rule: ${h.m(5000)} indexed to inflation every year since 2009, rounded to the nearest ${h.m(step)}. The result can only be ${h.m(K.tfsaLimit(Y))} or one step higher, and we show neither until the agency decides. What does not depend on the announcement: new room is added on January 1, ${N} to the ${h.m(cum)} accumulated from 2009 to ${Y}, and any withdrawal made in ${Y} is added back to your room on the same day.</p>
<h2>FHSA, HBP and LLP: same amounts as in ${Y}</h2>
<p>All three are round figures written into the law. The ${h.src('cra_fhsa', 'FHSA')} still adds ${h.m(FH.annual)} of room a year, up to ${h.m(FH.lifetime)}. The ${h.src('cra_hbp', 'HBP')} lets you withdraw ${h.m(HB.limit)} from your RRSPs for a first home. For a first withdrawal made in ${N}, the extended relief pushes the start of repayment to ${hbp27.start}, and the period runs to ${hbp27.end}. The ${h.src('cra_llp', 'LLP')} stays at ${h.m(LL.annual)} a year and ${h.m(LL.total)} in total.</p>
${h.mini('rap', { t: `Repaying an HBP taken out in ${N}`, p: ['mt', 'an'], d: { mt: HB.limit, an: String(N) }, c: 'See the HBP details' })}
<h2>${N} federal brackets: already published</h2>
<p>The ${h.src('t4127_jan27', 'T4127 guide for January 1, 2027')}, posted by the agency on November 19, ${Y}, sets the ${N} federal brackets, indexed by ${h.p(F27.index, 1)}. The rates do not change; the thresholds go up. The federal basic personal amount rises to ${h.m(F27.bpaMax)} (${h.m(F26.bpaMax)} in ${Y}), and to ${h.m(F27.bpaMin)} at the minimum for the highest incomes.</p>
${h.table(['Federal rate', `Rate starts at (${Y})`, `Rate starts at (${N})`], brRows(h), `Federal brackets for ${Y} and ${N}. Source: T4127 guide, 124th edition.`, ['l', 'r', 'r'])}
<h2>Still to be built in for ${N}</h2>
<p>The tax savings on this site, which combine federal and provincial brackets, stay on the ${Y} schedules until the full update in January: an RRSP refund worked out for a ${N} contribution may therefore be slightly overstated, since the higher ${N} thresholds move part of the income into a lower bracket. For the full deduction limit calculation, the ${h.a('plafond-reer', 'RRSP limit')} page goes through it step by step, and the ${h.a('plafond-celi', 'TFSA limit')} page keeps the history since 2009.</p>
`,
  },
});
