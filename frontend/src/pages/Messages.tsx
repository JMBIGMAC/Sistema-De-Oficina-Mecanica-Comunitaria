import React, { useState, useEffect } from 'react';
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
  Badge,
  Textarea,
  Flex,
  Input,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { messagesApi } from '../services/api';

interface Message {
  id: string;
  from: {
    name: string;
    role: UserRole;
    avatar?: string;
  };
  subject: string;
  content: string;
  timestamp: Date;
  isResolved: boolean;
  resolvedBy?: {
    name: string;
    role: UserRole;
  };
  isHidden: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  from: {
    name: string;
    role: UserRole;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen: isChatOpen, onOpen: onChatOpen, onClose: onChatClose } = useDisclosure();
  const { isOpen: isNewMessageOpen, onOpen: onNewMessageOpen, onClose: onNewMessageClose } = useDisclosure();
  
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const messageBoxBg = useColorModeValue('gray.50', 'gray.700');
  const chatWindowBg = useColorModeValue('white', 'gray.800');

  const loadMessages = React.useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await messagesApi.getMessages();
      if (response.success && response.data) {
        // Transform backend data to frontend format
        const transformedMessages = response.data.map((msg: any) => ({
          id: msg.id,
          from: {
            name: msg.from.name,
            role: msg.from.role.toLowerCase() as UserRole,
            avatar: msg.from.avatar,
          },
          subject: msg.subject,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isResolved: msg.isResolved,
          resolvedBy: msg.resolvedBy ? {
            name: msg.resolvedBy.name,
            role: msg.resolvedBy.role.toLowerCase() as UserRole,
          } : undefined,
          isHidden: msg.isHidden,
          replies: msg.replies.map((reply: any) => ({
            id: reply.id,
            from: {
              name: reply.from.name,
              role: reply.from.role.toLowerCase() as UserRole,
              avatar: reply.from.avatar,
            },
            content: reply.content,
            timestamp: new Date(reply.timestamp),
          })),
        }));
        setMessages(transformedMessages);
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to load messages',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Load messages from backend
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'purple';
      case UserRole.MODERATOR:
        return 'blue';
      default:
        return 'green';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const handleOpenChat = (message: Message) => {
    setSelectedMessage(message);
    onChatOpen();
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await messagesApi.replyToMessage(selectedMessage.id, replyText);
      if (response.success && response.data) {
        // Transform the reply to match frontend format
        const newReply: Reply = {
          id: response.data.id,
          from: {
            name: response.data.from.name,
            role: response.data.from.role.toLowerCase() as UserRole,
            avatar: response.data.from.avatar,
          },
          content: response.data.content,
          timestamp: new Date(response.data.timestamp),
        };

        // Update the selected message with the new reply
        const updatedMessage = {
          ...selectedMessage,
          replies: [...selectedMessage.replies, newReply]
        };
        setSelectedMessage(updatedMessage);

        // Update the messages list
        setMessages(prev => prev.map(msg => 
          msg.id === selectedMessage.id 
            ? updatedMessage
            : msg
        ));

        setReplyText('');
        
        toast({
          title: 'Reply sent',
          description: 'Your reply has been sent successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to send reply',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reply',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveMessage = async (messageId: string) => {
    setIsSubmitting(true);
    try {
      const response = await messagesApi.resolveMessage(messageId);
      if (response.success) {
        // Update both the selected message and the messages list
        const updatedMessage = messages.find(msg => msg.id === messageId);
        if (updatedMessage) {
          const resolvedMessage = {
            ...updatedMessage,
            isResolved: true,
            resolvedBy: {
              name: response.data?.resolvedBy?.name || `${user?.firstName} ${user?.lastName}` || 'Unknown User',
              role: response.data?.resolvedBy?.role?.toLowerCase() as UserRole || user?.role || UserRole.USER,
            }
          };
          
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? resolvedMessage : msg
          ));
          
          if (selectedMessage?.id === messageId) {
            setSelectedMessage(resolvedMessage);
          }
        }

        toast({
          title: 'Message resolved',
          description: 'The message has been marked as resolved.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        onChatClose();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to resolve message',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resolve message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHideMessage = async (messageId: string) => {
    setIsSubmitting(true);
    try {
      const response = await messagesApi.hideMessage(messageId);
      if (response.success) {
        // Remove the message from the list instead of hiding it locally
        // since the backend hides it completely
        setMessages(prev => prev.filter(msg => msg.id !== messageId));

        toast({
          title: 'Message hidden',
          description: 'The message has been hidden.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to hide message',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to hide message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendNewMessage = async () => {
    if (!newMessageSubject.trim() || !newMessageContent.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await messagesApi.createMessage(newMessageSubject, newMessageContent);
      if (response.success && response.data) {
        // Transform the new message to match frontend format
        const newMessage: Message = {
          id: response.data.id,
          from: {
            name: response.data.from.name,
            role: response.data.from.role.toLowerCase() as UserRole,
            avatar: response.data.from.avatar,
          },
          subject: response.data.subject,
          content: response.data.content,
          timestamp: new Date(response.data.timestamp),
          isResolved: response.data.isResolved,
          resolvedBy: response.data.resolvedBy,
          isHidden: response.data.isHidden,
          replies: [],
        };

        setMessages(prev => [newMessage, ...prev]);
        
        setNewMessageSubject('');
        setNewMessageContent('');
        onNewMessageClose();

        toast({
          title: 'Message sent',
          description: 'Your message has been sent to the moderators.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to send message',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter messages and sort by timestamp (newest first)
  const visibleMessages = messages
    .filter(msg => !msg.isHidden)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (!user) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Please log in to view messages.</Text>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading messages...</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        {/* Header */}
        <Flex 
          align={{ base: 'flex-start', md: 'center' }} 
          justify="space-between"
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 3, md: 0 }}
        >
          <Box>
            <Heading size={{ base: 'lg', md: 'xl' }} mb={2}>
              Messages
            </Heading>
            <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>
              Communicate with moderators and administrators
            </Text>
          </Box>
          <Button
            colorScheme="brand"
            onClick={onNewMessageOpen}
            size={{ base: 'md', md: 'lg' }}
            width={{ base: 'full', md: 'auto' }}
            minHeight={{ base: '48px', md: 'auto' }}
            flexShrink={0}
          >
            ✉️ New Message
          </Button>
        </Flex>

        {/* Messages List */}
        <VStack spacing={4} align="stretch">
          {visibleMessages.length === 0 ? (
            <Card bg={cardBg}>
              <CardBody textAlign="center" py={16}>
                <Text fontSize="lg" color="gray.500">
                  No messages found
                </Text>
                <Text color="gray.400" mt={2}>
                  Start a conversation with the moderators
                </Text>
              </CardBody>
            </Card>
          ) : (
            visibleMessages.map((message) => (
              <Card 
                key={message.id} 
                bg={cardBg}
                borderLeft={message.isResolved ? "4px solid" : "4px solid"}
                borderLeftColor={message.isResolved ? "green.400" : "brand.400"}
                cursor="pointer"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                onClick={() => handleOpenChat(message)}
              >
                <CardBody>
                  <Flex align="start" justify="space-between">
                    <HStack spacing={4} flex="1">
                      <Avatar 
                        size="md"
                        name={message.from.name}
                        src={message.from.avatar}
                        bg={`${getRoleColor(message.from.role)}.500`}
                      />
                      <VStack align="start" spacing={1} flex="1">
                        <HStack>
                          <Text fontWeight="bold">{message.from.name}</Text>
                          <Badge 
                            colorScheme={getRoleColor(message.from.role)}
                            size="sm"
                          >
                            {message.from.role.toUpperCase()}
                          </Badge>
                          {message.isResolved && (
                            <Badge colorScheme="green" size="sm">
                              RESOLVED
                            </Badge>
                          )}
                        </HStack>
                        <Text fontWeight="semibold" fontSize="lg">
                          {message.subject}
                        </Text>
                        <Text color="gray.600" noOfLines={2}>
                          {message.content}
                        </Text>
                        <HStack spacing={4} fontSize="sm" color="gray.500">
                          <HStack>
                            <Text>🕒</Text>
                            <Text>{formatTimestamp(message.timestamp)}</Text>
                          </HStack>
                          {message.replies.length > 0 && (
                            <Text>{message.replies.length} replies</Text>
                          )}
                        </HStack>
                      </VStack>
                    </HStack>
                    <VStack spacing={2}>
                      <Button
                        aria-label="Hide message"
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHideMessage(message.id);
                        }}
                      >
                        👁️‍🗨️
                      </Button>
                    </VStack>
                  </Flex>
                </CardBody>
              </Card>
            ))
          )}
        </VStack>

        {/* Chat Modal */}
        <Modal isOpen={isChatOpen} onClose={onChatClose} size={{ base: 'full', md: 'xl' }}>
          <ModalOverlay />
          <ModalContent maxH={{ base: '100vh', md: '80vh' }} m={{ base: 0, md: 4 }}>
            <ModalHeader px={{ base: 4, md: 6 }} pt={{ base: 4, md: 6 }}>
              <VStack align="start" spacing={1}>
                <Text fontSize={{ base: 'md', md: 'lg' }} noOfLines={2}>{selectedMessage?.subject}</Text>
                <HStack flexWrap="wrap">
                  <Text fontSize="sm" color="gray.500">
                    Started by {selectedMessage?.from.name}
                  </Text>
                  <Badge 
                    colorScheme={getRoleColor(selectedMessage?.from.role || UserRole.USER)}
                    size="sm"
                  >
                    {selectedMessage?.from.role.toUpperCase()}
                  </Badge>
                </HStack>
              </VStack>
            </ModalHeader>
            <ModalCloseButton top={{ base: 3, md: 4 }} right={{ base: 3, md: 4 }} />
            <ModalBody overflowY="auto" px={{ base: 4, md: 6 }}>
              <VStack spacing={4} align="stretch">
                {/* Original Message */}
                <Box
                  bg={messageBoxBg}
                  p={4}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderLeftColor="brand.400"
                >
                  <HStack mb={2}>
                    <Avatar 
                      size="sm"
                      name={selectedMessage?.from.name}
                      src={selectedMessage?.from.avatar}
                    />
                    <Text fontWeight="bold">{selectedMessage?.from.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {selectedMessage && formatTimestamp(selectedMessage.timestamp)}
                    </Text>
                  </HStack>
                  <Text>{selectedMessage?.content}</Text>
                </Box>

                {/* Replies */}
                {selectedMessage?.replies.map((reply) => (
                  <Box
                    key={reply.id}
                    bg={reply.from.role === user?.role ? 'brand.50' : messageBoxBg}
                    p={4}
                    borderRadius="lg"
                    ml={reply.from.role === user?.role ? 8 : 0}
                    mr={reply.from.role === user?.role ? 0 : 8}
                  >
                    <HStack mb={2}>
                      <Avatar 
                        size="sm"
                        name={reply.from.name}
                        src={reply.from.avatar}
                      />
                      <Text fontWeight="bold">{reply.from.name}</Text>
                      <Badge 
                        colorScheme={getRoleColor(reply.from.role)}
                        size="sm"
                      >
                        {reply.from.role.toUpperCase()}
                      </Badge>
                      <Text fontSize="sm" color="gray.500">
                        {formatTimestamp(reply.timestamp)}
                      </Text>
                    </HStack>
                    <Text>{reply.content}</Text>
                  </Box>
                ))}

                {/* Reply Input */}
                <Box
                  bg={chatWindowBg}
                  p={{ base: 3, md: 4 }}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    resize="none"
                    rows={3}
                    fontSize={{ base: 'sm', md: 'md' }}
                  />
                  <VStack mt={3} spacing={2} align="stretch">
                    <Flex 
                      direction={{ base: 'column', md: 'row' }} 
                      justify="space-between" 
                      gap={2}
                    >
                      <Box>
                        {!selectedMessage?.isResolved && (
                          <Button
                            size={{ base: 'sm', md: 'sm' }}
                            colorScheme="green"
                            onClick={() => selectedMessage && handleResolveMessage(selectedMessage.id)}
                            isDisabled={isSubmitting}
                            isLoading={isSubmitting}
                            width={{ base: 'full', md: 'auto' }}
                          >
                            ✅ Mark Resolved
                          </Button>
                        )}
                        {selectedMessage?.isResolved && selectedMessage?.resolvedBy && (
                          <Text fontSize="sm" color="green.600">
                            ✓ Resolved by {selectedMessage.resolvedBy.name}
                          </Text>
                        )}
                      </Box>
                      <Button
                        colorScheme="brand"
                        onClick={handleSendReply}
                        isDisabled={!replyText.trim() || isSubmitting}
                        isLoading={isSubmitting}
                        size={{ base: 'md', md: 'md' }}
                        width={{ base: 'full', md: 'auto' }}
                        minHeight={{ base: '44px', md: 'auto' }}
                      >
                        💬 Send Reply
                      </Button>
                    </Flex>
                  </VStack>
                </Box>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* New Message Modal */}
        <Modal isOpen={isNewMessageOpen} onClose={onNewMessageClose} size={{ base: 'full', md: 'lg' }}>
          <ModalOverlay />
          <ModalContent m={{ base: 0, md: 4 }}>
            <ModalHeader fontSize={{ base: 'lg', md: 'xl' }}>New Message to Moderators</ModalHeader>
            <ModalCloseButton top={{ base: 3, md: 4 }} right={{ base: 3, md: 4 }} />
            <ModalBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
              <VStack spacing={4}>
                <Box w="full">
                  <Text mb={2} fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }}>Subject</Text>
                  <Input
                    placeholder="Enter message subject"
                    value={newMessageSubject}
                    onChange={(e) => setNewMessageSubject(e.target.value)}
                    size={{ base: 'md', md: 'lg' }}
                  />
                </Box>
                <Box w="full">
                  <Text mb={2} fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }}>Message</Text>
                  <Textarea
                    placeholder="Type your message here..."
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    rows={6}
                    fontSize={{ base: 'sm', md: 'md' }}
                    minHeight={{ base: '120px', md: '160px' }}
                  />
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter 
              px={{ base: 4, md: 6 }} 
              py={{ base: 4, md: 6 }}
              flexDirection={{ base: 'column-reverse', md: 'row' }}
              gap={{ base: 2, md: 0 }}
            >
              <Button 
                variant="ghost" 
                mr={{ base: 0, md: 3 }} 
                onClick={onNewMessageClose}
                width={{ base: 'full', md: 'auto' }}
              >
                Cancel
              </Button>
              <Button 
                colorScheme="brand"
                onClick={handleSendNewMessage}
                isDisabled={!newMessageSubject.trim() || !newMessageContent.trim() || isSubmitting}
                isLoading={isSubmitting}
                width={{ base: 'full', md: 'auto' }}
                minHeight={{ base: '48px', md: 'auto' }}
              >
                📤 Send Message
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default Messages;