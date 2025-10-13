import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Badge,
  Button,
  useToast,
  useColorModeValue,
  Spinner,
  Text,
  Card,
  CardBody,
  Divider,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { messagesApi } from '../services/api';

interface Message {
  id: string;
  from: {
    name: string;
    role: string;
    avatar?: string;
  };
  subject: string;
  content: string;
  timestamp: string;
  isResolved: boolean;
  resolvedBy?: {
    name: string;
    role: string;
  };
  replies: Array<{
    id: string;
    from: {
      name: string;
      role: string;
      avatar?: string;
    };
    content: string;
    timestamp: string;
  }>;
}

const UserProblems: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const replyBgColor = useColorModeValue('gray.50', 'gray.700');

  const fetchMessages = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await messagesApi.getMessages();
      if (response.success && response.data) {
        setMessages(response.data);
      } else {
        throw new Error(response.error || 'Failed to load messages');
      }
    } catch (error: any) {
      toast({
        title: 'Error loading messages',
        description: error.message || 'Failed to load messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleResolve = async (messageId: string) => {
    try {
      setActionLoading(true);
      const response = await messagesApi.resolveMessage(messageId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to resolve message');
      }
      
      toast({
        title: 'Message resolved',
        description: 'The message has been marked as resolved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      fetchMessages();
    } catch (error: any) {
      toast({
        title: 'Error resolving message',
        description: error.message || 'Failed to resolve message',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleHide = async (messageId: string) => {
    try {
      setActionLoading(true);
      const response = await messagesApi.hideMessage(messageId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to hide message');
      }
      
      toast({
        title: 'Message hidden',
        description: 'The message has been hidden',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      fetchMessages();
    } catch (error: any) {
      toast({
        title: 'Error hiding message',
        description: error.message || 'Failed to hide message',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      setActionLoading(true);
      const response = await messagesApi.replyToMessage(selectedMessage.id, replyText);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to send reply');
      }
      
      toast({
        title: 'Reply sent',
        description: 'Your reply has been sent successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setReplyText('');
      onClose();
      fetchMessages();
    } catch (error: any) {
      toast({
        title: 'Error sending reply',
        description: error.message || 'Failed to send reply',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openReplyModal = (message: Message) => {
    setSelectedMessage(message);
    onOpen();
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading messages...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>
            User Problems & Troubleshooting
          </Heading>
          <Text color="gray.500">
            Manage user support tickets and resolve issues
          </Text>
        </Box>

        <VStack spacing={4} align="stretch">
          {messages.length === 0 ? (
            <Card bg={bgColor}>
              <CardBody>
                <Text textAlign="center" color="gray.500">
                  No messages to display
                </Text>
              </CardBody>
            </Card>
          ) : (
            messages.map((message) => (
              <Card key={message.id} bg={bgColor} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Heading size="md">{message.subject}</Heading>
                        <HStack>
                          <Text fontSize="sm" color="gray.500">
                            From: {message.from.name}
                          </Text>
                          <Badge colorScheme="blue">{message.from.role}</Badge>
                        </HStack>
                      </VStack>
                      <HStack>
                        {message.isResolved ? (
                          <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                            Resolved
                          </Badge>
                        ) : (
                          <Badge colorScheme="orange" fontSize="md" px={3} py={1}>
                            Open
                          </Badge>
                        )}
                      </HStack>
                    </HStack>

                    <Text>{message.content}</Text>

                    {message.replies.length > 0 && (
                      <>
                        <Divider />
                        <VStack spacing={3} align="stretch">
                          <Text fontWeight="bold" fontSize="sm">
                            Replies ({message.replies.length})
                          </Text>
                          {message.replies.map((reply) => (
                            <Box
                              key={reply.id}
                              bg={replyBgColor}
                              p={3}
                              borderRadius="md"
                            >
                              <HStack justify="space-between" mb={2}>
                                <HStack>
                                  <Text fontSize="sm" fontWeight="medium">
                                    {reply.from.name}
                                  </Text>
                                  <Badge colorScheme="purple" size="sm">
                                    {reply.from.role}
                                  </Badge>
                                </HStack>
                                <Text fontSize="xs" color="gray.500">
                                  {new Date(reply.timestamp).toLocaleString()}
                                </Text>
                              </HStack>
                              <Text fontSize="sm">{reply.content}</Text>
                            </Box>
                          ))}
                        </VStack>
                      </>
                    )}

                    <Divider />

                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => openReplyModal(message)}
                      >
                        Reply
                      </Button>
                      {!message.isResolved && (
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleResolve(message.id)}
                          isLoading={actionLoading}
                        >
                          Mark as Resolved
                        </Button>
                      )}
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleHide(message.id)}
                        isLoading={actionLoading}
                      >
                        Hide
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))
          )}
        </VStack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reply to: {selectedMessage?.subject}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Textarea
                placeholder="Type your reply..."
                rows={6}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <HStack width="full" justify="flex-end">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleReply}
                  isLoading={actionLoading}
                  isDisabled={!replyText.trim()}
                >
                  Send Reply
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default UserProblems;
