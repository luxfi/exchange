import { Data } from 'functions/utils/cache'
import getPool from 'functions/utils/getPool'
import getPosition from 'functions/utils/getPosition'
import { getRequest } from 'functions/utils/getRequest'
import getToken from 'functions/utils/getToken'
import { Context, Next } from 'hono'
import { encode } from 'html-entities'
import { paths } from '~/pages/paths'
import { MetaTagInjectorInput } from '~/shared-cloud/metatags'

function doesMatchPath(path: string): boolean {
  const regexPaths = paths.map((p) => '^' + p.replace(/:[^/]+/g, '[^/]+').replace(/\*/g, '.*') + '$')
  // These come from a constant we define (paths.ts), so we don't need to worry about them being malicious.
  // eslint-disable-next-line security/detect-non-literal-regexp
