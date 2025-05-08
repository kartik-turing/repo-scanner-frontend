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

const AddScanSchedulerDrawer = props => {
  const { open, handleClose, itemDetails, onDataUpdated } = props

  const [formData, setFormData] = useState(initialData)
  const [isEditing, setEditing] = useState(false)
  const [repos, setRepos] = useState([])
  const [dbdumps, setDbdumps] = useState([])
  const [networkDeployments, setNetworkDeployments] = useState([])
  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      scanTargetType: 'repository',
      repositoryId: '',
      networkDeploymentId: '',
      dbDumpId: '',
      scanInterval: '15_minutes',
      networkScanPeriodMinutes: 0,
      nextScanAt: '',
      lastScanAt: ''
    }
  })

  useEffect(() => {
    if (itemDetails) {
      setValue('scanTargetType', itemDetails.scanTargetType || 'repository')
      setValue('repositoryId', itemDetails.repositoryId || '')
      setValue('networkDeploymentId', itemDetails.networkDeploymentId || '')
      setValue('dbDumpId', itemDetails.dbDumpId || '')
      setValue('scanInterval', itemDetails.scanInterval || '15_minutes')
      setValue('networkScanPeriodMinutes', itemDetails.networkScanPeriodMinutes || 0)
      setValue('nextScanAt', itemDetails.nextScanAt || '')
      setValue('lastScanAt', itemDetails.lastScanAt || '')
      setEditing(true)
      console.log(itemDetails)
    } else {
      resetForm({
        scanTargetType: 'repository',
        repositoryId: '',
        networkDeploymentId: '',
        dbDumpId: '',
        scanInterval: '15_minutes',
        networkScanPeriodMinutes: 0,
        nextScanAt: '',
        lastScanAt: ''
      })
      setFormData(initialData)
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

    Promise.all([
      fetchData('repositories', setRepos, 'Repositories'),
      fetchData('db-dumps', setDbdumps, 'DB Dumps'),
      fetchData('network-scan-settings', setNetworkDeployments, 'Network Deployments')
    ])
  }, [])

  const onSubmit = async data => {
    const timestamp = new Date().toISOString()
    const payload = {
      scanTargetType: data.scanTargetType || 'repository',
      scanInterval: data.scanInterval || '15_minutes',
      networkScanPeriodMinutes: Number(data.networkScanPeriodMinutes) || 0,
      nextScanAt: data.nextScanAt || timestamp,
      lastScanAt: data.lastScanAt || timestamp,
      createdAt: isEditing ? itemDetails.createdAt : timestamp,
      updatedAt: timestamp
    }
    if (!isEditing) {
      payload.repositoryId = data.repositoryId || ''
      payload.networkDeploymentId = data.networkDeploymentId || ''
      payload.dbDumpId = data.dbDumpId || ''
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/scan-schedulers/${itemDetails.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/scan-schedulers`

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
        <Typography variant='h5'>{isEditing ? 'Edit Scan Scheduler' : 'Add Scan Scheduler'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <div className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Typography color='text.primary' className='font-medium mt-4'>
              Scan Scheduler Details
            </Typography>

            {!isEditing && (
              <Controller
                name='repositoryId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Repository ID'
                    {...(errors.repositoryId && { error: true, helperText: 'This field is required.' })}
                  >
                    {repos.map(repo => (
                      <MenuItem key={repo.id} value={repo.id}>
                        {repo.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            )}

            {!isEditing && (
              <Controller
                name='dbDumpId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='DB Dump ID'
                    {...(errors.dbDumpId && { error: true, helperText: 'This field is required.' })}
                  >
                    {dbdumps.map(dump => (
                      <MenuItem key={dump.id} value={dump.id}>
                        {dump.industry} {/* Assuming 'name' is the label for each dump, adjust accordingly */}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            )}

            <Controller
              name='scanInterval'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                  label='Scan Interval'
                  {...(errors.scanInterval && { error: true, helperText: 'This field is required.' })}
                >
                  <MenuItem value='15_minutes'>15 minutes</MenuItem>
                  <MenuItem value='30_minutes'>30 minutes</MenuItem>
                  <MenuItem value='1_hour'>1 hour</MenuItem>
                  <MenuItem value='12_hours'>12 hours</MenuItem>
                  <MenuItem value='1_day'>1 day</MenuItem>
                  {/* Add other intervals as needed */}
                </CustomTextField>
              )}
            />

            <Controller
              name='networkScanPeriodMinutes'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='number'
                  fullWidth
                  label='Network Scan Period (Minutes)'
                  placeholder='e.g., 60'
                  {...(errors.networkScanPeriodMinutes && { error: true, helperText: 'Enter a valid number.' })}
                />
              )}
            />

            <Controller
              name='nextScanAt'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='datetime-local'
                  fullWidth
                  label='Next Scan At'
                  {...(errors.nextScanAt && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='lastScanAt'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='datetime-local'
                  fullWidth
                  label='Last Scan At'
                  {...(errors.lastScanAt && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />
            {!isEditing && (
              <Controller
                name='networkDeploymentId'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} select fullWidth label='Select Network Deployment'>
                    {networkDeployments.map(deployment => (
                      <MenuItem key={deployment.id} value={deployment.id}>
                        {deployment.deploymentName}
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

export default AddScanSchedulerDrawer
