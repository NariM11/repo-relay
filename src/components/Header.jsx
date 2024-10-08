import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";


/**
 * Main Header component for the application.
 * 
 * @returns {JSX.Element} The rendered Header component.
 */
export default function Header() {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <Box bg="gray.50" shadow="md" borderWidth="1px" borderRadius="lg" p={[2, 4]}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        mx="auto"
      >
        <Link to="/home" id="logo-link">
          <Text
            fontWeight="bold"
            color="teal.500"
            fontSize={['0.5rem', '0.6rem', '1.1rem', '1.75rem', '2rem']}
            mr={[2, 3, 4, 5, 6]}
          >
            REPO RELAY
          </Text>
        </Link>
        <HStack spacing={[1.5, 3, 4, 5, 7]} alignItems="center">
          <Link to="/home">
            <Text color="gray.700" fontSize={['0.45rem', '0.5rem', '1.2rem']}>
              DASHBOARD
            </Text>
          </Link>
          <Link to="/hub">
            <Text color="gray.700" fontSize={['0.45rem', '0.5rem', '1.2rem']}>
              PROJECT HUB
            </Text>
          </Link>
          <Link to="/aboutUs">
            <Text color="gray.700" fontSize={['0.45rem', '0.5rem', '1.2rem']}>
              ABOUT US
            </Text>
          </Link>
          <Link to="/userProfile">
            <Avatar size={["xs", "sm", "md"]} src={currentUser?.userImage || ""} />
          </Link>
          <Link to="/post">
            <Button
              colorScheme="teal"
              fontWeight="bold"
              fontSize={['0.45rem', '0.45rem', '1.2rem']}
              px={[1, 1, 5]}
            >
              ADD PROJECT
            </Button>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
}
