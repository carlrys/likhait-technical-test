/**
 * Form component for adding/editing expenses
 */

import React, {useState, useEffect } from "react";
import { Category, ExpenseFormData } from "../types";
import { createCategory, fetchCategories } from "../services/api";
import { TextField, SelectBox, Button, Modal } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCategoryError("");
    setIsSavingCategory(true);

    try {
      const newCat = await createCategory(newCategoryName.trim());
      setCategories((prev) => [...prev, newCat]);
      handleChange("category", newCat.name);
      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (error) {
      setCategoryError("Failed to save category. Please try again.");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  const categoryInputStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    justifyContent: "flex-end",
    top: "0.75rem",
    position: "relative",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        error={errors.amount}
        fullWidth
        required
      />

      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        fullWidth
        required
      />
      <div>
        <SelectBox
          label="Category"
          options={categories.map((cat) => ({ value: cat.name, label: cat.name }))}
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          error={errors.category}
          onAction={() => setIsAddingCategory(true)}
          action
          fullWidth
          required
        />
      </div>

      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        error={errors.date}
        fullWidth
        required
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
      <Modal
        isOpen={isAddingCategory}
        onClose={() => setIsAddingCategory(false)}
        title="Add New Category"
      >
        <TextField
          label="Category Name"
          type="text"
          placeholder="Enter category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          error={categoryError}
          fullWidth
          autoFocus
        />
        <div style={categoryInputStyle}>
          <Button
            variant="primary"
            type="button"
            size="small"
            onClick={handleAddCategory}
            disabled={isSavingCategory}
          >
            {isSavingCategory ? "Adding..." : "Add"}
          </Button>
          <Button
            variant="secondary"
            type="button"
            size="small"
            onClick={() => setIsAddingCategory(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </form>
  );
}
