'use client';

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { client } from "../db/client"
import type { AuthProviderInfo, RecordModel as PbRecord } from "pocketbase";

interface PbUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
}

interface AuthContextType {
  isPending: boolean;
  user: PbUser | null;
  googleSignIn: () => void;
  githubSignIn: () => void;
  setUserData: (user: PbRecord) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(true);
  const [user, setUser] = useState<PbUser | null>(null);
  const [googleAuthProvider, setGoogleAuthProvider] = useState<AuthProviderInfo | null>(null);
  const [githubAuthProvider, setGithubAuthProvider] = useState<AuthProviderInfo | null>(null);
  const pathname = usePathname();


  useEffect(() => {
    const initAuth = async () => {
      if (pathname === "/signin") {
        const authMethods = await client
          .collection("users")
          .listAuthMethods()
          .then((methods) => methods)
          .catch((err) => {
            console.error(err);
          });
        if (authMethods)
          for (const provider of authMethods.authProviders) {
            if (provider.name === "google") setGoogleAuthProvider(provider);
            if (provider.name === "github") setGithubAuthProvider(provider);
          }
      }
    };

    try {
      initAuth();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }

    if (client.authStore.model) setUserData(client.authStore.model as PbRecord);
  }, [pathname]);

  const setUserData = (pbUser: PbRecord) => {
    const { id, name, email, username, avatarUrl } = pbUser;
    setUser({ id, name, email, username, avatarUrl });
  };

  const googleSignIn = () => {
    signOut();
    localStorage.setItem("provider", JSON.stringify(googleAuthProvider));
    const redirectUrl = `${location.origin}/signin`;
    const url = googleAuthProvider?.authUrl + redirectUrl;
    router.push(url);
  };

  const githubSignIn = () => {
    signOut();
    localStorage.setItem("provider", JSON.stringify(githubAuthProvider));
    const redirectUrl = `${location.origin}/signin`;
    const url = githubAuthProvider?.authUrl + redirectUrl;

    router.push(url);
  };

  const signOut = () => {
    setUser(null);
    client.authStore.clear();
    router.push("/signin");
  };

  return (
    <AuthContext.Provider value={{ isPending, user, googleSignIn, githubSignIn, setUserData, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const usePbAuth = () => useContext(AuthContext) as AuthContextType;
export default AuthWrapper;