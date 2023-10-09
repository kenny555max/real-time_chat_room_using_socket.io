import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

let socket;

const Chat = ({ isLoggedIn, username, room }) => {
    const ENDPOINT = 'http://localhost:5000';
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        // Create the socket and console log only once
        socket = io(ENDPOINT);
        console.log(socket);

        // Clean up the socket when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []); // Empty dependency array to run this effect only once

     useEffect(() => {
        socket.emit('connected', { name: username, room });
     }, [username, room]);
    
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages(([...messages, message]));
        })
    }, [messages]);
    
    const onChange = (e) => {
        socket.emit('messaging', { name: username, room });

        setMessage(e.target.value);
    }

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            //scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sendMessage = () => {
        if (message === '') return;

        socket.emit('sendMessage', { name: username, room, message });

        // Call scrollToBottom when the component mounts or whenever you need to scroll to the bottom
        scrollToBottom();

        setMessage('');
    }

    return (
        <div className="chat">
            <div className="chat_header">
                <div className="online">
                    <div className="online_dot"></div>
                    <div className="room_name">
                        <p>{room}</p>
                    </div>
                </div>
                <div className="close_room">x</div>
            </div>
            <div className="chat_message_body" ref={scrollRef}>
                {messages.map((message, index) => {
                    return (
                        <div key={index} className={message.user !== username ? 'inbox' : 'outbox'}>
                            <h6>
                                <span className="message">{message.text}</span>
                                <span className="user">{message.user}</span>
                            </h6>
                        </div>
                    )
                })}
            </div>
            <div className="chat_footer_send_message">
                <div className="input_message">
                    <input
                        type="text"
                        value={message}
                        onChange={onChange}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message............." />
                </div>
                <div className="button">
                    <button type="button" onClick={() => sendMessage()}>send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat;