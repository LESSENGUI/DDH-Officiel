create type public.content_status as enum ('draft', 'pending_review', 'published', 'archived');
create type public.locale_code as enum ('fr', 'en', 'es', 'ar', 'pt');
create type public.role_code as enum ('SUPERADMIN', 'ADMIN', 'REDACTEUR', 'GESTIONNAIRE_MEDIA');

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  code public.role_code not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z][a-z0-9_.-]{1,99}$'),
  description text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  granted_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status public.content_status not null default 'draft',
  is_public boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.actions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text,
  starts_at timestamptz,
  ends_at timestamptz,
  status public.content_status not null default 'draft',
  is_public boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

create table public.publications (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  publication_type text not null check (publication_type in ('book', 'article', 'speech', 'report', 'other')),
  status public.content_status not null default 'draft',
  is_public boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status public.content_status not null default 'draft',
  is_public boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.translations (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.pages(id) on delete cascade,
  action_id uuid references public.actions(id) on delete cascade,
  publication_id uuid references public.publications(id) on delete cascade,
  news_id uuid references public.news(id) on delete cascade,
  locale public.locale_code not null,
  title text not null check (length(trim(title)) between 1 and 300),
  excerpt text,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (num_nonnulls(page_id, action_id, publication_id, news_id) = 1)
);
create unique index translations_page_locale on public.translations(page_id, locale) where page_id is not null;
create unique index translations_action_locale on public.translations(action_id, locale) where action_id is not null;
create unique index translations_publication_locale on public.translations(publication_id, locale) where publication_id is not null;
create unique index translations_news_locale on public.translations(news_id, locale) where news_id is not null;

create table public.media (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null check (bucket_id in ('ddh-public-media', 'ddh-public-covers', 'ddh-private-documents')),
  object_path text not null,
  original_name text not null check (length(original_name) between 1 and 180),
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400),
  is_public boolean not null default false,
  status public.content_status not null default 'draft',
  alt_text text,
  uploaded_by uuid not null references public.profiles(id),
  created_by uuid not null references public.profiles(id),
  updated_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket_id, object_path)
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  category text not null check (length(trim(category)) between 2 and 80),
  name text not null check (length(trim(name)) between 2 and 120),
  organization text,
  email text not null check (length(email) <= 254),
  phone text,
  subject text not null check (length(trim(subject)) between 2 and 180),
  body text not null check (length(trim(body)) between 10 and 5000),
  consent boolean not null check (consent),
  status text not null default 'new' check (status in ('new', 'in_progress', 'answered', 'archived')),
  assigned_to uuid references public.profiles(id) on delete set null,
  internal_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key check (key ~ '^[a-z][a-z0-9_.-]{1,99}$'),
  value jsonb not null,
  is_public boolean not null default false,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null check (length(action) between 2 and 100),
  entity_type text not null check (length(entity_type) between 2 and 80),
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index user_roles_user_id_idx on public.user_roles(user_id);
create index role_permissions_role_id_idx on public.role_permissions(role_id);
create index pages_public_lookup_idx on public.pages(status, is_public, published_at);
create index actions_public_lookup_idx on public.actions(status, is_public, published_at);
create index publications_public_lookup_idx on public.publications(status, is_public, published_at);
create index news_public_lookup_idx on public.news(status, is_public, published_at);
create index translations_locale_idx on public.translations(locale);
create index media_public_lookup_idx on public.media(status, is_public, created_at desc);
create index contact_messages_status_created_idx on public.contact_messages(status, created_at desc);
create index audit_logs_created_at_idx on public.audit_logs(created_at desc);
create index audit_logs_actor_created_idx on public.audit_logs(actor_id, created_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger pages_set_updated_at before update on public.pages for each row execute function public.set_updated_at();
create trigger actions_set_updated_at before update on public.actions for each row execute function public.set_updated_at();
create trigger publications_set_updated_at before update on public.publications for each row execute function public.set_updated_at();
create trigger news_set_updated_at before update on public.news for each row execute function public.set_updated_at();
create trigger translations_set_updated_at before update on public.translations for each row execute function public.set_updated_at();
create trigger media_set_updated_at before update on public.media for each row execute function public.set_updated_at();
create trigger contact_messages_set_updated_at before update on public.contact_messages for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

insert into public.roles (code, name, description) values
  ('SUPERADMIN', 'Superadministrateur', 'Accès complet et gestion de la sécurité.'),
  ('ADMIN', 'Administrateur', 'Gestion des modules éditoriaux autorisés.'),
  ('REDACTEUR', 'Rédacteur', 'Création et modification de contenus non publiés.'),
  ('GESTIONNAIRE_MEDIA', 'Gestionnaire média', 'Gestion des médias et documents autorisés.');

insert into public.permissions (code, description) values
  ('pages.read', 'Consulter les pages institutionnelles'),
  ('pages.create', 'Créer des pages institutionnelles'),
  ('pages.update', 'Modifier des pages non publiées'),
  ('pages.publish', 'Publier et modifier les pages publiques'),
  ('pages.archive', 'Archiver des pages'),
  ('actions.read', 'Consulter les actions'),
  ('actions.create', 'Créer des actions'),
  ('actions.update', 'Modifier les actions non publiées'),
  ('actions.publish', 'Publier et modifier les actions publiques'),
  ('actions.archive', 'Archiver des actions'),
  ('publications.read', 'Consulter les publications'),
  ('publications.create', 'Créer des publications'),
  ('publications.update', 'Modifier les publications non publiées'),
  ('publications.publish', 'Publier et modifier les publications publiques'),
  ('publications.archive', 'Archiver les publications'),
  ('news.read', 'Consulter les actualités'),
  ('news.create', 'Créer des actualités'),
  ('news.update', 'Modifier les actualités non publiées'),
  ('news.publish', 'Publier et modifier les actualités publiques'),
  ('news.archive', 'Archiver des actualités'),
  ('media.read', 'Consulter les métadonnées des médias'),
  ('media.upload', 'Téléverser des médias'),
  ('media.update', 'Modifier les métadonnées des médias'),
  ('media.publish', 'Publier des médias et documents publics'),
  ('media.delete', 'Supprimer les médias'),
  ('media.download_private', 'Télécharger les documents privés autorisés'),
  ('contacts.read', 'Lire les messages de contact'),
  ('contacts.create', 'Créer des messages administratifs'),
  ('contacts.update', 'Traiter les messages de contact'),
  ('users.read', 'Consulter les profils administratifs'),
  ('users.manage', 'Gérer les comptes administratifs'),
  ('roles.manage', 'Gérer les rôles et leurs permissions'),
  ('settings.read', 'Consulter les paramètres'),
  ('settings.update', 'Modifier les paramètres'),
  ('audit.read', 'Consulter le journal d’audit'),
  ('audit.write', 'Enregistrer des événements d’audit');

insert into public.role_permissions (role_id, permission_id)
select role_row.id, permission_row.id
from public.roles role_row
cross join public.permissions permission_row
where role_row.code = 'SUPERADMIN';

insert into public.role_permissions (role_id, permission_id)
select role_row.id, permission_row.id
from public.roles role_row
cross join public.permissions permission_row
where role_row.code = 'ADMIN'
  and permission_row.code in (
    'pages.read', 'pages.create', 'pages.update', 'pages.publish', 'pages.archive',
    'actions.read', 'actions.create', 'actions.update', 'actions.publish', 'actions.archive',
    'publications.read', 'publications.create', 'publications.update', 'publications.publish', 'publications.archive',
    'news.read', 'news.create', 'news.update', 'news.publish', 'news.archive',
    'media.read', 'media.upload', 'media.update', 'media.publish', 'media.delete',
    'contacts.read', 'contacts.update',
    'settings.read', 'audit.write'
  );

insert into public.role_permissions (role_id, permission_id)
select role_row.id, permission_row.id
from public.roles role_row
cross join public.permissions permission_row
where role_row.code = 'REDACTEUR'
  and permission_row.code in (
    'pages.read', 'pages.create', 'pages.update',
    'actions.read', 'actions.create', 'actions.update',
    'publications.read', 'publications.create', 'publications.update',
    'news.read', 'news.create', 'news.update', 'audit.write'
  );

insert into public.role_permissions (role_id, permission_id)
select role_row.id, permission_row.id
from public.roles role_row
cross join public.permissions permission_row
where role_row.code = 'GESTIONNAIRE_MEDIA'
  and permission_row.code in ('media.read', 'media.upload', 'media.update', 'media.delete', 'media.download_private', 'audit.write');

create function public.has_permission(permission_code text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles profile
    join public.user_roles assignment on assignment.user_id = profile.id
    join public.role_permissions role_permission on role_permission.role_id = assignment.role_id
    join public.permissions permission on permission.id = role_permission.permission_id
    where profile.id = (select auth.uid())
      and profile.is_active
      and permission.code = permission_code
  );
$$;

create function public.current_user_permissions()
returns text[]
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(array_agg(distinct permission.code), '{}'::text[])
  from public.profiles profile
  join public.user_roles assignment on assignment.user_id = profile.id
  join public.role_permissions role_permission on role_permission.role_id = assignment.role_id
  join public.permissions permission on permission.id = role_permission.permission_id
  where profile.id = (select auth.uid())
    and profile.is_active;
$$;

create function public.promote_first_superadmin(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  superadmin_role_id uuid;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'Only a trusted service role may initialize the first SUPERADMIN.';
  end if;
  perform pg_advisory_xact_lock(783214, 1);
  if not exists (select 1 from public.profiles where id = target_user_id and is_active) then
    raise exception 'The invited user must have an active profile.';
  end if;
  if exists (
    select 1
    from public.user_roles assignment
    join public.roles role_row on role_row.id = assignment.role_id
    where role_row.code = 'SUPERADMIN'
  ) then
    raise exception 'A SUPERADMIN is already assigned.';
  end if;

  select id into strict superadmin_role_id from public.roles where code = 'SUPERADMIN';
  insert into public.user_roles (user_id, role_id) values (target_user_id, superadmin_role_id);
  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (target_user_id, 'admin.first_superadmin_created', 'user', target_user_id, '{"source":"trusted_setup_script"}'::jsonb);
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
revoke all on function public.has_permission(text) from public, anon;
revoke all on function public.current_user_permissions() from public, anon;
revoke all on function public.promote_first_superadmin(uuid) from public, anon, authenticated;
grant execute on function public.has_permission(text) to authenticated;
grant execute on function public.current_user_permissions() to authenticated;
grant execute on function public.promote_first_superadmin(uuid) to service_role;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.pages enable row level security;
alter table public.translations enable row level security;
alter table public.actions enable row level security;
alter table public.publications enable row level security;
alter table public.news enable row level security;
alter table public.media enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

grant usage on schema public to anon, authenticated;
grant select (id, email, full_name, is_active, created_at, updated_at) on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;
grant select on public.roles, public.permissions, public.role_permissions to authenticated;
grant select, insert, delete on public.user_roles to authenticated;
grant select, insert on public.pages, public.translations, public.actions, public.publications, public.news to authenticated;
grant update (slug, status, is_public, published_at, updated_by) on public.pages to authenticated;
grant update (slug, category, starts_at, ends_at, status, is_public, published_at, updated_by) on public.actions to authenticated;
grant update (slug, publication_type, status, is_public, published_at, updated_by) on public.publications to authenticated;
grant update (slug, status, is_public, published_at, updated_by) on public.news to authenticated;
grant update (locale, title, excerpt, body, metadata, updated_by) on public.translations to authenticated;
grant select, insert, delete on public.media to authenticated;
grant update (mime_type, is_public, status, alt_text, updated_by) on public.media to authenticated;
grant select, insert on public.contact_messages to authenticated;
grant update (status, assigned_to, internal_note) on public.contact_messages to authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;
grant select, insert on public.contact_messages to anon;
grant select on public.pages, public.translations, public.actions, public.publications, public.news, public.media, public.site_settings to anon;
grant insert (actor_id, action, entity_type, entity_id, metadata) on public.audit_logs to authenticated;
grant select on public.audit_logs to authenticated;

create policy "profiles_read_self_or_user_admin" on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.has_permission('users.read'));
create policy "profiles_update_own_name" on public.profiles for update to authenticated
using (id = (select auth.uid()) and is_active)
with check (id = (select auth.uid()) and is_active);

create policy "roles_read_authorized" on public.roles for select to authenticated
using (public.has_permission('roles.manage') or public.has_permission('users.read'));
create policy "roles_manage_superadmin" on public.roles for all to authenticated
using (public.has_permission('roles.manage')) with check (public.has_permission('roles.manage'));
create policy "permissions_read_authorized" on public.permissions for select to authenticated
using (public.has_permission('roles.manage') or public.has_permission('users.read'));
create policy "permissions_manage_superadmin" on public.permissions for all to authenticated
using (public.has_permission('roles.manage')) with check (public.has_permission('roles.manage'));
create policy "role_permissions_read_authorized" on public.role_permissions for select to authenticated
using (public.has_permission('roles.manage'));
create policy "role_permissions_manage_superadmin" on public.role_permissions for all to authenticated
using (public.has_permission('roles.manage')) with check (public.has_permission('roles.manage'));
create policy "user_roles_read_self_or_authorized" on public.user_roles for select to authenticated
using (user_id = (select auth.uid()) or public.has_permission('users.read') or public.has_permission('roles.manage'));
create policy "user_roles_manage_authorized" on public.user_roles for all to authenticated
using (public.has_permission('users.manage') and public.has_permission('roles.manage'))
with check (
  public.has_permission('users.manage')
  and public.has_permission('roles.manage')
  and granted_by = (select auth.uid())
);

create policy "pages_public_read" on public.pages for select to anon, authenticated
using (status = 'published' and is_public and published_at is not null and published_at <= now());
create policy "pages_staff_read" on public.pages for select to authenticated
using (public.has_permission('pages.read'));
create policy "pages_create" on public.pages for insert to authenticated
with check (
  public.has_permission('pages.create')
  and created_by = (select auth.uid())
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('pages.publish'))
);
create policy "pages_update" on public.pages for update to authenticated
using (
  public.has_permission('pages.update')
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('pages.publish'))
  and (status <> 'archived' or public.has_permission('pages.archive'))
)
with check (
  public.has_permission('pages.update')
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('pages.publish'))
  and (status <> 'archived' or public.has_permission('pages.archive'))
);

