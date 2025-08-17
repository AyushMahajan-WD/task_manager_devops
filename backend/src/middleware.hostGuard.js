import config from '../src/config/index.js';

/**
 * Allows requests only from configured hosts. Supports wildcard subdomains:
 * If a base domain like "example.com" is present in allowedHosts, then
 * any subdomain such as "abc.example.com" is allowed.
 */
export function hostGuard(req, res, next) {
  const hostHeader = req.headers.host || '';
  const hostname = hostHeader.split(':')[0]; // strip port
  const allowed = config.allowedHosts;
  const isAllowed = allowed.some(h => {
    if (!h) return false;
    if (h === hostname) return true;
    // wildcard subdomain check: "*.example.com"
    if (h.startsWith('*.')) {
      const base = h.substring(2);
      return hostname === base || hostname.endsWith('.' + base);
    }
    // if base domain listed without wildcard, allow any subdomain too
    // e.g., 'example.com' allows 'abc.example.com' and 'example.com'
    if (hostname === h) return true;
    if (hostname.endsWith('.' + h)) return true;
    return false;
  });
  if (!isAllowed && allowed.length) {
    return res.status(403).json({ error: 'Host not allowed', host: hostname });
  }
  next();
}
