import { JSX, JSXElement } from "solid-js";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSXElement;
}

export const Button = ({ children, ...rest }: ButtonProps) => {
  return (
    <button {...rest} class="border border-gray-300 rounded-[5px] p-2">
      {children}
    </button>
  );
};
