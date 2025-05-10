'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import OptionMenu from '@core/components/option-menu'
// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { Chip } from '@mui/material'
import DeleteModal from '@/components/modals/DeleteModal'
import { selectLoader } from '@/utils/Helpers'
import './../../apps/logistics/dashboard/styles.css'
import AddPartnerDrawer from './AddPartnerDrawer'
export const paymentStatus = {
  1: { text: 'Paid', color: 'success' },
  2: { text: 'Pending', color: 'warning' },
  3: { text: 'Cancelled', color: 'secondary' },
  4: { text: 'Failed', color: 'error' }
}
export const statusChipColor = {
  Delivered: { color: 'success' },
  'Out for Delivery': { color: 'primary' },
  'Ready to Pickup': { color: 'info' },
  Dispatched: { color: 'warning' }
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper()

const PartnersList = ({ initialData, loading, onDataUpdated }) => {
  // States
  const [customerUserOpen, setCustomerUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[initialData])
  const [itemDetails, setItemDetails] = useState('')
  const [globalFilter, setGlobalFilter] = useState('')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isDeleting, setDeleting] = useState(false)
  // Hooks
  const { lang: locale } = useParams()

  useEffect(() => {
    setData(...[initialData])
  }, [initialData])

  console.log(initialData)

  const columns = useMemo(
    () => [
      // columnHelper.accessor('id', {
      //   header: 'Unique Company ID',
      //   cell: info => <Typography>{info.getValue()}</Typography>
      // }),
      columnHelper.accessor('name', {
        header: 'Company Name',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('city', {
        header: 'City',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('primaryContact', {
        header: 'Contact Person Name',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('contactEmail', {
        header: 'Contact Email',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('contactPhone', {
        header: 'Contact Mobile Number',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('website', {
        header: 'Company Website',
        cell: info => (
          <Link href={info.getValue()} target='_blank'>
            <Typography className='text-primary underline'>{info.getValue()}</Typography>
          </Link>
        )
      }),
      columnHelper.accessor('createdAt', {
        header: 'Creation Time',
        cell: info => (
          <Typography>
            {new Date(info.getValue()).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </Typography>
        )
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Last Update Time',
        cell: info => (
          <Typography>
            {new Date(info.getValue()).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                setUserToDelete(row.original)
                setConfirmDeleteOpen(true)
              }}
            >
              <i className='tabler-trash text-textSecondary' />
            </IconButton>
            <IconButton
              onClick={() => {
                setItemDetails(row.original)
                setCustomerUserOpen(true)
              }}
            >
              <i className='tabler-edit text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    []
  )

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const getAvatar = params => {
    const { name } = params
    console.log('name:', name)
    return (
      <CustomAvatar skin='light' size={34}>
        {getInitials(name)}
      </CustomAvatar>
    )
  }

  const deleteItem = async itemId => {
    // if (userId) return
    console.log(itemId)

    try {
      setDeleting(true)
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `api/partners/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`, // We'll talk about this below 👇
          Accept: '*/*'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      onDataUpdated(false)
      // After successful delete, remove user from local state
      // setData(prevData => prevData.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Error deleting user:', error)
      // Optionally show a toast or snackbar for error
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      {loading ? (
        <div className='nodata-loader'>{selectLoader(50)}</div>
      ) : (
        <Card>
          <CardContent className='flex justify-between flex-wrap max-sm:flex-col sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search'
              className='max-sm:is-full'
            />
            <div className='flex max-sm:flex-col items-start sm:items-center gap-4 max-sm:is-full'>
              <CustomTextField
                select
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
                className='is-full sm:is-[70px]'
              >
                <MenuItem value='10'>10</MenuItem>
                <MenuItem value='25'>25</MenuItem>
                <MenuItem value='50'>50</MenuItem>
                <MenuItem value='100'>100</MenuItem>
              </CustomTextField>
              <Button
                variant='tonal'
                className='max-sm:is-full'
                color='secondary'
                startIcon={<i className='tabler-upload' />}
              >
                Export
              </Button>
              <Button
                variant='contained'
                color='primary'
                className='max-sm:is-full'
                startIcon={<i className='tabler-plus' />}
                onClick={() => setCustomerUserOpen(!customerUserOpen)}
              >
                Add Partner
              </Button>
            </div>
          </CardContent>
          <div className='overflow-x-auto'>
            <table className={tableStyles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              className={classnames({
                                'flex items-center': header.column.getIsSorted(),
                                'cursor-pointer select-none': header.column.getCanSort()
                              })}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: <i className='tabler-chevron-up text-xl' />,
                                desc: <i className='tabler-chevron-down text-xl' />
                              }[header.column.getIsSorted()] ?? null}
                            </div>
                          </>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {table.getFilteredRowModel().rows.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      No data available
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table
                    .getRowModel()
                    .rows.slice(0, table.getState().pagination.pageSize)
                    .map(row => {
                      return (
                        <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                          ))}
                        </tr>
                      )
                    })}
                </tbody>
              )}
            </table>
          </div>
          <TablePagination
            component={() => <TablePaginationComponent table={table} />}
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, page) => {
              table.setPageIndex(page)
            }}
          />
        </Card>
      )}
      <AddPartnerDrawer
        open={customerUserOpen}
        handleClose={() => {
          setCustomerUserOpen(false)
          setItemDetails('')
        }}
        // setItemDetails={setItemDetails}
        onDataUpdated={onDataUpdated}
        itemDetails={itemDetails}
      />
      <DeleteModal
        open={confirmDeleteOpen}
        title='Delete Item'
        description='Are you sure you want to delete this item?'
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={async () => {
          if (userToDelete) {
            await deleteItem(userToDelete.id)
            setUserToDelete(null)
            setConfirmDeleteOpen(false)
          }
        }}
        confirmText='Delete'
        cancelText='Cancel'
        loading={isDeleting}
      />
    </>
  )
}

export default PartnersList
