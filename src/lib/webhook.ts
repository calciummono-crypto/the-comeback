export async function whenCreated(...args: unknown[]): Promise<void> {
  console.warn("[webhook] bot created", ...args);
}
