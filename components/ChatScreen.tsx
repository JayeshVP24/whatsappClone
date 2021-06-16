import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { chat } from "../utils/interfaces";
import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, InsertEmoticon, Mic } from "@material-ui/icons";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { MouseEvent, useRef, useState } from "react";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react"

interface IChatScreen {
    chat: chat;
    messages: string;
}

const ChatScreen: React.FC<IChatScreen> = ({ chat, messages }) => {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState<string>("");
    const router = useRouter();
    const endOfMessagesRef = useRef(null)
    const [messagesSnapshot] = useCollection(
        db
            .collection("chats")
            .doc(router.query.id as string)
            .collection("messages")
            .orderBy("timestamp", "asc")
    );

    const [recipientSnapshot] = useCollection(
        db
            .collection("users")
            .where("email", "==", getRecipientEmail(chat.users, user))
    );

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        id: message.id,
                        photoURL: message.data().photoURL,
                        user: message.data().user,
                        message: message.data().message,
                        timestamp: message
                            .data()
                            .timestamp?.toDate()
                            .getTime() as string,
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map(({ id, user, message }) => (
                <Message key={id} user={user} message={message} />
            ));
        }
    };

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end"
        })
    }

    const sendMessage = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        db.collection("users").doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
        db.collection("chats")
            .doc(router.query.id as string)
            .collection("messages")
            .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                user: user.email,
                photoURL: user.photoURL,
            }).then(() => {
                setInput("");
                scrollToBottom()        
            });
    };

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
                {
                    recipient ? (
                        <Avatar src={recipient.photoURL} />
                    ) : (
                        <Avatar>{recipientEmail[0]}</Avatar>
                    )
                }

                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>
                            Last Active: {" "}
                            
                                {recipient?.lastSeen?.toDate() ? (
                                    <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                                ) : "Unavailable"}                            
                        </p>
                    ): (
                        <p>Loading last active...</p>
                    )}
                </HeaderInformation>

                <HeaderIcons>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef} />
            </MessageContainer>

            <InputContainer>
                <InsertEmoticon />
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button hidden disabled={!input} onClick={sendMessage}>
                    Send Message
                </button>
                <Mic />
            </InputContainer>
        </Container>
    );
};

export default ChatScreen;

const Container = styled.div``;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 0;
    }

    > p {
        margin-top: 3px ;
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 80vh;
    max-height: 80vh;
    overflow-y: auto;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;
