import { ReactNode, createContext } from "react";
import { User } from "~/global";

export const UserContext = createContext<User | null>(null);
export const UserContextProvider = ({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: ReactNode;
}) => {
  return (
    <UserContext.Provider value={initialUser}>{children}</UserContext.Provider>
  );
};
