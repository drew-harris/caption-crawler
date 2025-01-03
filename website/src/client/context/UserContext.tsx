import { ReactNode, createContext, useState } from "react";
import { User } from "~/global";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({ user: null, setUser: () => {} });

export const UserContextProvider = ({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(initialUser);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
  );
};
