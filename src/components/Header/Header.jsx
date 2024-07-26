import React, { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import style from './headerStyle'
import { useNavigate } from 'react-router-dom'
import { Box, Button, List, Stack, IconButton, Drawer } from '@mui/material'
import LoginModal from '../LoginModal/LoginModal'
import useMediaQuery from '@mui/material/useMediaQuery'
import MenuIcon from '@mui/icons-material/Menu'
import NavigationMenu from '../NavigationMenu/NavigationMenu'
import useUser from '../../useUser'

export default function Header() {
  const navigate = useNavigate()
  const [openLogInModal, setOpenLogInModal] = useState(false)
  const [openHamburgerMenu, setOpenHamburgerMenu] = useState(false)
  const user = useUser()
  const isDesktopScreen = useMediaQuery('(min-width:600px)')

  const handleOpen = () => setOpenLogInModal(true)
  const handleClose = () => setOpenLogInModal(false)
  const handleToggleDrawer = () => setOpenHamburgerMenu(!openHamburgerMenu)

  return (
    <Box>
      {/* nav bar styling */}
      <Box
        color="theme.secondary.light"
        sx={{
          backgroundColor: '#ffffff80',
          ...style.wrapper,
          fontFamily: 'Calibri, sans-serif',
          padding: '0 20px', // Adjust padding if necessary
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* IconButton for mobile menu */}
        {!isDesktopScreen && (
          <IconButton
            color="#222222"
            aria-label="open drawer"
            edge="start"
            onClick={handleToggleDrawer}
            sx={{ color: '#222222', fontFamily: 'Calibri, sans-serif' }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        )}

        {/* Register and login buttons */}
        <Stack direction="row" spacing="1rem" sx={{ flexShrink: 0 }}>
          {user === null && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: 'black',
                width: isDesktopScreen ? 'auto' : '100%',
                fontFamily: 'Calibri, sans-serif',
                flexShrink: 0,
                borderColor: 'black', // Set the border color

                '&:hover': {
                  backgroundColor: '#f3efeb', // Optional: Set a darker color for hover effect
                },
              }}
              onClick={
                isDesktopScreen
                  ? handleOpen
                  : () => {
                      navigate('phoneLogIn')
                    }
              }
            >
              התחבר
            </Button>
          )}
          {user && (
            <Button
              color="success"
              variant="contained"
              sx={{
                backgroundColor: '#e2dede',
                color: 'black',
                width: isDesktopScreen ? 'auto' : '100%',
                fontFamily: 'Calibri, sans-serif',
                flexShrink: 0,
                borderColor: '#e2dede', // Set the border color
                '&:hover': {
                  backgroundColor: '#2e4a78', // Optional: Set a darker color for hover effect
                },
              }}
              onClick={() => {
                signOut(auth)
                navigate('/')
              }}
            >
              התנתק
            </Button>
          )}
        </Stack>

        {/* On desktop screen display the navigation items */}
        {isDesktopScreen && (
          <Stack direction="row" spacing={-12} alignItems="center" sx={{ flexGrow: 1, justifyContent: 'flex-end' }}>
            <List sx={{ ...style.itemsWrapper, fontFamily: 'Calibri, sans-serif', marginTop: '100px' }}>
              <NavigationMenu color="#222222" isUser={user} />
            </List>
            <Box
              component="img"
              src="/1.png"
              alt="Custom Closet"
              sx={{ maxWidth: '200px', height: 'auto', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
          </Stack>
        )}
      </Box>

      {/* Mobile Drawer Menu */}
      <Drawer anchor="top" open={openHamburgerMenu} onClose={handleToggleDrawer} sx={{ display: { xs: 'block', md: 'none' } }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ padding: '16px', justifyContent: 'flex-end' }}>
          <List sx={{ ...style.drawerStyle, fontFamily: 'Calibri, sans-serif' }}>
            <NavigationMenu color="#222222" toolTipPlacement="left" handleToggleDrawer={handleToggleDrawer} isUser={user} />
          </List>
          <Box component="img" src="/logotype.png" alt="Custom Closet" sx={{ maxWidth: '150px', height: 'auto' }} />
        </Stack>
      </Drawer>

      <LoginModal open={openLogInModal} handleClose={handleClose} />
    </Box>
  )
}
