import { BACKEND_URL } from "../app/config"
import axios from "axios";
import { ClientRoom } from "./ClientRoom";


async function getChats(roomId: string){
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
    const chats = response.data.messages;

    return chats;

}

export async function ChatRoom({id}:{
    id: string
}){

    const messages = await getChats(id);

    return <ClientRoom id = {id} messages={messages}></ClientRoom>
    


}