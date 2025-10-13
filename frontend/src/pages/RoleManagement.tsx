import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  useToast,
  useColorModeValue,
  Spinner,
  Text,
  Badge,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { aclApi } from '../services/api';
import { RoleData, PageData, PermissionMatrix } from '../types';

const RoleManagement: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [permissions, setPermissions] = useState<PermissionMatrix>({});
  const [changes, setChanges] = useState<any[]>([]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const changeCardBg = useColorModeValue('blue.50', 'blue.900');

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await aclApi.getRolePermissions();
      if (response.success && response.data) {
        setRoles(response.data.roles);
        setPages(response.data.pages);
        setPermissions(response.data.permissions);
      } else {
        throw new Error(response.error || 'Failed to load data');
      }
    } catch (error: any) {
      toast({
        title: 'Error loading permissions',
        description: error.message || 'Failed to load data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePermissionChange = (
    roleName: string,
    pagePath: string,
    permissionType: 'canView' | 'canEdit',
    value: boolean
  ) => {
    // Update local state
    setPermissions((prev) => ({
      ...prev,
      [roleName]: {
        ...prev[roleName],
        [pagePath]: {
          ...prev[roleName]?.[pagePath],
          [permissionType]: value,
        },
      },
    }));

    // Track changes
    const changeKey = `${roleName}:${pagePath}`;
    const existingChangeIndex = changes.findIndex(
      (c) => `${c.role}:${c.page}` === changeKey
    );

    if (existingChangeIndex >= 0) {
      const updatedChanges = [...changes];
      updatedChanges[existingChangeIndex] = {
        ...updatedChanges[existingChangeIndex],
        [permissionType]: value,
      };
      setChanges(updatedChanges);
    } else {
      setChanges([
        ...changes,
        {
          role: roleName,
          page: pagePath,
          canView: permissions[roleName]?.[pagePath]?.canView ?? false,
          canEdit: permissions[roleName]?.[pagePath]?.canEdit ?? false,
          [permissionType]: value,
        },
      ]);
    }
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      const response = await aclApi.updateRolePermissions(changes);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save changes');
      }
      
      toast({
        title: 'Permissions saved',
        description: 'Permission changes have been saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setChanges([]);
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error saving permissions',
        description: error.message || 'Failed to save changes',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = () => {
    setChanges([]);
    fetchData();
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading permissions...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>
            Role & Permission Management
          </Heading>
          <Text color="gray.500">
            Manage access permissions for different roles across all pages
          </Text>
        </Box>

        {changes.length > 0 && (
          <Card bg={changeCardBg}>
            <CardBody>
              <HStack justify="space-between">
                <Text fontWeight="bold">
                  You have {changes.length} unsaved change{changes.length !== 1 ? 's' : ''}
                </Text>
                <HStack>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={discardChanges}
                    isDisabled={saving}
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={saveChanges}
                    isLoading={saving}
                  >
                    Save Changes
                  </Button>
                </HStack>
              </HStack>
            </CardBody>
          </Card>
        )}

        <Box overflowX="auto" bg={bgColor} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Page</Th>
                {roles.map((role) => (
                  <Th key={role.id} colSpan={2} textAlign="center">
                    <VStack spacing={0}>
                      <Text fontWeight="bold">{role.displayName}</Text>
                      <HStack spacing={4} fontSize="xs" color="gray.500">
                        <Text>View</Text>
                        <Text>Edit</Text>
                      </HStack>
                    </VStack>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {pages.map((page) => (
                <Tr key={page.id}>
                  <Td>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">{page.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {page.path}
                      </Text>
                    </VStack>
                  </Td>
                  {roles.map((role) => {
                    const perm = permissions[role.name]?.[page.path] || {
                      canView: false,
                      canEdit: false,
                    };
                    return (
                      <React.Fragment key={`${role.id}-${page.id}`}>
                        <Td textAlign="center">
                          <Checkbox
                            isChecked={perm.canView}
                            onChange={(e) =>
                              handlePermissionChange(
                                role.name,
                                page.path,
                                'canView',
                                e.target.checked
                              )
                            }
                          />
                        </Td>
                        <Td textAlign="center">
                          <Checkbox
                            isChecked={perm.canEdit}
                            onChange={(e) =>
                              handlePermissionChange(
                                role.name,
                                page.path,
                                'canEdit',
                                e.target.checked
                              )
                            }
                          />
                        </Td>
                      </React.Fragment>
                    );
                  })}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box>
          <Heading size="md" mb={3}>
            Role Descriptions
          </Heading>
          <VStack spacing={3} align="stretch">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardBody>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Text fontWeight="bold">{role.displayName}</Text>
                        <Badge colorScheme="green">Active</Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        {role.description}
                      </Text>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default RoleManagement;
