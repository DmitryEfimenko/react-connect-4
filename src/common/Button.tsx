import { forwardRef } from "react";

import styles from './Button.module.scss';

interface ButtonOptions {
  /**
   * Button display variants
   * @default "solid"
   * @type ButtonVariant
   */
  variant?: ButtonVariant;
}

type Ref = HTMLButtonElement;

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  ButtonOptions;

type ButtonVariant = "outline" | "solid" | "ghost";

const getVariant = (variant: ButtonVariant) => {
  switch (variant) {
    case "outline":
      return "btn-outline";
    case "ghost":
      return "btn-ghost";
    default:
      return undefined;
  }
};

export const Button = forwardRef<Ref, ButtonProps>((props, ref) => {
  const {
    variant = "solid",
    type = "button",
    className,
    children,
    ...rest
  } = props;

  return (
    <button ref={ref} className={`${styles.btn} ${styles[getVariant(variant)]} ${className}`} {...rest}>
      {children}
    </button>
  );
});