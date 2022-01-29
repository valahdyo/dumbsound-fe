import React, { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import NavbarComponent from "../components/Navbar"
import { Container, Row, Col } from "react-bootstrap"
import { io } from "socket.io-client"
import Contact from "../components/Chat/Contact"
import Message from "../components/Chat/Message"

let socket
export default function ChatAdmin() {
  const [contact, setContact] = useState(null)
  const [contacts, setContacts] = useState([])
  // create messages state
  const [messages, setMessages] = useState([])

  // consume user context
  const [state] = useContext(AuthContext)

  useEffect(() => {
    socket = io(process.env.REACT_APP_SERVERURL || "http://localhost:5000", {
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("accessToken"),
      },
      query: {
        id: state.user.id,
      },
    })

    // define listener for every updated message
    socket.on("new message", () => {
      console.log("contact", contact)
      socket.emit("load messages", contact?.id)
    })

    loadContacts()
    loadMessages()

    return () => {
      socket.disconnect()
    }
  }, [messages])

  const loadContacts = () => {
    socket.emit("load customer contacts")
    socket.on("customer contacts", (data) => {
      // filter just customers which have sent a message
      let dataContacts = data.filter(
        (item) =>
          item.listAs !== 1 &&
          (item.recipientMessage.length > 0 || item.senderMessage.length > 0)
      )

      // manipulate customers to add message property with the newest message
      dataContacts = dataContacts.map((item) => ({
        ...item,
        message:
          item.senderMessage.length > 0
            ? item.senderMessage[item.senderMessage.length - 1].message
            : "Click here to start message",
      }))
      setContacts(dataContacts)
    })
  }

  // used for active style when click contact
  const onClickContact = (data) => {
    setContact(data)
    // emit event load messages
    socket.emit("load messages", data.id)
  }

  const loadMessages = () => {
    // define event listener for "messages"
    socket.on("messages", (data) => {
      // get data messages
      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message,
        }))
        setMessages(dataMessages)
      }
      loadContacts()
      const chatMessagesElm = document.getElementById("chat-messages")
      chatMessagesElm.scrollTop = chatMessagesElm?.scrollHeight
    })
  }

  const onSendMessage = (e) => {
    // listen only enter key event press
    if (e.key === "Enter") {
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      }

      //emit event send message
      socket.emit("send message", data)
      e.target.value = ""
    }
  }

  return (
    <>
      <NavbarComponent shadow={true} />
      <Container fluid style={{ height: "89.5vh" }}>
        <Row>
          <Col
            md={3}
            style={{ height: "89.5vh" }}
            className="px-3 border-end border-dark overflow-auto"
          >
            <Contact
              dataContact={contacts}
              clickContact={onClickContact}
              contact={contact}
            />
          </Col>
          <Col md={9} style={{ maxHeight: "89.5vh" }} className="px-0">
            <Message
              contact={contact}
              messages={messages}
              user={state.user}
              sendMessage={onSendMessage}
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}
