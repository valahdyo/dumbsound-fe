import { useState, useMemo } from "react"
import { useTable, useFilters, useSortBy } from "react-table"
import { Table, Dropdown, Container } from "react-bootstrap"
import { API } from "../config/api"
import { useQuery } from "react-query"
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"

import ToggleDropdown from "../assets/Polygon-2.png"

export default function ListTransaction() {
  const [filterInput, setFilterInput] = useState("")
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
  // const tabledata = useMemo(
  //   () => [
  //     {
  //       Header: "No",
  //       accessor: "id",
  //     },
  //     {
  //       Header: "User",
  //       accessor: "user.fullName",
  //     },
  //     {
  //       Header: "Bukti Transfer",
  //       accessor: "attache",
  //     },
  //     {
  //       Header: "Remaining Active",
  //       accessor: "startDate",
  //     },
  //     {
  //       Header: "Status User",
  //       accessor: "user.subscribe",
  //     },
  //     {
  //       Header: "Status Payment",
  //       accessor: "status",
  //     },
  //     {
  //       Header: "Action",
  //       accessor: "status",
  //     },
  //   ],
  //   []
  // )

  const columns = useMemo(
    () => [
      {
        Header: "No",
        accessor: "id", // accessor is the "key" in the data
        Cell: ({ row }) => <th>{row.index + 1}</th>,
        maxWidth: 70,
        minWidth: 50,
        width: 50,
      },
      {
        Header: "User",
        accessor: "user.fullName",
        Cell: ({ row }) => <th>{row.original.user.fullName}</th>,
      },
      {
        Header: "Bukti Transfer",
        accessor: "attache",
        Cell: ({ row }) => {
          let proof = String(row.original.attache).substring(86)
          return (
            <>
              <th>
                <a
                  className="text-decoration-none light-color"
                  target="blank"
                  href={row.original.attache}
                >
                  {proof}
                </a>
              </th>
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
            <th>
              {" "}
              {row.original?.dueDate
                ? parseInt(day) + " / Hari"
                : "0 / Hari"}{" "}
            </th>
          )
        },
      },
      {
        Header: "Status User",
        accessor: "user.subscribe",
        Cell: ({ row }) => {
          let status = row.original.user?.subscribe
          if (status === 1) {
            return <th style={{ color: "#0ACF83" }}>Active</th>
          } else {
            return <th style={{ color: "#FF0742" }}>Not Active</th>
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
                <th style={{ color: "#F7941E" }}>{row.original.status}</th>
              ) : row.original.status === "Approve" ? (
                <th style={{ color: "#0ACF83" }}>{row.original.status}</th>
              ) : (
                <th style={{ color: "#FF0742" }}>{row.original.status}</th>
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable({ columns, data }, useFilters, useSortBy)

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined
    setFilter("user.fullName", value)
    setFilterInput(value)
  }
  /**
   * Approve transaction and request to backend for change transaction and user status
   * @param {int} idTransaction transaction id
   */
  const handleApprove = async (idTransaction) => {
    try {
      console.log(idTransaction)
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
        <input
          className="mb-3 input-filter"
          value={filterInput}
          onChange={handleFilterChange}
          placeholder=" Search user"
        />
        <Table
          striped
          hover
          variant="dark"
          className="ff-roboto fw-400 f-14 align-middle"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                style={{ height: "80px" }}
                className={"red-color align-middle"}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.id !== "actionColumn" &&
                      column.id !== "user.fullName" ? (
                        column.isSorted ? (
                          column.isSortedDesc ? (
                            <FaSortUp className="ms-3" />
                          ) : (
                            <FaSortDown className="ms-3" />
                          )
                        ) : (
                          <FaSort className="ms-3" />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <tr style={{ height: "80px" }} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <>
                        <td
                          {...cell.getCellProps({
                            style: {
                              minWidth: cell.column.minWidth,
                              width: cell.column.width,
                            },
                          })}
                        >
                          {cell.render("Cell")}
                        </td>
                      </>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </Table>
        {/* <Table
          striped
          hover
          variant="dark"
          className="ff-roboto fw-400 f-14 align-middle"
          {...getTableProps()}
        >
          <thead style={{ height: "80px" }}>
            {/* <tr className="red-color align-middle">
              <th>No</th>
              <th>User</th>
              <th>Bukti Transfer</th>
              <th>Remaining Active</th>
              <th>Status User</th>
              <th>Status Payment</th>
              <th>Action</th>
            </tr> 
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
        </Table> */}
      </Container>
    </>
  )
}
