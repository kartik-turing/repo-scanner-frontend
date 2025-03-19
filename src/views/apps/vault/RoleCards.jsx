'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'

// Component Imports
import RoleDialog from '@components/dialogs/role-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import Link from '@components/Link'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'

// Vars
const cardData = [
  { totalUsers: 4, title: 'Administrator', avatars: ['Nitin Tayal', 'Srijan D', 'Piyush T', 'Himanshu T'] },
  { totalUsers: 7, title: 'Editor', avatars: ['Kitin Tayal', 'Jrijan D', 'Liyush T', 'Oimanshu T'] },
  { totalUsers: 5, title: 'Users', avatars: ['Ritin Tayal', 'Irijan D', 'Siyush T', 'Himanshu T'] },
  { totalUsers: 6, title: 'Support', avatars: ['Nitin Tayal', 'Lrijan D', 'Piyush T', 'Himanshu T'] },
  { totalUsers: 10, title: 'Restricted User', avatars: ['Witin Tayal', 'Srijan D', 'Piyush T', 'Himanshu T'] }
]

const RoleCards = () => {
  // Vars
  const typographyProps = {
    children: 'Edit Role',
    component: Link,
    color: 'primary',
    onClick: e => e.preventDefault()
  }

  const CardProps = {
    className: 'cursor-pointer bs-full',
    children: (
      <Grid container className='bs-full'>
        <Grid size={{ xs: 12 }}>
          <CardContent>
            <div className='flex flex-col items-center justify-center gap-4 bs-full'>
              <Typography>Add new role, if it doesn't exist.</Typography>
              <Button variant='contained' size='small'>
                Add Role
              </Button>
            </div>
          </CardContent>
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <Grid container spacing={6}>
        {cardData.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
            <Card>
              <CardContent className='flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                  <Typography className='flex-grow'>{`Total ${item.totalUsers} users`}</Typography>
                  <AvatarGroup total={item.totalUsers}>
                    {item.avatars.map((name, index) => (
                      <CustomAvatar key={name} skin='light' size={34}>
                        {getInitials(name)}
                      </CustomAvatar>
                    ))}
                  </AvatarGroup>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex flex-col items-start gap-1'>
                    <Typography variant='h5'>{item.title}</Typography>
                    <OpenDialogOnElementClick
                      element={Typography}
                      elementProps={typographyProps}
                      dialog={RoleDialog}
                      dialogProps={{ title: item.title }}
                    />
                  </div>
                  <IconButton>
                    <i className='tabler-copy text-secondary' />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <OpenDialogOnElementClick element={Card} elementProps={CardProps} dialog={RoleDialog} />
        </Grid>
      </Grid>
    </>
  )
}

export default RoleCards
