import { useEffect, useState, useRef } from 'react'
import mqtt from 'mqtt'

const MQTT_BROKER_URL = 'wss://broker.emqx.io:8084/mqtt'
const TOPICS = ['timeline', 'cards', 'progress']

export const useMqtt = () => {
  const [cardsMessages, setCardsMessages] = useState([])
  const [timelineMessage, setTimelineMessage] = useState([])
  const [progressMessages, setProgressMessages] = useState([])
  const clientRef = useRef(null) // Store MQTT client

  useEffect(() => {
    if (clientRef.current) return // Prevent duplicate clients

    const client = mqtt.connect(MQTT_BROKER_URL, {
      clean: true,
      reconnectPeriod: 1000
    })

    clientRef.current = client // Store client instance
    console.log('Connecting to MQTT broker...')

    client.on('connect', () => {
      console.log('Connected to MQTT broker')

      if (client.connected) {
        client.subscribe(TOPICS, err => {
          if (err) {
            console.error('Subscription error:', err)
          } else {
            console.log(`Subscribed to topics: ${TOPICS.join(', ')}`)
          }
        })
      }
    })

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString())
        console.log(`Received MQTT message on ${topic}:`, data)

        switch (topic) {
          case 'timeline':
            setTimelineMessage(prev => [data, ...prev])
            break
          case 'cards':
            setCardsMessages(prev => [data, ...prev])
            break
          case 'progress':
            setProgressMessages(prev => [data, ...prev])
            break
          default:
            console.warn('Unhandled topic:', topic)
        }
      } catch (error) {
        console.error('Error parsing MQTT message:', error)
      }
    })

    client.on('error', err => {
      console.error('MQTT Connection Error:', err)
    })

    client.on('close', () => {
      console.log('MQTT connection closed')
    })

    return () => {
      console.log('Cleaning up MQTT connection...')
      if (clientRef.current?.connected) {
        clientRef.current.end(true) // Gracefully end connection
      }
      clientRef.current = null
    }
  }, [])

  return { timelineMessage, cardsMessages, progressMessages }
}
