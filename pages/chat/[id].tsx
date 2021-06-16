import { GetServerSideProps } from "next"
import Head from "next/head"
import { useAuthState } from "react-firebase-hooks/auth"
import styled from "styled-components"
import Chat from "../../components/Chat"
import ChatScreen from "../../components/ChatScreen"
import Sidebar from "../../components/Sidebar"
import { auth, db } from "../../firebase"
import getRecipientEmail from "../../utils/getRecipientEmail"
import { chat } from "../../utils/interfaces"

interface IChatId{
    chat: chat;
    messages: string;
}

const ChatId:React.FC<IChatId> = ({chat, messages}) => {
    const [user] = useAuthState(auth)

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    )
}

export default ChatId 

export const getServerSideProps: GetServerSideProps = async (context) => {
    const ref = db.collection("chats").doc(context.query.id as string)

    const messagesRes = await ref.collection("messages").orderBy('timestamp','asc').get()

    const messages = messagesRes.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp,
        id: doc.id,
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))

    const chatRes = await ref.get()

    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    // console.log(chat, messages); 

    return {
        props: {
            messages: JSON.stringify(messages),
            chat
        }
    }
}

const Container = styled.div`
    display: flex;
`

const ChatContainer = styled.div`
    flex:1;
    overflow:scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

`