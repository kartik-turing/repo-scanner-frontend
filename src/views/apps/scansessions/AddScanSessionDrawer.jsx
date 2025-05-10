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

const AddScanSessionDrawer = props => {
  const { open, handleClose, itemDetails, onDataUpdated } = props

  const [formData, setFormData] = useState(initialData)
  const [isEditing, setEditing] = useState(false)
  const [repos, setRepos] = useState([])
  const [dbdumps, setDbdumps] = useState([])
  const [networkDeployments, setNetworkDeployments] = useState([])
  const [schedulers, setSchedulers] = useState([])
  const [customers, setCustomers] = useState([])
  const [users, setUsers] = useState([])
  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      scanType: 'code',
      repositoryId: '',
      networkDeploymentId: '',
      dbDumpId: '',
      startedAt: '',
      completedAt: '',
      schedulerId: '',
      customerId: '',
      status: 'pending',
      initiatedBy: ''
    }
  })

  useEffect(() => {
    if (itemDetails) {
      setValue('scanType', itemDetails.scanType || 'code')
      setValue('repositoryId', itemDetails.repositoryId || '')
      setValue('networkDeploymentId', itemDetails.networkDeploymentId || '')
      setValue('dbDumpId', itemDetails.dbDumpId || '')
      setValue('startedAt', itemDetails.startedAt ? itemDetails.startedAt.slice(0, 16) : '')
      setValue('completedAt', itemDetails.completedAt ? itemDetails.completedAt.slice(0, 16) : '')
      setValue('schedulerId', itemDetails.schedulerId || '')
      setValue('customerId', itemDetails.customerId || '')
      setValue('status', itemDetails.status || 'pending')
      setValue('initiatedBy', itemDetails.initiatedBy?.id || '')
      setEditing(true)
      console.log(itemDetails)
    } else {
      resetForm({
        scanType: 'code',
        repositoryId: '',
        networkDeploymentId: '',
        dbDumpId: '',
        startedAt: '',
        completedAt: '',
        schedulerId: '',
        customerId: '',
        status: 'pending',
        initiatedBy: ''
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

    Promise.all([
      fetchData('repositories', setRepos, 'Repositories'),
      fetchData('db-dumps', setDbdumps, 'DB Dumps'),
      fetchData('network-scan-settings', setNetworkDeployments, 'Network Deployments'),
      fetchData('scan-schedulers', setSchedulers, 'Scan Schedulers'),
      fetchData('customers', setCustomers, 'Customers'),
      fetchData('users', setUsers, 'Users')
    ])
  }, [])

  useEffect(() => {
    console.log(users)
  }, [users])

  const onSubmit = async data => {
    const timestamp = new Date().toISOString()
    const payload = {
      scanType: data.scanType,
      startedAt: data.startedAt,
      completedAt: data.completedAt,
      status: data.status
    }
    if (!isEditing) {
      payload.repositoryId = data.repositoryId || ''
      payload.networkDeploymentId = data.networkDeploymentId || ''
      payload.dbDumpId = data.dbDumpId || ''
      payload.schedulerId = data.schedulerId || ''
      payload.customerId = data.customerId || ''
      payload.initiatedBy = data.initiatedBy || ''
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/scan/${itemDetails.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/scan`

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
        <Typography variant='h5'>{isEditing ? 'Edit Scan Session' : 'Add Scan Session'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <div className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Typography color='text.primary' className='font-medium mt-4'>
              Scan Session Details
            </Typography>

            <Controller
              name='scanType'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} select fullWidth label='Scan Type'>
                  <MenuItem value='code'>Code</MenuItem>
                  <MenuItem value='network'>Network</MenuItem>
                  <MenuItem value='database'>Database</MenuItem>
                </CustomTextField>
              )}
            />

            {!isEditing && (
              <>
                <Controller
                  name='repositoryId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      select
                      fullWidth
                      label='Select Repository'
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
                <Controller
                  name='networkDeploymentId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      select
                      fullWidth
                      label='Select Network Deployment'
                      {...(errors.networkDeploymentId && { error: true, helperText: 'This field is required.' })}
                    >
                      {networkDeployments.map(nd => (
                        <MenuItem key={nd.id} value={nd.id}>
                          {nd.deploymentName}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
                <Controller
                  name='dbDumpId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      select
                      fullWidth
                      label='Select DB Dump'
                      {...(errors.dbDumpId && { error: true, helperText: 'This field is required.' })}
                    >
                      {dbdumps.map(dump => (
                        <MenuItem key={dump.id} value={dump.id}>
                          {dump.industry}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />{' '}
              </>
            )}

            <Controller
              name='startedAt'
              control={control}
              render={({ field }) => <CustomTextField {...field} type='datetime-local' fullWidth label='Started At' />}
            />

            <Controller
              name='completedAt'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} type='datetime-local' fullWidth label='Completed At' />
              )}
            />

            {!isEditing && (
              <>
                <Controller
                  name='initiatedBy'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      select
                      fullWidth
                      label='Initiated By'
                      {...(errors.initiatedBy && { error: true, helperText: 'This field is required.' })}
                    >
                      {users.map(user => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
                <Controller
                  name='schedulerId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      select
                      fullWidth
                      label='Select Scheduler'
                      {...(errors.schedulerId && { error: true, helperText: 'This field is required.' })}
                    >
                      {schedulers.map(scheduler => (
                        <MenuItem key={scheduler.id} value={scheduler.id}>
                          {scheduler.scanTargetType}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />

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
              </>
            )}

            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} select fullWidth label='Status'>
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='in_progress'>In Progress</MenuItem>
                  <MenuItem value='completed'>Completed</MenuItem>
                  <MenuItem value='failed'>Failed</MenuItem>
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

export default AddScanSessionDrawer
