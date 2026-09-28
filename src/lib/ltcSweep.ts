export async function forwardInvoice(invoiceId: string): Promise<{ ok: boolean; txid?: string; error?: string }> {
  console.warn(`[ltc-sweep] forwarding not configured for invoice ${invoiceId}`);
  return { ok: false, error: "LTC sweeping is not configured" };
}
