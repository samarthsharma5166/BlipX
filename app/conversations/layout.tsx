import getConversations from "../actions/getConversations";
import Sidebar from "../components/sidebar/Sidebar"
import ConversationList from "./components/ConversationList"

export default async function ConversationsLayout({
    children
}: {
    children: React.ReactNode
}) {
    const conversations = await getConversations();
   console.log(conversations) 
    return (
        <Sidebar>
            <ConversationList intialItems={conversations}/>
            <div className="h-full">{children}</div>
        </Sidebar>
    )
}