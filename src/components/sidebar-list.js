import classNames from 'classnames';
import Image from 'next/image';
export default function SidebarList({ currentCategory, setCategory, categories }) {
  const changeCategory = (e, category) => {
    e.preventDefault();
    setCategory(category);
  };

  return (
    <aside className='w-full' aria-label='Sidebar'>
      <div
        className='p-4 overflow-y-auto bg-white border border-gray-200 rounded rounded-lg dark:bg-gray-800 dark:border-gray-700'>
        <ul>
          <li>
            <a
              href='.'
              onClick={(e) => changeCategory(e, null)}
              className={classNames(
                'flex items-center p-2 text-base font-medium text-gray-500 rounded-lg dark:text-white hover:bg-gray-100',
                !currentCategory && "text-violet-700",
              )}
            >
              <Image
                src='/oven.svg'
                className='flex-shrink-0 w-3.5 h-3.5'
                width={14}
                height={14}
                loading='lazy'
              />
              <span className='ml-3'>All categories</span>
            </a>
          </li>

          {categories.map((category) => (
            <li key={category._id}>
              <a
                href='.'
                onClick={(e) => changeCategory(e, category._slug)}
                className={classNames(
                  'flex items-center p-2 text-base font-medium text-gray-500 rounded-lg dark:text-white hover:bg-gray-100',
                  currentCategory === category._slug && 'text-violet-700',
                )}
              >
                {category.icon && (
                  <Image
                    className='flex-shrink-0 w-3.5 h-3.5'
                    src={category.icon[0].url}
                    width={14}
                    height={14}
                    loading='lazy'
                  />
                )}
                <span className='flex-1 ml-3 whitespace-nowrap'>
                  {category.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
