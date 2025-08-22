import axios from "axios";
import {BACKEND_URL} from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getroomId(slug:string) {

    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
    const roomId = response.data?.room?.id;

    return roomId;
    
}
 
export default async function ChatRoom1({
    params}:{
        params: {
            slug:string
        }
    })
    {
        const slug = (await params).slug;
        const roomId = await getroomId(slug);
        if(!roomId){
            return <div>Room not found</div>
        }

        return <ChatRoom id = {roomId}/>

    }