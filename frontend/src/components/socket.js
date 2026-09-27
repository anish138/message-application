import io from "socket.io-client"

const socket  = io("http://10.161.144.122:3000",{autoConnect: false})

export default socket;