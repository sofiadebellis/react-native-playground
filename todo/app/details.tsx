import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // Correct hooks
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ButtonText, ButtonIcon, Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CloseCircleIcon,
  AddIcon,
  RepeatIcon,
} from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import * as ImagePicker from "expo-image-picker";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Input, InputField } from "@/components/ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

interface TodoItem {
  id: string;
  title: string;
  description: string;
  image: string | null;
  completed: boolean;
}

const TaskDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [task, setTask] = useState<TodoItem | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem("todos");
      if (savedTodos) {
        const todosArray: TodoItem[] = JSON.parse(savedTodos);

        const foundTask = todosArray.find((todo) => todo.id === id);
        setTask(foundTask || null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const markTaskAsCompleted = async () => {
    if (!task) return;

    try {
      const savedTodos = await AsyncStorage.getItem("todos");
      if (savedTodos) {
        const todosArray: TodoItem[] = JSON.parse(savedTodos);

        const updatedTodos = todosArray.map((todo) =>
          todo.id === task.id ? { ...todo, completed: !todo.completed } : todo
        );

        await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
        setTask(
          (prevTask) =>
            prevTask && { ...prevTask, completed: !prevTask.completed }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async () => {
    if (!task) return;

    try {
      const savedTodos = await AsyncStorage.getItem("todos");
      if (savedTodos) {
        const todosArray: TodoItem[] = JSON.parse(savedTodos);

        const updatedTodos = todosArray.filter((todo) => todo.id !== task.id);

        await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));

        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to edit the task
  const editTask = () => {
    if (!task) return;
    setTitle(task.title);
    setDescription(task.description);
    setImage(task.image);
    setShowEditModal(true);
  };

  const addOrUpdateTodo = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill out both the title and description.");
      return;
    }

    if (!image) {
      alert("Please upload an image for the task.");
      return;
    }

    try {
      const savedTodos = await AsyncStorage.getItem("todos");
      if (savedTodos) {
        const todosArray: TodoItem[] = JSON.parse(savedTodos);

        const updatedTodos = todosArray.map((todo) =>
          todo.id === task?.id ? { ...todo, title, description, image } : todo
        );

        await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
        setTask({ ...task!, title, description, image });
        setShowEditModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to pick an image from the library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (!task) {
    return (
      <Box
        className="w-full h-full p-1 items-center"
        style={{ justifyContent: "flex-start", paddingTop: "70%" }}
      >
        <VStack space="lg" className="w-full h-full p-1 items-center">
          <Text className="primary-0" size={"xl"}>
            Task not found!
          </Text>

          <Button
            size="lg"
            variant="solid"
            action="primary"
            onPress={() => router.push("/")}
          >
            <ButtonText>Go Back</ButtonText>
            <ButtonIcon as={ArrowLeftIcon} />
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <ScrollView>
      <View style={{ alignItems: "flex-start" }}>
        <Button
          size="xl"
          variant="link"
          action="primary"
          className="ml-5"
          onPress={() => router.push("/")}
          style={{ flexDirection: "row", justifyContent: "flex-start" }}
        >
          <ButtonIcon as={ArrowLeftIcon} size="xl" />
          <ButtonText>Go Back</ButtonText>
        </Button>
      </View>

      <VStack
        space="lg"
        className="pl-5 pr-5"
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        {task.image && (
          <Avatar size="2xl">
            <AvatarFallbackText>{task.title}</AvatarFallbackText>
            <AvatarImage source={{ uri: task.image }} />
          </Avatar>
        )}
        <Heading className="text-typography-950" size={"xl"}>
          {task.title}
        </Heading>
        <Badge
          size="md"
          variant="solid"
          action={task.completed ? "success" : "error"}
        >
          <BadgeText>{task.completed ? "Completed" : "Incomplete"}</BadgeText>
          <BadgeIcon
            as={task.completed ? CheckCircleIcon : CloseCircleIcon}
            className="ml-2"
          />
        </Badge>
        <Text className="text-typography-950" size={"lg"}>
          {task.description}
        </Text>

        <Button
          size="xl"
          style={{ width: "90%", alignSelf: "center", marginTop: 10 }}
          className="bg-tertiary-400"
          onPress={markTaskAsCompleted}
        >
          <ButtonText>
            {task.completed ? "Mark as incomplete" : "Mark as complete"}
          </ButtonText>
        </Button>

        <Button
          size="xl"
          style={{ width: "90%", alignSelf: "center", marginTop: 10 }}
          onPress={editTask}
        >
          <ButtonText>Edit Task</ButtonText>
        </Button>

        <Button
          size="xl"
          style={{ width: "90%", alignSelf: "center", marginTop: 10 }}
          onPress={deleteTask}
        >
          <ButtonText>Delete Task</ButtonText>
        </Button>
      </VStack>

      <AlertDialog
        isOpen={showEditModal}
        onClose={() => {}}
        size="md"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="lg">
              Edit Task
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <VStack space="lg">
              <FormControl size="lg" isRequired={true}>
                <FormControlLabel>
                  <FormControlLabelText size="lg">Title</FormControlLabelText>
                </FormControlLabel>
                <Input size="lg">
                  <InputField
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChangeText={setTitle}
                  />
                </Input>
                <FormControlLabel className="mt-5">
                  <FormControlLabelText>Description</FormControlLabelText>
                </FormControlLabel>
                <Input size="lg">
                  <InputField
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChangeText={setDescription}
                  />
                </Input>
                <FormControlLabel className="mt-5">
                  <FormControlLabelText>Image</FormControlLabelText>
                </FormControlLabel>
                <Button className="mb-5" size="lg" onPress={pickImage}>
                  <ButtonText>
                    {image ? "Change Image" : "Upload Image"}
                  </ButtonText>
                  <ButtonIcon as={image ? RepeatIcon : AddIcon} />
                </Button>
              </FormControl>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => setShowEditModal(false)}
              size="lg"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              size="lg"
              onPress={addOrUpdateTodo}
              className="bg-tertiary-400"
            >
              <ButtonText>Update</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollView>
  );
};

export default TaskDetails;
