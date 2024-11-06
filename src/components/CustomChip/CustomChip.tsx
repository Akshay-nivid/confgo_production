/**
 * CustomChip component to handle a list of tags/chips within a form.
 */
import { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Chip,
  Box,
  FormHelperText,
} from "@mui/material";
import { Controller, FieldValues, Path, Control } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";

interface CustomChipProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  rules?: any;
  validateChip?: (chip: string) => string | boolean;
  className?: string;
}

const CustomChip = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Add a chip",
  rules,
  validateChip = () => true,
  className,
}: CustomChipProps<T>) => {
  const [inputValue, setInputValue] = useState("");
  const [localError, setLocalError] = useState<string | null>(null); // Local error state for chip validation

  /**
   * Handles adding a chip to the list.
   * @param chip - value to add
   * @param onChange - onChange handler to update the chip list in the form state
   * @param currentChips - current list of chips
   */
  const handleAddChip = (
    chip: string,
    onChange: (chips: string[]) => void,
    currentChips: string[]
  ) => {
    if (!chip) return;

    // Check for duplicates before adding the chip
    if (currentChips.includes(chip.trim())) {
      setLocalError("This item has already been added.");
      return;
    }

    // Custom error handling for chip validation
    const validationResult = validateChip(chip);
    if (typeof validationResult === "string") {
      setLocalError(validationResult);
      return;
    }

    // If no errors, add chip
    const newChips = [...currentChips, chip];
    onChange(newChips);
    setInputValue("");
    setLocalError(null);
  };

  /**
   * Handles deleting a chip from the list.
   * @param chipToDelete - value to delete
   * @param onChange - onChange handler to update the chip list in the form state
   * @param currentChips - current list of chips
   */
  const handleDeleteChip = (
    chipToDelete: string,
    onChange: (chips: string[]) => void,
    currentChips: string[]
  ) => {
    const newChips = currentChips.filter((chip) => chip !== chipToDelete);
    onChange(newChips);
  };

  return (
    <FormControl fullWidth className={className} variant="outlined">
      {label && <InputLabel>{label}</InputLabel>}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <OutlinedInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission on Enter
                  handleAddChip(inputValue, onChange, value || []); // Add chip when Enter is pressed
                }
              }}
              placeholder={placeholder}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      handleAddChip(inputValue, onChange, value || [])
                    }
                    edge="end"
                    aria-label="Add chip"
                  >
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              }
              label={label}
              error={!!error || !!localError} // Display error if validation fails
            />

            {/* Display error messages if validation fails */}
            <FormHelperText error>
              {localError || error?.message}
            </FormHelperText>

            <Box className="chip-box">
              {(value || []).map((chip: string) => (
                <Chip
                  key={chip}
                  label={chip}
                  onDelete={() => handleDeleteChip(chip, onChange, value || [])} // Handle chip deletion
                />
              ))}
            </Box>
          </>
        )}
      />
    </FormControl>
  );
};

export default CustomChip;
