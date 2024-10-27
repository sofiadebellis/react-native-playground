import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { CheckCircleIcon, Icon } from "@/components/ui/icon";
import React from "react";

const Header = () => {
  return (
    <HStack className="w-full p-5 bg-secondary-0 items-center" space="md">
    <Heading text-typography-950 size={"3xl"}>
      TickItOff
    </Heading>
    <Icon as={CheckCircleIcon} size="xl" />
    </HStack>
  );
}

export default Header;