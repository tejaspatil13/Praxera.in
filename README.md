# Praxera Technologies — website

Next.js 16 (App Router, TypeScript, Tailwind CSS v4, Motion). Every page is statically prerendered. The only server code is two route handlers:

- `POST /api/enquiry` validates the contact form and emails it to you through Resend.
- `GET /api/region` reads the visitor's country from the host's edge header (Vercel or Cloudflare) to suggest a currency.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in values (see below)
npm run dev                  # http://localhost:3000
```

Checks: `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | for production | Domain, e.g. `https://praxera.tech`. Turns on canonical URLs, the sitemap and search indexing. While it is unset, `robots.txt` blocks indexing. |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | recommended | Web3Forms access key for hello@praxera.in. |
| `RESEND_API_KEY` | optional | API key from resend.com. |
| `ENQUIRY_TO_EMAIL` | optional | Inbox that receives enquiries. Defaults to `hello@praxera.in`. |
| `ENQUIRY_FROM_EMAIL` | optional (with Resend) | Sender on a domain verified in Resend, e.g. `Praxera Technologies <enquiries@praxera.in>`. |

### Where enquiries arrive

| Setup | What the visitor does | Where you read it |
| --- | --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_KEY` set (recommended) | Clicks **Send enquiry** | Email inbox **hello@praxera.in**, and the Web3Forms dashboard |
| `RESEND_API_KEY` + `ENQUIRY_FROM_EMAIL` set | Clicks **Send enquiry** | Email inbox **hello@praxera.in** |
| Nothing set (default) | Clicks **Send enquiry** — sent through FormSubmit, no key needed | Email inbox **hello@praxera.in**. The first enquiry ever sent triggers a one-time **Activate Form** email from FormSubmit; click it once. |
| Automatic sending fails | Chooses **Send on WhatsApp** or **Send by email**; the message opens pre-written | WhatsApp on **+91 77092 88629**, or the **hello@praxera.in** inbox |

hello@praxera.in must be a working mailbox (or forward to one) for email to arrive.

The form only shows success after the provider confirms delivery.

## Deploy (Vercel recommended)

1. Push this folder to a Git repository (GitHub, GitLab or Bitbucket).
2. In Vercel, choose **Add New → Project**, import the repository and keep the default Next.js settings.
3. Add the environment variables above for the Production environment.
4. Deploy. Then add your domain under **Settings → Domains** and set `NEXT_PUBLIC_SITE_URL` to it. Redeploy.
5. In Resend, verify the domain (DNS records), then send a real test enquiry from the live site.

Vercel provides the `x-vercel-ip-country` header used for currency detection. On Cloudflare, `cf-ipcountry` is used instead. On other hosts, visitors default to International (USD) and can change their region manually.

## Updating content

All facts live in `src/content/`. Components only read from these files.

| What | File |
| --- | --- |
| Company name, founder links, public email, WhatsApp number, legal entity details | `src/content/site.ts` |
| Services (title, bullet points, caveats) | `src/content/services.ts` |
| Problems section | `src/content/problems.ts` |
| Process steps, principles, "good fit" lists | `src/content/process.ts` |
| Case studies and portfolio projects | `src/content/caseStudies.ts` |
| Regions, engagement types and **prices** | `src/content/pricing.ts` |
| Enquiry "area of interest" options | `src/content/interests.ts` |

**Publishing prices.** In `src/content/pricing.ts`, replace `null` for a region and engagement with an approved amount, for example `assessment: { amount: 25000, basis: "from" }` under `IN`. Each region is priced independently; nothing is converted between currencies. Any engagement left as `null` shows "Request a tailored quote" in that region's currency.

**Contact details and legal details.** Change `publicEmail`, `whatsapp` and the `legal` fields in `src/content/site.ts`. The footer, contact page and policies show them automatically once they are set.

**Case-study screenshots** are in `public/case-studies/call-list/`. They were extracted unaltered from the project PDF.
