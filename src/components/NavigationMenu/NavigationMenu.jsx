import React from 'react'
import routingItems, { routingItemsForAdmin } from '../consts/consts.js'

import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
function NavigationMenu(props) {
  const navigate = useNavigate()
  return (
    <>
      {props.isUser !== null
        ? routingItemsForAdmin.map((item) => {
            return (
              <Box key={item.id}>
                <Button
                  variant="text"
                  onClick={() => {
                    props.handleToggleDrawer && props.handleToggleDrawer() // close the drawer for phone screans
                    navigate(item.routing)
                  }}
                  children={item.label}
                  sx={{
                    color: props.color,
                    fontSize: '1rem',
                  }}
                />
              </Box>
            )
          })
        : routingItems.map((item) => {
            return (
              <Box key={item.id}>
                <Button
                  variant="text"
                  onClick={() => {
                    props.handleToggleDrawer && props.handleToggleDrawer() // close the drawer for phone screans
                    navigate(item.routing)
                  }}
                  children={item.label}
                  sx={{
                    marginTop: 2.5,
                    color: props.color,
                    fontSize: '1rem',
                  }}
                />
              </Box>
            )
          })}
    </>
  )
}

export default NavigationMenu
