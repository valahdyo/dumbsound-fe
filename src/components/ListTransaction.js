import { Table, Dropdown, Container } from "react-bootstrap"
import { API } from "../config/api"
import { useQuery } from "react-query"

import ToggleDropdown from "../assets/Polygon-2.png"

export default function ListTransaction() {
  /**
   * Fetching transaction list from database
   */
  let { data: transactions, refetch } = useQuery(
    "transactionsCache",
    async () => {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      }
      const response = await API.get("/transaction")
      return response.data.data
    }
  )

  /**
   * Approve transaction and request to backend for change transaction and user status
   * @param {int} idTransaction transaction id
   */
  const handleApprove = async (idTransaction) => {
    try {
      const response = await API.patch("/transaction/approve/" + idTransaction)
      if (response?.status === 200) {
        refetch()
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Cancel transaction and request to backend for change transaction and user status
   * @param {int} idTransaction transaction id
   */
  const handleCancel = async (idTransaction) => {
    try {
      const response = await API.patch("/transaction/cancel/" + idTransaction)
      if (response?.status === 200) {
        refetch()
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Delete transaction and request to backend for change transaction and user status
   * @param {int} idTransaction transaction id
   */
  const handleDelete = async (idTransaction) => {
    try {
      const response = await API.delete("/transaction/delete/" + idTransaction)
      if (response?.status === 200) {
        refetch()
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Update user subscription if expired
   * @param {int} idTransaction transaction id
   */
  const handleUpdateStatus = async (idTransaction) => {
    try {
      const response = await API.patch("/transaction/update/" + idTransaction)
      if (response?.status === 200) {
        refetch()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Container className="mt-4">
        <div className="mb-4 ff-avenir fw-800 h3" style={{ color: "white" }}>
          Incoming Transaction
        </div>
        <Table
          striped
          hover
          variant="dark"
          className="ff-roboto fw-400 f-14 align-middle"
        >
          <thead style={{ height: "80px" }}>
            <tr className="red-color align-middle">
              <th>No</th>
              <th>User</th>
              <th>Bukti Transfer</th>
              <th>Remaining Active</th>
              <th>Status User</th>
              <th>Status Payment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((item, index) => {
              let inMs = new Date(item?.dueDate) - new Date()
              let day = inMs / (1000 * 60 * 60 * 24)

              if (parseInt(day) <= 0 && item?.dueDate !== null) {
                handleUpdateStatus(item.id)
              }
              let proof = String(item.attache)
              return (
                <tr key={index} style={{ height: "80px" }}>
                  <th>{index + 1}</th>
                  <th>{item.user.fullName}</th>
                  <th>
                    <a
                      className="text-decoration-none light-color"
                      target="blank"
                      href={item.attache}
                    >
                      {proof.substring(86)}
                    </a>
                  </th>
                  <th>{item?.dueDate ? parseInt(day) : "0"} / Hari</th>
                  {item.user.subscribe === 0 ? (
                    <th style={{ color: "#FF0742" }}>Not Active</th>
                  ) : (
                    <th style={{ color: "#0ACF83" }}>Active</th>
                  )}
                  {item.status === "Pending" ? (
                    <th style={{ color: "#F7941E" }}>{item.status}</th>
                  ) : item.status === "Approve" ? (
                    <th style={{ color: "#0ACF83" }}>{item.status}</th>
                  ) : (
                    <th style={{ color: "#FF0742" }}>{item.status}</th>
                  )}
                  <th style={{ width: "5%" }}>
                    <Dropdown>
                      <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        <img src={ToggleDropdown} alt="icon" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="bg-dropdown-color dropdown-menu-admin">
                        <Dropdown.Item
                          style={{ color: "#0ACF83" }}
                          href="#/action-2"
                          onClick={() => handleApprove(item.id)}
                        >
                          Approve
                        </Dropdown.Item>
                        <Dropdown.Item
                          style={{ color: "#FF0000" }}
                          href="#/action-3"
                          onClick={() => handleCancel(item.id)}
                        >
                          Cancel
                        </Dropdown.Item>
                        <Dropdown.Item
                          style={{ color: "gray" }}
                          href="#/action-4"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </th>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Container>
    </>
  )
}
