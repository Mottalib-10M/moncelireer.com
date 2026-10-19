import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.fr, E = K.en, Y = K.YEAR;
const OAS = K.P.benefits.oas, GIS = K.P.benefits.gis;
const th25 = OAS.threshold['2025'], th26 = OAS.threshold['2026'];
const rate = OAS.recoveryRate;
// Exemple : Ontario, 85 000 $ de revenu de retraite, retrait FERR de 20 000 $ (revenu total 105 000 $).
const RR = 85000, MT = 20000;
const tEx = K.wtax(RR, MT, 'ON'), cEx = K.oas(RR + MT) - K.oas(RR);
// Retrait de 20 000 $ en Ontario selon le revenu de retraite déjà acquis.
const levels = [30000, 50000, 75000, 90000, 105000, 120000];
const rowsFor = (f: typeof F) => levels.map((r) => { const t = K.wtax(r, MT, 'ON'), c = K.oas(r + MT) - K.oas(r); return [f.m(r), f.m(t), f.m(c), f.p((t + c) / MT)]; });
// Seuils du SRG lus sur canada.ca (situations hors des données du simulateur : tapés d'après la page).
// Trois profils en Ontario.
const pA = K.wtax(16000, 5000, 'ON'), pB = K.wtax(50000, MT, 'ON'), pC = K.wtax(110000, MT, 'ON'), cC = K.oas(110000 + MT) - K.oas(110000);
const gisRows = (f: typeof F, a: string, b: string, c: string, d: string) => [[a, f.m(GIS.singleMax)], [b, f.m(GIS.coupleOasMax)], [c, f.m(42768)], [d, f.m(55392)]];

