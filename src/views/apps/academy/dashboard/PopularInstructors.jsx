// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Vars
const data = [
  {
    name: 'Weak RSA/ECC Encryption',
    profession: 'Business Intelligence',
    totalCourses: 33,
    avatar: '/images/avatars/1.png'
  },
  { name: 'Hardcoded Secrets', profession: 'Digital Marketing', totalCourses: 52, avatar: '/images/avatars/2.png' },
  { name: 'Deprecated Algorithms', profession: 'UI/UX Design', totalCourses: 12, avatar: '/images/avatars/3.png' },
  { name: 'Compliance Violations', profession: 'Vue', totalCourses: 8, avatar: '/images/avatars/4.png' }
]

const PopularInstructors = () => {
  return (
    <Card className='bs-full'>
      <CardHeader title='Issues Detected' action={<OptionMenu options={['Refresh', 'Update', 'Share']} />} />
      <Divider />
      <div className='flex justify-between plb-4 pli-6'>
        <Typography className='uppercase'>instructors</Typography>
        <Typography className='uppercase'>courses</Typography>
      </div>
      <Divider />
      <CardContent className='flex flex-col gap-4'>
        {data.map((item, i) => (
          <div key={i} className='flex items-center gap-4'>
            <CustomAvatar size={34} src={item.avatar} />
            <div className='flex justify-between items-center is-full gap-4'>
              <div>
                <Typography className='font-medium' color='text.primary'>
                  {item.name}
                </Typography>
                <Typography variant='body2'>{item.profession}</Typography>
              </div>
              <Typography className='font-medium' color='text.primary'>
                {item.totalCourses}
              </Typography>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default PopularInstructors
