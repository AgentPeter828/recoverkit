export function PlausibleProvider() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;

  if (!domain || !host) {
    return null;
  }

  return (
    <script
      defer
      data-domain={domain}
      src={`${host}/js/script.js`}
    />
  );
}