create policy "actions_public_read" on public.actions for select to anon, authenticated
using (status = 'published' and is_public and published_at is not null and published_at <= now());
create policy "actions_staff_read" on public.actions for select to authenticated
using (public.has_permission('actions.read'));
create policy "actions_create" on public.actions for insert to authenticated
with check (
  public.has_permission('actions.create')
  and created_by = (select auth.uid())
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('actions.publish'))
);
create policy "actions_update" on public.actions for update to authenticated
using (
  public.has_permission('actions.update')
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('actions.publish'))
  and (status <> 'archived' or public.has_permission('actions.archive'))
)
with check (
  public.has_permission('actions.update')
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('actions.publish'))
  and (status <> 'archived' or public.has_permission('actions.archive'))
);

create policy "publications_public_read" on public.publications for select to anon, authenticated
using (status = 'published' and is_public and published_at is not null and published_at <= now());
create policy "publications_staff_read" on public.publications for select to authenticated
using (public.has_permission('publications.read'));
create policy "publications_create" on public.publications for insert to authenticated
with check (
  public.has_permission('publications.create')
  and created_by = (select auth.uid())
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('publications.publish'))
);
create policy "publications_update" on public.publications for update to authenticated
using (
  public.has_permission('publications.update')
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('publications.publish'))
  and (status <> 'archived' or public.has_permission('publications.archive'))
)
with check (
  public.has_permission('publications.update')
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('publications.publish'))
  and (status <> 'archived' or public.has_permission('publications.archive'))
);

