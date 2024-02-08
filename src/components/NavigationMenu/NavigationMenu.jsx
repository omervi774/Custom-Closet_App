import React from "react";
import routingItems from "../consts/consts.js";

import { Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
function NavigationMenu(props) {
  const navigate = useNavigate();
  return (
    <>
      {routingItems.map((item) => {
        return (
          <>
            <Tooltip
              key={item.id}
              title={item.label}
              placement={props.toolTipPlacement}
            >
              <Button
                variant="text"
                onClick={() => {
                  props.handleToggleDrawer && props.handleToggleDrawer(); // close the drawer for phone screans
                  navigate(item.routing);
                }}
                children={item.label}
                sx={{
                  color: props.color,
                  fontSize: "1.5rem",
                }}
              />
            </Tooltip>
          </>
        );
      })}
    </>
  );
}

export default NavigationMenu;
