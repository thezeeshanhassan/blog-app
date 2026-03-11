/*
 * Allow anon role to use the public schema so it can read blog_posts.
 * Base schema revoked "all PRIVILEGES on schema public from anon"; we need
 * USAGE so that "grant select on blog_posts to anon" takes effect for
 * unauthenticated (signed-out) users viewing the blog.
 */
grant usage on schema public to anon;
