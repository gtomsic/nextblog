'use server';
import paths from '@/path';
import { redirect } from 'next/navigation';

export async function search(formData: FormData) {
   const term = formData.get('term');
   if (typeof term !== 'string' || !term) {
      redirect(paths.home());
   }

   redirect(paths.searchTerm(term));
}
