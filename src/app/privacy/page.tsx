import type { Metadata } from "next";
import { PolicyShell, PolicySection, PolicyList } from "@/components/policy";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Hair Secrets Store collects, uses, and safeguards your personal data across our website and services.",
};

export default function PrivacyPage() {
  return (
    <PolicyShell
      eyebrow="Your trust, protected"
      title="Privacy Policy"
      intro="As a global destination for premium human hair and luxury hair care, protecting your personal data is our priority."
    >
      <PolicySection title="1. What We Collect">
        <PolicyList
          items={[
            "Name, email, and contact number",
            "Shipping and billing addresses",
            "Social media profile (if you log in via Facebook, Google, etc.)",
            "Purchase history and preferences",
            "Any correspondence or interactions with our brand",
          ]}
        />
      </PolicySection>

      <PolicySection title="2. Why We Use Your Data">
        <PolicyList
          items={[
            "Process and fulfil orders",
            "Personalise your shopping experience",
            "Communicate exclusive offers and updates",
            "Improve our services and support",
            "Meet legal and contractual obligations",
          ]}
        />
      </PolicySection>

      <PolicySection title="3. When We Share Your Data">
        <p>
          Your data is never sold. We may share it with trusted partners (such
          as payment processors and delivery services), affiliate brands within
          the HSS network, and legal or regulatory bodies where required. All
          third parties uphold privacy standards in line with this policy.
        </p>
      </PolicySection>

      <PolicySection title="4. Global Data Transfers">
        <p>
          As a global brand, your data may be processed outside your country. We
          take all reasonable steps to ensure secure transfers in compliance
          with international privacy laws (e.g. GDPR, CCPA).
        </p>
      </PolicySection>

      <PolicySection title="5. Your Rights">
        <PolicyList
          items={[
            "Access or correct your personal data",
            "Request deletion or limit data use",
            "Opt out of marketing communications at any time",
            "Withdraw consent for social login integrations",
          ]}
        />
      </PolicySection>

      <PolicySection title="6. Data Retention">
        <p>
          We retain your data only as long as necessary — up to 24 months
          post-interaction, and longer only where required for tax, legal, or
          fraud-prevention reasons. After this period, data is securely deleted
          or anonymised.
        </p>
      </PolicySection>

      <PolicySection title="7. Cookies & Tracking">
        <p>
          We use cookies and tracking tools to improve website functionality,
          analyse trends and traffic, and tailor your browsing experience. You
          can manage cookie preferences through your browser at any time.
        </p>
      </PolicySection>

      <PolicySection title="8. Policy Updates">
        <p>
          This policy may be updated periodically. Any major changes will be
          posted on our website with a revised date. Continued use of our
          services implies acceptance of the updated terms.
        </p>
      </PolicySection>

      <PolicySection title="9. Contact Us">
        <p>
          For questions or requests regarding your data, reach out at{" "}
          <a href={`mailto:${site.email}`} className="text-brand-600 underline">
            {site.email}
          </a>{" "}
          or visit{" "}
          <a
            href={site.url}
            className="text-brand-600 underline"
          >
            {site.domain}
          </a>
          .
        </p>
      </PolicySection>
    </PolicyShell>
  );
}