create policy "news_public_read" on public.news for select to anon, authenticated
using (status = 'published' and is_public and published_at is not null and published_at <= now());
create policy "news_staff_read" on public.news for select to authenticated
using (public.has_permission('news.read'));
create policy "news_create" on public.news for insert to authenticated
with check (
  public.has_permission('news.create')
  and created_by = (select auth.uid())
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('news.publish'))
);
create policy "news_update" on public.news for update to authenticated
using (
  public.has_permission('news.update')
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('news.publish'))
  and (status <> 'archived' or public.has_permission('news.archive'))
)
with check (
  public.has_permission('news.update')
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('news.publish'))
  and (status <> 'archived' or public.has_permission('news.archive'))
);

create policy "translations_public_read" on public.translations for select to anon, authenticated
using (
  (page_id is not null and exists (select 1 from public.pages p where p.id = page_id and p.status = 'published' and p.is_public and p.published_at <= now()))
  or (action_id is not null and exists (select 1 from public.actions a where a.id = action_id and a.status = 'published' and a.is_public and a.published_at <= now()))
  or (publication_id is not null and exists (select 1 from public.publications p where p.id = publication_id and p.status = 'published' and p.is_public and p.published_at <= now()))
  or (news_id is not null and exists (select 1 from public.news n where n.id = news_id and n.status = 'published' and n.is_public and n.published_at <= now()))
);
create policy "translations_staff_read" on public.translations for select to authenticated
using (
  (page_id is not null and public.has_permission('pages.read'))
  or (action_id is not null and public.has_permission('actions.read'))
  or (publication_id is not null and public.has_permission('publications.read'))
  or (news_id is not null and public.has_permission('news.read'))
);
create policy "translations_create" on public.translations for insert to authenticated
with check (
  created_by = (select auth.uid())
  and updated_by = (select auth.uid())
  and ((page_id is not null and public.has_permission('pages.create') and exists (
    select 1 from public.pages p where p.id = page_id
      and (p.status <> 'published' or public.has_permission('pages.publish'))
      and (p.status <> 'archived' or public.has_permission('pages.archive'))
  ))
  or (action_id is not null and public.has_permission('actions.create') and exists (
    select 1 from public.actions a where a.id = action_id
      and (a.status <> 'published' or public.has_permission('actions.publish'))
      and (a.status <> 'archived' or public.has_permission('actions.archive'))
  ))
  or (publication_id is not null and public.has_permission('publications.create') and exists (
    select 1 from public.publications p where p.id = publication_id
      and (p.status <> 'published' or public.has_permission('publications.publish'))
      and (p.status <> 'archived' or public.has_permission('publications.archive'))
  ))
  or (news_id is not null and public.has_permission('news.create') and exists (
    select 1 from public.news n where n.id = news_id
      and (n.status <> 'published' or public.has_permission('news.publish'))
      and (n.status <> 'archived' or public.has_permission('news.archive'))
  )))
);
create policy "translations_update" on public.translations for update to authenticated
using (
  (page_id is not null and public.has_permission('pages.update') and exists (
    select 1 from public.pages p where p.id = page_id
      and (p.status <> 'published' or public.has_permission('pages.publish'))
      and (p.status <> 'archived' or public.has_permission('pages.archive'))
  ))
  or (action_id is not null and public.has_permission('actions.update') and exists (
    select 1 from public.actions a where a.id = action_id
      and (a.status <> 'published' or public.has_permission('actions.publish'))
      and (a.status <> 'archived' or public.has_permission('actions.archive'))
  ))
  or (publication_id is not null and public.has_permission('publications.update') and exists (
    select 1 from public.publications p where p.id = publication_id
      and (p.status <> 'published' or public.has_permission('publications.publish'))
      and (p.status <> 'archived' or public.has_permission('publications.archive'))
  ))
  or (news_id is not null and public.has_permission('news.update') and exists (
    select 1 from public.news n where n.id = news_id
      and (n.status <> 'published' or public.has_permission('news.publish'))
      and (n.status <> 'archived' or public.has_permission('news.archive'))
  )))
)
with check (
  updated_by = (select auth.uid())
  and ((page_id is not null and public.has_permission('pages.update') and exists (
    select 1 from public.pages p where p.id = page_id
      and (p.status <> 'published' or public.has_permission('pages.publish'))
      and (p.status <> 'archived' or public.has_permission('pages.archive'))
  ))
  or (action_id is not null and public.has_permission('actions.update') and exists (
    select 1 from public.actions a where a.id = action_id
      and (a.status <> 'published' or public.has_permission('actions.publish'))
      and (a.status <> 'archived' or public.has_permission('actions.archive'))
  ))
  or (publication_id is not null and public.has_permission('publications.update') and exists (
    select 1 from public.publications p where p.id = publication_id
      and (p.status <> 'published' or public.has_permission('publications.publish'))
      and (p.status <> 'archived' or public.has_permission('publications.archive'))
  ))
  or (news_id is not null and public.has_permission('news.update') and exists (
    select 1 from public.news n where n.id = news_id
      and (n.status <> 'published' or public.has_permission('news.publish'))
      and (n.status <> 'archived' or public.has_permission('news.archive'))
  )))
);

