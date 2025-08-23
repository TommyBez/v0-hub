import {
  createLoader,
  createSearchParamsCache,
  parseAsBoolean,
  parseAsString,
} from 'nuqs/server'

export const repositoryUrlParser = parseAsString.withDefault('')
export const branchParser = parseAsString.withDefault('')
export const privateChatParser = parseAsBoolean.withDefault(false)
export const commitParser = parseAsString.withDefault('')

export const repositorySearchParams = {
  repositoryUrl: repositoryUrlParser,
  branch: branchParser,
  private: privateChatParser,
  commit: commitParser,
}

export const loadSearchParams = createLoader(repositorySearchParams)

export const searchParamsCache = createSearchParamsCache(repositorySearchParams)
