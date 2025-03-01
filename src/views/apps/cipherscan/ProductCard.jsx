'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import { useMqtt } from '@/hooks/useMqtt'

// API Data

const ProductCard = () => {
  const { cardsMessages } = useMqtt()
  console.log('cardsMessages', cardsMessages)

  // Extract data safely
  const UpperCardJSON =
    cardsMessages?.length > 0
      ? cardsMessages[0]
      : {
          total_files_scanned: {
            value: 0,
            change: '0%'
          },
          files_scanned_per_minute: {
            value: 0,
            change: '0%'
          },
          time_elapsed: {
            value: 0,
            note: 'Renew required in 0 days'
          },
          estimated_time_remaining: {
            value: 0,
            change: '0%'
          }
        }

  // Hooks
  const isBelowMdScreen = useMediaQuery(theme => theme.breakpoints.down('md'))
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))

  // Ensure data is available before mapping
  if (!UpperCardJSON) {
    return <Typography>Loading...</Typography>
  }

  const mappedData = [
    {
      title: 'Total Files Scanned',
      value: UpperCardJSON.total_files_scanned?.value || 0,
      icon: 'tabler-smart-home',
      desc: UpperCardJSON.total_files_scanned?.value || 0,
      change: UpperCardJSON.total_files_scanned?.change ? parseFloat(UpperCardJSON.total_files_scanned.change) : null
    },
    {
      title: 'Files Scanned Per Minute',
      value: UpperCardJSON.files_scanned_per_minute?.value || 0,
      icon: 'tabler-device-laptop',
      desc: UpperCardJSON.files_scanned_per_minute?.value || 0,
      change: UpperCardJSON.files_scanned_per_minute?.change
        ? parseFloat(UpperCardJSON.files_scanned_per_minute.change)
        : null
    },
    {
      title: 'Time Elapsed',
      value: UpperCardJSON.time_elapsed?.value || 0,
      icon: 'tabler-gift',
      desc: UpperCardJSON.time_elapsed?.note || UpperCardJSON.time_elapsed?.value || 'N/A'
    },
    {
      title: 'Estimated Time Remaining',
      value: UpperCardJSON.estimated_time_remaining?.value || 0,
      icon: 'tabler-wallet',
      desc: UpperCardJSON.estimated_time_remaining?.value || 0,
      change: UpperCardJSON.estimated_time_remaining?.change
        ? parseFloat(UpperCardJSON.estimated_time_remaining.change)
        : null
    }
  ]

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          {mappedData.map((item, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              key={index}
              className={classnames({
                '[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie': isBelowMdScreen && !isSmallScreen,
                '[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie': !isBelowMdScreen
              })}
            >
              <div className='flex flex-col gap-1'>
                <div className='flex justify-between'>
                  <div className='flex flex-col gap-1'>
                    <Typography>{item.title}</Typography>
                    <Typography variant='h4'>{item.value}</Typography>
                  </div>
                  <CustomAvatar variant='rounded' size={44}>
                    <i className={classnames(item.icon, 'text-[28px]')} />
                  </CustomAvatar>
                </div>
                {item.change != null ? (
                  <div className='flex items-center gap-2'>
                    <Chip
                      variant='tonal'
                      label={`${item.change}%`}
                      size='small'
                      color={item.change > 0 ? 'success' : 'error'}
                    />
                  </div>
                ) : null}
              </div>
              {isBelowMdScreen && !isSmallScreen && index < mappedData.length - 2 && (
                <Divider
                  className={classnames('mbs-6', {
                    'mie-6': index % 2 === 0
                  })}
                />
              )}
              {isSmallScreen && index < mappedData.length - 1 && <Divider className='mbs-6' />}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductCard
