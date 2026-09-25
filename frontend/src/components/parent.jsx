import Admin from "./admin"
import User from "./user"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { createContext, useEffect,useState } from "react";


export const UserContext = createContext();

export default function Parent() {

    const [toggle, settoggle] = useState(localStorage.getItem("theme") === "dark")

    useEffect(() => {

        document.documentElement.setAttribute("data-bs-theme", toggle ? "dark" : "light");

        localStorage.setItem("theme", toggle ? "dark" : "light")

    }, [toggle])

    return (
        <div>
            <BrowserRouter>

                <UserContext.Provider value={{toggle, settoggle}}>
                    <Routes>
                        <Route index element={<Admin />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/user" element={<User />} />
                    </Routes>
                </UserContext.Provider>
            </BrowserRouter>
        </div>
    )
}