create policy "media_public_metadata_read" on public.media for select to anon, authenticated
using (is_public and status = 'published');
create policy "media_staff_read" on public.media for select to authenticated
using (public.has_permission('media.read'));
create policy "media_create" on public.media for insert to authenticated
with check (
  public.has_permission('media.upload')
  and uploaded_by = (select auth.uid())
  and created_by = (select auth.uid())
  and updated_by = (select auth.uid())
);
create policy "media_update" on public.media for update to authenticated
using (
  public.has_permission('media.update')
  and (status <> 'published' or public.has_permission('media.publish'))
  and (status <> 'archived' or public.has_permission('media.delete'))
)
with check (
  public.has_permission('media.update')
  and updated_by = (select auth.uid())
  and (status <> 'published' or public.has_permission('media.publish'))
  and (status <> 'archived' or public.has_permission('media.delete'))
);
create policy "media_delete" on public.media for delete to authenticated
using (public.has_permission('media.delete'));

create policy "contact_messages_staff_read" on public.contact_messages for select to authenticated
using (public.has_permission('contacts.read'));
create policy "contact_messages_staff_create" on public.contact_messages for insert to authenticated
with check (public.has_permission('contacts.create'));
create policy "contact_messages_staff_update" on public.contact_messages for update to authenticated
using (public.has_permission('contacts.update'))
with check (public.has_permission('contacts.update'));

