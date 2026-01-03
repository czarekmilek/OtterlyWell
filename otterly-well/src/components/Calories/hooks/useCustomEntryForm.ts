import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Entry } from "../types/types";

export function useCustomEntryForm(
  initialState: Omit<Entry, "id">,
  onSubmit: (
    entry: Omit<Entry, "id">,
    saveData?: { servingName: string; servingWeight: number }
  ) => Promise<boolean>
) {
  const [customEntry, setCustomEntry] =
    useState<Omit<Entry, "id">>(initialState);

  function handleCustomEntryChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setCustomEntry((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value),
    }));
  }

  async function handleCustomEntrySubmit(
    e: FormEvent,
    saveData?: { servingName: string; servingWeight: number }
  ) {
    e.preventDefault();
    const success = await onSubmit(customEntry, saveData);
    if (success) {
      setCustomEntry({
        name: "",
        kcal: 0,
        grams: 100,
        protein: 0,
        fat: 0,
        carbs: 0,
      });
    }
  }

  return {
    customEntry,
    handleCustomEntryChange,
    handleCustomEntrySubmit,
  };
}
