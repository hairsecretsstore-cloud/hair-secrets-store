import type { Metadata } from "next";
import { PolicyShell, PolicySection, PolicyList, PolicyTable } from "@/components/policy";
import { deliveryTimes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Hair Secrets Store shipping timeframes, courier partners (DHL, FedEx, UPS), and our returns & exchange policy.",
};

export default function ShippingReturnsPage() {
  return (
    <PolicyShell
      eyebrow="Crafted with care for our esteemed clientele worldwide"
      title="Shipping & Returns"
      intro="We deliver your luxury hair pieces with the utmost care, speed, and elegance — locally and internationally."
    >
      <PolicySection title="Processing Times">
        <PolicyList
          items={[
            "Ready-to-ship items: 10–17 business days",
            "Customized units: 15–30 business days",
            "Processing includes quality assurance, packaging, and logistics coordination.",
          ]}
        />
        <p className="text-sm text-muted">
          Please note that processing time is separate from shipping time.
        </p>
      </PolicySection>

      <PolicySection title="Domestic Delivery">
        <p className="font-medium text-espresso">Within Kampala</p>
        <PolicyList
          items={[
            "Free delivery within a 5km radius of Central Kampala.",
            "Estimated delivery time: 1–2 business days after dispatch.",
          ]}
        />
        <p className="mt-3 font-medium text-espresso">
          Outside Central Kampala / Upcountry
        </p>
        <PolicyList
          items={[
            "Delivery is available nationwide.",
            "Transportation costs are borne by the client and communicated prior to dispatch.",
            "Delivery timelines vary based on location and courier availability.",
          ]}
        />
      </PolicySection>

      <PolicySection title="Delivery Timeframes">
        <PolicyTable
          head={["Region / Method", "Estimated Delivery"]}
          rows={deliveryTimes.map((d) => [d.region, d.time])}
        />
      </PolicySection>

      <PolicySection title="Shipping Partners">
        <p>We exclusively ship via trusted, certified global couriers:</p>
        <PolicyList items={[...site.couriers]} />
        <p>
          Once your order is shipped, you&apos;ll receive tracking details via
          email or WhatsApp for real-time monitoring.
        </p>
      </PolicySection>

      <PolicySection title="Order Cancellations">
        <PolicyList
          items={[
            "Cancellations are accepted within 3 hours of order confirmation.",
            "Subject to a 15% handling fee of the purchase price.",
            "Orders that have been processed, shipped, or customized are non-cancellable.",
          ]}
        />
      </PolicySection>

      <PolicySection title="Returns & Exchanges">
        <p>
          Due to the bespoke nature of our products, returns are accepted for
          exchange only and must meet the following criteria:
        </p>
        <PolicyTable
          head={["Criteria", "Details"]}
          rows={[
            ["Return window", "Within 2 days of delivery (domestic) or 5 days (international)"],
            ["Condition", "Product must be unused, in original condition and packaging"],
            ["Documentation", "Original receipt / proof of purchase required"],
            ["Return fee", "30% restocking & logistics charge (includes taxes & shipping)"],
          ]}
        />
      </PolicySection>

      <PolicySection title="Non-Returnable Items">
        <PolicyList
          items={[
            "Final Sale items",
            "Products under the Payment Plan Policy (PPP)",
            "Custom-designed or tailored units (unless faulty)",
          ]}
        />
      </PolicySection>

      <PolicySection title="Refunds">
        <PolicyList
          items={[
            "Refunds are granted in rare circumstances at our discretion.",
            "Processing time: 5 business days after approval.",
            "Notification of refund status is sent via email.",
          ]}
        />
      </PolicySection>

      <PolicySection title="How to Initiate a Return or Inquiry">
        <p>
          Email us at{" "}
          <a href={`mailto:${site.email}`} className="text-brand-600 underline">
            {site.email}
          </a>{" "}
          with your order number and hair unit information, reason for return,
          proof of payment, and clear photos or videos. Or call our luxury
          support line:{" "}
          <a href={`tel:${site.phone}`} className="text-brand-600 underline">
            {site.phone}
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="Important Notes">
        <PolicyList
          items={[
            "All shipping fees are non-refundable.",
            "Hair Secrets Store is not liable for delays caused by customs, courier disruptions, or force majeure events.",
            "Clients are responsible for ensuring accurate delivery details at the time of order placement.",
          ]}
        />
        <p className="text-sm text-muted">
          Hair Secrets Store reserves the right to update this policy at any
          time. We encourage you to review it periodically for the latest
          information.
        </p>
      </PolicySection>
    </PolicyShell>
  );
}