export default defineGuide({
  id: 'reer-sv-srg', group: 'reer', order: 17, tool: 'sv',
  related: ['retrait-reer', 'reer-ou-celi', 'retrait-celi', 'reer-conjoint', 'taux-marginal'],
  sources: ['esdc_oas_recovery', 'esdc_gis', 'rc4466'],
  fr: {
    slug: 'reer-sv-srg',
    nav: 'REER, SV et SRG', card: `Un retrait REER ou FERR compte pour la récupération de la SV au-delà de ${F.m(th26)} et pour le SRG ; un retrait CELI, non.`,
    title: `REER et SV ${Y} : récupération, SRG et retraits FERR`,
    description: `REER, SV et SRG en ${Y} : un retrait REER ou FERR compte pour la récupération de ${F.p(rate, 0)} au-delà de ${F.m(th26)} et pour le seuil du SRG. Le CELI n'y touche pas.`,
    h1: `REER et Sécurité de la vieillesse ${Y} : ce que coûte un retrait`,
    intro: 'Entrez votre province, votre revenu de retraite sans les retraits et le retrait REER ou FERR prévu : le simulateur ajoute à l’impôt la part de SV qui serait récupérée.',
    resume: `Un retrait REER ou FERR s'ajoute à votre revenu net, et c'est ce revenu qui sert à calculer deux prestations fédérales de la retraite. La pension de la Sécurité de la vieillesse est récupérée à raison de ${F.p(rate, 0)} du revenu net qui dépasse ${F.m(th26)} pour l'année de revenu ${Y} (${F.m(th25)} pour ${Y - 1}). Le Supplément de revenu garanti n'est versé qu'aux personnes dont le revenu annuel reste sous ${F.m(GIS.singleMax)} pour une personne seule, et les retraits REER et FERR comptent dans ce revenu. Un retrait CELI ne compte ni pour l'une ni pour l'autre. Il ne faut pas exagérer l'effet : entre ces deux seuils, un retrait REER ne coûte que de l'impôt. En Ontario, avec ${F.m(RR)} de revenu de retraite, un retrait FERR de ${F.m(MT)} entraîne environ ${F.m(tEx)} d'impôt et ${F.m(cEx)} de SV récupérée en plus, soit ${F.p((tEx + cEx) / MT)} du retrait.`,
    faqs: [
      { q: 'Un retrait REER réduit-il la pension de la Sécurité de la vieillesse ?', a: `Seulement si votre revenu net de l'année dépasse le seuil de récupération, ${F.m(th26)} pour ${Y}. Sous ce seuil, un retrait REER ne change rien à la pension. Au-delà, chaque dollar retiré en fait rembourser ${F.p(rate, 0)}, en plus de l'impôt. La récupération se fait par retenue mensuelle sur la pension de la période qui commence en juillet de l'année suivante, et elle ne dépasse jamais la pension reçue.` },
      { q: 'À partir de quel revenu la pension de la SV est-elle réduite ?', a: `À partir de ${F.m(th26)} de revenu net mondial pour l'année ${Y}, ce qui touche la pension versée de juillet ${Y + 1} à juin ${Y + 2}. Pour l'année ${Y - 1}, le seuil est de ${F.m(th25)} et vaut pour juillet ${Y} à juin ${Y + 1}. Le gouvernement donne cet exemple : à ${F.m(100000)} de revenu ${Y - 1}, on rembourse ${F.p(rate, 0)} de l'écart avec ${F.m(th25)}, soit ${F.m(K.oas(100000, 2025))}.` },
      { q: 'Les retraits du FERR comptent-ils pour le Supplément de revenu garanti ?', a: `Oui. Les retraits d'un REER ou d'un FERR font partie du revenu annuel qui sert à fixer le droit au Supplément de revenu garanti, alors que ceux d'un CELI n'y entrent pas. Pour une personne seule, le revenu annuel doit rester sous ${F.m(GIS.singleMax)}. Un retrait qui fait franchir ce seuil fait perdre le droit au Supplément ; plus bas, il le réduit.` },
      { q: 'Vaut-il mieux retirer son REER avant de toucher la SV ?', a: `Il n'y a pas de réponse générale. Retirer plus tôt étale le revenu sur plus d'années et peut éviter de dépasser le seuil de récupération plus tard, mais l'impôt est payé plus tôt et l'argent cesse de croître à l'abri. Pour un revenu de retraite modeste, la question du SRG pèse davantage. Le simulateur compare le coût d'un retrait selon votre revenu de l'année.` },
    ],
    body: (h) => `
<h2>Le revenu qui compte</h2>
<p>La Sécurité de la vieillesse et le Supplément de revenu garanti sont deux prestations fédérales, mais elles regardent le même chiffre : votre revenu de l'année. Un retrait REER, un paiement de FERR, une rente, un salaire, des intérêts : tout cela entre dans le revenu net. Les retraits et les revenus du CELI, eux, n'y entrent pas, comme le rappelle le guide ${h.src('rc4466', 'RC4466')}. C'est la différence de fond entre les deux comptes à la retraite : un dollar sorti d'un REER est un revenu, un dollar sorti d'un CELI n'en est pas un.</p>
<p>Cette différence ne pèse pourtant que dans deux zones de revenu : en bas, là où l'on peut recevoir le Supplément, et en haut, là où la pension de la SV commence à être récupérée. Entre les deux, et c'est là que se trouvent beaucoup de retraités, un retrait REER ne coûte que l'impôt ordinaire au taux marginal.</p>
<h2>La récupération de la SV</h2>
<p>Quand votre revenu net mondial dépasse le seuil de l'année, vous remboursez ${h.p(rate, 0)} de l'excédent, selon la ${h.src('esdc_oas_recovery', 'page fédérale sur l’impôt de récupération')}. Le remboursement est retenu chaque mois sur la pension de la période de juillet à juin qui suit l'année de revenu.</p>
${h.table(['Année de revenu', 'Seuil de récupération', 'Pension touchée'], [[String(Y - 1), h.m(th25), `juillet ${Y} à juin ${Y + 1}`], [String(Y), h.m(th26), `juillet ${Y + 1} à juin ${Y + 2}`]], `Récupération de ${h.p(rate, 0)} du revenu net au-delà du seuil ; elle ne dépasse jamais la pension reçue.`, ['l', 'r', 'l'])}
<p>Au-dessus du seuil, un retrait REER coûte donc l'impôt plus ${h.p(rate, 0)}. Le tableau suivant suit un retrait FERR de ${h.m(MT)} en Ontario, selon le revenu de retraite déjà acquis dans l'année. Tant que le revenu total reste sous ${h.m(th26)}, la colonne de la SV reste à zéro ; dans le tableau, elle n'apparaît qu'à la ligne de ${h.m(90000)}, quand le retrait fait franchir le seuil.</p>
${h.table(['Revenu de retraite avant le retrait', 'Impôt sur le retrait', 'SV récupérée en plus', 'Coût total en %'], rowsFor(h), `Retrait de ${h.m(MT)} en ${K.prov('ON', 'fr')}, barème ${Y}. Les crédits pour âge et pour revenu de pension ne sont pas comptés.`, ['l', 'r', 'r', 'r'])}
<h2>Le Supplément de revenu garanti</h2>
<p>Le Supplément s'adresse aux personnes de 65 ans ou plus qui reçoivent la pension de la SV, vivent au Canada et ont un revenu annuel sous le seuil de leur situation, d'après la ${h.src('esdc_gis', 'page d’admissibilité au SRG')}.</p>
${h.table(['Situation', 'Revenu annuel inférieur à'], gisRows(h, 'Personne seule, divorcée ou veuve', 'Conjoint qui reçoit la pension de la SV complète (revenu du couple)', 'Conjoint qui reçoit l’Allocation (revenu du couple)', 'Conjoint qui ne reçoit pas la SV (revenu du couple)'), 'Seuils de revenu publiés pour le Supplément de revenu garanti.', ['l', 'r'])}
<p>Dans cette zone, un retrait REER ou FERR réduit le Supplément en plus d'être imposé, et un retrait qui fait passer le revenu au-dessus du seuil le supprime. Le simulateur ne chiffre pas cette réduction ; il signale seulement que le revenu se trouve dans la zone du SRG. Un retrait CELI, lui, laisse le Supplément intact. C'est pourquoi le CELI est souvent cité pour les personnes qui prévoient un revenu de retraite modeste : la comparaison complète est sur la page ${h.a('reer-ou-celi', 'REER ou CELI')}.</p>
${h.mini('reerCeli', { t: 'REER ou CELI avec un petit revenu de retraite', p: ['rv', 'ep', 'rr'], d: { pr: 'ON', rv: 50000, rr: 20000 }, c: 'Voir l’effet du SRG dans la comparaison' })}
<h2>Trois retraités, trois effets</h2>
<p>Une personne seule de l'Ontario qui vit de ${h.m(16000)} de revenu et retire ${h.m(5000)} de son REER reste sous le seuil du SRG, à ${h.m(21000)}. L'impôt sur le retrait est faible, environ ${h.m(pA)} avant les crédits liés à l'âge, mais le Supplément baisse : pour elle, le CELI aurait été le compte le plus utile, et c'est le seul cas où l'écart peut être important.</p>
<p>Une deuxième personne touche ${h.m(50000)} de rentes et retire ${h.m(MT)} de son FERR. Elle est trop haut pour le Supplément et loin du seuil de la SV : le retrait lui coûte environ ${h.m(pB)} d'impôt, rien de plus. Beaucoup de retraités sont dans ce cas, et pour eux la question REER ou CELI se ramène à la comparaison des taux d'imposition.</p>
<p>Une troisième touche déjà ${h.m(110000)}. Le même retrait de ${h.m(MT)} lui coûte ${h.m(pC)} d'impôt et ${h.m(cC)} de pension récupérée, soit ${h.p((pC + cC) / MT)} du montant. À ce niveau, chaque dollar sorti du REER subit le taux marginal plus ${h.p(rate, 0)}.</p>
<h2>Ce que l'on peut ajuster</h2>
<p>Le moment des retraits est le seul levier. Un retrait se rattache à l'année civile où il est fait : le même montant peut tomber sous le seuil une année et au-dessus l'année suivante. L'année de vos 71 ans, le REER doit être retiré, transféré dans un FERR ou servir à acheter une rente, et le FERR verse un montant minimum chaque année à partir de l'année qui suit son ouverture, ce qui limite la marge de manœuvre. Dans un couple, le titulaire du compte compte aussi : un ${h.a('reer-conjoint', 'REER de conjoint')} place les retraits dans le revenu du conjoint, avec son propre seuil de récupération.</p>
<p>Le retrait lui-même subit une retenue à la source qui ne tient compte ni de l'impôt réel ni de la SV : le solde se règle dans la déclaration, voir ${h.a('retrait-reer', 'retrait REER')}.</p>
`,
  },
  en: {
    slug: 'rrsp-oas-gis',
    nav: 'RRSP, OAS and GIS', card: `An RRSP or RRIF withdrawal counts for the OAS clawback above ${E.m(th26)} and for the GIS; a TFSA withdrawal does not.`,
    title: `RRSP and OAS ${Y}: clawback, GIS and RRIF withdrawals`,
    description: `RRSP, OAS and GIS in ${Y}: RRSP or RRIF withdrawals count for the ${E.p(rate, 0)} OAS clawback above ${E.m(th26)} and for the GIS income test. TFSA withdrawals do not count.`,
    h1: `RRSP and Old Age Security ${Y}: what a withdrawal really costs`,
    intro: 'Enter your province, your retirement income before withdrawals and the planned RRSP or RRIF withdrawal: the calculator adds the OAS that would be clawed back to the tax.',
    resume: `An RRSP or RRIF withdrawal is added to your net income, and that income drives two federal retirement benefits. The Old Age Security pension is clawed back at ${E.p(rate, 0)} of net income above ${E.m(th26)} for the ${Y} income year (${E.m(th25)} for ${Y - 1}). The Guaranteed Income Supplement is only paid when annual income stays below ${E.m(GIS.singleMax)} for a single person, and RRSP and RRIF withdrawals count toward that income. A TFSA withdrawal counts for neither, whatever its size. The effect is easy to overstate: between those two thresholds, an RRSP withdrawal costs nothing but tax. In Ontario, with ${E.m(RR)} of retirement income, a ${E.m(MT)} RRIF withdrawal brings about ${E.m(tEx)} of tax and ${E.m(cEx)} of extra OAS clawed back, or ${E.p((tEx + cEx) / MT)} of the withdrawal.`,
    faqs: [
      { q: 'Do RRSP withdrawals reduce Old Age Security?', a: `Only if your net income for the year goes above the recovery threshold, ${E.m(th26)} for ${Y}. Below it, an RRSP withdrawal changes nothing in your pension. Above it, every dollar withdrawn makes you repay ${E.p(rate, 0)}, on top of the tax. The recovery is taken monthly from the pension for the period starting the following July, and it never exceeds the pension received.` },
      { q: 'At what income is OAS clawed back?', a: `From ${E.m(th26)} of net world income for ${Y}, which affects the pension paid from July ${Y + 1} to June ${Y + 2}. For ${Y - 1} income the threshold is ${E.m(th25)}, for July ${Y} to June ${Y + 1}. The government gives this example: with ${E.m(100000)} of ${Y - 1} income, you repay ${E.p(rate, 0)} of the gap above ${E.m(th25)}, which is ${E.m(K.oas(100000, 2025))}.` },
      { q: 'Do RRIF withdrawals count as income for the GIS?', a: `Yes. RRSP and RRIF withdrawals are part of the annual income used to decide whether you get the Guaranteed Income Supplement, while TFSA withdrawals are left out. For a single person, annual income has to stay below ${E.m(GIS.singleMax)}. A withdrawal that pushes you over that line ends your eligibility for the Supplement; below it, the withdrawal reduces it.` },
      { q: 'Should I draw down my RRSP before OAS starts?', a: `There is no general answer. Drawing earlier spreads the income over more years and can keep you under the recovery threshold later, but you pay the tax sooner and the money stops growing tax-sheltered. With a modest retirement income, the GIS question matters more. The calculator compares the cost of a withdrawal against your income for the year.` },
    ],
    body: (h) => `
<h2>The income that counts</h2>
<p>Old Age Security and the Guaranteed Income Supplement are two federal benefits, but both look at the same figure: your income for the year. An RRSP withdrawal, a RRIF payment, an annuity, wages, interest: all of it goes into net income. TFSA withdrawals and TFSA income do not, as guide ${h.src('rc4466', 'RC4466')} points out. That is the real difference between the two accounts in retirement: a dollar out of an RRSP is income, a dollar out of a TFSA is not.</p>
<p>The difference only bites in two income ranges, though: at the bottom, where the Supplement can be paid, and at the top, where the OAS pension starts to be clawed back. In between, which is where many retirees sit, an RRSP withdrawal costs nothing beyond ordinary tax at the marginal rate.</p>
<h2>The OAS clawback</h2>
<p>When your net world income goes above the threshold for the year, you repay ${h.p(rate, 0)} of the excess, according to the ${h.src('esdc_oas_recovery', 'federal page on the recovery tax')}. The repayment is withheld each month from the pension for the July-to-June period that follows the income year.</p>
${h.table(['Income year', 'Recovery threshold', 'Pension affected'], [[String(Y - 1), h.m(th25), `July ${Y} to June ${Y + 1}`], [String(Y), h.m(th26), `July ${Y + 1} to June ${Y + 2}`]], `Recovery of ${h.p(rate, 0)} of net income above the threshold; it never exceeds the pension received.`, ['l', 'r', 'l'])}
<p>Above the threshold, then, an RRSP withdrawal costs the tax plus ${h.p(rate, 0)}. The next table follows a ${h.m(MT)} RRIF withdrawal in Ontario, by the retirement income already earned in the year. As long as total income stays below ${h.m(th26)}, the OAS column stays at zero; in the table it first shows up on the ${h.m(90000)} row, when the withdrawal crosses the line.</p>
${h.table(['Retirement income before the withdrawal', 'Tax on the withdrawal', 'Extra OAS clawed back', 'Total cost in %'], rowsFor(h), `${h.m(MT)} withdrawal in ${K.prov('ON', 'en')}, ${Y} tax tables. Age and pension income credits are not counted.`, ['l', 'r', 'r', 'r'])}
<h2>The Guaranteed Income Supplement</h2>
<p>The Supplement is for people aged 65 or older who receive the OAS pension, live in Canada and have an annual income below the threshold for their situation, according to the ${h.src('esdc_gis', 'GIS eligibility page')}.</p>
${h.table(['Situation', 'Annual income must be below'], gisRows(h, 'Single, divorced or widowed', 'Spouse receives the full OAS pension (couple income)', 'Spouse receives the Allowance (couple income)', 'Spouse does not receive OAS (couple income)'), 'Published income thresholds for the Guaranteed Income Supplement.', ['l', 'r'])}
<p>In this range, an RRSP or RRIF withdrawal reduces the Supplement as well as being taxed, and a withdrawal that lifts income above the threshold removes it. The calculator does not put a figure on that reduction; it only flags that your income is in the GIS range. A TFSA withdrawal leaves the Supplement untouched. That is why the TFSA often comes up for people who expect a modest retirement income; the full comparison is on the ${h.a('reer-ou-celi', 'RRSP vs TFSA')} page.</p>
${h.mini('reerCeli', { t: 'RRSP or TFSA with a small retirement income', p: ['rv', 'ep', 'rr'], d: { pr: 'ON', rv: 50000, rr: 20000 }, c: 'See the GIS effect in the comparison' })}
<h2>Three retirees, three effects</h2>
<p>A single person in Ontario living on ${h.m(16000)} who takes ${h.m(5000)} out of an RRSP stays under the GIS threshold, at ${h.m(21000)}. The tax on the withdrawal is small, about ${h.m(pA)} before age credits, but the Supplement goes down: for this person a TFSA would have been the more useful account, and it is the one case where the gap can be large.</p>
<p>A second person receives ${h.m(50000)} in pensions and withdraws ${h.m(MT)} from a RRIF. They are too high for the Supplement and well below the OAS threshold, so the withdrawal costs about ${h.m(pB)} in tax and nothing else. Many retirees are in this position, and for them the RRSP or TFSA question comes down to comparing tax rates.</p>
<p>A third already has ${h.m(110000)}. The same ${h.m(MT)} withdrawal costs ${h.m(pC)} in tax and ${h.m(cC)} in clawed-back pension, or ${h.p((pC + cC) / MT)} of the amount. At that level, every dollar taken out of the RRSP bears the marginal rate plus ${h.p(rate, 0)}.</p>
<h2>What you can adjust</h2>
<p>Timing is the only lever. A withdrawal belongs to the calendar year it is made in, so the same amount can fall below the threshold one year and above it the next. In the year you turn 71, the RRSP has to be withdrawn, moved to a RRIF or used to buy an annuity, and a RRIF pays out a minimum amount each year from the year after it is set up, which narrows the room to manoeuvre. In a couple, whose name the account is in matters too: a ${h.a('reer-conjoint', 'spousal RRSP')} puts withdrawals in the spouse's income, with its own recovery threshold.</p>
<p>The withdrawal itself has tax withheld at source that takes neither the real tax nor OAS into account; the balance is settled on your return, see ${h.a('retrait-reer', 'RRSP withdrawal tax')}.</p>
`,
  },
});
