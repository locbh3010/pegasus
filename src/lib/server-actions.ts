import { cookies, headers } from 'next/headers'

export async function getAuthToken() {
  'use server'

  const authToken = (await headers()).get('authorization')

  return authToken
}
