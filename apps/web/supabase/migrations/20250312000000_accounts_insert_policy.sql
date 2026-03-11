/*
 * Allow authenticated users to insert their own account row.
 * Fixes "Key is not present in table accounts" when creating a blog post
 * for users who don't have an account yet (e.g. created before trigger ran).
 */
create policy accounts_insert on public.accounts
  for insert
  to authenticated
  with check (id = auth.uid());
