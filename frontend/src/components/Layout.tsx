import React, { ReactNode } from 'react';
import {
  Box,
  Flex,
  Spacer,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  HStack,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getFeatureFlags } from '../utils/permissions';
import RoleBasedRender from './RoleBasedRender';
import { UserRole } from '../types';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const featureFlags = getFeatureFlags(user);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'About', path: '/', public: true },
    { 
      label: 'Home', 
      path: '/home', 
      requireAuth: true,
      roles: [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN]
    },
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      requireAuth: true,
      roles: [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN]
    },
    { 
      label: 'Payment', 
      path: '/home/payment', 
      requireAuth: true,
      roles: [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN]
    },
    { 
      label: 'Analytics', 
      path: '/analytics', 
      requireAuth: true,
      show: featureFlags.showAnalytics
    },
    { 
      label: 'User Problems', 
      path: '/usersProblems', 
      requireAuth: true,
      roles: [UserRole.MODERATOR, UserRole.ADMIN]
    },
    { 
      label: 'Role Management', 
      path: '/organization/roles', 
      requireAuth: true,
      roles: [UserRole.ADMIN]
    },
    { 
      label: 'User Monitoring', 
      path: '/control/users', 
      requireAuth: true,
      roles: [UserRole.ADMIN]
    },
  ];

  const NavLinks = ({ isMobile = false }) => (
    <>
      {navItems.map((item) => {
        // Don't show if explicitly hidden
        if (item.show === false) return null;
        
        // Show public items or authenticated items based on auth status
        if (item.public || (item.requireAuth && isAuthenticated)) {
          return (
            <RoleBasedRender
              key={item.path}
              roles={item.roles}
              requireAuth={item.requireAuth}
            >
              <Button
                as={RouterLink}
                to={item.path}
                variant="ghost"
                size={isMobile ? 'lg' : 'md'}
                width={isMobile ? 'full' : 'auto'}
                justifyContent={isMobile ? 'flex-start' : 'center'}
                onClick={isMobile ? onClose : undefined}
              >
                {item.label}
              </Button>
            </RoleBasedRender>
          );
        }
        return null;
      })}
    </>
  );

  return (
    <Box minH="100vh">
      {/* Header */}
      <Box
        bg={bg}
        borderBottom="1px"
        borderColor={borderColor}
        px={4}
        py={2}
        position="sticky"
        top={0}
        zIndex={1000}
        boxShadow="sm"
      >
        <Flex align="center" maxW="container.xl" mx="auto">
          {/* Logo */}
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="brand.500"
            as={RouterLink}
            to="/"
            _hover={{ textDecoration: 'none', color: 'brand.600' }}
          >
            TemplateV2
          </Text>

          {/* Desktop Navigation */}
          <HStack spacing={4} ml={8} display={{ base: 'none', md: 'flex' }}>
            <NavLinks />
          </HStack>

          <Spacer />

          {/* Right side actions */}
          <HStack spacing={2}>
            {/* Color mode toggle - removed for now */}

            {isAuthenticated && user ? (
              /* User menu */
              <Menu>
                <MenuButton as={Button} variant="ghost" size="sm">
                  <HStack spacing={2}>
                    <Avatar size="sm" name={`${user.firstName} ${user.lastName}`} src={user.avatar} />
                    <Text display={{ base: 'none', md: 'block' }}>
                      {user.firstName}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/settings">
                    Settings
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout} color="error.500">
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              /* Auth buttons */
              <HStack spacing={2}>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  size="sm"
                >
                  Login
                </Button>
                <Button
                  as={RouterLink}
                  to="/signup"
                  variant="solid"
                  size="sm"
                >
                  Sign Up
                </Button>
              </HStack>
            )}

            {/* Mobile menu button */}
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
              variant="ghost"
              size="sm"
              display={{ base: 'flex', md: 'none' }}
            />
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navigation</DrawerHeader>
          <DrawerBody>
            <VStack spacing={2} align="stretch">
              <NavLinks isMobile />
              {!isAuthenticated && (
                <>
                  <Button
                    as={RouterLink}
                    to="/login"
                    variant="outline"
                    size="lg"
                    width="full"
                    onClick={onClose}
                  >
                    Login
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/signup"
                    variant="solid"
                    size="lg"
                    width="full"
                    onClick={onClose}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box as="main" flex="1">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;