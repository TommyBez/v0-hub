import { createLoader, parseAsString } from 'nuqs/server'

export const repositorySearchParams = {
  repositoryUrl: parseAsString.withDefault(''),
  branch: parseAsString.withDefault(''),
}

export const loadSearchParams = createLoader(repositorySearchParams)
