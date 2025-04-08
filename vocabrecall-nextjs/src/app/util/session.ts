import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";


const authToken: string = process.env.AUTH_TOKEN || "";
const sessionDurationDays: number = Number(process.env.TOKEN_DURATION_DAYS) || 0;

// Secret key for JWT signing (using auth token as the secret)
const getSecretKey = () => {
  if (authToken === "") {
    console.error("AUTHTOKEN is unset")
    return new TextEncoder().encode("fallback-secret-do-not-use-in-production")
  }
  return new TextEncoder().encode(authToken)
}


interface SessionData {
  expires: number
}

// verify session
export async function getSession(): Promise<SessionData | null> {
  if(authToken === ""){
    console.error("AUTHTOKEN is unset");
    return null;
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("vocabrecall-session");

  if(!sessionCookie){ return null; }

  try {
    // verify jwt
    const verified = await jwtVerify(sessionCookie.value, getSecretKey(), { algorithms: ["HS256"] });
    return Promise.resolve(verified)
      .then((result) => {
        const payload = result.payload as unknown as SessionData;
        if(payload.expires < Date.now()){ return null; }
        return payload;
      })
      .catch(() => null);
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

// create a session
export async function createSession(inputToken: string): Promise<boolean> {
  // ensure auth token env is set
  if (authToken === "") {
    console.error("AUTHTOKEN is unset")
    return false
  }

  // check input token against env auth token
  if(inputToken !== authToken){ return false; }

  // calculate session duration
  if(!sessionDurationDays || sessionDurationDays === 0){
    console.error("SESSION_DURATION_DAYS is unset or invalid");
    return false;
  }
  const expires = Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000;

  // create jwt token
  const session = await new SignJWT({ expires })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(expires))
    .sign(getSecretKey());

  // set cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: "vocabrecall-session",
    value: session,
    httpOnly: true,
    expires: new Date(expires),
    path: "/",
    secure: process.env.WEB_PROTOCOL === "https",
    sameSite: "strict"
  });

  return true;
}