import { useState, useEffect, useContext, useRef } from "react";
import socket from "./socket.js";
import { UserContext } from "./parent.jsx";


import "./admin.css"

export default function Admin() {

    const { toggle, settoggle } = useContext(UserContext)

    const [show, setShow] = useState([])
    const [message, setMessage] = useState("")
    const [online, setOnline] = useState([])
    const [chek, setChek] = useState(false)
    const [type, setType] = useState(false)
    const typeRef = useRef(null)
    const [typerecive, setTyperecive] = useState(false)
    const scrolleref = useRef(null)

    const currentrole = "admin";


    useEffect(() => {
        socket.connect();

        // Backend se connection hone par
        socket.on("connect", () => {
            console.log("Backend Connected to User");

            const roleobj = { role: currentrole, msg: "i am admin" }

            socket.emit("frontendMessage", roleobj);
        });

        socket.on("backendMessage", (data) => {
            setShow(data)
        });

        // Backend ke reply ko receive karna
        socket.on("backendReply", (data) => {
            console.log("Backend reply fro admin:", data);
        });

        socket.on("frontenddata", (data) => {
            console.log(data)
            setShow(prev => [...prev, data])
        });

        socket.on("arrydata", (data) => {
            console.log(data);
            setOnline(data)

            if (!online.includes(data)) {
                setChek(true)
            } else {
                setChek(false)
            }
        })

        socket.on("typetrack", (data) => {
            setTyperecive(data.type)
        })

        socket.on("connectionchek",(data)=>{
            alert(data)
        })

        return () => {
            socket.disconnect();
        }

    }, [])


    useEffect(() => {

        socket.emit("typetrack", { type: type })

    }, [type])

    const sendclick = () => {



        const messageObject = { messages: message, role: currentrole }

        socket.emit("frontenddata", messageObject);

        setMessage("")

    }


    const InputType = () => {
        setType(true);

        clearTimeout(typeRef.current)

        typeRef.current = setTimeout(() => {
            setType(false);
        }, 1000)
    }

    useEffect(()=>{
        if(scrolleref.current){
            scrolleref.current.scrollTop = scrolleref.current.scrollHeight
        }
    },[show])


    return (
        <div className="d-flex flex-column min-vh-100 ">
            <header className="d-flex justify-content-between header-color p-3 fixed-top ">

                <div className="d-flex justify-content-between">

                    <span className="bi bi-arrow-left fs-2 "></span>

                    <div>
                        <div className="d-flex align-items-center mx-3">
                            <h3>Admin</h3>
                        </div>
                        <span className="text-secondary">
                            {typerecive ? "typing..." : chek ? "online..." : ""}
                        </span>
                    </div>

                </div>

                <div>
                    <button className="btn" onClick={() => settoggle(pre => !pre)}><span className={toggle ? "bi bi-sun" : "bi bi-moon"}></span></button>
                </div>

            </header>


            <main className="flex-grow-1 p-3 " ref={scrolleref}
                style={{
                    backgroundColor: toggle ? "#000000" : "#f5f7fb",
                    overflowY: "auto",
                    height: "calc(100vh - 140px)",
                    marginTop: "70px",
                    marginBottom: "70px"
                }}
            >

                <div className="d-flex flex-column gap-2">

                    {show.map((data, index) => (
                        <div key={index} className={`d-flex ${data.sendroles === currentrole ? "justify-content-end" : "justify-content-start"}`} >

                            <div className="px-3 py-2 rounded-3 shadow-sm"
                                style={{
                                    maxWidth: "100%",
                                    backgroundColor:
                                        data.sendroles === currentrole
                                            ? "#0d6efd"
                                            : "#ffffff",
                                    color:
                                        data.sendroles === currentrole
                                            ? "#ffffff"
                                            : "#212529",
                                }}
                            >
                                <div className="small fw-semibold mb-1">
                                    {data.sendroles === "admin" ? "Admin" : "User"}
                                </div>

                                <div>{data.messages}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="fixed-bottom" style={{ background: toggle ? "black" : "white" }}>
                <div className="d-flex justify-content-between m-3 ">
                    <input type="text" className="form-control foots" placeholder="Enter message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={InputType} />
                    <button className="input-group-text btn btns mx-1 ms-3" onClick={() => sendclick()} ><span className={`bi bi-send ${message.length <= 0?"text-secondary":"text-white"}`}></span></button>
                </div>
            </footer>
        </div>
    )
}