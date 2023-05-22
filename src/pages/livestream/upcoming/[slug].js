import client from '../../../../apollo-client';
import { GetStreamBySlug } from '@/queries/get-stream-by-slug';
import Hero from '@/components/hero';
import CountDown from '@/components/countdown';
import Speakers from '@/components/speakers';
import usePopup from '@/hooks/usePopup';
import ArrowRightIcon from '@/components/icons/arrow-right-icon';
import Image from 'next/image';

export default function UpcomingPage({ liveEvent }) {
  const { openPopup } = usePopup();

  return (
    <div className='container mx-auto md:px-0'>
      <Hero title={liveEvent.title} description={liveEvent.heading}>
        <a
          href='#notify'
          className='text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800'
        >
          Notify me
          <ArrowRightIcon fill="currentColor" />
        </a>
      </Hero>

      <CountDown startDate={liveEvent.start_day_and_time} />

      <div
        id='notify'
        className='flex items-center justify-between mt-16 mb-8 space-x-40 md:mt-28'
      >
        <div className='w-full md:basis-2/4'>
          <h3
            className='mb-4 text-xl font-semibold tracking-tight text-center text-gray-900 md:text-left dark:text-white'>
            {liveEvent.heading}
          </h3>
          <p className='mb-6 text-base leading-relaxed text-center text-gray-500 md:text-left dark:text-gray-400'>
            {liveEvent.live_stream_intro}
          </p>
          <form action='#'>
            <div className='flex items-center max-w-screen-md mx-auto'>
              <div className='relative w-5/6 mr-3 md:w-4/6'>
                <label
                  htmlFor='email'
                  className='hidden mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300'
                >
                  Email address
                </label>
                <input
                  className='block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500'
                  placeholder='Your email address'
                  type='email'
                  id='email'
                  required=''
                />
              </div>
              <div className='w-1/6 md:w-auto'>
                <button
                  type='button'
                  onClick={openPopup}
                  className='inline-flex w-full px-5 py-3 text-sm font-medium text-center text-white rounded-lg cursor-pointer bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:ring-violet-300 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800'
                >
                  <span className='hidden md:inline'>Notify me</span>
                  <svg
                    aria-hidden='true'
                    className='w-5 h-5 -mr-1 md:ml-2'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className='hidden md:flex basis-2/4'>
          <Image
            className='object-cover w-full rounded-lg h-96'
            src={liveEvent.cover[0].url}
            width={500}
            height={500}
            loading='lazy'
            alt='Live Stream'
          />
        </div>
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
