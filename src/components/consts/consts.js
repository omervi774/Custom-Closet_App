// consts file contain all the logic in the app
const routingItems = [
  { id: 4, label: 'בינה מלאכותית', routing: 'ai' },
  { id: 2, label: 'עיצוב ארון', routing: 'closetDesign' },
  { id: 1, label: 'דף הבית', routing: '/' },
]
export const routingItemsForAdmin = [
  { id: 5, label: 'ניהול מלאי', routing: 'stock' },
  { id: 3, label: 'הזמנות', routing: 'orders' },
  { id: 1, label: 'דף הבית', routing: '/' },
]

export const serverRoute = process.env.REACT_APP_SERVER_ROUTE
export const appRoute = process.env.REACT_APP_ROUTE

// login modal style
export const loginModalStyle = {
  modalWrapper: {
    position: 'absolute',
    top: '33vh',
    left: '29vh',

    transform: 'translate(-50%, -50%)',
    width: 400,
    // height: 400,
    bgcolor: 'white',
    borderTop: '1px solid #FFC107',
    boxShadow: 24,
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    bgcolor: 'background.default',
    color: 'text.primary',
    height: '7vh',
  },
  formStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '5vh',
  },
  inputTexts: {
    marginBottom: '4vh',
    width: '58%',
  },
  inputLabels: {
    textAlign: 'right',
    width: '100%',
  },
  buttons: {
    width: '58%',
    marginBottom: '4vh',
  },
  text: {
    fontSize: '1.5rem',
    width: '58%',
    textAlign: 'right',
    paddingBottom: '4vh',
    '&:hover': { cursor: 'pointer', textDecoration: 'underline' },
  },
}
// phone login page style
export const phoneLogInStyle = {
  contentWrapper: {},
  formStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '5vh',
  },
  inputTexts: {
    marginBottom: '4vh',
    width: '160%',
  },
  inputLabels: {
    textAlign: 'right',
    width: '100%',
    fontSize: '1.4rem',
  },
  buttons: {
    width: '160%',
    marginBottom: '4vh',
    color: 'white',
    fontSize: '1.4rem',
  },
  text: {
    fontSize: '2rem',
    width: '160%',
    textAlign: 'right',
    paddingBottom: '4vh',
    '&:hover': { cursor: 'pointer', textDecoration: 'underline' },
  },
}
export default routingItems
