import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Prov } from '../../lib/engine/tax';

const F = K.fr, E = K.en, Y = K.YEAR;
const AMT = 5000;
const incomes = [40000, 60000, 80000, 100000, 150000];
const provs: Prov[] = ['QC', 'ON', 'AB'];
// Exemple principal : Ontario, 70 000 $ de revenu imposable, 5 000 $ déduits.
const on70 = K.saving(70000, AMT, 'ON'), mr70 = K.marginal(70000, 'ON');
// Déduction qui traverse un seuil de tranche : 10 000 $ à 60 000 $ en Ontario.
const cross = K.saving(60000, 10000, 'ON'), mr60 = K.marginal(60000, 'ON');
// Québec : deux déclarations, deux baisses d'impôt.
const qA = K.taxDetail(70000, 'QC'), qB = K.taxDetail(70000 - AMT, 'QC');
const qFed = qA.federal - qB.federal, qProv = qA.provincial - qB.provincial;
const abat = K.P.federal.qcAbatement;
// Report de la déduction : revenu de 45 000 $ cette année, 80 000 $ prévus plus tard (Ontario).
const low = K.saving(45000, AMT, 'ON'), high = K.saving(80000, AMT, 'ON');

export default defineGuide({
  id: 'remboursement-reer', group: 'reer', order: 12, tool: 'remboursement',
  related: ['reer-ou-celi', 'taux-marginal', 'plafond-reer', 'date-limite-reer', 'reer-allocation-enfants'],
  sources: ['cra_rates_2026', 'cra_rrsp_limit', 'rq_rates', 'cra_ccb'],
  fr: {
    slug: 'calcul-remboursement-reer',
    nav: 'Remboursement REER', card: `Ce que votre cotisation fait baisser votre impôt ${Y}, au fédéral et dans votre province, avec votre taux marginal.`,
    title: `Remboursement REER ${Y} : combien d'impôt vous récupérez`,
    description: `Remboursement REER ${Y} : la baisse d'impôt vaut votre taux marginal, par exemple ${F.m(on70)} pour ${F.m(AMT)} cotisés à ${F.m(70000)} en Ontario. Calcul par province.`,
    h1: `Remboursement d'impôt REER ${Y} : combien allez-vous récupérer ?`,
    intro: 'Entrez votre province, votre revenu imposable et le montant que vous comptez déduire : le simulateur recalcule votre impôt fédéral et provincial avant et après la déduction.',
    resume: `Le remboursement REER n'est pas une prime : c'est l'impôt que vous ne payez pas sur la partie de votre revenu que vous déduisez. En ${Y}, une personne de l'Ontario dont le revenu imposable est de ${F.m(70000)} et qui déduit ${F.m(AMT)} paie ${F.m(on70)} d'impôt en moins, soit son taux marginal de ${F.p(mr70)} appliqué à toute la cotisation. Au même revenu, l'économie atteint ${F.m(K.saving(70000, AMT, 'QC'))} au Québec et ${F.m(K.saving(70000, AMT, 'AB'))} en Alberta. Quand la déduction fait passer votre revenu sous un seuil de tranche, une partie est récupérée au taux plus bas, et la moyenne baisse. Cette économie ne devient un chèque que si l'impôt retenu sur votre paie dépassait l'impôt dû. Elle n'est pas définitive non plus : les retraits du REER seront imposés plus tard. Pour que la cotisation rapporte vraiment, le montant récupéré doit être placé à son tour.`,
    faqs: [
      { q: `Combien me rapporte une cotisation REER de 5 000 $ en ${Y} ?`, a: `Votre taux marginal multiplié par ${F.m(AMT)}, tant que la déduction ne vous fait pas changer de tranche. À ${F.m(60000)} de revenu imposable, cela donne ${F.m(K.saving(60000, AMT, 'QC'))} au Québec, ${F.m(K.saving(60000, AMT, 'ON'))} en Ontario et ${F.m(K.saving(60000, AMT, 'AB'))} en Alberta. À ${F.m(40000)}, c'est moins, puisque le taux marginal est plus bas. Le simulateur donne le chiffre des 13 provinces et territoires pour votre revenu.` },
      { q: 'Pourquoi mon remboursement REER est-il plus petit que prévu ?', a: `Trois raisons reviennent souvent. La déduction a fait descendre votre revenu dans une tranche moins imposée, et une partie n'est récupérée qu'au taux inférieur. Ou bien la baisse d'impôt a servi d'abord à combler un solde dû : l'impôt retenu sur la paie était trop faible. Enfin, la cotisation dépassait peut-être votre maximum déductible, et l'excédent n'a pas été déduit.` },
      { q: 'Peut-on attendre une autre année pour déduire sa cotisation REER ?', a: `Oui. Une cotisation non déduite reste disponible et peut être déduite une année ultérieure, dans la limite du maximum de cette année-là. En Ontario, ${F.m(AMT)} déduits à ${F.m(45000)} de revenu font économiser ${F.m(low)} ; déduits une année où le revenu atteint ${F.m(80000)}, ils en font économiser ${F.m(high)}. Il faut déclarer la cotisation à l'annexe 7 l'année du versement.` },
      { q: 'Comment recevoir l’économie d’impôt du REER sur chaque paie ?', a: `Si vous cotisez par versements réguliers prévus par contrat avec une institution, le formulaire T1213 permet de demander à l'Agence du revenu du Canada l'autorisation pour votre employeur de réduire l'impôt retenu à la source. L'économie arrive alors sur chaque paie plutôt qu'au printemps. Le même formulaire sert pour d'autres déductions ou crédits qui ne figurent pas sur le formulaire TD1.` },
    ],
    body: (h) => `
<h2>D'où vient le remboursement</h2>
<p>Une cotisation REER est déduite de votre revenu. Votre revenu imposable baisse du même montant, et l'impôt calculé sur ce revenu aussi. Tant que vous restez dans la même tranche, chaque dollar déduit fait économiser votre taux marginal combiné, fédéral plus provincial. En Ontario, à ${h.m(70000)} de revenu imposable, ce taux est de ${h.p(mr70)} en ${Y} : ${h.m(AMT)} déduits retirent ${h.m(on70)} de votre impôt. Les tranches viennent des ${h.src('cra_rates_2026', 'taux publiés par l’Agence du revenu du Canada')}.</p>
<p>Ce montant s'appelle « remboursement » parce qu'il arrive souvent ainsi : votre employeur a retenu de l'impôt sur un revenu de ${h.m(70000)}, alors que vous ne devez de l'impôt que sur ${h.m(70000 - AMT)}. L'écart vous revient après la déclaration. Si l'impôt retenu était déjà trop faible, la déduction réduit d'abord le solde à payer, et il n'y a peut-être aucun chèque.</p>
<h2>L'économie selon le revenu et la province</h2>
<p>Le tableau applique une même déduction de ${h.m(AMT)} à cinq revenus, dans trois provinces. L'économie grimpe avec le revenu, mais par paliers : elle ne change pas entre deux seuils de tranche, puis saute quand on passe au taux suivant.</p>
${h.table(['Revenu imposable', K.prov('QC', 'fr'), K.prov('ON', 'fr'), K.prov('AB', 'fr')], incomes.map((i) => [h.m(i), ...provs.map((p) => `${h.m(K.saving(i, AMT, p))} (${h.p(K.marginal(i, p))})`)]), `Baisse d’impôt ${Y} pour ${h.m(AMT)} déduits ; entre parenthèses, le taux marginal avant la déduction.`, ['l', 'r', 'r', 'r'])}
<p>Quand la déduction traverse un seuil, une partie seulement est récupérée au taux marginal de départ. En Ontario, une personne à ${h.m(60000)} qui déduit ${h.m(10000)} part d'un taux de ${h.p(mr60)}, mais descend sous le premier seuil fédéral en cours de route : elle économise ${h.m(cross)}, soit un taux moyen de ${h.p(cross / 10000)}. Le simulateur affiche ce taux moyen sous le résultat. Étaler une grosse déduction sur deux années permet parfois d'en garder une plus grande part au taux élevé : c'est l'une des raisons de bien choisir l'année de la déduction.</p>
<h2>Au Québec, deux déclarations et deux baisses</h2>
<p>Le Québec administre son propre impôt : ses résidents produisent en général une déclaration fédérale et une déclaration distincte pour Revenu Québec, et la déduction REER fait baisser les deux impôts. La part fédérale est plus petite qu'ailleurs, parce que les résidents du Québec reçoivent un abattement de ${h.r(abat)} de l'impôt fédéral de base. À ${h.m(70000)} de revenu, ${h.m(AMT)} déduits font baisser l'impôt fédéral de ${h.m(qFed)} et l'impôt du Québec de ${h.m(qProv)}, pour ${h.m(qFed + qProv)} au total. Les taux du Québec viennent de ${h.src('rq_rates', 'Revenu Québec')}.</p>
${h.mini('taux', { t: 'Votre taux marginal combiné', p: ['pr', 'rv'], c: 'Voir où le taux change dans votre province' })}
<h2>Pourquoi ce n'est pas un cadeau</h2>
<p>L'impôt économisé aujourd'hui sera payé plus tard, sur les retraits. Le REER reporte l'impôt ; il ne l'efface pas. Le gain réel dépend de l'écart entre votre taux d'aujourd'hui et celui qui s'appliquera aux retraits, et d'une condition : que le remboursement soit lui aussi épargné. Dépensé, il réduit la somme placée par rapport à un CELI. La comparaison complète est sur la page ${h.a('reer-ou-celi', 'REER ou CELI')}.</p>
<p>Il y a aussi des effets indirects. La déduction baisse le revenu net qui sert au calcul de prestations comme l'Allocation canadienne pour enfants : l'allocation versée à partir de juillet de l'année suivante peut augmenter, selon le ${h.src('cra_ccb', 'calcul de l’Agence')}. Le détail est sur la page ${h.a('reer-allocation-enfants', 'REER et allocation pour enfants')}.</p>
<h2>Choisir l'année de la déduction</h2>
<p>Cotiser et déduire sont deux gestes distincts. Une cotisation que vous ne déduisez pas tout de suite reste à votre crédit et peut être déduite une année ultérieure, dans la limite du maximum de cette année-là, selon la ${h.src('cra_rrsp_limit', 'page de l’Agence sur le maximum déductible')}. On la déclare à l'annexe 7 l'année du versement. Cela sert quand votre revenu va monter : en Ontario, ${h.m(AMT)} déduits à ${h.m(45000)} rapportent ${h.m(low)}, et ${h.m(high)} s'ils sont déduits une année à ${h.m(80000)}. L'argent fructifie à l'abri de l'impôt pendant ce temps.</p>
<p>Pour recevoir l'économie au fil de l'année plutôt qu'au printemps, une personne qui cotise par versements réguliers prévus par contrat avec une institution peut utiliser le formulaire T1213, Demande de réduction des retenues d'impôt à la source. L'Agence peut alors autoriser votre employeur à retenir moins d'impôt sur chaque paie.</p>
`,
  },
  en: {
    slug: 'rrsp-tax-refund',
    nav: 'RRSP tax refund', card: `How much your contribution cuts your ${Y} tax, federal and provincial, at your marginal rate.`,
    title: `RRSP tax refund ${Y}: how much tax you will get back`,
    description: `RRSP tax refund ${Y}: the tax saved equals your marginal rate, such as ${E.m(on70)} on ${E.m(AMT)} contributed at ${E.m(70000)} in Ontario. Figures for every province.`,
    h1: `RRSP tax refund ${Y}: how much will you get back?`,
    intro: 'Enter your province, your taxable income and the amount you plan to deduct: the calculator works out your federal and provincial tax before and after the deduction.',
    resume: `An RRSP refund is not a bonus: it is the tax you do not pay on the part of your income you deduct. In ${Y}, an Ontario resident with ${E.m(70000)} of taxable income who deducts ${E.m(AMT)} pays ${E.m(on70)} less tax, which is the ${E.p(mr70)} marginal rate applied to the whole contribution. At the same income, the saving is ${E.m(K.saving(70000, AMT, 'QC'))} in Quebec and ${E.m(K.saving(70000, AMT, 'AB'))} in Alberta. When the deduction takes your income below a bracket threshold, part of it is saved at the lower rate and the average drops. The saving only turns into a cheque if the tax withheld from your pay was more than the tax you owe. It is not final either: RRSP withdrawals will be taxed later. For the contribution to pay off, the money you get back has to be invested too.`,
    faqs: [
      { q: `How much tax do I get back on a $5,000 RRSP contribution in ${Y}?`, a: `Your marginal rate times ${E.m(AMT)}, as long as the deduction does not move you into a lower bracket. At ${E.m(60000)} of taxable income, that is ${E.m(K.saving(60000, AMT, 'QC'))} in Quebec, ${E.m(K.saving(60000, AMT, 'ON'))} in Ontario and ${E.m(K.saving(60000, AMT, 'AB'))} in Alberta. At ${E.m(40000)} it is less, since the marginal rate is lower. The calculator shows the figure for all 13 provinces and territories at your income.` },
      { q: 'Why is my RRSP refund smaller than I expected?', a: `Three reasons come up often. The deduction pushed your income into a lower bracket, so part of it was saved at the lower rate. Or the tax saving first went to cover a balance owing because too little tax was withheld from your pay. Or the contribution was above your deduction limit, and the extra was not deducted.` },
      { q: 'Can I wait and deduct my RRSP contribution in a later year?', a: `Yes. A contribution you do not deduct stays available and can be deducted in a later year, up to that year's limit. In Ontario, ${E.m(AMT)} deducted at ${E.m(45000)} of income saves ${E.m(low)}; deducted in a year when income reaches ${E.m(80000)}, it saves ${E.m(high)}. You report the contribution on Schedule 7 for the year you made it.` },
      { q: 'How can I get my RRSP tax saving on each paycheque?', a: `If you contribute through regular payments under a contract with a financial institution, Form T1213 lets you ask the Canada Revenue Agency to authorize your employer to reduce the tax withheld at source. The saving then shows up on each pay rather than in the spring. The same form covers other deductions or credits that are not part of Form TD1.` },
    ],
    body: (h) => `
<h2>Where the refund comes from</h2>
<p>An RRSP contribution is deducted from your income. Your taxable income falls by the same amount, and so does the tax on it. As long as you stay in the same bracket, each dollar deducted saves your combined federal and provincial marginal rate. In Ontario, at ${h.m(70000)} of taxable income, that rate is ${h.p(mr70)} in ${Y}: deducting ${h.m(AMT)} takes ${h.m(on70)} off your tax. The brackets come from the ${h.src('cra_rates_2026', 'rates published by the Canada Revenue Agency')}.</p>
<p>It is called a refund because that is how it usually arrives: your employer withheld tax on ${h.m(70000)} of income, while you only owe tax on ${h.m(70000 - AMT)}. The difference comes back after you file. If too little tax was withheld to begin with, the deduction first shrinks the balance owing, and there may be no cheque at all.</p>
<h2>The saving by income and province</h2>
<p>The table applies the same ${h.m(AMT)} deduction at five income levels in three provinces. The saving rises with income, but in steps: it stays flat between two bracket thresholds, then jumps when you reach the next rate.</p>
${h.table(['Taxable income', K.prov('QC', 'en'), K.prov('ON', 'en'), K.prov('AB', 'en')], incomes.map((i) => [h.m(i), ...provs.map((p) => `${h.m(K.saving(i, AMT, p))} (${h.p(K.marginal(i, p))})`)]), `${Y} tax saved on a ${h.m(AMT)} deduction; marginal rate before the deduction in brackets.`, ['l', 'r', 'r', 'r'])}
<p>When the deduction crosses a threshold, only part of it is saved at your starting marginal rate. In Ontario, someone at ${h.m(60000)} who deducts ${h.m(10000)} starts at ${h.p(mr60)} but drops below the first federal threshold along the way: they save ${h.m(cross)}, an average rate of ${h.p(cross / 10000)}. The calculator shows that average rate under the result. Splitting a large deduction over two years can sometimes keep more of it at the higher rate, which is one reason to look at the year of the deduction below.</p>
<h2>In Quebec, two returns and two savings</h2>
<p>Quebec runs its own income tax, so residents generally file a federal return and a separate Revenu Québec return, and the RRSP deduction lowers both taxes. The federal part is smaller than elsewhere because Quebec residents get an abatement of ${h.r(abat)} of basic federal tax. At ${h.m(70000)} of income, a ${h.m(AMT)} deduction cuts federal tax by ${h.m(qFed)} and Quebec tax by ${h.m(qProv)}, ${h.m(qFed + qProv)} in total. Quebec rates come from ${h.src('rq_rates', 'Revenu Québec')}.</p>
${h.mini('taux', { t: 'Your combined marginal rate', p: ['pr', 'rv'], c: 'See where the rate changes in your province' })}
<h2>Why it is not free money</h2>
<p>The tax saved today will be paid later, on withdrawals. An RRSP defers tax; it does not erase it. The real gain depends on the gap between your rate today and the one that will apply to withdrawals, and on one condition: the refund has to be saved as well. Spent, it leaves less invested than a TFSA would. The full comparison is on the ${h.a('reer-ou-celi', 'RRSP vs TFSA')} page.</p>
<p>There are side effects too. The deduction lowers the net income used for benefits such as the Canada Child Benefit, so the benefit paid from July of the following year can go up, under the ${h.src('cra_ccb', 'CRA calculation')}. The details are on the ${h.a('reer-allocation-enfants', 'RRSP and child benefit')} page.</p>
<h2>Choosing the year of the deduction</h2>
<p>Contributing and deducting are two separate steps. A contribution you do not deduct right away stays on your record and can be deducted in a later year, up to that year's limit, according to the ${h.src('cra_rrsp_limit', 'CRA page on the deduction limit')}. You report it on Schedule 7 for the year you paid it. That helps when your income is about to rise: in Ontario, ${h.m(AMT)} deducted at ${h.m(45000)} saves ${h.m(low)}, and ${h.m(high)} if deducted in a year at ${h.m(80000)}. Meanwhile the money grows sheltered from tax.</p>
<p>To get the saving during the year rather than in the spring, someone who contributes through regular payments under a contract with a financial institution can use Form T1213, Request to Reduce Tax Deductions at Source. The CRA can then authorize your employer to withhold less tax on each pay.</p>
`,
  },
});
