import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/content/site";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Praxera Technologies collects and uses personal information submitted through this website.",
  alternates: canonical("/privacy"),
};

export default function PrivacyPage() {
  const operator = site.legal.entityName ?? `${site.name}, a trading brand of its founder, ${site.founder.name}`;
  return (
    <LegalPage title="Privacy Policy" updated="27 October 2026">
      <p>
        This policy explains what personal information this website collects, why, and what you can do about it. The
        website is operated by {operator} (“Praxera”, “we”, “us”).
      </p>

      <h2>What we collect</h2>
      <p>We collect only the information you choose to send through the enquiry form:</p>
      <ul>
        <li>your name and business email address;</li>
        <li>your company name, if you provide it;</li>
        <li>your country, and the currency your quote should use;</li>
        <li>the area you are interested in and your description of what you want to improve;</li>
        <li>your preferred contact method and, if you choose phone or WhatsApp, your phone number.</li>
      </ul>
      <p>
        We do not use advertising trackers or analytics cookies. To protect the form from abuse, our server briefly
        processes your IP address to limit repeated submissions; it is not stored with your enquiry.
      </p>
      <p>
        To suggest the right currency, the website asks our hosting platform for the country of your connection. Only the
        country code is used, it is not stored on our side, and your chosen region is remembered only in your own
        browser’s local storage.
      </p>

      <h2>Why we use it</h2>
      <p>
        We use your enquiry details only to respond to you, discuss your requirements, and prepare any proposal you ask
        for. Our basis for this is your consent, given when you submit the form, and our legitimate interest in
        replying to business enquiries. We never sell your information or add you to marketing lists.
      </p>

      <h2>Who processes it</h2>
      <p>
        Enquiries are delivered to us by email through a form-to-email provider (Web3Forms, Resend or FormSubmit), and the website is served by
        our hosting provider. These providers process data on our behalf to deliver the service and may do so outside
        your country. If you message us on WhatsApp, that conversation is also handled under WhatsApp’s own terms
        and privacy policy.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry emails for as long as needed to respond and to manage any resulting project, and delete enquiries
        that do not lead to work within 24 months.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live — including under the UK GDPR, the EU GDPR and India’s Digital Personal Data
        Protection Act — you may have the right to access, correct or delete your personal information, to withdraw
        consent, and to complain to your data-protection authority. To make a request, contact us using the details below.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, use the <Link href="/contact">enquiry form</Link>
        {site.publicEmail ? (
          <>
            , email <a href={`mailto:${site.publicEmail}`}>{site.publicEmail}</a>
          </>
        ) : null}{" "}
        or message us on{" "}
        <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
          WhatsApp ({site.whatsapp.display})
        </a>
        .
      </p>
    </LegalPage>
  );
}
