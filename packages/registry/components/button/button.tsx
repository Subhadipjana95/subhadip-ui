import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className = "", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`px-4 py-2 rounded-md bg-primary text-white ${className}`}
      {...props}
    />
  )
})

Button.displayName = "Button"