import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Heading } from "@/components/ui/heading";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import {
  AddIcon,
  CheckCircleIcon,
  Icon,
  MenuIcon,
  EditIcon,
  TrashIcon,
  RepeatIcon,
  InfoIcon,
  CloseCircleIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/components/ui/icon";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { ScrollView } from "react-native";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ButtonText, ButtonIcon, Button } from "@/components/ui/button";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";

import {
  CircleAlert,
  CircleArrowDown,
  CircleArrowUp,
} from "lucide-react-native";

interface TodoItem {
  id: string;
  title: string;
  description: string;
  image: string | null;
  completed: boolean;
  priority: "Low" | "Medium" | "High" | null; 
}

const ToDoApp = () => {
  const router = useRouter();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasTodos, setHasTodos] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isHighToLow, setIsHighToLow] = useState<boolean>(true);

  const handleClose = () => {
    setShowAddModal(false);
    setTitle("");
    setDescription("");
    setImage(null);
    setPriority(null); 
    setEditingId(null);
  };

  // Load todos when the component mounts
  useEffect(() => {
    loadTodos();
  }, []);

  // Function to load todos from AsyncStorage
  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem("todos");
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
        setHasTodos(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (todo: TodoItem) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setImage(todo.image);
    setPriority(todo.priority); // Set priority when editing
    setEditingId(todo.id);
    setShowAddModal(true);
  };

  const addOrUpdateTodo = () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill out both the title and description.");
      return;
    }

    if (!image) {
      alert("Please upload an image for the task.");
      return;
    }

    if (priority === null) {
      alert("Please select a priority for the task.");
      return;
    }

    // If editing an existing task
    if (editingId !== null) {
      const updatedTodos = todos.map((todo) =>
        todo.id === editingId
          ? {
              ...todo,
              title,
              description,
              image,
              priority, // Update priority
            }
          : todo
      );
      saveTodos(updatedTodos);
      setEditingId(null);
    } else {
      // Creating a new task
      const newTodo: TodoItem = {
        id: uuidv4(),
        title,
        description,
        image,
        completed: false,
        priority, // Add priority to the new task
      };
      const newTodos = [...todos, newTodo];
      saveTodos(newTodos);
      if (!hasTodos) {
        setHasTodos(true);
      }
    }

    // Reset modal fields and close modal
    setTitle("");
    setDescription("");
    setImage(null);
    setPriority("Low");
    setShowAddModal(false);
  };

  // Function to save todos in AsyncStorage
  const saveTodos = async (newTodos: TodoItem[]) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  // Function to mark a todo as completed
  const markAsCompleted = (id: string) => {
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

  // Function to delete a todo
  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    saveTodos(newTodos);
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

  // Sort todos based on priority and sorting state
  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    const aPriority = a.priority ? priorityOrder[a.priority] : 0;
    const bPriority = b.priority ? priorityOrder[b.priority] : 0;
    return isHighToLow ? bPriority - aPriority : aPriority - bPriority;
  });

  // Filter todos based on the search query
  const filteredTodos = sortedTodos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle sorting order
  const toggleSortOrder = () => {
    setIsHighToLow((prev) => !prev);
  };

  return (
    <>
      <VStack className="flex-1 bg-secondary-0 items-center pt-2" space="lg">
        <Box style={{ width: "90%", marginBottom: 10 }}>
          <Input className="my-1" size="lg">
            <InputSlot className="pl-3">
              <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField
              type="text"
              placeholder="Search todos"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
        </Box>
        <Box style={{ width: "90%", marginBottom: 10 }}>
          <Button onPress={toggleSortOrder} size="lg">
            <ButtonText>
              {isHighToLow ? "Sort: High to Low" : "Sort: Low to High"}
            </ButtonText>
            <ButtonIcon as={isHighToLow ? ChevronDownIcon : ChevronUpIcon} />
          </Button>
        </Box>

        {hasTodos ? (
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <Card
                  size="lg"
                  variant="outline"
                  className="m-3 w-full"
                  style={{ maxWidth: "90%" }}
                  key={todo.id}
                >
                  <HStack
                    space="md"
                    className="justify-between w-full"
                    style={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <VStack space="md">
                      <Heading
                        size="lg"
                        className="mb-1"
                        style={{ textAlign: "left" }}
                      >
                        {todo.title}
                      </Heading>
                      <HStack
                        space="md"
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <Badge
                          size="md"
                          variant="solid"
                          action={todo.completed ? "success" : "error"}
                        >
                          <BadgeText>
                            {todo.completed ? "Completed" : "Incomplete"}
                          </BadgeText>
                          <BadgeIcon
                            as={
                              todo.completed ? CheckCircleIcon : CloseCircleIcon
                            }
                            className="ml-2"
                          />
                        </Badge>
                        <Badge
                          size="md"
                          variant="solid"
                          action={
                            todo.priority === "High"
                              ? "error"
                              : todo.priority === "Medium"
                              ? "warning"
                              : "info"
                          }
                          style={{ alignSelf: "flex-start", marginTop: 5 }}
                        >
                          <BadgeText>{todo.priority} Priority</BadgeText>
                          <BadgeIcon
                            as={
                              todo.priority === "High"
                                ? CircleAlert
                                : todo.priority === "Medium"
                                ? CircleArrowUp
                                : CircleArrowDown
                            }
                            className="ml-2"
                          />
                        </Badge>
                      </HStack>
                    </VStack>
                    <Menu
                      placement="bottom right"
                      offset={5}
                      trigger={({ ...triggerProps }) => {
                        return (
                          <Button
                            {...triggerProps}
                            size="lg"
                            className="p-2"
                            variant="link"
                            textValue="Menu"
                          >
                            <ButtonIcon size={"lg"} as={MenuIcon} />
                          </Button>
                        );
                      }}
                    >
                      <MenuItem
                        key="View"
                        onPress={() => router.replace(`/details?id=${todo.id}`)}
                      >
                        <Icon as={InfoIcon} size="lg" className="mr-2" />
                        <MenuItemLabel size="lg">View Task</MenuItemLabel>
                      </MenuItem>
                      <MenuItem
                        key="Complete"
                        onPress={() => markAsCompleted(todo.id)}
                      >
                        <Icon
                          as={
                            todo.completed ? CloseCircleIcon : CheckCircleIcon
                          }
                          size="lg"
                          className="mr-2"
                        />
                        <MenuItemLabel size="lg">
                          {todo.completed
                            ? "Mark as incomplete"
                            : "Mark as complete"}
                        </MenuItemLabel>
                      </MenuItem>
                      <MenuSeparator />
                      <MenuItem key="Edit" onPress={() => handleEdit(todo)}>
                        <Icon as={EditIcon} size="lg" className="mr-2" />
                        <MenuItemLabel size="lg">Edit</MenuItemLabel>
                      </MenuItem>
                      <MenuItem
                        key="Delete"
                        onPress={() => deleteTodo(todo.id)}
                      >
                        <Icon
                          as={TrashIcon}
                          size="lg"
                          className="mr-2 color-error-700"
                        />
                        <MenuItemLabel size="lg" className="color-error-700">
                          Delete
                        </MenuItemLabel>
                      </MenuItem>
                    </Menu>
                  </HStack>
                </Card>
              ))
            ) : (
              <Text className="primary-0" size={"lg"}>
                No todos found!
              </Text>
            )}
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
          className="bg-tertiary-400"
          onPress={() => setShowAddModal(true)}
        >
          <FabIcon as={AddIcon} />
          <FabLabel>Add ToDo</FabLabel>
        </Fab>
      </VStack>

      <AlertDialog isOpen={showAddModal} onClose={() => {}} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="lg">
              {editingId ? "Edit ToDo" : "Create a new ToDo"}
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

                <FormControlLabel className="mt-5">
                  <FormControlLabelText>Priority</FormControlLabelText>
                </FormControlLabel>
                <Select
                  onValueChange={(value) =>
                    setPriority(value as "Low" | "Medium" | "High")
                  }
                >
                  <SelectTrigger
                    variant="outline"
                    size="lg"
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <SelectInput
                      placeholder={priority ? priority : "Select priority"}
                    />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem
                        label="Low"
                        value="Low"
                        style={{ paddingVertical: 10 }}
                      />
                      <SelectItem
                        label="Medium"
                        value="Medium"
                        style={{ paddingVertical: 10 }}
                      />
                      <SelectItem
                        label="High"
                        value="High"
                        style={{ paddingVertical: 10 }}
                      />
                    </SelectContent>
                  </SelectPortal>
                </Select>
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
              onPress={handleClose}
              size="lg"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              size="lg"
              onPress={addOrUpdateTodo}
              className="bg-tertiary-400"
            >
              <ButtonText>{editingId ? "Update" : "Create"}</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ToDoApp;
