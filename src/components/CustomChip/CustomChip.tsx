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
  validateChip?: (chip: string) => boolean;
  className?: string;
}

const CustomChip = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Add a chip",
  rules,
  validateChip,
  className,
}: CustomChipProps<T>) => {
  const [inputValue, setInputValue] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAddChip = (
    chip: string,
    onChange: (chips: string[]) => void,
    currentChips: string[]
  ) => {
    if (!chip) return;

    // Check for duplicates before adding the chip
    if (currentChips.includes(chip)) {
      setLocalError("This item has already been added.");
      return;
    }

    // Custom error handling for chip validation
    if (validateChip && !validateChip(chip)) {
      const errorMessage = "Invalid item format.";
      setLocalError(errorMessage);
      return;
    }

    // If no errors, add chip
    const newChips = [...currentChips, chip];
    onChange(newChips);
    setInputValue("");
    setLocalError(null);
  };

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
                  e.preventDefault();
                  handleAddChip(inputValue, onChange, value || []);
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
              error={!!error || !!localError}
            />

            {/* Display error messages conditionally */}
            <FormHelperText error>
              {localError || error?.message}
            </FormHelperText>

            <Box className="chip-box">
              {(value || []).map((chip: string) => (
                <Chip
                  key={chip}
                  label={chip}
                  onDelete={() => handleDeleteChip(chip, onChange, value || [])}
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
