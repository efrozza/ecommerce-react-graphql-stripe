import React from 'react';
import { Box, Text, Heading } from 'gestalt';
import { NavLink } from 'react-router-dom';

const NavBar = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="around"
    height={78}
    color="midnight"
    padding={1}
    shape="roundedBottom"
  >
    {/* signin */}

    <NavLink to="/signin" activeClassName="active">
      <Text size="xl" color="white">
        SignIn
      </Text>
    </NavLink>

    {/* logo */}

    <NavLink activeClassName="active" exact to="/">
      <Box display="flex" alignItems="center">
        <Heading size="xs" color="orange">
          FlashCards
        </Heading>
      </Box>
    </NavLink>

    {/* signup */}

    <NavLink to="/signup" activeClassName="active">
      <Text size="xl" color="white">
        SignUp
      </Text>
    </NavLink>
  </Box>
);
export default NavBar;
