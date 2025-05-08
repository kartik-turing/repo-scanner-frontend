'use client'

import { useEffect, useState } from 'react'
import PartnersList from '@/views/apps/partners/PartnersList'

const PartnerListTablePage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const getEcommerceData = async (displayLoader = true) => {
    if (displayLoader) {
      setLoading(true)
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/partners`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
          Accept: '*/*'
        }
      })

      if (!res.ok) throw new Error('Failed to fetch data')
      const json = await res.json()
      console.log(json)

      setData(json.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getEcommerceData()
  }, [])

  return (
    <PartnersList
      initialData={data}
      onDataUpdated={getEcommerceData} // pass to child
      loading={loading}
    />
  )
}

export default PartnerListTablePage
