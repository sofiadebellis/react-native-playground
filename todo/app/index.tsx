import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as ImagePicker from "expo-image-picker";
import { Heading } from "@/components/ui/heading";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import {
  AddIcon,
  CheckCircleIcon,
  Icon,
  RepeatIcon,
} from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { HStack } from "@/components/ui/hstack";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollView } from "react-native";
interface TodoItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  completed: boolean;
}
const ToDoApp = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [hasTodos, setHasTodos] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  const handleClose = () => {
    setShowAddModal(false);
    setTitle("");
    setDescription("");
    setImage(null);
  };

  // Load todos when the component mounts
  useEffect(() => {
    loadTodos();
  }, []);

  // Function to load todos from AsyncStorage
  const loadTodos = async () => {
    try {
      await AsyncStorage.clear();
      const savedTodos = await AsyncStorage.getItem("todos");
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
        setHasTodos(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to save todos in AsyncStorage
  const saveTodos = async (newTodos: TodoItem[]) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to add or update a todo
  const addOrUpdateTodo = () => {
    if (!title.trim() && !description.trim()) {
      alert("Please fill out both the title and description too add a todo.");
      return;
    } else if (!title.trim()) {
      alert("Please fill out the title to add a todo.");
      return;
    } else if (!description.trim()) {
      alert("Please fill out the description to add a todo.");
      return;
    }

    if (editingId !== null) {
      const updatedTodos = todos.map((todo) =>
        todo.id === editingId
          ? {
              ...todo,
              title,
              description,
              image,
            }
          : todo
      );
      saveTodos(updatedTodos);
      setEditingId(null);
    } else {
      const newTodo: TodoItem = {
        id: counter,
        title,
        description,
        image,
        completed: false,
      };
      const newTodos = [...todos, newTodo];
      saveTodos(newTodos);
      if (!hasTodos) {
        setHasTodos(true);
      }
      setCounter(counter + 1);
    }

    // Clear form fields after adding/updating
    setTitle("");
    setDescription("");
    setImage(null);
    setShowAddModal(false);
  };

  // Function to delete a todo
  const deleteTodo = (id: number) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    saveTodos(newTodos);
  };

  // Function to mark a todo as completed
  const markAsCompleted = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
          }
        : todo
    );
    saveTodos(updatedTodos);
  };

  // Function to handle editing
  const handleEdit = (todo: TodoItem) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setImage(todo.image);
    setEditingId(todo.id);
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

  // Rendering each todo item
  const renderTodoItem = ({ item }: { item: TodoItem }) => console.log(item);

  return (
    <>
      <VStack className="flex-1 bg-secondary-0 items-center pt-2" space="lg">
        <HStack className="w-full p-5 bg-secondary-0 items-center" space="md">
          <Heading text-typography-950 size={"3xl"}>
            TickItOff
          </Heading>
          <Icon as={CheckCircleIcon} size="xl" />
        </HStack>
        {hasTodos ? (
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {todos.map((todo) => (
              <Card
                key={todo.id}
                size="lg"
                variant="outline"
                className="m-3 w-full"
                style={{ maxWidth: "90%", width: "100%" }}
              >
                <HStack
                  space="md"
                  className="justify-between w-full"
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Left-aligned content: Title and Description */}
                  <VStack space="md" style={{ flex: 1 }}>
                    <Heading
                      size="lg"
                      className="mb-1"
                      style={{ textAlign: "left" }}
                    >
                      {todo.title}
                    </Heading>
                    <Text size="lg" style={{ textAlign: "left" }}>
                      {todo.description}
                    </Text>
                  </VStack>

                  {/* Right-aligned circular image */}
                  {todo.image && (
                    <Image
                      source={{ uri: todo.image }}
                      alt="Todo Image"
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50, // Make the image circular
                      }}
                    />
                  )}
                </HStack>
              </Card>
            ))}
          </ScrollView>
        ) : (
          <Box
            className="w-full h-full p-1 items-center"
            style={{ justifyContent: "flex-start", paddingTop: "70%" }}
          >
            <Text className="primary-0" size={"lg"}>
              No todos yet. Add one now!
            </Text>
          </Box>
        )}
        <Fab
          size="lg"
          placement="bottom right"
          isHovered={false}
          isDisabled={false}
          isPressed={false}
          onPress={() => setShowAddModal(true)}
        >
          <FabIcon as={AddIcon} />
          <FabLabel>Add ToDo</FabLabel>
        </Fab>
      </VStack>

      <AlertDialog isOpen={showAddModal} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="lg">
              Create a new ToDo
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <VStack space="lg">
              <FormControl
                size="lg"
                isDisabled={false}
                isReadOnly={false}
                isRequired={true}
              >
                <FormControlLabel>
                  <FormControlLabelText size="lg">Title</FormControlLabelText>
                </FormControlLabel>
                <Input className="my-1" size="lg">
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
                <Input className="my-1" size="lg">
                  <InputField
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChangeText={setDescription}
                  />
                </Input>
                <Button className="mt-7 mb-5" size="lg" onPress={pickImage}>
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
              onPress={handleClose}
              size="lg"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="lg" onPress={addOrUpdateTodo}>
              <ButtonText>Create</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ToDoApp;
