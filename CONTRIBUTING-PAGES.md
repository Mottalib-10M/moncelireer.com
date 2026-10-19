# Écrire une page

Une page = un fichier TypeScript, `src/content/guides/<id>.ts` (`defineGuide`), qui porte la version
française (`fr`) et la version anglaise (`en`) côte à côte. Routes, menus, pied de page, sitemap,
hreflang, schémas, llms.txt et liens internes ne lisent que ces fichiers. Modèle : `guides/droits-celi.ts`.

- Ids prévus : `src/lib/planned.ts`. Champs : `src/lib/page-types.ts`.
- Simulateurs (et champs de chaque mini-simulateur) : `src/lib/tool-specs.ts`. Ids des champs :
  `pr` province, `rv` revenu, `na` année de naissance, `ar` arrivée, `mt` montant, etc.
- Pages par province : id `prov-<code>`, `group: 'prov'`, `toolArg: { pr: '<CODE>' }` (le tableau de
  l'accueil retrouve la page par `toolArg.pr`).

## Chiffres

- Aucun chiffre que les données contiennent n'est tapé à la main. Trousse `K` (`src/lib/kit.ts`) :
  `K.tfsaLimit(y)`, `K.tfsaCum(y)`, `K.tfsaRoom({...})`, `K.rrspLimit(y)`, `K.rrspRoom({...})`,
  `K.rrspExcess(limit, contrib)`, `K.withholding(montant, qc)`, `K.fhsaRoom({...})`, `K.hbp(...)`,
  `K.llp(...)`, `K.marginal(revenu, 'QC')`, `K.split(...)`, `K.saving(revenu, déduction, 'ON')`,
  `K.wtax(autres, retrait, 'BC')`, `K.steps('MB')`, `K.compare({...})`, `K.ccbGain(...)`, `K.oas(net)`,
  `K.jur('ON')` (tranches, taux, montant de base), `K.P` (params-2026.json), `K.prov('QC', 'fr')`.
- Formats : `K.fr.m(7000)` « 7 000 $ », `K.en.m(7000)` « $7,000 », `.p(0.361)` taux arrondi,
  `.r(0.1216)` taux officiel avec ses décimales, `.n()`, `.day(iso)`. Dans `body(h)` : `h.m`, `h.p`,
  `h.r`, `h.n`, `h.day` sont déjà dans la langue de la page.
- Les montants d'exemple que vous choisissez (un revenu de 75 000 $) peuvent être tapés.
- 2027 : seul le plafond REER (35 390 $) est publié. Le plafond CELI 2027 est « à venir », jamais une
  projection. Les tranches 2027 ne sont pas publiées.

## Règles vérifiées par `tests/pages.test.ts`

- `title` 50 à 60 caractères, terme clé d'abord, contient 2026 ; jamais en tête un mot de question,
  « Calcul », « Simulateur », « Canada », « Canadian ». Unique.
- `description` 150 à 160 caractères avec 2026. Unique.
- `resume` : UN paragraphe de 120 mots ou plus, la réponse chiffrée.
- Corps : au moins 520 mots de prose (tableaux à part), au moins un `${h.mini(kind, { t, p, d })}`.
- FAQ : 3 à 5 questions, réponses de 40 à 90 mots, chaque question unique sur tout le site (accueil
  compris, les deux langues). Ce sont les questions que les gens tapent.
- Ni tiret cadratin ni demi-cadratin ; en anglais ni « Moreover », « Additionally », « Furthermore »,
  « delve », « dive into », « navigate the », « whether you're », « unlock », « guaranteed » ; en
  français ni « en outre », « de plus, », « par ailleurs », « n'hésitez pas », « il est important de noter ».
- Ni `undefined`, `NaN`, `null` dans la sortie.
- Liens : `${h.a('id', 'texte')}` ; sources : `${h.src('clé', 'texte')}` (clés de `params-2026.json > sources`).

Similarité entre deux pages : moins de 30 % (`python3 scripts/sim-pages.py --seuil 28` après le test).
Les 13 pages par province partagent un simulateur, pas un texte : chacune part de ce qui est propre à la
province (tranches, montant de base, surtaxe, hausse ou gel, abattement du Québec, prestations locales
connues), avec un plan et des exemples à elle.

Tester un fichier : `PAGE_FILES=droits-celi,prov-qc npx vitest run tests/pages.test.ts`.

## Ton

Français clair du Canada (« courriel », « avis de cotisation », « Mon dossier », « cotiser »), tutoiement
exclu, phrases courtes, faits d'abord. Anglais simple du Canada. Site indépendant : jamais « nous, à
l'Agence » ; on ne vend rien, on ne recommande aucun produit ni institution. Information générale, pas
de conseil personnel : les chiffres officiels sont l'avis de cotisation et Mon dossier. Ne jamais nommer
ni lier canadanetpay.com, myeicanada.com, mycanadabenefits.com ni un autre site du portefeuille.

## Faits vérifiés (sources officielles lues le 2026-10-19)

CELI (guide RC4466, tableau des plafonds de canada.ca)
- Plafonds : 2009 à 2012 5 000 $ ; 2013-2014 5 500 $ ; 2015 10 000 $ ; 2016 à 2018 5 500 $ ;
  2019 à 2022 6 000 $ ; 2023 6 500 $ ; 2024 à 2026 7 000 $ ; total 109 000 $. Indexé, arrondi à 500 $.
- Droits d'une année : si la personne a au moins 18 ans ET réside au Canada à un moment de l'année.
  Pas de prorata l'année d'arrivée ou de départ. Aucune accumulation pour une année entière de
  non-résidence. NAS valide requis.
- Là où l'on ne peut signer un contrat qu'à 19 ans, les droits de l'année des 18 ans sont reportés.
- Retraits : non imposés, ajoutés aux droits le 1er janvier suivant. Transferts directs entre CELI :
  ni retrait ni cotisation. Rendements et pertes : aucun effet sur les droits.
- Excédent : impôt de 1 % par mois sur l'excédent le plus élevé du mois, tant qu'il reste. Cotisation
  d'un non-résident : 1 % par mois jusqu'au retrait ou au retour comme résident.
- Le revenu et les retraits du CELI ne réduisent pas : SV, SRG, assurance-emploi, ACE, ACT (allocation
  canadienne pour les travailleurs), crédit pour la TPS/TVH, montant en raison de l'âge.
- Intérêts d'un emprunt pour cotiser : non déductibles. Cotisation non déductible.

REER
- Plafond en dollars : 2022 29 210 $ ; 2023 30 780 $ ; 2024 31 560 $ ; 2025 32 490 $ ; 2026 33 810 $ ;
  2027 35 390 $.
- Maximum déductible : droits inutilisés + le moins élevé de 18 % du revenu gagné de l'année précédente
  et du plafond, − facteur d'équivalence (FE) + FE rectifié − FE pour services passés.
- Cotiser jusqu'au 31 décembre de l'année des 71 ans.
- Excédent : marge de 2 000 $ à 18 ans et plus ; au-delà, 1 % par mois ; formulaire T1-OVP dans les
  90 jours après la fin de l'année.
- Date limite pour l'année 2025 : 2 mars 2026. Pour l'année 2026 : 60e jour de 2027 = 1er mars 2027
  (déduit, pas encore publié par l'Agence : écrire « 60 jours après la fin de l'année, soit le 1er mars 2027 »).
- Retenue sur un retrait unique : 10 % jusqu'à 5 000 $, 20 % de 5 000,01 $ à 15 000 $, 30 % au-delà ;
  au Québec 5 %, 10 %, 15 % au fédéral plus la retenue du Québec ; non-résident 25 %.
- REER de conjoint : un retrait est imposé au cotisant s'il a cotisé à un REER de conjoint l'année du
  retrait ou l'une des deux années précédentes.
- Un retrait REER ne redonne pas de droits.

CELIAPP (pages de canada.ca)
- Ouvrir : résident, 18 ans (ou âge de contracter), 71 ans au plus au 31 décembre de l'année
  d'ouverture, premier acheteur : ni vous ni votre conjoint n'avez été propriétaire de la maison où
  vous habitiez dans l'année ou les 4 années civiles précédentes.
- Droits : 8 000 $ par année à partir de l'ouverture (rien avant), report de la part inutilisée limité
  à 8 000 $, plafond à vie 40 000 $. Durée maximale 15 ans (fermeture au plus tard fin de la 15e année
  après l'ouverture, ou année des 71 ans, ou l'année suivant le premier retrait admissible).
- Cotisation déductible ; la déduction peut être reportée à une année ultérieure. Retrait admissible
  pour une première propriété : non imposé. Transfert d'un REER vers le CELIAPP : utilise les droits
  CELIAPP, ne redonne pas de droits REER, non déductible. Excédent : 1 % par mois.
- On peut faire un retrait RAP et un retrait admissible CELIAPP pour la même maison.

RAP
- Limite 60 000 $ par personne. Remboursement sur 15 ans. Allègement : pour un premier retrait entre
  le 1er janvier 2022 et le 31 décembre 2025, puis prolongé du 1er janvier 2026 au 31 décembre 2028,
  le remboursement commence la 5e année suivant l'année du premier retrait (sinon la 2e). Exemple
  officiel : premier retrait en 2026, première année de remboursement 2031. Un versement manquant
  est ajouté au revenu.

REEP
- 10 000 $ par année, 20 000 $ par participation ; remboursement de 1/10 par année sur 10 ans ; début
  au plus tard la 5e année après le premier retrait, plus tôt si l'étudiant n'est pas admissible deux
  années de suite (début la 2e de ces deux années).

Impôt fédéral 2026 : tranches 58 523 $, 117 045 $, 181 440 $, 258 482 $ ; taux 14 %, 20,5 %, 26 %, 29 %,
33 % ; montant personnel de base 16 452 $, réduit jusqu'à 14 829 $ entre 181 440 $ et 258 482 $.
Abattement du Québec : 16,5 % de l'impôt fédéral de base.

Provinces 2026 (`K.jur(code)` donne les tranches) :
- QC : 14 %, 19 %, 24 %, 25,75 % ; montant de base 18 952 $. Tranches non relues (revenuquebec.ca
  refuse les robots) : ne pas écrire les seuils du Québec en dur dans le texte ; les citer seulement
  via le simulateur ou `K.jur('QC')` en précisant qu'ils viennent de Revenu Québec.
- ON : 5,05 % à 13,16 % ; montant de base 12 989 $ ; surtaxe de 20 % de l'impôt de base de l'Ontario
  au-delà de 5 818 $ et 36 % au-delà de 7 446 $. Contribution santé de l'Ontario non modélisée.
- BC : 5,6 % (hausse de 5,06 % à 5,6 %, annoncée le 17 février 2026) à 20,5 % ; montant de base 13 216 $ ;
  indexation suspendue de 2027 à 2030.
- AB : 8 % (tranche créée en 2025) jusqu'à 61 200 $, puis 10 %, 12 %, 13 %, 14 %, 15 % ; montant de base 22 769 $.
- SK : 10,5 %, 12,5 %, 14,5 % ; montant de base 20 381 $ (hausse de 500 $ par année prévue).
- MB : 10,8 %, 12,75 %, 17,4 % ; tranches gelées à 47 000 $ et 100 000 $ depuis 2025 ; montant de base
  15 780 $, réduit à zéro entre 200 000 $ et 400 000 $ de revenu net.
- NS : 8,79 % à 21 % ; montant de base 11 932 $.
- NB : 9,4 %, 14 %, 16 %, 19,5 % ; montant de base 13 664 $.
- NL : 8,7 % à 21,8 % (8 taux) ; montant de base 13 094 $ (relevé de 11 188 $, annonce du 29 avril 2026).
- PE : 9,5 % à 20 % ; nouvelle tranche à 20 % au-delà de 200 000 $ (annonce du 14 avril 2026) ;
  montant de base 15 000 $ (de 14 650 $).
- YT : 6,4 % à 15 % ; tranches du fédéral jusqu'à 181 440 $, puis 500 000 $ ; montant de base = fédéral.
- NT : 5,9 % à 14,05 % ; montant de base 18 198 $.
- NU : 4 % à 11,5 % ; montant de base 19 659 $.

Prestations
- ACE (juillet 2026 à juin 2027, revenu familial net rajusté de 2025) : seuils 38 237 $ et 82 847 $ ;
  réduction 7 % / 3,2 % (1 enfant), 13,5 % / 5,7 % (2), 19 % / 8 % (3), 23 % / 9,5 % (4 et plus) ;
  maximum 8 157 $ par enfant de moins de 6 ans, 6 883 $ de 6 à 17 ans. Une déduction REER ou CELIAPP
  baisse le revenu familial net, donc relève l'ACE de la période qui commence en juillet de l'année suivante.
- SV : récupération de 15 % du revenu net au-delà de 93 454 $ (revenu 2025) et 95 323 $ (revenu 2026).
- SRG : revenu annuel sous 23 112 $ (personne seule) ; 30 528 $ (couple dont le conjoint reçoit la SV
  complète). Retraits REER et FERR comptent dans ce revenu ; retraits CELI non.

Ce que le modèle d'impôt n'applique pas : crédits RPC/RRQ, AE, montant canadien pour emploi, âge,
pension ; réductions d'impôt des bas revenus (Ontario, C.-B.) ; contribution santé de l'Ontario ; IMR.

Tout autre fait : le lire dans un des textes officiels téléchargés (voir le compte rendu de l'agent)
ou sur canada.ca, et citer la phrase lue dans le compte rendu. Dans le doute, retirer la phrase.
