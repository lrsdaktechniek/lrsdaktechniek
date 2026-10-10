/**
 * Elke Vercel-build heeft een eigen commit SHA. De privéwerkbon controleert
 * periodiek of de open tab nog diezelfde build gebruikt, zodat een iPhone
 * niet eindeloos met oude JavaScript en oude offerte-opmaak blijft werken.
 *
 * Er worden GEEN klantgegevens, tokens of offertes in dit endpoint gedeeld.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  const deployedVersion = process.env.VERCEL_GIT_COMMIT_SHA
    || process.env.VERCEL_URL
    || process.env.DEPLOYMENT_VERSION
    || "local-development";

  return Response.json(
    { version: deployedVersion },
    { headers: { "Cache-Control": "no-store, max-age=0", "X-Robots-Tag": "noindex" } },
  );
}
