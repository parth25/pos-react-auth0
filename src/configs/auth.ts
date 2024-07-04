import * as process from 'process'

export type AuthConfigType = {
  CLIENT_ID: string
  CLIENT_DOMAIN: string
  AUDIENCE: string
  SCOPE: string
}

export default {
  CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string,
  CLIENT_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN as string,
  AUDIENCE: process.env.NEXT_PUBLIC_AUTH0_API_AUDIENCE as string,
  SCOPE: process.env.NEXT_PUBLIC_AUTH0_SCOPE as string
} as AuthConfigType
