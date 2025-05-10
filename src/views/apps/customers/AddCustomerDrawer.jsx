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

const AddCustomerDrawer = props => {
  const { open, handleClose, itemDetails, onDataUpdated } = props

  const [formData, setFormData] = useState(initialData)
  const [isEditing, setEditing] = useState(false)
  const [partners, setPartners] = useState([])
  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      city: '',
      address: '',
      primaryContact: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      partnerId: ''
    }
  })

  useEffect(() => {
    if (itemDetails) {
      setValue('name', itemDetails.name || '')
      setValue('city', itemDetails.city || '')
      setValue('address', itemDetails.address || '')
      setValue('primaryContact', itemDetails.primaryContact || '')
      setValue('contactEmail', itemDetails.contactEmail || '')
      setValue('contactPhone', itemDetails.contactPhone || '')
      setValue('website', itemDetails.website || '')
      // setValue('partnerId', itemDetails.partnerId || '')
      console.log(itemDetails)

      // console.log(itemDetails.partnerId)

      setEditing(true)
    } else {
      resetForm({
        partnerId: '',
        name: '',
        city: '',
        address: '',
        primaryContact: '',
        contactEmail: '',
        contactPhone: '',
        website: ''
      })
      setFormData(initialData)
      setEditing(false)
    }
  }, [itemDetails])

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `api/partners`, {
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
        setPartners(result.data || [])
        // }
      } catch (error) {
        console.error('Error fetching partners:', error)
      }
    }

    fetchPartners()
  }, [])

  const onSubmit = async data => {
    const payload = {
      name: data.name,
      city: data.city,
      address: data.address,
      primaryContact: data.primaryContact,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      website: data.website
      // partnerId: data.partnerId
    }
    if (!isEditing) {
      payload.partnerId = data.partnerId
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/customers/${itemDetails.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/customers`

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
        <Typography variant='h5'>{isEditing ? 'Edit Customer' : 'Add Customer'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <div className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Typography color='text.primary' className='font-medium mt-4'>
              Customer Details
            </Typography>

            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Name'
                  placeholder='Customer name'
                  {...(errors.name && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='city'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='City'
                  placeholder='City'
                  {...(errors.city && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='address'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Address'
                  placeholder='Address'
                  {...(errors.address && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='primaryContact'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Primary Contact'
                  placeholder='Primary Contact Number'
                  {...(errors.primaryContact && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='contactEmail'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Contact Email'
                  placeholder='Contact Email'
                  {...(errors.contactEmail && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='contactPhone'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Contact Phone'
                  placeholder='Alternate Phone'
                  {...(errors.contactPhone && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            {!isEditing && (
              <Controller
                name='partnerId'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Select Partner'
                    // placeholder='Choose a partner'
                    {...(errors.partnerId && { error: true, helperText: 'This field is required.' })}
                  >
                    {partners.map(partner => (
                      <MenuItem key={partner.id} value={partner.id}>
                        {partner.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            )}

            <Controller
              name='website'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Website'
                  placeholder='https://example.com'
                  {...(errors.website && { error: true, helperText: 'This field is required.' })}
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

export default AddCustomerDrawer
