import React from "react"

import default_profile from "../../assets/noImage-1.svg"
import Avatar from "../../assets/avatar.png"
import Admin from "../../assets/admin.png"

export default function Contact({ dataContact, clickContact, contact, user }) {
  dataContact = dataContact?.filter((item) => {
    return item.id !== user?.id
  })
  return (
    <>
      {dataContact.length > 0 && (
        <>
          {dataContact.map((item) => (
            <div
              key={item.id}
              className={`contact mt-3 p-2 ${
                contact?.id === item?.id && "contact-active"
              }`}
              onClick={() => {
                clickContact(item)
              }}
            >
              <img
                src={item.listAs === 1 ? Admin : Avatar}
                className="rounded-circle me-2 img-contact"
                alt="user avatar"
              />
              <div className="ps-1 ml-2 text-contact d-flex flex-column justify-content-around">
                <p className="mb-0 light-color">
                  <strong>{item.fullName}</strong>
                </p>
                <p className="text-contact-chat mt-1 mb-0">{item.message}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}
