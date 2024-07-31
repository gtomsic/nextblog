'use server';
import { z } from 'zod';
import { auth } from '@/auth';
import { Topic } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import paths from '@/path';

const createTopicShema = z.object({
   name: z
      .string()
      .min(3)
      .regex(/[a-z-]/, {
         message: 'Must be lowercase letters or dashes without spaces',
      }),
   description: z
      .string()
      .min(10, { message: 'Description must be longer than 10 characters.' }),
});

interface CreateTopicFormState {
   errors: {
      name?: string[];
      description?: string[];
      _form?: string[];
   };
}

export async function createTopic(
   formState: CreateTopicFormState,
   formData: FormData
): Promise<CreateTopicFormState> {
   const result = createTopicShema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
   });

   if (!result.success) {
      return {
         errors: result.error.flatten().fieldErrors,
      };
   }
   const session = await auth();
   if (!session || !session.user) {
      return {
         errors: {
            _form: ['You must be signed in to create topic.'],
         },
      };
   }

   let topic: Topic;
   try {
      topic = await db.topic.create({
         data: {
            slug: result.data.name,
            description: result.data.description,
         },
      });
   } catch (err: unknown) {
      if (err instanceof Error) {
         return {
            errors: {
               _form: [err.message],
            },
         };
      } else {
         return {
            errors: {
               _form: ['Something went wrong.'],
            },
         };
      }
   }
   revalidatePath(paths.home());
   redirect(paths.topicShow(topic.slug));
}
