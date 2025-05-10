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

const AddSubscriptionDrawer = props => {
  const { open, handleClose, itemDetails, onDataUpdated } = props

  const [formData, setFormData] = useState(initialData)
  const [isEditing, setEditing] = useState(false)
  const [customers, setCustomers] = useState([])
  const [devkits, setDevkits] = useState([])
  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      userId: '',
      sdkId: '',
      subscriptionPlan: 'basic', // default to 'basic' or null
      subscribedAt: '',
      expiresAt: ''
    }
  })

  useEffect(() => {
    if (itemDetails) {
      // Format the datetime fields for `datetime-local` input type
      const formatDateTimeLocal = iso => iso?.slice(0, 16)

      setValue('userId', itemDetails.userId || '')
      setValue('sdkId', itemDetails.sdkId || '')
      setValue('subscriptionPlan', itemDetails.subscriptionPlan || 'basic')
      setValue('subscribedAt', formatDateTimeLocal(itemDetails.subscribedAt) || '')
      setValue('expiresAt', formatDateTimeLocal(itemDetails.expiresAt) || '')
      setEditing(true)
      console.log(itemDetails)
    } else {
      const now = new Date().toISOString()
      resetForm({
        userId: '',
        sdkId: '',
        subscriptionPlan: 'basic',
        subscribedAt: now.slice(0, 16), // Format for datetime-local
        expiresAt: now.slice(0, 16) // Format for datetime-local
      })
      setFormData(initialData)
      setEditing(false)
    }
  }, [itemDetails])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `api/devkits`, {
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
        setDevkits(result.data || [])
        // }
      } catch (error) {
        console.error('Error fetching Customers:', error)
      }
    }

    fetchData()
  }, [])

  const onSubmit = async data => {
    const payload = {
      subscriptionPlan: data.subscriptionPlan,
      subscribedAt: data.subscribedAt,
      expiresAt: data.expiresAt
    }
    if (!isEditing) {
      payload.userId = data.userId
      payload.sdkId = data.sdkId
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/subscriptions/${itemDetails.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/subscriptions`

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
        <Typography variant='h5'>{isEditing ? 'Edit Subscription' : 'Add Subscription'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <div className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Typography color='text.primary' className='font-medium mt-4'>
              Subscription Details
            </Typography>

            {!isEditing && (
              <Controller
                name='userId'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='User ID'
                    placeholder='UUID of the user'
                    {...(errors.userId && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            )}

            {!isEditing && (
              <Controller
                name='sdkId'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Select Customer'
                    {...(errors.sdkId && { error: true, helperText: 'This field is required.' })}
                  >
                    {devkits.map(devkit => (
                      <MenuItem key={devkit.id} value={devkit.id}>
                        {devkit.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            )}

            <Controller
              name='subscriptionPlan'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                  label='Subscription Plan'
                  {...(errors.subscriptionPlan && { error: true, helperText: 'This field is required.' })}
                >
                  <MenuItem value='basic'>Basic</MenuItem>
                  <MenuItem value='pro'>Pro</MenuItem>
                  <MenuItem value='enterprise'>Enterprise</MenuItem>
                </CustomTextField>
              )}
            />

            <Controller
              name='subscribedAt'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} type='datetime-local' fullWidth label='Subscribed At' />
              )}
            />
            <Controller
              name='expiresAt'
              control={control}
              render={({ field }) => <CustomTextField {...field} type='datetime-local' fullWidth label='Expires At' />}
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

export default AddSubscriptionDrawer
