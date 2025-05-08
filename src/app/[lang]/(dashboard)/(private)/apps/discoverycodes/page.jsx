'use client'

import { useEffect, useState } from 'react'
import AiUniverseList from '@/views/apps/aiuniverse/AiUniverseList'
import DevkitList from '@/views/apps/devkits/DevkitList'
import PartnersList from '@/views/apps/partners/PartnersList'
import CustomerList from '@/views/apps/customers/CustomerList'
import RepositoryList from '@/views/apps/repositories/RepositoryList'
import DbDumpsList from '@/views/apps/dbdumps/DbDumpsList'
import DiscoveryCodeList from '@/views/apps/discoverycodes/DiscoveryCodeList'

const DiscoveryCodeListTablePage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const getEcommerceData = async (displayLoader = true) => {
    if (displayLoader) {
      setLoading(true)
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/discovery-list-code`, {
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
    <DiscoveryCodeList
      initialData={data}
      onDataUpdated={getEcommerceData} // pass to child
      loading={loading}
    />
  )
}

export default DiscoveryCodeListTablePage
