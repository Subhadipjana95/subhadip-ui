import React from "react"

export const Button = React.forwardRef(
  ({ className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-4 py-2 rounded-md bg-primary text-white ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"