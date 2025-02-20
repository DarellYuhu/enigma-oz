"use client";

import { buttonVariants } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type Props = {
  options: { label: string; value: string }[];
  onValueChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
};

export default function Window(props: Props) {
  return (
    <ToggleGroup type="single" defaultValue={props.defaultValue} {...props}>
      {props.options.map((option, idx) => (
        <ToggleGroupItem
          key={idx}
          value={option.value}
          className={buttonVariants({ variant: "outline" })}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
