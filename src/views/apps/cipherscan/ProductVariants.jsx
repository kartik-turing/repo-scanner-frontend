'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

import CustomTextField from '@core/components/mui/TextField'

const ProductVariants = () => {
  return (
    <Card>
      <CardHeader title='Connect Your Repository' />
      <CardContent className='!pb-0'>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <form className='flex justify-end items-end bs-full flex-col gap-5 pbe-6'>
              <CustomTextField select fullWidth label='Repository Type' defaultValue=''>
                <MenuItem value='full-control'>Full Control</MenuItem>
                <MenuItem value='modify'>Modify</MenuItem>
                <MenuItem value='read-execute'>Read & Execute</MenuItem>
                <MenuItem value='list-folder-contents'>List Folder Contents</MenuItem>
                <MenuItem value='read-only'>Read Only</MenuItem>
                <MenuItem value='read-write'>Read & Write</MenuItem>
              </CustomTextField>
              <CustomTextField label='Repository URL' placeholder='Server key 1' fullWidth />
              <Button variant='contained' fullWidth>
                Connect
              </Button>
            </form>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductVariants
