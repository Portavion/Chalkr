// AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
const expo = SQLite.openDatabaseSync("db.db");
import * as SQLite from "expo-sqlite";
import { AuthSessionResult } from "expo-auth-session";
const db = drizzle(expo);

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<AuthSessionResult>;
  signOutUser: () => Promise<void>;
  setUser: Dispatch<SetStateAction<FirebaseUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  });

  const checkLocalUser = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUser(userData);
    } catch (error: unknown) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const result = await promptAsync();
    if (result?.type === "success") {
      const { id_token } = result.params;
      const credential = GoogleAuthProvider.credential(id_token);
      await signInWithCredential(FIREBASE_AUTH, credential);
    }
    return result;
  };

  const signOutUser = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      await AsyncStorage.removeItem("@user");
      setUser(null);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  useEffect(() => {
    checkLocalUser();
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        setUser(user);
        await AsyncStorage.setItem("@user", JSON.stringify(user));

        const userDb = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, String(user.email)));

        if (userDb.length === 0) {
          await db.insert(usersTable).values([{ email: String(user.email) }]);
        }
      } else {
        setUser(null);
      }
      if (loading) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(FIREBASE_AUTH, credential);
    }
  }, [response]);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOutUser,
    setUser,
  };
  if (!signInWithGoogle) {
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
