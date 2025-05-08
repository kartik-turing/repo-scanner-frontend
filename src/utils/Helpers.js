import { Oval } from 'react-loader-spinner'

// Common loader for the button loading.
export const selectLoader = (size = 20) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
      //   padding: '10px'
    }}
  >
    <Oval height={size} width={size} color='#0000FF' ariaLabel='oval-loading' wrapperStyle={{}} wrapperClass='' />
  </div>
)
