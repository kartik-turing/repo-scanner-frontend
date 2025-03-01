'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Third Party Imports
import classnames from 'classnames'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'
import { useMqtt } from '@/hooks/useMqtt'
import CurrentTimeline from './CurrentTimeline'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const SupportTracker = () => {
  // Hooks
  const theme = useTheme()
  const { progressMessages } = useMqtt()
  console.log('gbfprogressMessages', progressMessages)

  // Extracting data from progressMessages
  const sysytemPerfomanceJSON = progressMessages[0] ?? {
    title: 'System Performance Dashboard',
    subtext: 'Real-time tracking of support tickets and file scanning activity',
    support_tracker: {
      total_issues_found: 0, // Corrected key
      completed_task_percentage: 0, // Corrected key
      new_tickets: 0,
      open_tickets: 0,
      response_time: 'N/A'
    }
  }

  const options = {
    stroke: { dashArray: 10 },
    labels: ['Completed Task'],
    colors: ['var(--mui-palette-primary-main)'],
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityTo: 0.5,
        opacityFrom: 1,
        shadeIntensity: 0.5,
        stops: [30, 70, 100],
        inverseColors: false,
        gradientToColors: ['var(--mui-palette-primary-main)']
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 130,
        startAngle: -140,
        hollow: { size: '60%' },
        track: { background: 'transparent' },
        dataLabels: {
          name: {
            offsetY: -24,
            color: 'var(--mui-palette-text-disabled)',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body2.fontSize
          },
          value: {
            offsetY: 8,
            fontWeight: 500,
            formatter: value => `${value}%`,
            color: 'var(--mui-palette-text-primary)',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h2.fontSize
          }
        }
      }
    }
  }

  const data = [
    {
      title: 'New Tickets',
      open_tickets: sysytemPerfomanceJSON?.support_tracker?.new_tickets ?? 'N/A',
      avatarColor: 'primary',
      avatarIcon: 'tabler-ticket'
    },
    {
      title: 'Open Tickets',
      open_tickets: sysytemPerfomanceJSON?.support_tracker?.open_tickets ?? 'N/A',
      avatarColor: 'info',
      avatarIcon: 'tabler-check'
    },
    {
      title: 'Response Time',
      open_tickets: sysytemPerfomanceJSON?.support_tracker?.response_time ?? 'N/A',
      avatarColor: 'warning',
      avatarIcon: 'tabler-clock'
    }
  ]

  return (
    <>
      <CurrentTimeline title={sysytemPerfomanceJSON.title} body={sysytemPerfomanceJSON.subtext} />
      <div style={{ paddingBottom: '15px' }}></div>
      <Card>
        <CardHeader
          title='Support Tracker'
          subheader='Last 7 days'
          action={<OptionMenu options={['Refresh', 'Edit', 'Share']} />}
        />
        <CardContent className='flex flex-col sm:flex-row items-center justify-between gap-7'>
          <div className='flex flex-col gap-6 is-full sm:is-[unset]'>
            <div className='flex flex-col'>
              <Typography variant='h2'>{sysytemPerfomanceJSON?.support_tracker?.total_issues_found ?? 0}</Typography>
              <Typography>Total Tickets</Typography>
            </div>
            <div className='flex flex-col gap-4 is-full'>
              {data.map((item, index) => (
                <div key={index} className='flex items-center gap-4'>
                  <CustomAvatar skin='light' variant='rounded' color={item.avatarColor} size={34}>
                    <i className={classnames(item.avatarIcon, 'text-[22px]')} />
                  </CustomAvatar>
                  <div className='flex flex-col'>
                    <Typography className='font-medium' color='text.primary'>
                      {item.title}
                    </Typography>
                    <Typography variant='body2'>{item.open_tickets}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AppReactApexCharts
            type='radialBar'
            height={350}
            width='100%'
            series={[sysytemPerfomanceJSON?.support_tracker?.completed_task_percentage ?? 0]}
            options={options}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default SupportTracker
