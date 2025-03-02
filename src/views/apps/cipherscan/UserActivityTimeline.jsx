'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'

import CurrentTimeline from './CurrentTimeline'
import { useMqtt } from '@/hooks/useMqtt'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Styled Timeline component
const Timeline = styled(MuiTimeline)({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const UserActivityTimeLine = () => {
  const { timelineMessage } = useMqtt()
  console.log('Nitin Niitn UserActivityTimeLine:', timelineMessage)

  return (
    <Card>
      <CardHeader title='' />
      <CardContent>
        {/* Scrollable Container */}
        <PerfectScrollbar
          style={{
            maxHeight: timelineMessage?.length > 2 ? '715px' : 'auto',
            paddingRight: '8px' // Prevents scrollbar from overlapping content
          }}
        >
          <Timeline>
            {timelineMessage &&
              timelineMessage.map((item, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color='primary' />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                      <Typography className='font-medium' color='text.primary'>
                        {item.filename}
                      </Typography>
                      <Typography variant='caption' color='text.disabled'>
                        12 min ago
                      </Typography>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <Typography className='mbe-2'>
                        {item.description} in line {item.lineNumber}
                      </Typography>
                      <Typography variant='caption' color='text.disabled'>
                        <div className='flex items-center gap-2.5 is-fit bg-actionHover rounded plb-[5px] pli-2.5'>
                          <Typography className='font-medium'>low </Typography>
                        </div>
                      </Typography>
                    </div>
                    <Typography className='mbe-2'>{item.codeSnippet}</Typography>
                    <div style={{ marginTop: '10px' }}></div>
                    <CurrentTimeline title={item.recommendedFix.title} body={item.recommendedFix.body} />
                  </TimelineContent>
                </TimelineItem>
              ))}
          </Timeline>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  )
}

export default UserActivityTimeLine
