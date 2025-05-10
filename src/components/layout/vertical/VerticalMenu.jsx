// Next Imports
import { useParams } from 'next/navigation'
import { useTheme } from '@mui/material/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Menu, MenuItem } from '@menu/vertical-menu'
import useVerticalNav from '@menu/hooks/useVerticalNav'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }) => {
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href={`/${locale}/apps/dashboard`}>{dictionary['navigation'].academy}</MenuItem>
        <MenuItem href={`/${locale}/apps/sdk`}>{dictionary['navigation'].qgsdk}</MenuItem>
        {/* sdkdetaills */}
        {/* <MenuItem href={`/${locale}/apps/sdk/details`}>{dictionary['navigation'].qgSDKDetails}</MenuItem> */}
        <MenuItem href={`/${locale}/apps/keymanagement`}>{dictionary['navigation'].qgkms}</MenuItem>
        {/* keyManagement key add  */}
        {/* <MenuItem href={`/${locale}/apps/keymanagement/addkey`}>{dictionary['navigation'].addkey}</MenuItem> */}
        <MenuItem href={`/${locale}/apps/vault`}>{dictionary['navigation'].qgVault}</MenuItem>
        <MenuItem href={`/${locale}/apps/cipherscan`}>{dictionary['navigation'].cipherscan}</MenuItem>
        <MenuItem href={`/${locale}/apps/integrations`}>{dictionary['navigation'].qgIntegrations}</MenuItem>
        <MenuItem href={`/${locale}/apps/permissions`}>{dictionary['navigation'].qgPermissions}</MenuItem>
        <MenuItem href={`/${locale}/apps/support`}>{dictionary['navigation'].qgSupport}</MenuItem>
        <MenuItem href={`/${locale}/apps/users`}>{dictionary['navigation'].qgusers}</MenuItem>
        <MenuItem href={`/${locale}/apps/devkit`}>{dictionary['navigation'].devkit}</MenuItem>
        <MenuItem href={`/${locale}/apps/subscription`}>{dictionary['navigation'].subscription}</MenuItem>
        <MenuItem href={`/${locale}/apps/partner`}>{dictionary['navigation'].partners}</MenuItem>
        <MenuItem href={`/${locale}/apps/customer`}>{dictionary['navigation'].customer}</MenuItem>
        <MenuItem href={`/${locale}/apps/repositories`}>{dictionary['navigation'].repositories}</MenuItem>
        <MenuItem href={`/${locale}/apps/dbdumps`}>{dictionary['navigation'].dbdumps}</MenuItem>
        <MenuItem href={`/${locale}/apps/networksettings`}>{dictionary['navigation'].networksettings}</MenuItem>
        <MenuItem href={`/${locale}/apps/scanschedulers`}>{dictionary['navigation'].scanschedulers}</MenuItem>
        <MenuItem href={`/${locale}/apps/scansessions`}>{dictionary['navigation'].scansessions}</MenuItem>
        <MenuItem href={`/${locale}/apps/discoverycodes`}>{dictionary['navigation'].discoverycodes}</MenuItem>
        <MenuItem href={`/${locale}/apps/discoverydatabase`}>{dictionary['navigation'].discoverydatabase}</MenuItem>
        <MenuItem href={`/${locale}/apps/discoverynetworks`}>{dictionary['navigation'].discoverynetworks}</MenuItem>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
