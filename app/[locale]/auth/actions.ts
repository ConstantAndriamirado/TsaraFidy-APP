'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'tsara_fidy_token',
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  revalidatePath('/', 'layout');
  redirect('/');
}
