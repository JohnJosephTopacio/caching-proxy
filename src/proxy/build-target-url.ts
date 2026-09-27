export function buildTargetUrl(origin: URL, requestPathnameAndQuery: string): URL {
  // conveniently separate the pathname and query using a temporary URL object
  const incomingUrl = new URL(requestPathnameAndQuery, 'http://proxy.invalid');

  const targetUrl = new URL(origin);
  // normalize the pathname of origin to not have trailing slash
  const originPath = targetUrl.pathname.replace(/\/$/, '');

  // trying to append both pathname and query in the pathname results into query characters being encoded as they are treated as path
  targetUrl.pathname = `${originPath}${incomingUrl.pathname}`;
  targetUrl.search = incomingUrl.search;

  return targetUrl;
}
