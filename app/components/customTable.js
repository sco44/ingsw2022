import { useEffect, useState, useRef } from "react";
import { useTable, usePagination, useBlockLayout, useRowSelect } from 'react-table';

function EditableCell({ value: initialValue, row: { index }, column: { id }, state: { selectedRowIds }, selectedFlatRows, updateMyData }) {

  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)
  const [dirty, setDirty] = useState(false)
  const [originalVal, setOriginalVal] = useState('');

  useEffect(() => {
    if (selectedFlatRows.toString() && selectedFlatRows[0]['index'] === index) {
      setOriginalVal(selectedFlatRows[0]['original'][id])
    }
    else {
      setOriginalVal('')
    }
  }, [selectedFlatRows, index, id])

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const onChange = e => {
    setValue(e.target.value)
    setDirty(true)
  }
  const _setDirtyFalse = () => {setDirty(false)}

    if (selectedRowIds[index]) {
      switch (id.toString()) {
        case 'punti':
          return <div className="input-group">
          <input
          type="number"
            className="input-group-text w-75"
            value={value} onChange={onChange} />
          </div>
        case 'nome':
        default:
          return <div className="input-group">
          <input
            className="input-group-text"
            value={value} onChange={onChange} />
          </div>

      }
    }
    else {
      if (dirty && value !== initialValue) {
        updateMyData(index, id, value)
        console.log(`index: ${index}, accessorId: ${id}, value: ${value}, initialValue: ${initialValue}`)
        _setDirtyFalse();
      }
      switch (id.toString()) {
        default:
          return <>{value}</>
      }
    }
}
  
  // Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
    Cell: EditableCell,
    minWidth: 40,
    width: 190,
    maxWidth: 450,
}
  
export function CustomTable({ columns, data, updateMyData, skipPageReset, handleDelete, }) {
    const [customTable, _setCustomTable] = useState(false);
    const customTableRef = useRef(false)
    const defaultPageSize = 14;
  
    const setCustomTable = (fn) => {
      customTableRef.current = fn(customTableRef.current)
      _setCustomTable(customTableRef.current)
    }
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      selectedFlatRows,
      state: { pageIndex, pageSize, selectedRowIds },
      toggleAllRowsSelected
    } = useTable(
      {
        columns,
        data,
        initialState: { pageSize: defaultPageSize },
        defaultColumn,
        // use the skipPageReset option to disable page resetting temporarily
        autoResetPage: !skipPageReset,
        // updateMyData isn't part of the API, but
        // anything we put into these options will
        // automatically be available on the instance.
        // That way we can call this function from our
        // cell renderer!
        updateMyData,
        handleDelete,
  
      },
      usePagination,
      // useResizeColumns,
      useRowSelect,
      useBlockLayout,
      hooks => {
        hooks.visibleColumns.push(columns => [
          ...columns,
          {
            id: 'selection',
            Header: 'edit',
            Cell: ({ row }) => (
              <button type="button" className="btn btn-outline-primary"
                {...row.getToggleRowSelectedProps({
                  onClick: () => {
                    toggleAllRowsSelected(false)
                    row.toggleRowSelected(!row.isSelected);
                  },
                  title: 'Edit',
                  indeterminate: "false"
                })}>
                  edit
              </button>
            ),
            width: 90
          },
          // {
          //   id: 'del',
          //   Header: 'Del',
          //   Cell: ({ row, handleDelete }) =>{
          //     return(
          //     <button type="button" className="btn btn-outline-danger" disabled={customTableRef.current} data-index={row.index} data-id={row.values.id} onClickCapture={handleDelete} >X
          //     </button>
          // )},
          //   width: 70
          // },
        ])
      }
    )
  
    useEffect(()=>{
      if(Object.values(selectedRowIds).length === 0)
      setCustomTable(() => false)
      else
        setCustomTable(() => true)
    },[selectedRowIds])
  
    // Render the UI for your table
    return (
      <>
        <div className="">
          <table hoverable striped {...getTableProps()} className="table table-bordered">
            <thead>
              {headerGroups.map((headerGroup, i) => (
                <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                  <th colSpan="1" role="columnheader" style={{ position: 'relative', display: 'inline-block', boxSizing: 'border-box', width: 65 }}>#</th>
                  {headerGroup.headers.map((column, i) => (
                    <th key={i} {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <tr key={i} {...row.getRowProps()}>
                    <td role="cell" style={{ display: 'inline-block', boxSizing: 'border-box', width: 65 }}>{(pageIndex * pageSize) + i + 1}</td>
                    {row.cells.map((cell, i) => {
                      return <td key={i} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-around">
          <div className=" d-flex justify-content-center">
          <button type="button" className="btn btn-outline-primary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button type="button" className="btn btn-outline-primary" onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button type="button" className="btn btn-outline-primary" onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button type="button" className="btn btn-outline-primary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          </div>
          <span>Page{' '}<strong>{pageIndex + 1} of {pageOptions.length} -- Total count: {page.length}</strong>{' '}</span>
          <div className="d-flex justify-content-center">
          <span>Page:</span>
          
          <div className="d-flex justify-content-center">
            <select className="form-select" value={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
            >
              {new Array(parseInt(pageOptions.length)).fill().map((el, i) =>
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              )}
            </select>
          </div>
          <div className="d-flex justify-content-center">
            <select className="form-select" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)) }} >
              {[defaultPageSize, 40].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>))}
            </select>
          </div>
        </div>
        </div>
      </>
    )
  }