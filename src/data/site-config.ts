/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://moncelireer.com";
export const SITE_NAMES: Record<string, string> = {"fr": "Mon CELI REER", "en": "TFSA or RRSP"};
export const LANG_TAGS: Record<string, string> = {"fr": "fr-CA", "en": "en-CA"};
export const OG_LOCALES: Record<string, string> = {"fr": "fr_CA", "en": "en_CA"};
export const LOCALE_TAG = 'fr-CA';
export const CURRENCY = 'CAD';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-19';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"fr": "Éditeur indépendant de simulateurs CELI, REER et CELIAPP construits sur les plafonds publiés sur canada.ca et les barèmes d'impôt fédéral, du Québec et des provinces", "en": "Independent publisher of TFSA, RRSP and FHSA calculators built on the limits published on canada.ca and the federal, Quebec and provincial tax tables"};
export const AUTHOR_DESC: Record<string, string> = {"fr": "Radif Partners recalcule les droits CELI année par année depuis 2009, l'âge de 18 ans et la date d'arrivée au Canada, et chiffre le remboursement d'un REER avec les tranches 2026 du fédéral et des treize provinces et territoires, l'abattement du Québec et la surtaxe de l'Ontario compris. Les plafonds viennent du tableau des limites de l'Agence du revenu du Canada, les barèmes du guide T4127 et de la page des taux 2026. Aucun produit financier n'est vendu ni recommandé, aucun courriel n'est demandé.", "en": "Radif Partners rebuilds TFSA room year by year from 2009, age 18 and the date you arrived in Canada, and prices an RRSP refund with the 2026 federal brackets and those of all thirteen provinces and territories, including the Quebec abatement and the Ontario surtax. Limits come from the Canada Revenue Agency limits table, brackets from the T4127 guide and the 2026 rates page. No financial product is sold or recommended, and no e-mail is asked for."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"fr": ["Compte d'épargne libre d'impôt (CELI)", "Régime enregistré d'épargne-retraite (REER)", "Compte d'épargne libre d'impôt pour l'achat d'une première propriété (CELIAPP)", "Régime d'accession à la propriété (RAP)", "Régime d'encouragement à l'éducation permanente (REEP)", "Taux marginaux d'imposition fédéral et provinciaux"], "en": ["Tax-Free Savings Account (TFSA)", "Registered Retirement Savings Plan (RRSP)", "First Home Savings Account (FHSA)", "Home Buyers' Plan (HBP)", "Lifelong Learning Plan (LLP)", "Federal and provincial marginal tax rates"]};
export const CONTACT_EMAIL = "contact@moncelireer.com";
export const THEME_COLOR = '#9B1B30';
export const LOGO_SYMBOL = '%';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = 'c4e7a19b2f5d4c8e9a3b6d1f0e2c7a58';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme sur les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "TVA",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
