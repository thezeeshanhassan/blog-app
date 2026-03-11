/**
 * Supabase GraphQL client.
 * Uses NEXT_PUBLIC_SUPABASE_GRAPHQL_URL and anon key; pass accessToken for authenticated mutations.
 */

const getConfig = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_GRAPHQL_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});

export type GraphQLVariables = Record<string, unknown>;

export async function graphqlRequest<T = unknown>(params: {
  query: string;
  variables?: GraphQLVariables;
  accessToken?: string | null;
}): Promise<{ data?: T; errors?: Array<{ message: string }> }> {
  const { url, anonKey } = getConfig();
  if (!url || !anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_GRAPHQL_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: anonKey,
    ...(params.accessToken && { Authorization: `Bearer ${params.accessToken}` }),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: params.query,
      variables: params.variables ?? {},
    }),
    cache: 'no-store',
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.errors?.[0]?.message ?? `GraphQL request failed: ${res.status}`);
  }
  if (json.errors?.length) {
    return { data: undefined, errors: json.errors };
  }
  return { data: json.data as T, errors: undefined };
}
