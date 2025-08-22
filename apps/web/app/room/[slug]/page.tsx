import axios from "axios";
import {BACKEND_URL} from "../../config";

async function getroomId(slug:string) {

    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
    const roomId = response.data.id;
    
}
 
export default function ChatRoom({
    params}:{
        params: {
            slug:string
        }
    })
    {
        const slug = params.slug;
        const roomId = getroomId(slug);
        
    }