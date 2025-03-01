'use client'
import Card from '@mui/material/Card'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

const CurrentTimeline = data => {
  console.log('Nitin Current Timeline:', data)
  const { title, body } = data
  return (
    <Card>
      <Alert icon={false} severity='warning'>
        <AlertTitle>{title}</AlertTitle>
        {body}
      </Alert>
    </Card>
  )
}

export default CurrentTimeline
