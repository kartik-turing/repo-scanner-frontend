// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Vars
const data = [
  { title: 'gradle.properties', views: '12', icon: 'tabler-video', color: 'primary' },
  { title: 'DeviceInfo.ios.kt', views: '4', icon: 'tabler-code', color: 'info' },
  { title: 'AuthUseCase.kt', views: '7', icon: 'tabler-camera', color: 'success' },
  { title: 'store_deploy.yml', views: '5', icon: 'tabler-brand-dribbble', color: 'warning' },
  { title: 'package.json', views: '8', icon: 'tabler-microphone-2', color: 'error' }
]

const TopCourses = () => {
  return (
    <Card>
      <CardHeader
        title='Top At-Risk Files'
        action={<OptionMenu options={['Last 28 Days', 'Last Month', 'Last Year']} />}
      />
      <CardContent className='flex flex-col gap-6'>
        {data.map((item, i) => (
          <div key={i} className='flex items-center gap-4'>
            <CustomAvatar variant='rounded' skin='light' color={item.color}>
              <i className={item.icon} />
            </CustomAvatar>
            <div className='flex justify-between items-center gap-4 is-full flex-wrap'>
              <Typography className='font-medium flex-1' color='text.primary'>
                {item.title}
              </Typography>
              <Chip label={`${item.views} Views`} variant='tonal' size='small' color='secondary' />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default TopCourses
