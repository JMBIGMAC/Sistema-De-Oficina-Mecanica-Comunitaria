import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Card,
  CardBody,
  SimpleGrid,
  Badge,
  Icon,
  Divider,
  useColorModeValue,
  useToast,
  Select,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';

const Payment: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      name: 'Basic',
      price: '$9.99',
      period: 'month',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      color: 'green',
    },
    {
      name: 'Pro',
      price: '$29.99',
      period: 'month',
      features: ['All Basic features', 'Feature 4', 'Feature 5', 'Feature 6'],
      color: 'blue',
      recommended: true,
    },
    {
      name: 'Enterprise',
      price: '$99.99',
      period: 'month',
      features: ['All Pro features', 'Feature 7', 'Feature 8', 'Priority support'],
      color: 'purple',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Reset form
      setCardNumber('');
      setCardName('');
      setExpiryDate('');
      setCvv('');
    }, 2000);
  };

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <HStack justify="center" mb={4}>
              <Icon as={FaCreditCard as any} boxSize={8} color="brand.500" />
              <Heading size="xl">Payment Gateway</Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              Secure payment processing with 256-bit SSL encryption
            </Text>
            <HStack justify="center" mt={2}>
              <Icon as={FaLock as any} color="green.500" />
              <Text fontSize="sm" color="green.600" fontWeight="medium">
                Secure & Encrypted
              </Text>
            </HStack>
          </Box>

          {/* Plans */}
          <Box>
            <Heading size="md" mb={6} textAlign="center">
              Choose Your Plan
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  bg={cardBg}
                  borderWidth={plan.recommended ? 2 : 1}
                  borderColor={plan.recommended ? 'brand.500' : borderColor}
                  position="relative"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                  transition="all 0.3s"
                >
                  {plan.recommended && (
                    <Badge
                      position="absolute"
                      top={-3}
                      right={4}
                      colorScheme="brand"
                      fontSize="xs"
                    >
                      RECOMMENDED
                    </Badge>
                  )}
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Box textAlign="center">
                        <Text fontSize="xl" fontWeight="bold" color={`${plan.color}.500`}>
                          {plan.name}
                        </Text>
                        <HStack justify="center" mt={2}>
                          <Text fontSize="3xl" fontWeight="bold">
                            {plan.price}
                          </Text>
                          <Text color="gray.500">/{plan.period}</Text>
                        </HStack>
                      </Box>
                      <Divider />
                      <VStack align="start" spacing={2}>
                        {plan.features.map((feature, idx) => (
                          <HStack key={idx}>
                            <Icon as={FaCheckCircle as any} color="green.500" />
                            <Text fontSize="sm">{feature}</Text>
                          </HStack>
                        ))}
                      </VStack>
                      <Button
                        colorScheme={plan.color}
                        width="full"
                        mt={2}
                      >
                        Select Plan
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Payment Form */}
          <Card bg={cardBg} maxW="600px" mx="auto" w="full">
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <Heading size="md">Payment Information</Heading>
                  
                  <FormControl isRequired>
                    <FormLabel>Card Number</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaCreditCard as any} color="gray.500" />
                      </InputLeftElement>
                      <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '');
                          if (value.length <= 16 && /^\d*$/.test(value)) {
                            setCardNumber(value.replace(/(\d{4})/g, '$1 ').trim());
                          }
                        }}
                        maxLength={19}
                      />
                    </InputGroup>
                    <FormHelperText>Enter your 16-digit card number</FormHelperText>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Cardholder Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </FormControl>

                  <SimpleGrid columns={2} spacing={4} w="full">
                    <FormControl isRequired>
                      <FormLabel>Expiry Date</FormLabel>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            setExpiryDate(
                              value.length >= 2
                                ? `${value.slice(0, 2)}/${value.slice(2)}`
                                : value
                            );
                          }
                        }}
                        maxLength={5}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>CVV</FormLabel>
                      <Input
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 3) {
                            setCvv(value);
                          }
                        }}
                        maxLength={3}
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl>
                    <FormLabel>Billing Country</FormLabel>
                    <Select placeholder="Select country">
                      <option value="us">United States</option>
                      <option value="uk">United Kingdom</option>
                      <option value="ca">Canada</option>
                      <option value="au">Australia</option>
                      <option value="br">Brazil</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    width="full"
                    isLoading={isProcessing}
                    loadingText="Processing..."
                    leftIcon={<Icon as={FaLock as any} />}
                  >
                    Complete Payment
                  </Button>

                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    By clicking "Complete Payment" you agree to our Terms of Service and Privacy Policy.
                    Your payment information is encrypted and secure.
                  </Text>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Security Info */}
          <Box textAlign="center" py={4}>
            <HStack justify="center" spacing={6} flexWrap="wrap">
              <HStack>
                <Icon as={FaLock as any} color="green.500" />
                <Text fontSize="sm" color="gray.600">SSL Encrypted</Text>
              </HStack>
              <HStack>
                <Icon as={FaCheckCircle as any} color="green.500" />
                <Text fontSize="sm" color="gray.600">PCI Compliant</Text>
              </HStack>
              <HStack>
                <Icon as={FaCheckCircle as any} color="green.500" />
                <Text fontSize="sm" color="gray.600">Money-back Guarantee</Text>
              </HStack>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Payment;
