'use client'
// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { MenuItem } from '@mui/material'

// Vars
const initialData = {
  recommendedPrice: ''
}

const AddDbDumpDrawer = props => {
  const { open, handleClose, itemDetails, onDataUpdated } = props

  const [formData, setFormData] = useState(initialData)
  const [isEditing, setEditing] = useState(false)
  const [customers, setCustomers] = useState([])
  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      customerId: '',
      contentDescription: '',
      industry: '',
      rows: 0,
      sizeKb: 0,
      filePath: ''
    }
  })

  useEffect(() => {
    if (itemDetails) {
      setValue('contentDescription', itemDetails.contentDescription || '')
      setValue('industry', itemDetails.industry || '')
      setValue('rows', itemDetails.rows || 0)
      setValue('sizeKb', itemDetails.sizeKb || 0)
      setValue('filePath', itemDetails.filePath || '')
      setValue('customerId', itemDetails.customerId || '') // If customerId is available
      setEditing(true)
      console.log(itemDetails)
    } else {
      resetForm({
        customerId: '',
        contentDescription: '',
        industry: '',
        rows: 0,
        sizeKb: 0,
        filePath: ''
      })
      setFormData(initialData)
      setEditing(false)
    }
  }, [itemDetails])

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `api/customers`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
            Accept: '*/*'
          }
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch eCommerce data: ${res.status} ${res.statusText}`)
        }
        const result = await res.json()
        // if (res.statusCode === 200) {
        setCustomers(result.data || [])
        // }
      } catch (error) {
        console.error('Error fetching Customers:', error)
      }
    }

    fetchCustomers()
  }, [])

  const onSubmit = async data => {
    const timestamp = new Date().toISOString()
    const payload = {
      // customerId: data.customerId,
      contentDescription: data.contentDescription,
      industry: data.industry,
      rows: Number(data.rows),
      sizeKb: Number(data.sizeKb),
      filePath: data.filePath,
      createdAt: isEditing ? itemDetails.createdAt : timestamp,
      updatedAt: timestamp
    }
    if (!isEditing) {
      payload.customerId = data.customerId
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/db-dumps/${itemDetails.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/db-dumps`

      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
          Accept: '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (result.message) {
        onDataUpdated()
      }
      console.log(`${isEditing ? 'Update' : 'Create'} Response:`, result)
    } catch (error) {
      console.error('API Error:', error)
    }

    console.log('Payload:', payload)
    handleClose()
    resetForm()
    setFormData(initialData)
  }

  const handleReset = () => {
    handleClose()
    resetForm()
    setFormData(initialData)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-6 plb-5'>
        <Typography variant='h5'>{isEditing ? 'Edit DB Dump' : 'Add DB Dump'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <div className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Typography color='text.primary' className='font-medium mt-4'>
              Db Dump Details
            </Typography>

            <Controller
              name='contentDescription'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Content Description'
                  placeholder='e.g., Product details, customer info'
                  {...(errors.contentDescription && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='industry'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Industry'
                  placeholder='e.g., Retail, Finance'
                  {...(errors.industry && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='rows'
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='number'
                  fullWidth
                  label='Row Count'
                  placeholder='e.g., 10000'
                  {...(errors.rows && { error: true, helperText: 'Enter a valid number.' })}
                />
              )}
            />

            <Controller
              name='sizeKb'
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='number'
                  fullWidth
                  label='Size (KB)'
                  placeholder='e.g., 2048'
                  {...(errors.sizeKb && { error: true, helperText: 'Enter a valid size in KB.' })}
                />
              )}
            />

            <Controller
              name='filePath'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='File Path or URL'
                  placeholder='e.g., /uploads/db-dump.sql or https://example.com'
                  {...(errors.filePath && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            {!isEditing && (
              <Controller
                name='customerId'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Select Customer'
                    {...(errors.customerId && { error: true, helperText: 'This field is required.' })}
                  >
                    {customers.map(customer => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            )}

            <div className='flex items-center gap-4'>
              <Button variant='contained' type='submit'>
                {isEditing ? 'Update' : 'Add'}
              </Button>
              <Button variant='tonal' color='error' type='reset' onClick={handleReset}>
                Discard
              </Button>
            </div>
          </form>
        </div>
      </PerfectScrollbar>
    </Drawer>
  )
}

export default AddDbDumpDrawer
