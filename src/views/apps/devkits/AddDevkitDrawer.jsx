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

// Vars
const initialData = {
  recommendedPrice: ''
}

const AddDevkitDrawer = props => {
  const { open, handleClose, itemDetails, onDataUpdated } = props

  const [formData, setFormData] = useState(initialData)
  const [isEditing, setEditing] = useState(false)

  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      version: '',
      language: '',
      framework: '',
      supportedCompliance: '',
      downloadUrl: '',
      documentationUrl: ''
    }
  })

  useEffect(() => {
    if (itemDetails) {
      setValue('name', itemDetails.name || '')
      setValue('version', itemDetails.version || '')
      setValue('language', itemDetails.language || '')
      setValue('framework', itemDetails.framework || '')
      setValue('supportedCompliance', (itemDetails.supportedCompliance || []).join(', '))
      setValue('downloadUrl', itemDetails.downloadUrl || '')
      setValue('documentationUrl', itemDetails.documentationUrl || '')
      setEditing(true)
    } else {
      resetForm({
        name: '',
        version: '',
        language: '',
        framework: '',
        supportedCompliance: '',
        downloadUrl: '',
        documentationUrl: ''
      })
      setFormData(initialData)
      setEditing(false)
    }
  }, [itemDetails])

  const onSubmit = async data => {
    const payload = {
      name: data.name,
      version: data.version,
      language: data.language,
      framework: data.framework,
      supportedCompliance: data.supportedCompliance.split(',').map(s => s.trim()),
      downloadUrl: data.downloadUrl,
      documentationUrl: data.documentationUrl
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/devkits/${itemDetails.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/devkits`

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
        <Typography variant='h5'>{isEditing ? 'Edit Devkit' : 'Add Devkit'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <div className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Typography color='text.primary' className='font-medium mt-4'>
              Devkit Details
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
                  placeholder='Devkit name'
                  {...(errors.name && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='version'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Version'
                  placeholder='1.0.0'
                  {...(errors.version && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='language'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Language'
                  placeholder='JavaScript'
                  {...(errors.language && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='framework'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Framework'
                  placeholder='Next.js'
                  {...(errors.framework && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='supportedCompliance'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Supported Compliance (comma-separated)'
                  placeholder='ISO27001, SOC2'
                  {...(errors.supportedCompliance && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='downloadUrl'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Download URL'
                  placeholder='https://example.com/devkit.zip'
                  {...(errors.downloadUrl && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='documentationUrl'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Documentation URL'
                  placeholder='https://docs.example.com'
                  {...(errors.documentationUrl && { error: true, helperText: 'This field is required.' })}
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

export default AddDevkitDrawer
