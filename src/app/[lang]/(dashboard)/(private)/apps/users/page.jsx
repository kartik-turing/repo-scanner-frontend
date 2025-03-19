// Data Imports
// import { getEcommerceData } from '@/app/server/actions'

import CustomerListTable from '@/views/apps/users/CustomerListTable'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/ecommerce` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */
const getEcommerceData = async () => {
  try {
    const res = await fetch(`https://api-dev.genieapps.co.in/api/utopia/users`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        Accept: '*/*'
      }
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch eCommerce data: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    console.log('Fetched data:', data.data.users)

    return data.data.users
  } catch (error) {
    console.error('Error fetching eCommerce data:', error)
    throw error
  }
}

const CustomerListTablePage = async () => {
  const data = await getEcommerceData()

  return <CustomerListTable customerData={data} />
}

export default CustomerListTablePage
