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

const AddRepoDrawer = props => {
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
      name: '',
      platform: '',
      repoUrl: '',
      customerId: ''
    }
  })

  useEffect(() => {
    if (itemDetails) {
      setValue('name', itemDetails.name || '')
      setValue('platform', itemDetails.platform || '')
      setValue('repoUrl', itemDetails.repoUrl || '')
      // No need to set `lastScanAt`, it's not edited
      console.log(itemDetails)

      // console.log(itemDetails.partnerId)

      setEditing(true)
    } else {
      resetForm({
        name: '',
        platform: '',
        repoUrl: '',
        customerId: ''
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
    const payload = {
      name: data.name,
      platform: data.platform,
      repoUrl: data.repoUrl,
      lastScanAt: new Date().toISOString()
    }
    if (!isEditing) {
      payload.customerId = data.customerId
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/repositories/${itemDetails.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/repositories`

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
        <Typography variant='h5'>{isEditing ? 'Edit Repository' : 'Add Repository'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <div className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Typography color='text.primary' className='font-medium mt-4'>
              Repository Details
            </Typography>

            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Repository Name'
                  placeholder='Repository name'
                  {...(errors.name && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='platform'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Platform'
                  placeholder='e.g., GitHub, GitLab'
                  {...(errors.platform && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='repoUrl'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Repository URL'
                  placeholder='e.g., https://github.com/org/repo'
                  {...(errors.repoUrl && { error: true, helperText: 'This field is required.' })}
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

export default AddRepoDrawer
