import Hero from '@/components/hero';
import LivestreamCard from '@/components/livestream-card';
import { GetUpcomingLiveStreams } from '@/queries/get-upcoming-live-streams';
import { GetRecordedLiveStreams } from '@/queries/get-recorded-live-streams';
import { GetStreamBySlug } from '@/queries/get-stream-by-slug';
import client from '../../../apollo-client';

export default function LivestreamsPage({ live, upcoming, recorded }) {
  return (
    <div className='container mx-auto md:px-0'>
      <Hero
        title='Live Events'
        description='Through our live events, join our baking community and skill up on basic and advanced skills. Turn your baked goodies into unforgettable treats for your family, friends or customers.'
      />
      <div className='grid gap-4 mb-12'>
        <h3 className='text-xl font-bold md:text-2xl'>Live</h3>
        <div className='grid gap-6'>
          <LivestreamCard type='live' event={live} />
        </div>
      </div>

      <div className='grid gap-4 mb-12'>
        <h3 className='text-xl font-bold md:text-2xl'>Upcoming</h3>
        <div className='grid gap-6'>
          {upcoming.map((stream) => (
            <div key={stream._id} className='col-span-12'>
              <LivestreamCard type='upcoming' event={stream} />
            </div>
          ))}
        </div>
      </div>

      <div className='grid gap-4'>
        <h3 className='text-xl font-bold md:text-2xl'>Recorded</h3>
        <div className='grid gap-6'>
          {recorded.map((stream) => (
            <div key={stream._id} className='col-span-12'>
              <LivestreamCard type='recorded' event={stream} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const today = new Date().toJSON().slice(0, 10);

  const liveQuery = client.query({
    query: GetStreamBySlug,
    variables: {
      slug: 'fall-bake-a-thon',
    },
  });

  const upcomingQuery = client.query({
    query: GetUpcomingLiveStreams,
    variables: {
      where: {
        start_day_and_time_gt: today,
      },
    },
  });

  const recordedQuery = client.query({
    query: GetRecordedLiveStreams,
    variables: {
      where: {
        start_day_and_time_lt: today,
      },
    },
  });

  const [liveResult, upcomingResult, recordedResult] = await Promise.all([liveQuery, upcomingQuery, recordedQuery]);

  if (liveResult.error || upcomingResult.error || recordedResult.error) {
    return {
      notFound: true,
    };
  }

  const live = liveResult.data.LiveEvent;
  const upcoming = upcomingResult.data.LiveEvents.items;
  const recorded = recordedResult.data.LiveEvents.items;

  return {
    props: {
      live,
      upcoming,
      recorded,
    },
  };
}
