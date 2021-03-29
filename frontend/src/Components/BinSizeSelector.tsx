import React, { useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";

interface Props {
  onChange(amount: number, unit: string): void;
  defaultValues: { amount: number; unit: string };
}

/**
 * Let the user select a frequency by time-unit and amount
 */
const BinSizeSelector: React.FC<Props> = ({ onChange, defaultValues }) => {
  const [frequencyType, setFrequencyType] = useState<string>(defaultValues.unit);
  const [frequencyAmount, setFrequencyAmount] = useState<number>(defaultValues.amount);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onChange(frequencyAmount, frequencyType);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex" }}>
      <TextField
        label="Frequency"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        style={{ width: 100 }}
        value={frequencyAmount}
        onChange={(e) => setFrequencyAmount(parseInt(e.target.value, 10))}
        size="small"
      />

      <div style={{ width: 10 }}></div>

      <FormControl variant="outlined" size="small">
        <InputLabel>Unit</InputLabel>
        <Select value={frequencyType} onChange={(e) => setFrequencyType(e.target.value as string)} variant="outlined" label="Unit">
          <MenuItem value="min">Minute(s)</MenuItem>
          <MenuItem value="H">Hour(s)</MenuItem>
        </Select>
      </FormControl>

      <div style={{ width: 10 }}></div>

      <Button variant="contained" type="submit" size="small">
        Apply
      </Button>
    </form>
  );
};

export default BinSizeSelector;
