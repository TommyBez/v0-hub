import { createLoader, parseAsBoolean, parseAsString } from 'nuqs/server'

export const repositoryUrlParser = parseAsString.withDefault('')
export const branchParser = parseAsString.withDefault('')
export const privateChatParser = parseAsBoolean.withDefault(false)

export const repositorySearchParams = {
  repositoryUrl: parseAsString.withDefault(''),
  branch: parseAsString.withDefault(''),
  privateChat: parseAsBoolean.withDefault(false),
}

export const loadSearchParams = createLoader(repositorySearchParams)
