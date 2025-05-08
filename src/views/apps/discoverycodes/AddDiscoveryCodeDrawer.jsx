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

const AddDiscoveryCodeDrawer = props => {
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
      filePath: '',
      lineNumber: 0,
      lineContent: '',
      lineContentType: '',
      detectedAt: new Date().toISOString()
    }
  })

  useEffect(() => {
    if (itemDetails) {
      setValue('discoveryType', itemDetails.discoveryType || '')
      setValue('severity', itemDetails.severity || '')
      setValue('description', itemDetails.description || '')
      setValue('filePath', itemDetails.filePath || '')
      setValue('lineNumber', itemDetails.lineNumber || 0)
      setValue('lineContent', itemDetails.lineContent || '')
      setValue('lineContentType', itemDetails.lineContentType || '')
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
        filePath: '',
        lineNumber: 0,
        lineContent: '',
        lineContentType: '',
        detectedAt: new Date().toISOString()
      })
      setFormData(initialData)
      setEditing(false)
    }
  }, [itemDetails])

  useEffect(() => {
    const fetchCustomers = async () => {
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

    fetchCustomers()
  }, [])

  const onSubmit = async data => {
    const payload = {
      discoveryType: data.discoveryType,
      severity: data.severity,
      description: data.description,
      filePath: data.filePath,
      lineNumber: Number(data.lineNumber),
      lineContent: data.lineContent,
      lineContentType: data.lineContentType,
      detectedAt: new Date().toISOString()
    }
    if (!isEditing) {
      payload.scanSessionId = data.scanSessionId
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/discovery-list-code/${itemDetails.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/discovery-list-code`

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

            <Controller
              name='discoveryType'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField {...field} select fullWidth label='Discovery Type'>
                  <MenuItem value='weak_encryption'>Weak Encryption</MenuItem>
                  <MenuItem value='hardcoded_key'>Hardcoded Key</MenuItem>
                  <MenuItem value='open_port'>Open Port</MenuItem>
                  <MenuItem value='db_misconfiguration'>DB Misconfiguration</MenuItem>
                </CustomTextField>
              )}
            />

            <Controller
              name='severity'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField {...field} select fullWidth label='Severity'>
                  <MenuItem value='low'>Low</MenuItem>
                  <MenuItem value='medium'>Medium</MenuItem>
                  <MenuItem value='high'>High</MenuItem>
                  <MenuItem value='critical'>Critical</MenuItem>
                </CustomTextField>
              )}
            />

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

            <Controller
              name='filePath'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='File Path'
                  {...(errors.filePath && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='lineNumber'
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='number'
                  fullWidth
                  label='Line Number'
                  {...(errors.lineNumber && { error: true, helperText: 'Enter a valid line number.' })}
                />
              )}
            />

            <Controller
              name='lineContent'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Line Content'
                  {...(errors.lineContent && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='lineContentType'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField {...field} select fullWidth label='Line Content Type'>
                  <MenuItem value='library import'>Library Import</MenuItem>
                  <MenuItem value='invocation'>Invocation</MenuItem>
                  <MenuItem value='definition'>Definition</MenuItem>
                </CustomTextField>
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

export default AddDiscoveryCodeDrawer
