import Hero from '@/components/hero';
import LiveBadge from '@/components/badges/live-badge';
import { GetStreamBySlug } from '@/queries/get-stream-by-slug';
import client from '../../../../apollo-client';
import Speakers from '@/components/speakers';
import MuxPlayer from '@mux/mux-player-react';

export default function LiveStreamPage({ liveEvent }) {
  return (
    <div className='container mx-auto md:px-0'>
      <Hero title={liveEvent.title} description={liveEvent.heading}>
        <LiveBadge size='lg' />
      </Hero>
      <div className='grid gap-8 overflow-hidden rounded-lg'>
        <MuxPlayer
          id='video'
          className='flex w-full rounded-lg'
          style={{ aspectRatio: '16/9' }}
          playbackId={liveEvent.live_stream[0].playback_id}
          metadataVideoId={liveEvent.live_stream[0].playback_id}
          loop
          streamType='live'
          controls
          autoplay
        />
      </div>
      <div className='grid grid-cols-2 gap-1 md:gap-8'>
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
