# DDH — site officiel

Site Next.js App Router en français, TypeScript strict et Tailwind CSS 4. Le site public conserve son accueil animé, ses rubriques et le formulaire de contact. Le back-end utilise Supabase PostgreSQL, Auth et Storage avec des migrations SQL versionnées et Row Level Security (RLS).

## Démarrage local

Node.js 20.6 ou une version ultérieure est nécessaire pour le script d’initialisation sécurisé.

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Si `.env` existe déjà, ne le remplacez pas : ajoutez-y les variables Supabase ci-dessous sans publier le fichier. Tant qu’elles ne sont pas renseignées, le site public reste consultable, la page `/admin/login` indique que le service n’est pas configuré et les opérations nécessitant Supabase répondent avec une erreur de service.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Dans **Supabase → Project Settings → API**, renseignez l’URL du projet et sa clé `anon` publique (ou la clé `publishable` équivalente dans les projets qui utilisent les nouvelles clés). La clé `service_role`/`secret` est réservée au serveur et au script d’initialisation de confiance. Ne lui donnez jamais un préfixe `NEXT_PUBLIC_`, ne l’incluez pas dans du code client et ne la commitez pas. `.env` est ignoré par Git.

## Créer la base Supabase

1. Créez un projet Supabase et gardez son identifiant de projet.
2. Installez la [Supabase CLI](https://supabase.com/docs/guides/cli), puis authentifiez-la et liez le projet :

   ```powershell
   supabase login
   supabase link --project-ref VOTRE_PROJECT_REF
   ```

3. Vérifiez la migration avant de l’appliquer. `db push` n’efface pas ou ne réinitialise pas la base :

   ```powershell
   npm run db:push
   ```

La migration `supabase/migrations/20261017140000_ddh_backend_foundation.sql` crée les tables, les rôles et permissions, les politiques RLS et les buckets Storage. Elle ne crée aucun contenu biographique ou éditorial. Les tables Supabase doivent être sauvegardées et les migrations examinées avant toute évolution en production.

Le fichier `prisma/schema.prisma` est conservé comme référence de l’ancien modèle; Prisma n’est plus utilisé par les scripts ou les routes applicatives. Aucune migration automatique des données d’une ancienne base `DATABASE_URL` vers Supabase n’est effectuée. Exportez et migrez manuellement les données à préserver après comparaison et sauvegarde.

## Authentification et premier SUPERADMIN

Dans **Authentication → URL Configuration**, définissez l’URL du site, puis autorisez le callback local `http://localhost:3000/auth/callback` et son équivalent de production. Configurez l’envoi de courriels Supabase (SMTP recommandé en production).

Après avoir renseigné dans `.env` l’URL du projet et la clé secrète serveur, créez une invitation unique depuis un terminal de confiance :

```powershell
npm run admin:create-first -- administrateur@exemple.org
```

Le script envoie une invitation Supabase Auth, puis appelle la fonction SQL `promote_first_superadmin`. Cette fonction n’accepte que le rôle `service_role`, vérifie qu’aucun SUPERADMIN n’existe déjà et journalise l’initialisation. L’administrateur définit son propre mot de passe après avoir suivi le lien d’invitation. Aucun mot de passe par défaut n’est créé. Ne lancez pas le script depuis un navigateur ou un environnement partagé; après l’initialisation, retirez la clé serveur des environnements temporaires.

La route `/admin/login` utilise `signInWithPassword` côté serveur et des cookies gérés par `@supabase/ssr`. Le middleware rafraîchit et vérifie les sessions. La limitation de tentatives en mémoire protège chaque instance de l’application; en production, configurez aussi les limites et la protection CAPTCHA de Supabase Auth ainsi qu’une limitation distribuée au niveau de l’hébergeur/reverse proxy. N’accordez jamais d’accès en vous fiant uniquement à l’interface.

## Rôles, contenu et stockage

Les rôles SQL sont `SUPERADMIN`, `ADMIN`, `REDACTEUR` et `GESTIONNAIRE_MEDIA`. Les politiques vérifient les permissions côté base. Le public ne lit que les contenus explicitement publics et publiés; les tables de messages et d’audit ne sont pas publiques. Les modifications de contenu publié nécessitent la permission de publication. Les suppressions directes de contenus éditoriaux ne sont pas accordées : utilisez le statut archivé.

Les langues préparées sont `fr`, `en`, `es`, `ar` et `pt`. Les buckets `ddh-public-media` et `ddh-public-covers` servent aux images publiques; `ddh-private-documents` est privé. Le point d’accès d’URL de téléversement `/api/admin/media/upload-url` exige la permission `media.upload`, valide les types et tailles, et renvoie un URL signé temporaire. Les documents privés restent soumis aux politiques de Storage; un document public placé dans le bucket privé doit être publié et accédé par URL signée.

Les formulaires de contact valident les données avec Zod et utilisent le client `service_role` exclusivement dans la route serveur pour insérer un message validé. La route n’expose pas ce client ni les messages. Son limiteur anti-abus en mémoire n’est pas partagé entre instances; configurez un rate limiter distribué ou un CAPTCHA avant un déploiement exposé.

## Clients et sécurité applicative

- `src/lib/supabase/browser.ts` crée le client navigateur avec uniquement l’URL et la clé publique.
- `src/lib/supabase/server.ts` crée le client SSR utilisant les cookies de session.
- `src/lib/supabase/service-role.ts` est marqué `server-only` et n’est utilisé que pour l’insertion contrôlée des messages de contact.
- `src/lib/supabase/admin.ts` vérifie l’utilisateur, le profil actif et les permissions depuis PostgreSQL.
- `src/lib/supabase/audit.ts` journalise les opérations administratives sans accepter de champs nommés comme mots de passe, secrets ou jetons; la migration rejette également ces clés dans les métadonnées.
- `src/lib/supabase/storage.ts` valide et autorise les téléversements avant de créer un URL signé.

Les fondations d’authentification, RLS et Storage sont en place; l’interface CRUD éditoriale complète et les écrans de gestion de rôles restent à développer avant le lancement opérationnel du CMS.

## Vérifications

```powershell
npm test
npx tsc --noEmit
npm run lint
npm run build
```

Les tests vérifient les validations, la limitation de tentatives et des invariants statiques des migrations RLS. Sans identifiants Supabase, ces tests ne peuvent pas prouver l’exécution réelle des migrations, la livraison des invitations, l’authentification hébergée, les politiques Storage ni les requêtes RLS sur un projet distant. Vérifiez également ces points sur un projet Supabase de test avant la production.
