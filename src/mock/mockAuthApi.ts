export async function mockSignIn(username: string) {
  // simple mock: accept any username, return a user object
  await new Promise((r) => setTimeout(r, 120));
  return { username };
}
