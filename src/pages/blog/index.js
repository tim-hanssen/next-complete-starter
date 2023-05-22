import Hero from '@/components/hero';
import Search from '@/components/search';
import SidebarList from '@/components/sidebar-list';
import { useState } from 'react';

import { GetArticles } from '@/queries/get-articles';
import { GetCategories } from '@/queries/get-categories';
import ArticleCard from '@/components/article-card';
import client from '../../../apollo-client';
import Author from '@/components/author';
import { useLazyQuery } from '@apollo/client';

export default function BlogPage({articleItems, categoryItems}) {
  const [categorySlug, setCategorySlug] = useState('');
  const [articles, setArticles] = useState(articleItems);

  const [loadArticles] = useLazyQuery(
    GetArticles,
    {
      variables: {
        where: {
          categories: {
            _slug_any: categorySlug,
          }
        }
      }
    }
  );

  const setCategory = async (cat) => {
    setCategorySlug(cat);

    loadArticles().then((result) => {
      const { data } = result;

      if (!data || data.error || !data.Articles || !data.Articles.items) {
        return;
      }

      setArticles(data.Articles.items);
    });
  };



  const authors = []
    .concat(...articles.map((article) => article.authors)) // Flatten the authors array and remove duplicates.
    .filter(
      (author, index, self) =>
        self.findIndex((a) => a.full_name === author.full_name) === index,
    );

  return (
    <div className='container mx-auto md:px-0'>
      <Hero
        title='Our blog'
        description='Fun recipes, tips-and-tricks and more from our in-house chefs.'
      />
      <div className='grid grid-cols-4 gap-1 md:gap-12'>
        <div className='col-span-4 md:hidden'>
          <Search />
        </div>
        <div className='hidden col-span-1 md:block'>
          <SidebarList
            setCategory={setCategory}
            currentCategory={categorySlug}
            categories={categoryItems}
          />
        </div>
        <div className='col-span-4 md:col-span-2'>
          {articles.map((articleItem) => (
            <ArticleCard data={articleItem} key={articleItem._id} />
          ))}
        </div>
        <div className='hidden col-span-1 md:block'>
          <Search />
          <div className='p-5 rounded-lg bg-gray-50'>
            {authors.map((author) => (
              <Author
                key={author._id}
                profile_pic={author.profile_pic[0].url}
                bio={author.bio}
                full_name={author.full_name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const articles = client.query({
    query: GetArticles,
  });

  const categories = client.query({
    query: GetCategories,
  });

  const [articlesResult, categoriesResult] = await Promise.all([articles, categories]);

  if (articlesResult.error || categoriesResult.error) {
    return {
      notFound: true,
    };
  }

  return {
    props: { articleItems: articlesResult.data.Articles.items, categoryItems: categoriesResult.data.Categories.items},
  };
}


