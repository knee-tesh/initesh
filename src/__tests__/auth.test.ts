describe('Auth Utilities', () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = 'test-password';
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it('isAdminPasswordValid returns true for matching password', async () => {
    const { isAdminPasswordValid } = await import('@/lib/auth');
    const result = isAdminPasswordValid('test-password');
    expect(result).toBe(true);
  });

  it('isAdminPasswordValid returns false for wrong password', async () => {
    const { isAdminPasswordValid } = await import('@/lib/auth');
    const result = isAdminPasswordValid('wrong-password');
    expect(result).toBe(false);
  });
});
