import { Button } from "@/components/ui/button";
import React from "react";

const CustomButton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      className="group rounded-full bg-baby-powder border border-jet text-jet hover:border-yellow-orange hover:text-yellow-orange hover:bg-transparent"
    >
      {children}
    </Button>
  );
};

export default CustomButton;
