import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {

  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      "message": "Hi there! How can I help?",
      "type": "apiMessage"
    }
  ]);

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    //const messageList = messageListRef.current;
   // messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    //textAreaRef.current.focus();
  }, []);

  // Handle errors
  const handleError = () => {
    setMessages((prevMessages) => [...prevMessages, { "message": "Oops! There seems to be an error. Please try again.", "type": "apiMessage" }]);
    setLoading(false);
    setUserInput("");
  }

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { "message": userInput, "type": "userMessage" }]);

    // Send user question and history to API
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: userInput, history: history }),
    });

    if (!response.ok) {
      handleError();
      return;
  }

    // Reset user input
    setUserInput("");
    const data = await response.json();

    if (data.result.error === "Unauthorized") {
      handleError();
      return;
    }

    setMessages((prevMessages) => [...prevMessages, { "message": data.result.success, "type": "apiMessage" }]);
    setLoading(false);
    
  };

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if(!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Keep history in sync with messages
  useEffect(() => {
    if (messages.length >= 3) {
      setHistory([[messages[messages.length - 2].message, messages[messages.length - 1].message]]);
    }
    }, [messages])

  return (
    <>
      <Head>
        <title>PIXSELLS</title>
        <meta name="description" content="LangChain documentation chatbot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.topnav}>
      
    <div className = {styles.navlinks}>
    <a href="" target="_blank">
  <img className={styles.image}  src="logotwitter.png" alt="Image Description" />
</a>
    </div>
</div>
      <main className={styles.main}>
      <img src="logo.png" alt="logo" style={{ marginTop: '-28%' }} />
      <p style={{ marginTop: '2%', fontFamily: 'Lato, sans-serif', color: '#00303B', fontSize: '80px' }}>pixsells</p>
      <p style={{ marginTop: '2%', fontFamily: 'Lato, sans-serif',fontWeight: '300',color: '#00303B', fontSize: '60px' }}>Breaking NFTs into Pixels</p>
      <p style={{ marginBottom: '4.9%', fontFamily: 'Lato, sans-serif',fontWeight: '300', color: '#00303B', fontSize: '60px' }}>Unleash Infinite Possibilities.</p>


         
      </main>
    </>
  )
}
