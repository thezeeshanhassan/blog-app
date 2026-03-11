/**
 * Blog GraphQL queries and mutations for Supabase.
 * Table: public.blog_posts (id, title, body, author_id, created_at) with relation to accounts for author name.
 */

import { graphqlRequest } from './client';

const PAGE_SIZE = 5;

export type BlogPostAuthor = {
  id: string;
  name: string;
};

export type BlogPost = {
  id: string;
  nodeId: string;
  title: string;
  body: string;
  author_id?: string;
  authorId?: string;
  created_at?: string;
  createdAt?: string;
  author?: BlogPostAuthor | null;
  account?: BlogPostAuthor | null;
};

export type BlogPostEdge = {
  cursor: string;
  node: BlogPost;
};

export type BlogPostsConnection = {
  blogPostCollection?: {
    edges: BlogPostEdge[];
    pageInfo: { endCursor: string | null; hasNextPage: boolean; hasPreviousPage: boolean; startCursor: string | null };
  };
  blogPostsCollection?: {
    edges: BlogPostEdge[];
    pageInfo: { endCursor: string | null; hasNextPage: boolean; hasPreviousPage: boolean; startCursor: string | null };
  };
};

export type BlogPostByPkResult = {
  blogPostByPk?: BlogPost | null;
  blogPostsByPk?: BlogPost | null;
};

const LIST_QUERY = `
  query BlogPostsList($first: Int!, $after: Cursor, $offset: Int) {
    blogPostsCollection(first: $first, after: $after, offset: $offset, orderBy: [{ createdAt: DescNullsLast }]) {
      edges {
        cursor
        node {
          id
          nodeId
          title
          body
          authorId
          createdAt
          account {
            id
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

const POST_BY_ID_QUERY = `
  query BlogPostById($id: UUID!) {
    blogPostsByPk(id: $id) {
      id
      nodeId
      title
      body
      authorId
      createdAt
      account {
        id
        name
      }
    }
  }
`;

const CREATE_POST_MUTATION = `
  mutation CreateBlogPost($objects: [BlogPostsInsertInput!]!) {
    insertIntoBlogPostsCollection(objects: $objects) {
      affectedCount
      records {
        id
        title
        body
        authorId
        createdAt
      }
    }
  }
`;

export async function fetchBlogPosts(params: {
  page?: number;
  cursor?: string | null;
  accessToken?: string | null;
}): Promise<BlogPostsConnection> {
  const page = params.page ?? 1;
  const offset = (page - 1) * PAGE_SIZE;
  const after = params.cursor ?? null;
  const variables: { first: number; after?: string | null; offset?: number } = {
    first: PAGE_SIZE,
    ...(after != null ? { after } : { offset }),
  };
  const { data, errors } = await graphqlRequest<BlogPostsConnection>({
    query: LIST_QUERY,
    variables,
    accessToken: params.accessToken,
  });
  if (errors?.length) throw new Error(errors[0]?.message ?? 'Failed to fetch blog posts');
  const collection = data?.blogPostsCollection ?? data?.blogPostCollection;
  if (!collection) throw new Error('Failed to fetch blog posts');
  return { ...data, blogPostsCollection: collection } as BlogPostsConnection;
}

export async function fetchBlogPostById(
  id: string,
  accessToken?: string | null
): Promise<BlogPost | null> {
  const { data, errors } = await graphqlRequest<BlogPostByPkResult>({
    query: POST_BY_ID_QUERY,
    variables: { id },
    accessToken,
  });
  if (errors?.length) throw new Error(errors[0]?.message ?? 'Failed to fetch blog post by id');
  return data?.blogPostsByPk ?? data?.blogPostByPk ?? null;
}

export async function createBlogPost(params: {
  title: string;
  body: string;
  author_id: string;
  accessToken: string;
}): Promise<BlogPost> {
  const { data, errors } = await graphqlRequest<{
    insertIntoBlogPostCollection?: { records: BlogPost[] };
    insertIntoBlogPostsCollection?: { records: BlogPost[] };
  }>({
    query: CREATE_POST_MUTATION,
    variables: {
      objects: [
        { title: params.title, body: params.body, authorId: params.author_id },
      ],
    },
    accessToken: params.accessToken,
  });
  if (errors?.length) throw new Error(errors[0]?.message ?? 'Failed to create post');
  const records =
    data?.insertIntoBlogPostsCollection?.records ??
    data?.insertIntoBlogPostCollection?.records;
  if (!records?.[0]) throw new Error('Failed to create post');
  return records[0];
}

/** Author name for display (from account relation or fallback) */
export function getPostAuthorName(post: BlogPost): string {
  const author = post.account ?? post.author;
  return author?.name ?? 'Anonymous';
}

/** Normalized created_at (handles both snake_case and camelCase from API) */
export function getPostDate(post: BlogPost): string {
  return post.created_at ?? post.createdAt ?? '';
}

export { PAGE_SIZE };
