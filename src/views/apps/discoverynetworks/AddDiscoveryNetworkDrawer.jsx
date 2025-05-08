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

const AddDiscoveryNetworkDrawer = props => {
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
      sourceIp: '',
      destinationIp: '',
      sourcePort: 0,
      destinationPort: 0,
      protocol: '',
      cryptographyComment: '',
      quantumVulnerable: false,
      vulnerableAlgorithms: '',
      pqcSchemePresent: false,
      pqcAlgorithms: '',
      detectedAt: new Date().toISOString()
    }
  })

  useEffect(() => {
    if (itemDetails) {
      setValue('discoveryType', itemDetails.discoveryType || '')
      setValue('severity', itemDetails.severity || '')
      setValue('description', itemDetails.description || '')
      setValue('sourceIp', itemDetails.sourceIp || '')
      setValue('destinationIp', itemDetails.destinationIp || '')
      setValue('sourcePort', itemDetails.sourcePort || 0)
      setValue('destinationPort', itemDetails.destinationPort || 0)
      setValue('protocol', itemDetails.protocol || '')
      setValue('cryptographyComment', itemDetails.cryptographyComment || '')
      setValue('quantumVulnerable', itemDetails.quantumVulnerable || false)
      setValue('vulnerableAlgorithms', itemDetails.vulnerableAlgorithms || '')
      setValue('pqcSchemePresent', itemDetails.pqcSchemePresent || false)
      setValue('pqcAlgorithms', itemDetails.pqcAlgorithms || '')
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
        sourceIp: '',
        destinationIp: '',
        sourcePort: 0,
        destinationPort: 0,
        protocol: '',
        cryptographyComment: '',
        quantumVulnerable: false,
        vulnerableAlgorithms: '',
        pqcSchemePresent: false,
        pqcAlgorithms: '',
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
      sourceIp: data.sourceIp,
      destinationIp: data.destinationIp,
      sourcePort: Number(data.sourcePort),
      destinationPort: Number(data.destinationPort),
      protocol: data.protocol,
      cryptographyComment: data.cryptographyComment,
      quantumVulnerable: data.quantumVulnerable,
      vulnerableAlgorithms: data.vulnerableAlgorithms,
      pqcSchemePresent: data.pqcSchemePresent,
      pqcAlgorithms: data.pqcAlgorithms,
      detectedAt: data.detectedAt || new Date().toISOString()
    }
    if (!isEditing) {
      payload.scanSessionId = data.scanSessionId
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/discovery-list-network/${itemDetails.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/discovery-list-network`

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

            {/* Only show this in Create mode */}
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
                    error={!!errors.scanSessionId}
                    helperText={errors.scanSessionId && 'Required'}
                  >
                    {scanSessions.map(scan => (
                      <MenuItem key={scan.id} value={scan.id}>
                        {scan.scanType}
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
                  <MenuItem value='open_port'>Open Port</MenuItem>
                  <MenuItem value='weak_tls'>Weak TLS</MenuItem>
                  <MenuItem value='outdated_software'>Outdated Software</MenuItem>
                  <MenuItem value='misconfigured_device'>Misconfigured Device</MenuItem>
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
                  error={!!errors.description}
                  helperText={errors.description && 'Required'}
                />
              )}
            />

            <Controller
              name='sourceIp'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Source IP'
                  error={!!errors.sourceIp}
                  helperText={errors.sourceIp && 'Required'}
                />
              )}
            />

            <Controller
              name='destinationIp'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Destination IP'
                  error={!!errors.destinationIp}
                  helperText={errors.destinationIp && 'Required'}
                />
              )}
            />

            <Controller
              name='sourcePort'
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='number'
                  fullWidth
                  label='Source Port'
                  error={!!errors.sourcePort}
                  helperText={errors.sourcePort && 'Required'}
                />
              )}
            />

            <Controller
              name='destinationPort'
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='number'
                  fullWidth
                  label='Destination Port'
                  error={!!errors.destinationPort}
                  helperText={errors.destinationPort && 'Required'}
                />
              )}
            />

            <Controller
              name='protocol'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Protocol'
                  error={!!errors.protocol}
                  helperText={errors.protocol && 'Required'}
                />
              )}
            />

            <Controller
              name='cryptographyComment'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Cryptography Comment'
                  error={!!errors.cryptographyComment}
                  helperText={errors.cryptographyComment && 'Required'}
                />
              )}
            />

            <Controller
              name='quantumVulnerable'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} select fullWidth label='Quantum Vulnerable'>
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </CustomTextField>
              )}
            />

            <Controller
              name='vulnerableAlgorithms'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Vulnerable Algorithms'
                  error={!!errors.vulnerableAlgorithms}
                  helperText={errors.vulnerableAlgorithms && 'Required'}
                />
              )}
            />

            <Controller
              name='pqcSchemePresent'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} select fullWidth label='PQC Scheme Present'>
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </CustomTextField>
              )}
            />

            <Controller
              name='pqcAlgorithms'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='PQC Algorithms'
                  error={!!errors.pqcAlgorithms}
                  helperText={errors.pqcAlgorithms && 'Required'}
                />
              )}
            />

            <Controller
              name='detectedAt'
              control={control}
              render={({ field }) => <CustomTextField {...field} type='datetime-local' fullWidth label='Detected At' />}
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

export default AddDiscoveryNetworkDrawer
