import { createContext, useState } from "react";

interface UserContextType {
    user : string,
    setUser : React.Dispatch<React.SetStateAction<string>>;
}
export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider : React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState("");

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
};