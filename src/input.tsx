import { JSX } from "solid-js/jsx-runtime";

interface InputInterface extends JSX.InputHTMLAttributes<HTMLInputElement> {}

export const Input = (props: InputInterface) => {
  return (
    <input
      class={`border flex-grow border-gray-300 rounded-[5px] p-2 ${props.class}`}
      {...props}
    />
  );
};
