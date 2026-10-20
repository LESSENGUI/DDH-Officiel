export type NavItem = { label: string; href: string };
export type NavGroup = { label: string; href: string; description: string; items: NavItem[] };

export const navigation: NavGroup[] = [
  { label: "À propos", href: "/a-propos", description: "Un parcours au service de l’engagement.", items: [
    { label: "Histoire de ma vie", href: "/a-propos/histoire-de-ma-vie" }, { label: "Formation & qualifications", href: "/a-propos/formation-qualifications" }, { label: "Parcours professionnel", href: "/a-propos/parcours-professionnel" }, { label: "Parcours politique & institutionnel", href: "/a-propos/parcours-politique" }, { label: "Mon CV", href: "/a-propos/cv" }, { label: "Valeurs & vision", href: "/a-propos/valeurs-vision" }, { label: "Distinctions & reconnaissances", href: "/a-propos/distinctions" }, { label: "Galerie du parcours", href: "/a-propos/galerie-parcours" }
  ] },
  { label: "Actions", href: "/actions", description: "Des engagements, des actions, des résultats.", items: [
    { label: "Vue d’ensemble", href: "/actions/vue-ensemble" }, { label: "Actions réalisées", href: "/actions/realisees" }, { label: "En cours & à venir", href: "/actions/en-cours" }, { label: "Actions parlementaires", href: "/actions/parlementaires" }, { label: "Actions gouvernementales & institutionnelles", href: "/actions/gouvernementales-institutionnelles" }, { label: "Actions sociales & solidaires", href: "/actions/sociales-solidaires" }, { label: "Éducation & formation", href: "/actions/education-formation" }, { label: "Santé & bien-être", href: "/actions/sante-bien-etre" }, { label: "Entrepreneuriat & autonomisation", href: "/actions/entrepreneuriat-autonomisation" }, { label: "Développement local & infrastructures", href: "/actions/developpement-infrastructures" }, { label: "Culture & patrimoine", href: "/actions/culture-patrimoine" }, { label: "Partenariats & collaborations", href: "/actions/partenariats" }, { label: "Résultats & impacts", href: "/actions/resultats-impacts" }, { label: "Archives des actions", href: "/actions/archives" }
  ] },
  { label: "Publications", href: "/publications", description: "Écrits, idées et contributions au débat public.", items: [
    { label: "Tous les articles", href: "/publications/articles" }, { label: "Opinions & tribunes", href: "/publications/opinions-tribunes" }, { label: "Articles politiques", href: "/publications/articles-politiques" }, { label: "Articles professionnels & techniques", href: "/publications/articles-professionnels" }, { label: "Développement & société", href: "/publications/developpement-societe" }, { label: "Livres & ouvrages", href: "/publications/ouvrages" }, { label: "Contributions & discours", href: "/publications/contributions-discours" }, { label: "Bibliographie & archives", href: "/publications/bibliographie" }
  ] },
  { label: "Actualités", href: "/actualites", description: "Suivre les activités et les prises de parole.", items: [
    { label: "Toutes les actualités", href: "/actualites/toutes" }, { label: "Activités institutionnelles & politiques", href: "/actualites/activites-institutionnelles" }, { label: "Médias & vidéos", href: "/actualites/medias" }, { label: "Galerie photos", href: "/actualites/galerie" }, { label: "Agenda & événements", href: "/actualites/agenda" }, { label: "Communiqués officiels", href: "/actualites/communiques" }
  ] }
];

export const mainNavigation = [
  { label: "Accueil", href: "/" },
  ...navigation.map(({ label, href }) => ({ label, href })),
  { label: "Contact", href: "/contact" },
];

export const pageCopy: Record<string, { title: string; intro: string; sections: string[] }> = {
  "/a-propos": { title: "Un parcours pluriel, un engagement constant.", intro: "Ingénieure, docteure, ancienne pilote, écrivaine et femme engagée dans la vie publique : découvrez les étapes d’un parcours au service du Congo.", sections: navigation[0].items.map((item) => item.label) },
  "/actions": { title: "Agir avec méthode. Servir avec conviction.", intro: "Retrouvez les actions, projets et initiatives avec leur contexte, le rôle exercé et les résultats documentés.", sections: navigation[1].items.map((item) => item.label) },
  "/publications": { title: "Des idées en partage.", intro: "Articles, ouvrages, discours et contributions : un espace consacré aux écrits et à la réflexion.", sections: navigation[2].items.map((item) => item.label) },
  "/actualites": { title: "Au fil des engagements.", intro: "Activités institutionnelles, rencontres et prises de parole : retrouvez les actualités et archives.", sections: navigation[3].items.map((item) => item.label) }
};

export function findRoute(path: string) {
  for (const group of navigation) {
    if (group.href === path) return { group, title: group.label, href: group.href, parent: null as string | null };
    const item = group.items.find((entry) => entry.href === path);
    if (item) return { group, title: item.label, href: item.href, parent: group.label };
  }
  return null;
}
