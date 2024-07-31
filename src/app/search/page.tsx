import paths from '@/path';
import { redirect } from 'next/navigation';
import PostList from '@/components/posts/post-list';
import { fetchPotsBySearchTerm } from '@/db/queties/posts';
import React from 'react';

interface SearchPageProps {
   searchParams: {
      term: string;
   };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
   const { term } = searchParams;
   if (!term) {
      redirect(paths.home());
   }
   return (
      <div>
         <PostList fetchData={() => fetchPotsBySearchTerm(term)} />
      </div>
   );
}
