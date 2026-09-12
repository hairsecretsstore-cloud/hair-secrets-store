import type { Metadata } from "next";
import { PolicyShell, PolicySection, PolicyList } from "@/components/policy";

export const metadata: Metadata = {
  title: "Payment Plans",
  description:
    "Hair Secrets Store Payment Plan Policy — full payment or a 70% deposit plan with flexible, transparent terms.",
};

export default function PaymentPlansPage() {
  return (
    <PolicyShell
      eyebrow="Invest in timeless elegance"
      title="Payment Plan Policy"
      intro="Luxury is an experience — we offer flexible payment solutions that uphold the craftsmanship, integrity, and fairness that define our brand."
    >
      <PolicySection title="1. Accepted Forms of Payment">
        <p className="font-medium text-espresso">Full Payment</p>
        <p>Payment in full at the time of purchase.</p>
        <p className="mt-3 font-medium text-espresso">70% Deposit Plan</p>
        <p>
          Secure your hair unit with a 70% deposit — whether on preorder or not
          — with the balance of 30% payable upon delivery.
        </p>
        <PolicyList
          items={[
            "All payment plans must be completed within one (1) month from the date of initiation.",
            "No hair unit is delivered until the balance is fully cleared.",
          ]}
        />
      </PolicySection>

      <PolicySection title="2. Discount Policy">
        <PolicyList
          items={[
            "Discounts under a payment plan are not automatic.",
            "Any discount must be approved by HSS Management and reflected on the official invoice.",
          ]}
        />
      </PolicySection>

      <PolicySection title="3. Late Payment Policy">
        <PolicyList
          items={[
            "Late payments may attract penalties as guided by the invoice or HSS Management.",
            "If the plan is not completed within one month, all deposits become non-refundable.",
            "Items reserved under a payment plan cannot be exchanged, as they are custom-prepared.",
            "A 20-working-day grace period applies after the plan month; without communication or payment, the order is cancelled with no deposit refund.",
          ]}
        />
      </PolicySection>

      <PolicySection title="4. Invoices & Account Management">
        <PolicyList
          items={[
            "Clients receive invoices, quotations, and receipts from HSS.",
            "Statements are updated after every deposit.",
            "Please notify HSS after each payment for accurate account reconciliation.",
            "All payments made may be subject to withdrawal charges, where applicable.",
          ]}
        />
      </PolicySection>

      <PolicySection title="5. Debt Recovery">
        <p>
          To protect business sustainability, HSS follows a fair, staged
          recovery process:
        </p>
        <PolicyList
          items={[
            "Reminder Notices — upon lapse of the payment timeline, HSS issues three formal reminders.",
            "Final Demand Notice — if no payment or communication follows, HSS issues a final demand with a set deadline.",
            "Escalation to Authorities — failure to settle after the deadline results in a case filed with the relevant authorities.",
            "Legal Action — cases may be escalated to the Courts of Law for formal recovery and any applicable legal remedies.",
          ]}
        />
      </PolicySection>
    </PolicyShell>
  );
}
