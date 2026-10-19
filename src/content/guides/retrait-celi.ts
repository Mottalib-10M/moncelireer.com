import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const wn = 10000, cb = 50000;
// Exemple du simulateur en tête : né en 1990, 50 000 $ versés avant 2026, retrait de 10 000 $ en 2026.
const t = K.tfsaRoom({ birthYear: 1990, arrival: 0, contribBefore: cb, withdrawBefore: 0, contribThisYear: 0, withdrawThisYear: wn });
// Le même retrait sorti d'un REER, hors Québec.
const w = K.withholding(wn, false);
const gis = K.P.benefits.gis.singleMax;
const oasT = K.P.benefits.oas.threshold[String(Y) as '2026'];
// Piège du redépôt : 10 000 $ remis en juillet sans droits libres, jusqu'en décembre.
const trap = K.excessTax(wn, 6);
// Placement de 8 000 $ tombé à 5 000 $, retiré en entier.
const lossIn = 8000, lossOut = 5000;

export default defineGuide({
  id: 'retrait-celi', group: 'celi', order: 5, tool: 'celi',
  toolArg: { wn, cb },
  related: ['droits-celi', 'excedent-celi', 'retrait-reer', 'reer-sv-srg', 'reer-ou-celi'],
  sources: ['rc4466', 'cra_withholding', 'esdc_gis'],
  fr: {
    slug: 'retrait-celi',
    nav: 'Retrait CELI', card: `Un retrait CELI n'est pas imposé et revient dans vos droits le 1er janvier suivant. Ce qu'il faut savoir avant de remettre l'argent.`,
    title: `Retrait CELI ${Y} : non imposé, recrédité le 1er janvier`,
    description: `Retrait CELI en ${Y} : aucun impôt, aucune retenue, montant recrédité le 1er janvier ${Y + 1}. Aucun effet sur la SV, le SRG ou l'ACE. Le piège du redépôt.`,
    h1: `Retrait CELI en ${Y} : impôt, droits et prestations`,
    intro: 'Indiquez vos cotisations passées et ce que vous retirez cette année : le simulateur montre vos droits d’aujourd’hui et ce qui reviendra le 1er janvier suivant.',
    resume: `Un retrait du CELI n'est jamais imposé : ni retenue à la source, ni montant à inclure dans la déclaration de revenus. Il ne recrée pas de droits tout de suite, mais s'ajoute à vos droits le 1er janvier de l'année suivante. Une personne née en 1990 qui a versé ${F.m(cb)} au fil des ans et retire ${F.m(wn)} en ${Y} garde ${F.m(t.available)} de droits pour ${Y}, puis récupère ${F.m(t.addedBackNextYear)} le 1er janvier ${Y + 1}, en plus du plafond ${Y + 1} qui n'est pas encore publié. Le retrait ne touche ni la pension de la Sécurité de la vieillesse, ni le Supplément de revenu garanti, ni l'assurance-emploi, ni l'allocation canadienne pour enfants, ni le crédit pour la TPS/TVH. Le seul piège est le redépôt : remettre l'argent la même année alors que vos droits sont épuisés crée un excédent imposé à 1 % par mois. Le même retrait sorti d'un REER subirait une retenue de ${F.m(w.withheld)} hors Québec et serait ajouté au revenu imposable.`,
    faqs: [
      { q: 'Un retrait CELI est-il imposable ?', a: `Non. Les sommes retirées d'un CELI, capital comme revenus accumulés, ne sont pas imposées et l'institution ne retient aucun impôt. Vous pouvez retirer à tout moment, pour n'importe quelle raison, selon les conditions du placement détenu. Seuls des impôts propres au CELI, sur un excédent, une cotisation de non-résident ou un placement interdit, peuvent viser le compte.` },
      { q: `Quand puis-je remettre l'argent retiré de mon CELI ?`, a: `Dès le 1er janvier de l'année suivant le retrait, sans risque : le montant retiré s'ajoute alors à vos droits. Vous pouvez aussi le remettre la même année si vous avez encore des droits inutilisés pour le couvrir. Si vos droits sont déjà épuisés, le redépôt crée un excédent imposé à 1 % par mois tant qu'il reste dans le compte.` },
      { q: 'Faut-il déclarer un retrait CELI dans sa déclaration de revenus ?', a: `Non. Ni les retraits ni le revenu gagné dans le CELI ne s'inscrivent dans la déclaration de revenus. L'institution transmet elle-même vos cotisations et vos retraits à l'Agence du revenu du Canada, qui s'en sert pour mettre à jour vos droits. Gardez vos relevés : Mon dossier n'affiche les opérations d'une année qu'au printemps suivant.` },
      { q: 'Les retraits CELI comptent-ils pour l’allocation canadienne pour enfants ?', a: `Non. Les retraits et le revenu d'un CELI ne font pas partie du revenu net qui sert à calculer l'allocation canadienne pour enfants, l'allocation canadienne pour les travailleurs ou le crédit pour la TPS/TVH. Une famille peut donc puiser dans son CELI sans réduire ses prestations, alors qu'un retrait REER augmenterait son revenu familial net.` },
    ],
    body: (h) => `
<h2>Ni impôt ni retenue</h2>
<p>L’${h.src('rc4466', 'Agence du revenu du Canada')} est clair : vous pouvez en général retirer n'importe quel montant de votre CELI, à tout moment, pour n'importe quelle raison, sans conséquence fiscale. L'institution ne prélève aucune retenue, et vous n'avez rien à inscrire dans votre déclaration de revenus. Cela vaut pour l'argent versé comme pour les intérêts, dividendes et gains accumulés dans le compte. Les seules limites tiennent au type de placement détenu, dont les conditions de rachat varient d'une institution à l'autre.</p>
<h2>Les droits reviennent le 1er janvier suivant</h2>
<p>Un retrait ne diminue pas les cotisations déjà faites dans l'année et ne libère pas de droits sur-le-champ. Le montant retiré, sauf transfert admissible ou distribution déterminée, s'ajoute à vos droits au début de l'année qui suit. Reprenons l'exemple du simulateur : ${h.m(cb)} déjà versés et un retrait de ${h.m(wn)} en ${Y}.</p>
${h.table(['Moment', 'Opération', 'Droits disponibles'], [[`1er janvier ${Y}`, 'Plafonds cumulés moins les cotisations', h.m(t.roomJan1)], [`En cours d'année ${Y}`, `Retrait de ${h.m(wn)}`, `${h.m(t.available)} (inchangé)`], [`1er janvier ${Y + 1}`, `Retrait recrédité et plafond ${Y + 1}`, `${h.m(t.available + t.addedBackNextYear)} plus le plafond ${Y + 1}, à venir`]], 'Né en 1990, résident depuis 2009, aucune autre opération.', ['l', 'l', 'r'])}
<p>C'est le montant retiré qui revient, pas la somme versée à l'origine. Si un placement a pris de la valeur, le retrait complet vous rend plus de droits que vous n'en aviez utilisé. Une perte, elle, n'est pas un retrait : quelqu'un qui a placé ${h.m(lossIn)} et retire les ${h.m(lossOut)} qui restent ne récupère que ${h.m(lossOut)} de droits l'année suivante. La perte ne peut pas non plus être déduite comme perte en capital.</p>
<p>La date du retrait compte donc. Un retrait fait en décembre redevient des droits quelques jours plus tard, le 1er janvier. Le même retrait fait le 2 janvier attend près d'un an. Si vous prévoyez de sortir de l'argent au tournant de l'année et de le remettre ensuite, retirer avant le 31 décembre raccourcit l'attente. Le montant retiré reste le même dans les deux cas ; seule change la date où il redevient utilisable.</p>
<h2>Aucun effet sur les prestations</h2>
<p>Comme le revenu et les retraits du CELI ne figurent pas dans la déclaration, ils n'entrent pas dans les calculs fondés sur le revenu. Le guide cite la pension de la Sécurité de la vieillesse, le Supplément de revenu garanti et l'assurance-emploi, puis l'allocation canadienne pour enfants, l'allocation canadienne pour les travailleurs, le crédit pour la TPS/TVH et le montant en raison de l'âge. Le contraste avec le REER est net. Pour une personne seule, le SRG cesse quand le revenu annuel atteint ${h.src('esdc_gis', h.m(gis))}, et chaque retrait REER ou FERR compte dans ce revenu. À un revenu plus élevé, la SV commence à être récupérée au-delà de ${h.m(oasT)} de revenu net en ${Y}. Un retrait CELI ne fait bouger aucun de ces seuils.</p>
${h.table(['', 'Retrait CELI', 'Retrait REER'], [['Impôt sur le montant', 'Aucun', 'Ajouté au revenu imposable'], [`Retenue sur ${h.m(wn)}, hors Québec`, 'Aucune', `${h.p(w.rate, 0)}, soit ${h.m(w.withheld)}`], ['Droits de cotisation', 'Recrédités le 1er janvier suivant', 'Perdus'], ['SV, SRG, assurance-emploi', 'Aucun effet', 'Compte dans le revenu'], ['ACE, crédit pour la TPS/TVH', 'Aucun effet', 'Hausse du revenu familial net']], 'Même somme, deux comptes.', ['l', 'l', 'l'])}
${h.mini('retrait', { t: `Le même retrait de ${h.m(wn)} sorti d'un REER`, p: ['pr', 'mt', 'au'], d: { mt: wn, au: 45000 }, c: 'Voir le calcul du retrait REER' })}
<h2>Le piège du redépôt</h2>
<p>La plupart des excédents viennent de là. Une personne qui a déjà rempli ses droits retire ${h.m(wn)} au printemps, puis remet la somme en juillet en pensant « rendre » ce qu'elle a pris. Pour l'Agence, ce redépôt est une nouvelle cotisation, et les ${h.m(wn)} retirés ne redeviennent des droits qu'en janvier. Laissé jusqu'à la fin de l'année, l'excédent coûte ${h.m(trap)}. La règle à retenir : avant de remettre de l'argent dans la même année, vérifiez qu'il vous reste des droits inutilisés ; sinon, attendez le 1er janvier. La page ${h.a('excedent-celi', 'cotisation excédentaire au CELI')} explique comment corriger un excédent déjà créé.</p>
<h2>Changer d'institution sans retirer</h2>
<p>Pour déplacer un CELI d'une institution à une autre, demandez un transfert direct. Ce transfert n'est ni un retrait ni une cotisation et ne touche pas vos droits. Si vous retirez vous-même l'argent pour le déposer ailleurs, le dépôt compte comme une cotisation ordinaire, avec le même risque d'excédent que ci-dessus.</p>
<h2>Retrait d'un non-résident</h2>
<p>Après un départ du Canada, le retrait reste non imposé au Canada. Il s'ajoute bien à vos droits l'année suivante, mais vous ne pourrez utiliser ces droits qu'une fois redevenu résident du Canada aux fins de l'impôt. Les autres règles des expatriés sont sur la page ${h.a('celi-non-resident', 'CELI et non-résident')}.</p>
`,
  },
  en: {
    slug: 'tfsa-withdrawal',
    nav: 'TFSA withdrawal', card: `A TFSA withdrawal is tax-free and comes back as room on the following January 1. What to check before you put the money back.`,
    title: `TFSA withdrawal ${Y}: tax-free, room back on January 1`,
    description: `TFSA withdrawal in ${Y}: no tax, no withholding, amount added back to your room on January 1, ${Y + 1}. No effect on OAS, GIS or the CCB. The re-contribution trap.`,
    h1: `TFSA withdrawals in ${Y}: tax, room and benefits`,
    intro: 'Enter your past contributions and what you take out this year: the calculator shows your room today and what comes back on the following January 1.',
    resume: `A TFSA withdrawal is never taxed: no withholding at source and nothing to include on your tax return. It does not create room right away; it is added to your room on January 1 of the following year. Someone born in 1990 who has put ${E.m(cb)} into the account over the years and takes out ${E.m(wn)} in ${Y} keeps ${E.m(t.available)} of room for ${Y}, then gets ${E.m(t.addedBackNextYear)} back on January 1, ${Y + 1}, on top of the ${Y + 1} limit, which is not published yet. The withdrawal has no effect on the Old Age Security pension, the Guaranteed Income Supplement, Employment Insurance, the Canada child benefit or the GST/HST credit. The one trap is putting the money back: doing it in the same year when your room is used up creates an excess taxed at 1% a month. The same withdrawal from an RRSP would have ${E.m(w.withheld)} withheld outside Quebec and would be added to taxable income.`,
    faqs: [
      { q: 'Is a TFSA withdrawal taxable?', a: `No. Money taken out of a TFSA, both what you put in and what it earned, is not taxed, and the institution withholds nothing. You can withdraw at any time, for any reason, subject to the terms of the investment you hold. Only special TFSA taxes, on an excess, a non-resident contribution or a prohibited investment, can apply to the account.` },
      { q: 'When can I put back money I took out of my TFSA?', a: `From January 1 of the year after the withdrawal, with no risk: the amount withdrawn is added to your room on that date. You can also put it back in the same year if you still have unused room to cover it. If your room is already used up, putting it back creates an excess taxed at 1% a month while it stays in the account.` },
      { q: 'Do I have to report a TFSA withdrawal on my tax return?', a: `No. Neither withdrawals nor income earned in a TFSA go on your tax return. The institution reports your contributions and withdrawals to the Canada Revenue Agency itself, and the Agency uses them to update your room. Keep your statements: My Account only shows a year's transactions the following spring.` },
      { q: 'Do TFSA withdrawals count for the Canada child benefit?', a: `No. TFSA withdrawals and income are not part of the net income used to work out the Canada child benefit, the Canada workers benefit or the GST/HST credit. A family can draw on its TFSA without reducing those benefits, whereas an RRSP withdrawal would raise its adjusted family net income.` },
    ],
    body: (h) => `
<h2>No tax, no withholding</h2>
<p>The ${h.src('rc4466', 'Canada Revenue Agency')} is clear: you can generally withdraw any amount from your TFSA, at any time, for any reason, with no tax consequences. The institution withholds nothing and there is nothing to enter on your tax return. That covers the money you put in as well as the interest, dividends and gains built up in the account. The only limits come from the type of investment held, whose redemption terms vary from one institution to another.</p>
<h2>Room comes back the following January 1</h2>
<p>A withdrawal does not reduce the contributions already made in the year and does not free up room on the spot. The amount withdrawn, other than a qualifying transfer or a specified distribution, is added to your room at the start of the next year. Take the calculator's example: ${h.m(cb)} already contributed and a ${h.m(wn)} withdrawal in ${Y}.</p>
${h.table(['When', 'What happens', 'Room available'], [[`January 1, ${Y}`, 'Limits added up, minus contributions', h.m(t.roomJan1)], [`During ${Y}`, `${h.m(wn)} withdrawn`, `${h.m(t.available)} (unchanged)`], [`January 1, ${Y + 1}`, `Withdrawal added back, plus the ${Y + 1} limit`, `${h.m(t.available + t.addedBackNextYear)} plus the ${Y + 1} limit, not yet published`]], 'Born in 1990, resident since 2009, no other transactions.', ['l', 'l', 'r'])}
<p>What comes back is the amount withdrawn, not what you originally put in. If an investment has grown, withdrawing all of it gives you back more room than you used. A loss is not a withdrawal: someone who invested ${h.m(lossIn)} and takes out the ${h.m(lossOut)} that is left only gets ${h.m(lossOut)} of room back the next year. Nor can the loss be claimed as a capital loss.</p>
<p>The date of the withdrawal therefore matters. A withdrawal made in December turns back into room a few days later, on January 1. The same withdrawal made on January 2 waits almost a year. If you plan to take money out around the turn of the year and put it back later, withdrawing before December 31 shortens the wait. The amount is the same either way; only the date it becomes usable again changes.</p>
<h2>No effect on benefits</h2>
<p>Because TFSA income and withdrawals stay off your tax return, they do not enter income-tested calculations. The guide lists the Old Age Security pension, the Guaranteed Income Supplement and Employment Insurance, then the Canada child benefit, the Canada workers benefit, the GST/HST credit and the age amount. The contrast with an RRSP is sharp. For a single person, the GIS stops once annual income reaches ${h.m(gis)}, according to the Government of Canada's eligibility page, and every RRSP or RRIF withdrawal counts in that income. Higher up, the OAS pension starts being clawed back above ${h.m(oasT)} of net income in ${Y}. A TFSA withdrawal moves none of these thresholds.</p>
${h.table(['', 'TFSA withdrawal', 'RRSP withdrawal'], [['Tax on the amount', 'None', 'Added to taxable income'], [`Withholding on ${h.m(wn)}, outside Quebec`, 'None', `${h.p(w.rate, 0)}, or ${h.m(w.withheld)}`], ['Contribution room', 'Added back the next January 1', 'Lost'], ['OAS, GIS, Employment Insurance', 'No effect', 'Counts as income'], ['CCB, GST/HST credit', 'No effect', 'Raises family net income']], 'Same amount, two accounts.', ['l', 'l', 'l'])}
${h.mini('retrait', { t: `The same ${h.m(wn)} taken out of an RRSP`, p: ['pr', 'mt', 'au'], d: { mt: wn, au: 45000 }, c: 'See the RRSP withdrawal math' })}
<h2>The re-contribution trap</h2>
<p>Most excess amounts start here. Someone who has already used up their room takes out ${h.m(wn)} in the spring, then puts it back in July, thinking they are just "returning" what they took. To the Agency, that deposit is a new contribution, and the ${h.m(wn)} withdrawn only turns back into room in January. Left until year end, the excess costs ${h.m(trap)}. The rule of thumb: before putting money back in the same year, check that you still have unused room; if not, wait for January 1. The ${h.a('excedent-celi', 'TFSA over-contribution')} page explains how to fix an excess that already exists.</p>
<h2>Switching institutions without withdrawing</h2>
<p>To move a TFSA from one institution to another, ask for a direct transfer. It is neither a withdrawal nor a contribution and leaves your room alone. If you take the cash out yourself and deposit it elsewhere, the deposit counts as an ordinary contribution, with the same excess risk as above.</p>
<h2>Withdrawals by a non-resident</h2>
<p>After leaving Canada, a withdrawal is still not taxed in Canada. It is added to your room the following year, but you can only use that room once you are a resident of Canada for tax purposes again. The other rules for people abroad are on the ${h.a('celi-non-resident', 'TFSA for non-residents')} page.</p>
`,
  },
});
