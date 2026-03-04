/**
 * Reusable SelectBox component
 */

import React from "react";
import { COLORS } from "../constants/colors";
import { Button } from "./Button";

interface SelectBoxProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  action?: boolean;
  onAction?: () => void;
  options: Array<{ value: string; label: string }>;
}

export function SelectBox({
  label,
  error,
  fullWidth = false,
  options,
  action = false,
  onAction,
  ...props
}: SelectBoxProps) {


  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: fullWidth ? "100%" : "auto",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: COLORS.text.primary,
  };

  const selectStyle: React.CSSProperties = {
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    border: `1px solid ${error ? COLORS.danger : COLORS.border}`,
    borderRadius: "0.375rem",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: COLORS.background.main,
    color: COLORS.text.primary,
    cursor: "pointer",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    color: COLORS.danger,
    marginTop: "-0.25rem",
  };

  const buttonContainerStyle: React.CSSProperties = {
    marginLeft: "0.5rem",
  };

  return (
    <div style={containerStyle}>
      <div>
        {label && <label style={labelStyle}>{label}</label>}
        {action && <span style={buttonContainerStyle}>
          <Button
            type="button"
            size="small"
            variant="primary"
            onClick={onAction}
          >
            + New
          </Button>
        </span> }
      </div>
      <select style={selectStyle} {...props}>
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}
