import client from '../../../../apollo-client';
import { GetStreamBySlug } from '@/queries/get-stream-by-slug';
import Speakers from '@/components/speakers';
import Hero from '@/components/hero';
import RecordedBadge from '@/components/badges/recorded-badge';
import MuxPlayer from '@mux/mux-player-react';

export default function RecordedPage({ liveEvent }) {
  return (
    <div className='container mx-auto md:px-0'>
      <Hero title={liveEvent.title} description={liveEvent.heading}>
        <RecordedBadge size='lg' />
      </Hero>
      <div className='grid gap-8 overflow-hidden rounded-lg'>
        {liveEvent.live_stream.length && (
          <MuxPlayer
            style={{ aspectRatio: '16/9' }}
            className='flex w-full rounded-lg'
            playbackId={liveEvent.live_stream[0].playback_id}
            metadata-video-id='video-id-54321'
            metadata-video-title='Vue 3: Episode 2'
            metadata-viewer-user-id='user-id-vue3007'
            streamType='on-demand'
          />
        )}
      </div>
      <div className='grid grid-cols-2 gap-8'>
        <Speakers speakers={liveEvent.speakers} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const { data, error } = await client.query({
    query: GetStreamBySlug,
    variables: {
      slug,
    },
  });

  if (error) {
    return {
      notFound: true,
    };
  }

  const { LiveEvent } = data;

  return {
    props: { liveEvent: LiveEvent },
  };
}
