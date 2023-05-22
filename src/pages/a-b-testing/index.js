import React from 'react';
import client from '../../../apollo-client';
import { GetStaticPageBySlug } from '@/queries/get-static-page-by-slug';

import ABSwitch from '@/components/a-b-switch';
import PageStack from '@/components/page-stack';
import { useRouter } from 'next/router';
import { clientIds } from '@/values/client-ids';
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { v4 } from "uuid";


export default function ABTestingPage({ page, version }) {
  const router = useRouter();

  const changeVersion = async (version) => {
    const routerObject = {
      pathname: router.route,
    }
    const clientItem = clientIds.find((clientId) => clientId.name === version);

    if (clientItem) {
      routerObject.query = { customer_id: clientItem.id };
    }
    await router.push(routerObject);
  };

  return (
    <>
      <div className='grid max-w-screen-xl mx-auto mb-12'>
        <ABSwitch title='Try it out!' changeVersion={changeVersion} defaultVersion={version} />
      </div>
      <PageStack stack={page.stack} />
    </>
  );
}

export async function getServerSideProps({ query, req, res }) {
  let version = { name: 'you' };

  if (query && query.customer_id) {
    version = clientIds.find((clientId) => clientId.id === query.customer_id);
  } else {
    if (!hasCookie('__prepr_uid', {req, res})) {
      const uuid = v4();
      await setCookie('__prepr_uid', uuid, {req,res})
    }
    version.id = await getCookie('__prepr_uid', { req, res});
  }


  const { data, error } = await client.query({
    query: GetStaticPageBySlug,
    variables: {
      slug: 'home-page-ab-testing',
    },
    context: {
      headers: {
        'Prepr-Customer-Id': version.id,
      }
    },
    fetchPolicy: 'no-cache',
  });

  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: { page: data.Page, version: version.name },
  };
}
