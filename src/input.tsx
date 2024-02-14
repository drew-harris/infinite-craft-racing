import { JSX } from "solid-js/jsx-runtime";
import { cn } from "./utils";

interface InputInterface extends JSX.InputHTMLAttributes<HTMLInputElement> {}

export const Input = (props: InputInterface) => {
  return (
    <input
      class={cn("!border !border-gray-300 rounded-[5px] p-2", props.class)}
      {...props}
    />
  );
};
