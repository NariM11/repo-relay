import {
  Flex,
  Heading,
  Button,
  UnorderedList,
  ListItem,
  Box,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectsAsync, updatePartialProjectAsync } from "../../redux/projects/projectCardThunks";
import { fetchUserAsync, updateUserAsync } from "../../redux/user/userThunks";
import { setUser } from "../../redux/user/userSlice";
import { useEffect } from "react";
import { subscribeToProjectApi, unsubscribeFromProjectApi } from "../../redux/email/emailService";

/**
 * A component that displays and manages the list of users subscribed to a project.
 * Allows the current user to join or leave the project team.
 *
 * @param {Object} project - The project object to display and manage.
 *
 * @returns {JSX.Element} The rendered ProjectUsers component.
 */
export default function ProjectUsers({ project }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleAddSubscribedUser = async () => {
    if (!currentUser || !currentUser.userID || !currentUser.subscribedProjects) {
      console.error("Current user data is incomplete:", currentUser);
      return;
    }

    if (currentUser.userID === project.projectOwner) {
      console.error("Project owner cannot subscribe to their own project.");
      return;
    }

    try {
      await dispatch(
        updatePartialProjectAsync({
          id: project.projectID,
          project: {
            subscribedUsers: [...new Set([...project.subscribedUsers, currentUser.userID])],
          },
        })
      );
      dispatch(getProjectsAsync());

      const updatedUser = await dispatch(
        updateUserAsync({
          githubUsername: currentUser.githubUsername,
          updateData: {
            subscribedProjects: [
              ...new Set([...currentUser.subscribedProjects, project.projectID]),
            ],
          },
        })
      ).unwrap();
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(fetchUserAsync(token));
      }

      dispatch(setUser(updatedUser.currentUser));

      const emailData = {
        githubUsername: currentUser.githubUsername,
        projectOwnerID: project.projectOwner,
        projectName: project.projectName,
      };

      const response = await subscribeToProjectApi(emailData);

      if (!response.ok) {
        console.error('Failed to send subscription email');
      } else {
        console.log('Subscription email sent successfully');
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleRemoveSubscribedUser = async () => {
    if (!currentUser || !currentUser.userID || !currentUser.subscribedProjects) {
      console.error("Current user data is incomplete:", currentUser);
      return;
    }

    try {
      await dispatch(
        updatePartialProjectAsync({
          id: project.projectID,
          project: {
            subscribedUsers: project.subscribedUsers.filter(
              (subscriber) => subscriber !== currentUser.userID
            ),
          },
        })
      );
      dispatch(getProjectsAsync());

      const updatedUser = await dispatch(
        updateUserAsync({
          githubUsername: currentUser.githubUsername,
          updateData: {
            subscribedProjects: currentUser.subscribedProjects.filter(
              (id) => id !== project.projectID
            ),
          },
        })
      ).unwrap();
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(fetchUserAsync(token));
      }

      dispatch(setUser(updatedUser.currentUser));

      const emailData = {
        githubUsername: currentUser.githubUsername,
        projectOwnerID: project.projectOwner,
        projectName: project.projectName,
      };

      const response = await unsubscribeFromProjectApi(emailData);

      if (!response.ok) {
        console.error('Failed to send unsubscription email');
      } else {
        console.log('Unsubscription email sent successfully');
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const isSubscriber = currentUser && currentUser.userID && project.subscribedUsers.includes(currentUser.userID);
  const isOwner = currentUser && currentUser.userID === project.projectOwner;

  return (
    <Flex direction="column" mb="10px">
      <Flex
        align="center"
        justify="space-between"
        my="10px"
        direction={["column", "column", "row"]}
        gap="5px"
      >
        <Box flex="1" textAlign="left" my="5px">
          <Heading size="md">Project Owner:</Heading>
        </Box>
        <Box
          flex="2"
          textAlign={["center", "center", "left"]}
          my="5px"
          px="10px"
        >
          <p>{project.projectOwner}</p>
        </Box>
        <Box flex="1"></Box> {/* Placeholder for alignment */}
      </Flex>

      <Flex
        align="center"
        justify="space-between"
        my="10px"
        direction={["column", "column", "row"]}
        gap="5px"
      >
        <Box flex="1" textAlign="left" my="5px">
          <Heading size="md">Contributors:</Heading>
        </Box>
        <Box
          flex="2"
          textAlign={["center", "center", "left"]}
          my="5px"
          px="10px"
        >
          <UnorderedList
            listStyleType="none"
            m={0}
            p={0}
            display="flex"
            flexWrap="wrap"
            justifyContent={["center", "center", "flex-start"]}
            alignItems="center"
            gap="10px"
          >
            {project.subscribedUsers.filter(Boolean).map((subscribedUser) => (
              <ListItem key={subscribedUser}>
                <p>{subscribedUser}</p>
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
        <Box
          flex="1"
          display="flex"
          flexDirection={["column", "column", "row"]}
          gap="5px"
          textAlign="left"
          my="5px"
          width={["50%", "50%", "auto"]}
          px={["10px", "10px", "0px"]}
        >
          {!isOwner && !isSubscriber ? (
            <Button
              size="sm"
              colorScheme="teal"
              onClick={handleAddSubscribedUser}
              flex="1"
              p="10px"
            >
              Join The Team
            </Button>
          ) : !isOwner && isSubscriber ? (
            <Button
              size="sm"
              colorScheme="red"
              onClick={handleRemoveSubscribedUser}
              flex="1"
              p="10px"
            >
              Leave The Team
            </Button>
          ) : null}
        </Box>
      </Flex>
    </Flex>
  );
}
