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

const AddDiscoveryDBDrawer = props => {
  const { open, handleClose, itemDetails, onDataUpdated } = props

  const [formData, setFormData] = useState(initialData)
  const [isEditing, setEditing] = useState(false)
  const [scanSessions, setScanSessions] = useState([])
  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      scanSessionId: '',
      discoveryType: '',
      severity: '',
      description: '',
      tableName: '',
      columnName: '',
      data: '',
      detectedAt: new Date().toISOString()
    }
  })

  useEffect(() => {
    if (itemDetails) {
      setValue('discoveryType', itemDetails.discoveryType || '')
      setValue('severity', itemDetails.severity || '')
      setValue('description', itemDetails.description || '')
      setValue('tableName', itemDetails.tableName || '')
      setValue('columnName', itemDetails.columnName || '')
      setValue('data', itemDetails.data || '')
      setValue('detectedAt', itemDetails.detectedAt || new Date().toISOString())
      // setValue('scanSessionId', itemDetails.scanSessionId || '')
      setEditing(true)
      console.log(itemDetails)
    } else {
      resetForm({
        scanSessionId: '',
        discoveryType: '',
        severity: '',
        description: '',
        tableName: '',
        columnName: '',
        data: '',
        detectedAt: new Date().toISOString()
      })
      setFormData(initialData)
      setEditing(false)
    }
  }, [itemDetails])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `api/scan`, {
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
        setScanSessions(result.data || [])
        // }
      } catch (error) {
        console.error('Error fetching Customers:', error)
      }
    }

    fetchData()
  }, [])

  const onSubmit = async data => {
    const payload = {
      discoveryType: data.discoveryType,
      severity: data.severity,
      description: data.description,
      tableName: data.tableName,
      columnName: data.columnName,
      data: data.data,
      detectedAt: new Date().toISOString()
    }
    if (!isEditing) {
      payload.scanSessionId = data.scanSessionId
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/discovery-list-database/${itemDetails.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/discovery-list-database`

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
        <Typography variant='h5'>{isEditing ? 'Edit Discovery Code' : 'Add Discovery Code'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <div className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Typography color='text.primary' className='font-medium mt-4'>
              Discovery Code Details
            </Typography>

            {/* Scan Session ID (only for creation) */}
            {!isEditing && (
              <Controller
                name='scanSessionId'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Select Scan Session'
                    {...(errors.scanSessionId && { error: true, helperText: 'This field is required.' })}
                  >
                    {scanSessions.map(scanSession => (
                      <MenuItem key={scanSession.id} value={scanSession.id}>
                        {scanSession.scanType}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            )}

            {/* Discovery Type */}
            <Controller
              name='discoveryType'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                  label='Discovery Type'
                  {...(errors.discoveryType && { error: true, helperText: 'This field is required.' })}
                >
                  <MenuItem value='unencrypted_column'>Unencrypted Column</MenuItem>
                </CustomTextField>
              )}
            />

            {/* Severity */}
            <Controller
              name='severity'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                  label='Severity'
                  {...(errors.severity && { error: true, helperText: 'This field is required.' })}
                >
                  <MenuItem value='low'>Low</MenuItem>
                  <MenuItem value='medium'>Medium</MenuItem>
                  <MenuItem value='high'>High</MenuItem>
                  <MenuItem value='critical'>Critical</MenuItem>
                </CustomTextField>
              )}
            />

            {/* Description */}
            <Controller
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Description'
                  {...(errors.description && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            {/* Table Name */}
            <Controller
              name='tableName'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Table Name'
                  {...(errors.tableName && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            {/* Column Name */}
            <Controller
              name='columnName'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Column Name'
                  {...(errors.columnName && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            {/* Data Sample */}
            <Controller
              name='data'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Data Sample'
                  {...(errors.data && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

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

export default AddDiscoveryDBDrawer
