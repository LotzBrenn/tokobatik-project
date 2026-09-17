import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.SESSION_SECRET || 'tokobatik-secret-key-change-in-production';
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(token) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId, userData) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt({ userId, ...userData, expiresAt: expiresAt.getTime() });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    return null;
  }

  return await decrypt(sessionCookie.value);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function verifySession() {
  const session = await getSession();

  if (!session) {
    return { isAuth: false };
  }

  if (session.expiresAt < Date.now()) {
    await deleteSession();
    return { isAuth: false };
  }

  return {
    isAuth: true,
    userId: session.userId,
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
    },
  };
}
