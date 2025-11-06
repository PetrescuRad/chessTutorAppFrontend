import { useEffect, useState } from "react";
import axios from "axios";
import type { User } from "../data/User";

const HomePage = () => {
    const [loggedUser, setLoggedUser] = useState<User>();
    
    async function fetchUser() {
        const token = localStorage.getItem("token");
        try {
            let response = await axios.get('/api/user/profile', 
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLoggedUser(response.data);
            console.log("Logged user: ", response.data.username);
        } catch (err) {
            console.log("Error fetching data: ", err);
        }
    }

    useEffect(() => {
       fetchUser();
    }, []);

    return (
    <div>
      {loggedUser ? (
        <>
          <h2>Welcome, {loggedUser.username}</h2>
          <p>Profile: {loggedUser["@id"]}</p>
        </>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default HomePage;