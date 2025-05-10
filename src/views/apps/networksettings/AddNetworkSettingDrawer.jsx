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

const AddNetworkSettingDrawer = props => {
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
      deploymentName: '',
      location: '',
      switchBrand: '',
      switchModel: '',
      spanPortConfigured: false,
      spanSourcePorts: '', // ✅ Add this
      spanDestinationPort: '',
      forwardingDeviceType: '',
      forwardingProtocol: 'tcp',
      destinationIpForScanner: '',
      captureFilter: '',
      networkBandwidthLimitMbps: 0,
      packetCaptureDurationMinutes: 0
    }
  })

  useEffect(() => {
    if (itemDetails) {
      if (itemDetails) {
        setValue('deploymentName', itemDetails.deploymentName || '')
        setValue('location', itemDetails.location || '')
        setValue('switchBrand', itemDetails.switchBrand || '')
        setValue('switchModel', itemDetails.switchModel || '')
        setValue('spanPortConfigured', itemDetails.spanPortConfigured ?? false)
        setValue('spanSourcePorts', itemDetails.spanSourcePorts || '')
        setValue('spanDestinationPort', itemDetails.spanDestinationPort || '')
        setValue('forwardingDeviceType', itemDetails.forwardingDeviceType || '')
        setValue('forwardingProtocol', itemDetails.forwardingProtocol || 'tcp')
        setValue('destinationIpForScanner', itemDetails.destinationIpForScanner || '')
        setValue('captureFilter', itemDetails.captureFilter || '')
        setValue('networkBandwidthLimitMbps', itemDetails.networkBandwidthLimitMbps || 0)
        setValue('packetCaptureDurationMinutes', itemDetails.packetCaptureDurationMinutes || 0)
      } // If customerId is available
      setEditing(true)
      console.log(itemDetails)
    } else {
      resetForm({
        customerId: '',
        deploymentName: '',
        location: '',
        switchBrand: '',
        switchModel: '',
        spanPortConfigured: false,
        spanSourcePorts: '', // ✅ Add this
        spanDestinationPort: '',
        forwardingDeviceType: '',
        forwardingProtocol: 'tcp',
        destinationIpForScanner: '',
        captureFilter: '',
        networkBandwidthLimitMbps: 0,
        packetCaptureDurationMinutes: 0
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
      deploymentName: data.deploymentName,
      location: data.location,
      switchBrand: data.switchBrand,
      switchModel: data.switchModel,
      spanPortConfigured: data.spanPortConfigured,
      spanSourcePorts: data.spanSourcePorts,
      spanDestinationPort: data.spanDestinationPort,
      forwardingDeviceType: data.forwardingDeviceType,
      forwardingProtocol: data.forwardingProtocol,
      destinationIpForScanner: data.destinationIpForScanner,
      captureFilter: data.captureFilter,
      networkBandwidthLimitMbps: Number(data.networkBandwidthLimitMbps),
      packetCaptureDurationMinutes: Number(data.packetCaptureDurationMinutes),
      updatedAt: timestamp,
      createdAt: isEditing ? itemDetails.createdAt : timestamp
    }

    if (!isEditing) {
      payload.customerId = data.customerId
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/network-scan-settings/${itemDetails.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/network-scan-settings`

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
        <Typography variant='h5'>{isEditing ? 'Edit Network Setting' : 'Add Network Setting'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <div className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Typography color='text.primary' className='font-medium mt-4'>
              Network Setting Details
            </Typography>

            <Controller
              name='deploymentName'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Deployment Name'
                  placeholder='e.g., Office Network'
                  error={!!errors.deploymentName}
                  helperText={errors.deploymentName && 'This field is required.'}
                />
              )}
            />

            <Controller
              name='location'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Location'
                  placeholder='e.g., New York Data Center'
                  error={!!errors.location}
                  helperText={errors.location && 'This field is required.'}
                />
              )}
            />

            <Controller
              name='switchBrand'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label='Switch Brand' placeholder='e.g., Cisco' />
              )}
            />

            <Controller
              name='switchModel'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label='Switch Model' placeholder='e.g., Catalyst 9300' />
              )}
            />

            <Controller
              name='spanPortConfigured'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} select fullWidth label='SPAN Port Configured?'>
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </CustomTextField>
              )}
            />

            <Controller
              name='spanDestinationPort'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label='SPAN Destination Port' placeholder='e.g., Gi1/0/24' />
              )}
            />
            <Controller
              name='spanSourcePorts'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label='SPAN Source Ports' placeholder='e.g., Gi1/0/1, Gi1/0/2' />
              )}
            />

            <Controller
              name='forwardingDeviceType'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label='Forwarding Device Type' placeholder='e.g., Firewall' />
              )}
            />

            <Controller
              name='forwardingProtocol'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label='Forwarding Protocol' placeholder='e.g., tcp' />
              )}
            />

            <Controller
              name='destinationIpForScanner'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Destination IP for Scanner'
                  placeholder='e.g., 192.168.1.100'
                />
              )}
            />

            <Controller
              name='captureFilter'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Capture Filter'
                  placeholder='e.g., port 80 or host 192.168.1.1'
                />
              )}
            />

            <Controller
              name='networkBandwidthLimitMbps'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} type='number' fullWidth label='Network Bandwidth Limit (Mbps)' />
              )}
            />

            <Controller
              name='packetCaptureDurationMinutes'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} type='number' fullWidth label='Packet Capture Duration (Minutes)' />
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

export default AddNetworkSettingDrawer
