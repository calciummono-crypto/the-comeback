export async function loginMinecraftEmail(_email: string, _password: string): Promise<{ token: string; name: string; id: string }> {
  throw new Error("Microsoft email/password login is not configured on this deployment. Paste a Minecraft session token instead.");
}