create policy "site_settings_public_read" on public.site_settings for select to anon, authenticated
using (is_public);
create policy "site_settings_staff_read" on public.site_settings for select to authenticated
using (public.has_permission('settings.read') and (is_public or public.has_permission('roles.manage')));
create policy "site_settings_update" on public.site_settings for insert to authenticated
with check (public.has_permission('settings.update') and updated_by = (select auth.uid()));
create policy "site_settings_modify" on public.site_settings for update to authenticated
using (public.has_permission('settings.update'))
with check (public.has_permission('settings.update') and updated_by = (select auth.uid()));
create policy "site_settings_delete" on public.site_settings for delete to authenticated
using (public.has_permission('settings.update'));

create function public.jsonb_contains_sensitive_key(value jsonb)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  object_key text;
  child jsonb;
begin
  if jsonb_typeof(value) = 'object' then
    for object_key in select jsonb_object_keys(value) loop
      if lower(object_key) ~ '(password|secret|token|cookie|authorization|credential)' then
        return true;
      end if;
      if public.jsonb_contains_sensitive_key(value -> object_key) then
        return true;
      end if;
    end loop;
  elsif jsonb_typeof(value) = 'array' then
    for child in select jsonb_array_elements(value) loop
      if public.jsonb_contains_sensitive_key(child) then
        return true;
      end if;
    end loop;
  end if;
  return false;
