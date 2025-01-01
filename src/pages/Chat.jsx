import React, { useEffect, useState } from 'react';
import "./message.css";
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";

// Problem --> Blandet sending og receiving når det kommer til send og get
// I send skal receivingUsername være den den user som det skal bli sendt til
// I get message skal det receiverUsername være sendToUsername. Receiver er ikke den som har token men den som har grå messages
export default function Chat(props) {

  const sendToUsername = "Gustavo"; // change to NS solutions

  const [messages, setMessages] = useState([]);

  const [sendingMessages, setSendingMessages] = useState([]);

  const [receivingMessages, setReceivingMessages] = useState([]);

  const [messageContent, setMessageContent] = useState("");

  const [pageNumber, setPageNumber] = useState(0);

  const [loading, setLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const [goToBottom, setGoToBottom] = useState(false);

  const navigate = useNavigate();

  
  const fetchMessages = async () => {
    if (loading) return;
    setLoading(true);

    try {                                                   // SenderUsername er feil tror jeg, burde være receiver, det vil stemme å si at gustavo er receiver
      const response = await fetch(`${props.API_URL}/api/lim-messages/related?page=${pageNumber}&size=${25}&receiverUsername=${sendToUsername}`, { 
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
      });

        if (response.ok) {
            const data = await response.json();

            if (Array.isArray(data.messages) && data.messages.length > 0) {
                setMessages(prevMessages => {
                    const allMessages = [...data.messages, ...prevMessages];

                    // Remove duplicates based on a unique message identifier (e.g., `id`)
                    return Array.from(new Set(allMessages.map(msg => msg.id))).map(
                        id => allMessages.find(msg => msg.id === id)
                    );
                });

                // Append to receiving and sending messages
                setReceivingMessages(prevReceiving => {
                  const allReceiving = [
                      ...prevReceiving,
                      ...data.messages.filter(message => message.receiver.username.toLowerCase() !== sendToUsername.toLowerCase()),
                  ];
                  return Array.from(new Set(allReceiving.map(msg => msg.id))).map(
                      id => allReceiving.find(msg => msg.id === id)
                  );
              });

                setSendingMessages(prevSending => {
                    const allSending = [
                        ...prevSending,
                        ...data.messages.filter(message => message.receiver.username.toLowerCase() === sendToUsername.toLowerCase()),
                    ];
                    return Array.from(new Set(allSending.map(msg => msg.id))).map(
                        id => allSending.find(msg => msg.id === id)
                    );
                });
            } else {
                setHasMore(false);
            }
        } else {
            console.error("Failed to fetch messages. HTTP status:", response.status);
        }
    } catch (error) {
        console.error("Error fetching messages:", error.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    // Call fetchMessages immediately when pageNumber changes
    fetchMessages();
  
    // Set up an interval to call fetchMessages every 5000 milliseconds
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 10000);
  
    // Cleanup interval when pageNumber changes or component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [pageNumber]); // This will run when pageNumber changes

  const fetchMoreData = () => { // receiving messages er de som har wagen som sender
    if (hasMore && !loading) {
      setPageNumber(prevPageNumber => prevPageNumber + 1);
    }
  }

  const handleSubmit = async (e) => {
    if (messageContent === "") return;
    e.preventDefault();
  
    try {
      const response = await fetch(`${props.API_URL}/api/message/send?receiverUsername=${sendToUsername}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: messageContent }),
      });
      if (response.ok) {
        const data = await response.json();
        setMessages([data, ...messages]); // Add new message to the start
        setSendingMessages([data, ...sendingMessages]); // Update sendingMessages
        setMessageContent("");
        setGoToBottom(prev => !prev);
      }
    } catch (error) {
      console.error(error.message);  // Next --> ...data, ...prev !!!!!!!!!!!!!!!!!!!!!!!! For correct order kanskje    Se last chat
    }
  };

  useEffect(() => {
    const scrollableDiv = document.getElementById('scrollableDiv');
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight; // Scroll to the bottom
    }
  }, [goToBottom]); // Run this effect whenever the messages array updates

  const deleteMessage = async (id) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`${props.API_URL}/api/message/delete?id=${id}`, {
        method:"DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }


  return ( // Keep functionality unchanged
    <>
    <div id="main-container">
      <div className="chat-container">
        <div className="chat-header">Kontakt oss</div>
        <div id="scrollableDiv" className="chat-messages-container dark:bg-black">
          <InfiniteScroll
            id="infscroll"
            dataLength={messages.length}
            next={fetchMoreData}
            hasMore={hasMore}
            inverse={true} // Loads more messages when scrolling to top
            scrollableTarget="scrollableDiv"
          >
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.receiver.username.toLowerCase() === sendToUsername.toLowerCase()
                      ? "sent"
                      : "received"
                  }`}
                >
                  {message.content}
                  {message.receiver.username.toLowerCase() === sendToUsername.toLowerCase() && (
                    <button id="del-message-btn" className="delete-btn" onClick={() => deleteMessage(message.id)}>Slett</button> 
                  )}
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>
        <form onSubmit={handleSubmit} className="chat-input-container dark:bg-black">
          <input
          className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          placeholder="Skriv en melding"
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          />
          <button type="submit" className="chat-input-button">Send</button>
        </form>
      </div>
    </div>
    </>
  );
};