import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/content/site";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the Praxera Technologies website.",
  alternates: canonical("/terms"),
};

export default function TermsPage() {
  const operator = site.legal.entityName ?? `${site.name}, a trading brand of its founder, ${site.founder.name}`;
  return (
    <LegalPage title="Terms of Service" updated="27 October 2026">
      <p>
        These terms cover your use of this website, which is operated by {operator}. By using the website you agree to
        them.
      </p>

      <h2>Information on this website</h2>
      <p>
        The website describes our services and past work for general information. Case-study figures are reported as
        documented in their stated context; they are not guarantees of results for your business. Any engagement is
        governed by a separate written proposal or agreement, which takes precedence over anything on this website.
      </p>

      <h2>Pricing</h2>
      <p>
        Where prices are shown, they are indicative and depend on agreed scope. A price is binding only once confirmed
        in a written proposal. Third-party charges, such as hosting, software subscriptions, AI model usage or messaging
        fees, are separate unless the proposal states otherwise.
      </p>

      <h2>Enquiries</h2>
      <p>
        Submitting an enquiry does not create a contract or an obligation for either party. Please do not send
        confidential information through the enquiry form; we can arrange a suitable way to share it if needed. How we
        handle your details is described in our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Praxera name, wordmark, website design and written content belong to Praxera unless stated otherwise.
        Screenshots and project details are shown with their sources identified. Third-party names and trademarks belong
        to their respective owners.
      </p>

      <h2>External links</h2>
      <p>
        Links to other websites, including project demos and code repositories, are provided for convenience. We are not
        responsible for the content of external sites.
      </p>

      <h2>Liability</h2>
      <p>
        We work to keep the website accurate and available but cannot guarantee it will always be error-free or
        uninterrupted. To the extent permitted by law, we are not liable for losses arising from use of the website.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms. The date at the top shows when they last changed.</p>
    </LegalPage>
  );
}
