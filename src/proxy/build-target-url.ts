export function buildTargetUrl(origin: URL, requestPathnameAndQuery: string): URL {
  const incomingUrl = new URL(requestPathnameAndQuery, 'http://proxy.invalid');

  const targetUrl = new URL(origin);
  // normalize the pathname of origin to not have trailing slash
  const originPath = targetUrl.pathname.replace(/\/$/, '');

  targetUrl.pathname = `${originPath}${incomingUrl.pathname}`;
  targetUrl.search = incomingUrl.search;

  return targetUrl;
}
