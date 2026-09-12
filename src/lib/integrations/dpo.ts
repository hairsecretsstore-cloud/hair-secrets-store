/**
 * DPO Pay (DirectPay Online) integration for Mobile Money & card payments.
 *
 * Docs: https://docs.dpopay.com/
 * DPO uses an XML API. Set DPO_COMPANY_TOKEN and (optionally) DPO_SERVICE_TYPE.
 *
 * Flow:
 *  1. createToken()  → create a transaction, returns a TransToken
 *  2. redirect user to getPaymentUrl(token) (hosted payment page)
 *  3. on return, verifyToken() → confirm the payment result
 *
 * Mobile Money can also be charged directly via chargeMobileMoney().
 */

const DPO_ENDPOINT = "https://secure.3gdirectpay.com/API/v6/";
const DPO_PAYMENT_PAGE = "https://secure.3gdirectpay.com/payv2.php";

function companyToken() {
  const token = process.env.DPO_COMPANY_TOKEN;
  if (!token) throw new Error("DPO_COMPANY_TOKEN not configured");
  return token;
}

async function dpoRequest(xml: string): Promise<string> {
  const res = await fetch(DPO_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/xml" },
    body: xml,
  });
  if (!res.ok) throw new Error(`DPO request failed: ${res.status}`);
  return res.text();
}

function extract(xml: string, tag: string): string | null {
  const match = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`, "s"));
  return match ? match[1] : null;
}

export interface CreateTokenParams {
  amount: number; // in cents
  currency: string;
  reference: string; // your order reference
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  redirectUrl: string;
  backUrl: string;
}

export interface DpoToken {
  transToken: string;
  transRef: string;
  paymentUrl: string;
}

/** Step 1: create a transaction token. */
export async function createToken(
  params: CreateTokenParams,
): Promise<DpoToken> {
  const amount = (params.amount / 100).toFixed(2);
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${companyToken()}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>${amount}</PaymentAmount>
    <PaymentCurrency>${params.currency}</PaymentCurrency>
    <CompanyRef>${params.reference}</CompanyRef>
    <RedirectURL>${params.redirectUrl}</RedirectURL>
    <BackURL>${params.backUrl}</BackURL>
    <customerEmail>${params.customerEmail}</customerEmail>
    <customerFirstName>${params.customerFirstName}</customerFirstName>
    <customerLastName>${params.customerLastName}</customerLastName>
  </Transaction>
  <Services>
    <Service>
      <ServiceType>${process.env.DPO_SERVICE_TYPE ?? "3854"}</ServiceType>
      <ServiceDescription>Hair Secrets order ${params.reference}</ServiceDescription>
      <ServiceDate>${new Date().toISOString().slice(0, 10)}</ServiceDate>
    </Service>
  </Services>
</API3G>`;

  const response = await dpoRequest(xml);
  const result = extract(response, "Result");
  if (result !== "000") {
    throw new Error(
      `DPO createToken error ${result}: ${extract(response, "ResultExplanation")}`,
    );
  }
  const transToken = extract(response, "TransToken")!;
  return {
    transToken,
    transRef: extract(response, "TransRef") ?? "",
    paymentUrl: getPaymentUrl(transToken),
  };
}

/** Hosted payment page URL for a token. */
export function getPaymentUrl(transToken: string) {
  return `${DPO_PAYMENT_PAGE}?ID=${transToken}`;
}

export interface VerifyResult {
  paid: boolean;
  status: string;
  amount?: number;
  currency?: string;
}

/** Step 3: verify a transaction after the customer returns. */
export async function verifyToken(transToken: string): Promise<VerifyResult> {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${companyToken()}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>${transToken}</TransactionToken>
</API3G>`;

  const response = await dpoRequest(xml);
  const result = extract(response, "Result");
  // 000 = paid, 900 = not paid yet
  return {
    paid: result === "000",
    status: extract(response, "ResultExplanation") ?? "unknown",
    amount: Number(extract(response, "TransactionAmount") ?? 0) * 100 || undefined,
    currency: extract(response, "TransactionCurrency") ?? undefined,
  };
}

/** Directly charge a Mobile Money account (MTN / Airtel). */
export async function chargeMobileMoney(
  transToken: string,
  phoneNumber: string,
  provider: "MTN" | "Airtel",
): Promise<{ initiated: boolean; instructions: string }> {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${companyToken()}</CompanyToken>
  <Request>ChargeTokenMobile</Request>
  <TransactionToken>${transToken}</TransactionToken>
  <PhoneNumber>${phoneNumber}</PhoneNumber>
  <MNO>${provider}</MNO>
  <MNOcountry>Uganda</MNOcountry>
</API3G>`;

  const response = await dpoRequest(xml);
  const result = extract(response, "Result");
  return {
    initiated: result === "000",
    instructions:
      extract(response, "ResultExplanation") ??
      "Approve the prompt on your phone to complete payment.",
  };
}
