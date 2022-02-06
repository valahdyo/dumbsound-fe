import { useState, useMemo } from "react"

import { Container, Dropdown } from "react-bootstrap"
import { API } from "../config/api"
import { useQuery } from "react-query"

import ToggleDropdown from "../assets/Polygon-2.png"
import TableComponent from "./Table"

export default function ListTransaction() {
  const [data, setData] = useState([])
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
      let response = await API.get("/transaction")
      setData(response.data.data)

      return response.data.data
    }
  )

  const columns = useMemo(
    () => [
      {
        Header: "No",
        accessor: "id", // accessor is the "key" in the data
        Cell: ({ row }) => row.index + 1,
        maxWidth: 70,
        minWidth: 50,
        width: 50,
      },
      {
        Header: "User",
        accessor: "user.fullName",
        Cell: ({ row }) => row.original.user.fullName,
      },
      {
        Header: "Bukti Transfer",
        accessor: "attache",
        disableSortBy: true,
        Cell: ({ row }) => {
          let proof = String(row.original.attache).substring(86)
          return (
            <>
              <a
                className="text-decoration-none light-color"
                target="blank"
                href={row.original.attache}
              >
                {proof}
              </a>
            </>
          )
        },
      },
      {
        Header: "Remaining Active",
        accessor: "dueDate",
        Cell: ({ row }) => {
          let inMs = new Date(row.original?.dueDate) - new Date()
          let day = inMs / (1000 * 60 * 60 * 24)

          if (parseInt(day) <= 0 && row.original?.dueDate !== null) {
            handleUpdateStatus(row.original.id)
          }
          return (
            <>
              {" "}
              {row.original?.dueDate
                ? parseInt(day) + " / Hari"
                : "0 / Hari"}{" "}
            </>
          )
        },
      },
      {
        Header: "Status User",
        accessor: "user.subscribe",
        Cell: ({ row }) => {
          let status = row.original.user?.subscribe
          if (status === 1) {
            return <span style={{ color: "#0ACF83" }}>Active</span>
          } else {
            return <span style={{ color: "#FF0742" }}>Not Active</span>
          }
        },
      },
      {
        Header: "Status Payment",
        accessor: "status",
        Cell: ({ row }) => {
          return (
            <>
              {row.original.status === "Pending" ? (
                <span style={{ color: "#F7941E" }}>{row.original.status}</span>
              ) : row.original.status === "Approve" ? (
                <span style={{ color: "#0ACF83" }}>{row.original.status}</span>
              ) : (
                <span style={{ color: "#FF0742" }}>{row.original.status}</span>
              )}
            </>
          )
        },
      },
      {
        Header: "Action",
        accessor: "actionColumn",
        disableSortBy: true,
        maxWidth: 70,
        minWidth: 50,
        width: 60,
        Cell: ({ row }) => (
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              <img src={ToggleDropdown} alt="icon" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="bg-dropdown-color dropdown-menu-admin">
              <Dropdown.Item
                style={{ color: "#0ACF83" }}
                href="#/action-2"
                onClick={() => handleApprove(row.original.id)}
              >
                Approve
              </Dropdown.Item>
              <Dropdown.Item
                style={{ color: "#FF0000" }}
                href="#/action-3"
                onClick={() => handleCancel(row.original.id)}
              >
                Cancel
              </Dropdown.Item>
              <Dropdown.Item
                style={{ color: "gray" }}
                href="#/action-4"
                onClick={() => handleDelete(row.original.id)}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ),
      },
    ],
    []
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
        <TableComponent columns={columns} data={data} />
      </Container>
    </>
  )
}
