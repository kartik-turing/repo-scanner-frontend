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

const AddUserDrawer = props => {
  const { open, handleClose, itemDetails, onDataUpdated } = props

  const [formData, setFormData] = useState(initialData)
  const [isEditing, setEditing] = useState(false)
  const [partners, setPartners] = useState([])
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
      email: '',
      password: '',
      role: '',
      customer_id: '',
      partner_id: ''
    }
  })

  useEffect(() => {
    if (itemDetails) {
      setValue('name', itemDetails.name || '')
      setValue('email', itemDetails.email || '')
      setValue('role', itemDetails.role || '')
      // password is never pre-filled for security
      setEditing(true)
    } else {
      resetForm({
        name: '',
        email: '',
        password: '',
        role: '',
        customer_id: '',
        partner_id: ''
      })
      setEditing(false)
    }
  }, [itemDetails])

  useEffect(() => {
    const fetchData = async (endpoint, setter, label) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/${endpoint}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
            Accept: '*/*'
          }
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch ${label} data: ${res.status} ${res.statusText}`)
        }

        const result = await res.json()
        setter(result.data || [])
      } catch (error) {
        console.error(`Error fetching ${label}:`, error)
      }
    }

    Promise.all([fetchData('partners', setPartners, 'Partners'), fetchData('customers', setCustomers, 'Customers')])
  }, [])

  const onSubmit = async data => {
    const payload = {
      name: data.name,
      email: data.email,
      role: data.role
    }

    if (!isEditing) {
      payload.partner_id = data.partner_id
      payload.customer_id = data.customer_id
      payload.password = data.password
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/users/${itemDetails.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/users`

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
        <Typography variant='h5'>{isEditing ? 'Edit User' : 'Add User'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <div className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Typography color='text.primary' className='font-medium mt-4'>
              User Details
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
                  placeholder='Enter name'
                  {...(errors.name && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Email'
                  placeholder='Enter email'
                  {...(errors.email && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            {!isEditing && (
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='password'
                    label='Password'
                    placeholder='Enter password'
                    {...(errors.password && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            )}

            <Controller
              name='role'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                  label='Role'
                  {...(errors.role && { error: true, helperText: 'This field is required.' })}
                >
                  <MenuItem value='admin'>Admin</MenuItem>
                  <MenuItem value='partner'>Partner</MenuItem>
                  <MenuItem value='customer'>Customer</MenuItem>
                  <MenuItem value='demo'>Demo</MenuItem>
                </CustomTextField>
              )}
            />

            {!isEditing && (
              <>
                <Controller
                  name='customer_id'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      select
                      fullWidth
                      label='Select Customer'
                      {...(errors.customer_id && { error: true, helperText: 'This field is required.' })}
                    >
                      {customers.map(customer => (
                        <MenuItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />

                <Controller
                  name='partner_id'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      select
                      fullWidth
                      label='Partner'
                      {...(errors.partner_id && { error: true, helperText: 'This field is required.' })}
                    >
                      {partners.map(partner => (
                        <MenuItem key={partner.id} value={partner.id}>
                          {partner.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </>
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

export default AddUserDrawer
