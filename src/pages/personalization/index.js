import React, { useState } from 'react';
import client from '../../../apollo-client';
import { GetPageBySlug } from '@/queries/get-page-by-slug';

import SegmentSwitch from '@/components/segment-switch';
import PageStack from '@/components/page-stack';
import { useRouter } from 'next/router';

export default function PersonalizationPage({ page, activeSegment }) {
  const router = useRouter();

  const changeSegment = async (segment) => {
    const routerObject = {
      pathname: router.route,
    };

    if (segment) {
      routerObject.query = { segment };
    }
    await router.push(routerObject);
  };

  return (
    <>
      <div className='grid max-w-screen-xl mx-auto mb-12'>
        <SegmentSwitch title='Try it out!' setSegment={changeSegment} currentSegment={activeSegment} />
      </div>
      <PageStack stack={page.stack} />
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { data, error } = await client.query({
    query: GetPageBySlug,
    variables: {
      slug: 'home-page-personalization',
      segment: query.segment ? query.segment : '',
    },
    fetchPolicy: 'no-cache',
  });

  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: { page: data.Page, activeSegment: query.segment ? query.segment : '' },
  };
}