end;
$$;

create function public.reject_sensitive_audit_metadata()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if public.jsonb_contains_sensitive_key(new.metadata) then
    raise exception 'Sensitive values are not allowed in audit metadata.';
  end if;
  return new;
end;
$$;
create trigger audit_logs_reject_sensitive_metadata
  before insert or update on public.audit_logs
  for each row execute function public.reject_sensitive_audit_metadata();
revoke all on function public.jsonb_contains_sensitive_key(jsonb) from public, anon, authenticated;
revoke all on function public.reject_sensitive_audit_metadata() from public, anon, authenticated;

create policy "audit_logs_read_authorized" on public.audit_logs for select to authenticated
using (public.has_permission('audit.read'));
create policy "audit_logs_insert_authorized" on public.audit_logs for insert to authenticated
with check (public.has_permission('audit.write') and actor_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('ddh-public-media', 'ddh-public-media', true, 26214400, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('ddh-public-covers', 'ddh-public-covers', true, 26214400, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('ddh-private-documents', 'ddh-private-documents', false, 26214400, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "ddh_public_assets_read" on storage.objects for select to anon, authenticated
using (bucket_id in ('ddh-public-media', 'ddh-public-covers'));
create policy "ddh_private_documents_read" on storage.objects for select to authenticated
using (
  bucket_id = 'ddh-private-documents'
  and (
    public.has_permission('media.download_private')
    or exists (
      select 1 from public.media item
      where item.bucket_id = storage.objects.bucket_id
        and item.object_path = storage.objects.name
        and item.is_public
        and item.status = 'published'
    )
  )
);
create policy "ddh_media_upload" on storage.objects for insert to authenticated
with check (
  bucket_id in ('ddh-public-media', 'ddh-public-covers', 'ddh-private-documents')
  and public.has_permission('media.upload')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "ddh_media_update" on storage.objects for update to authenticated
using (
  bucket_id in ('ddh-public-media', 'ddh-public-covers', 'ddh-private-documents')
  and public.has_permission('media.update')
  and ((storage.foldername(name))[1] = (select auth.uid())::text or public.has_permission('roles.manage'))
)
with check (
  bucket_id in ('ddh-public-media', 'ddh-public-covers', 'ddh-private-documents')
  and public.has_permission('media.update')
  and ((storage.foldername(name))[1] = (select auth.uid())::text or public.has_permission('roles.manage'))
);
create policy "ddh_media_delete" on storage.objects for delete to authenticated
using (
  bucket_id in ('ddh-public-media', 'ddh-public-covers', 'ddh-private-documents')
  and public.has_permission('media.delete')
  and ((storage.foldername(name))[1] = (select auth.uid())::text or public.has_permission('roles.manage'))
);
