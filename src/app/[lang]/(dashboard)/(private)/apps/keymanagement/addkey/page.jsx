// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ProductAddHeader from '@views/apps/keymanagement/addkey/ProductAddHeader'
import ProductInformation from '@views/apps/keymanagement/addkey/ProductInformation'
import ProductImage from '@views/apps/keymanagement/addkey/ProductImage'
import ProductVariants from '@views/apps/keymanagement/addkey/ProductVariants'
import ProductInventory from '@views/apps/keymanagement/addkey/ProductInventory'
import ProductPricing from '@views/apps/keymanagement/addkey/ProductPricing'
import ProductOrganize from '@views/apps/keymanagement/addkey/ProductOrganize'

const eCommerceProductsAdd = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ProductAddHeader />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <ProductInformation />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ProductImage />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ProductVariants />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ProductInventory />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <ProductPricing />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ProductOrganize />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default eCommerceProductsAdd
