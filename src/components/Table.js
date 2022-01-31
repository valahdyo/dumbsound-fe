import { useState } from "react"
import { useTable, useFilters, useSortBy } from "react-table"
import { Table } from "react-bootstrap"
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"

export default function TableComponent({ columns, data }) {
  const [filterInput, setFilterInput] = useState("")
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

  return (
    <>
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
                    column.id !== "user.fullName" &&
                    column.id !== "attache" ? (
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
    </>
  )
}
