import React from 'react';
import client from '../../../apollo-client';
import { GetPageBySlug } from '@/queries/get-page-by-slug';

import PageStack from '@/components/page-stack';

export default function PagePatternSlugPage({ page }) {
  return <PageStack stack={page.stack} />;
}

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const { utm_campaign: segment } = context.query;

  const { data, error } = await client.query({
    query: GetPageBySlug,
    variables: {
      slug: slug,
      segment: segment || '',
    },
    fetchPolicy: 'no-cache',
  });

  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: { page: data.Page },
  };
}
