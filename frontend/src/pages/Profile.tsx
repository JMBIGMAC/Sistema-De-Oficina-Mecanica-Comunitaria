import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Badge,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  Icon,
  Divider,
  SimpleGrid,
  FormHelperText,
} from '@chakra-ui/react';
import { FaUser, FaEdit, FaClock, FaEnvelope, FaShieldAlt, FaCheck } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { profileApi } from '../services/api';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Form state for editing
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Mock data - in real app would come from API
  const profileStats = {
    completion: 85,
    lastActive: '2 hours ago',
    sessionStatus: 'Active',
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
    totalSessions: 247,
    hoursSpent: '124h 32m',
  };

  const calculateProfileCompletion = () => {
    let completion = 0;
    if (user?.firstName) completion += 20;
    if (user?.lastName) completion += 20;
    if (user?.email) completion += 20;
    if (user?.avatar) completion += 20;
    if (user?.role) completion += 20;
    return completion;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await profileApi.updateProfile(formData, avatarFile || undefined);
      
      if (response.success && response.data) {
        // Update the user in the auth context and localStorage
        updateUser({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          avatar: response.data.avatar,
        });
        
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Reset form state
        setAvatarFile(null);
        setAvatarPreview(null);
        onClose();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update profile. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a JPG, PNG, or SVG file.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 5MB.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Please log in to view your profile.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" mb={4}>
            User Profile
          </Heading>
          <Text color="gray.600">
            Manage your account information and preferences
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Main Profile Section */}
          <GridItem>
            <Card bg={cardBg}>
              <CardHeader>
                <HStack>
                  <Icon as={FaUser as any} color="brand.500" />
                  <Heading size="md">Profile Information</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  {/* Avatar and Basic Info */}
                  <HStack spacing={6} align="start">
                    <VStack>
                      <Avatar
                        size="xl"
                        name={`${user.firstName} ${user.lastName}`}
                        src={user.avatar}
                      />
                      <Badge
                        colorScheme={profileStats.sessionStatus === 'Active' ? 'green' : 'gray'}
                      >
                        {profileStats.sessionStatus}
                      </Badge>
                    </VStack>
                    <VStack align="start" flex={1} spacing={3}>
                      <VStack align="start" spacing={1}>
                        <Heading size="lg">
                          {user.firstName} {user.lastName}
                        </Heading>
                        <Text color="gray.600" fontSize="lg">
                          @{user.firstName?.toLowerCase()}{user.lastName?.toLowerCase()}
                        </Text>
                      </VStack>
                      <HStack>
                        <Icon as={FaEnvelope as any} color="gray.500" />
                        <Text>{user.email}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaShieldAlt as any} color="brand.500" />
                        <Badge colorScheme="brand">{user.role}</Badge>
                      </HStack>
                      <HStack>
                        <Icon as={FaClock as any} color="gray.500" />
                        <Text fontSize="sm" color="gray.600">
                          Last active: {profileStats.lastActive}
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>

                  <Divider />

                  {/* Profile Completion */}
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Profile Completion</Text>
                      <Text fontWeight="bold" color="brand.500">
                        {calculateProfileCompletion()}%
                      </Text>
                    </HStack>
                    <Progress 
                      value={calculateProfileCompletion()} 
                      colorScheme="brand" 
                      size="lg" 
                      hasStripe 
                      isAnimated 
                    />
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Icon as={(user.firstName ? FaCheck : FaEdit) as any} color={user.firstName ? 'green.500' : 'gray.400'} />
                        <Text fontSize="sm" color={user.firstName ? 'green.600' : 'gray.500'}>
                          First Name {user.firstName ? '✓' : '(Missing)'}
                        </Text>
                      </HStack>
                      <HStack>
                        <Icon as={(user.lastName ? FaCheck : FaEdit) as any} color={user.lastName ? 'green.500' : 'gray.400'} />
                        <Text fontSize="sm" color={user.lastName ? 'green.600' : 'gray.500'}>
                          Last Name {user.lastName ? '✓' : '(Missing)'}
                        </Text>
                      </HStack>
                      <HStack>
                        <Icon as={(user.email ? FaCheck : FaEdit) as any} color={user.email ? 'green.500' : 'gray.400'} />
                        <Text fontSize="sm" color={user.email ? 'green.600' : 'gray.500'}>
                          Email Address {user.email ? '✓' : '(Missing)'}
                        </Text>
                      </HStack>
                      <HStack>
                        <Icon as={(user.avatar ? FaCheck : FaEdit) as any} color={user.avatar ? 'green.500' : 'gray.400'} />
                        <Text fontSize="sm" color={user.avatar ? 'green.600' : 'gray.500'}>
                          Profile Photo {user.avatar ? '✓' : '(Missing)'}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>

                  <Button colorScheme="brand" onClick={onOpen} leftIcon={<Icon as={FaEdit as any} />}>
                    Edit Profile
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Stats & Activity */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Activity Stats */}
              <Card bg={cardBg}>
                <CardHeader>
                  <Heading size="md">Activity Stats</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <Stat textAlign="center">
                      <StatLabel>Total Sessions</StatLabel>
                      <StatNumber>{profileStats.totalSessions}</StatNumber>
                      <StatHelpText>Since joining</StatHelpText>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel>Time Spent</StatLabel>
                      <StatNumber>{profileStats.hoursSpent}</StatNumber>
                      <StatHelpText>All time</StatHelpText>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel>Member Since</StatLabel>
                      <StatNumber fontSize="md">{profileStats.memberSince}</StatNumber>
                    </Stat>
                  </VStack>
                </CardBody>
              </Card>

              {/* Account Status */}
              <Card bg={cardBg}>
                <CardHeader>
                  <Heading size="md">Account Status</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text>Account Status</Text>
                      <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Role</Text>
                      <Badge colorScheme="brand">{user.role}</Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Security Level</Text>
                      <Badge colorScheme="green">Verified</Badge>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>

        {/* Edit Profile Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </FormControl>
                </SimpleGrid>
                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Profile Photo</FormLabel>
                  <VStack spacing={3} align="start">
                    {(avatarPreview || user?.avatar) && (
                      <Avatar 
                        size="lg" 
                        src={avatarPreview || user?.avatar} 
                        name={`${user?.firstName} ${user?.lastName}`}
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                      onChange={handleAvatarChange}
                      sx={{
                        '::file-selector-button': {
                          height: 10,
                          fontSize: 'sm',
                          fontWeight: 'semibold',
                          color: 'brand.500',
                          backgroundColor: 'transparent',
                          border: '1px solid',
                          borderColor: 'brand.500',
                          borderRadius: 'md',
                          cursor: 'pointer',
                          _hover: {
                            backgroundColor: 'brand.50',
                          },
                        },
                      }}
                    />
                    <FormHelperText>
                      Upload a JPG, PNG, or SVG file. Maximum size: 5MB
                    </FormHelperText>
                  </VStack>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="brand" 
                onClick={handleSave}
                isLoading={isLoading}
                loadingText="Saving..."
              >
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default Profile;