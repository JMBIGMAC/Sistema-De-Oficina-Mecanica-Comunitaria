import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  useColorModeValue,
  Text,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { messagesApi } from '../services/api';

const ContactUs: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const bgColor = useColorModeValue('white', 'gray.800');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      
      // Call the messages API to send the message
      const response = await messagesApi.createMessage(formData.subject, formData.message);
      
      if (response.success) {
        toast({
          title: 'Message sent',
          description: 'Your message has been sent successfully. We\'ll get back to you soon!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        setFormData({ subject: '', message: '' });
      } else {
        toast({
          title: 'Error sending message',
          description: response.error || 'Failed to send message',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error sending message',
        description: error.message || 'Failed to send message',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 6, md: 8 }} align="stretch">
        <Box textAlign="center">
          <Heading size={{ base: 'xl', md: '2xl' }} mb={4}>
            Contact Us
          </Heading>
          <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }}>
            Have a question or need support? Send us a message and we'll respond as soon as possible.
          </Text>
        </Box>

        <Card bg={bgColor}>
          <CardBody p={{ base: 4, md: 6 }}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={{ base: 4, md: 6 }}>
                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Your Email</FormLabel>
                  <Input
                    type="email"
                    value={user?.email || ''}
                    isReadOnly
                    bg={useColorModeValue('gray.100', 'gray.700')}
                    size={{ base: 'md', md: 'lg' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Subject</FormLabel>
                  <Input
                    placeholder="Brief description of your inquiry"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    size={{ base: 'md', md: 'lg' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Message</FormLabel>
                  <Textarea
                    placeholder="Tell us more about your question or issue..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    fontSize={{ base: 'sm', md: 'md' }}
                    minHeight={{ base: '120px', md: '160px' }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size={{ base: 'md', md: 'lg' }}
                  width="full"
                  isLoading={loading}
                  mt={{ base: 2, md: 0 }}
                  minHeight={{ base: '48px', md: '56px' }}
                >
                  Send Message
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        <Box bg={useColorModeValue('blue.50', 'blue.900')} p={{ base: 4, md: 6 }} borderRadius="md">
          <VStack spacing={2} align="start">
            <Heading size={{ base: 'xs', md: 'sm' }}>Other ways to reach us</Heading>
            <Text fontSize="sm">Email: support@example.com</Text>
            <Text fontSize="sm">Phone: +1 (555) 123-4567</Text>
            <Text fontSize="sm">Hours: Monday - Friday, 9:00 AM - 5:00 PM</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default ContactUs;
