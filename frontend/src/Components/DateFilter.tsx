import React, { useState } from "react";
import { KeyboardTimePicker } from "@material-ui/pickers";
import { FormControl, InputLabel, Select, MenuItem, Button } from "@material-ui/core";
import moment from "moment";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

const dates: string[] = ["2020-04-06", "2020-04-07", "2020-04-08", "2020-04-09", "2020-04-10"];

const defaultView = {
  startDate: "2020-04-06",
  endDate: "2020-04-10",
  startTime: "00:00:00",
  endTime: "23:59:59",
};

interface Props {
  onChange(start?: string, end?: string): void;
}

/**
 * Let user select a start/end date + time to filter tweets
 */
const DateFilter: React.FC<Props> = ({ onChange }) => {
  // Filter start/end date
  const [filterStartDate, setFilterStartDate] = useState<string | null>(defaultView.startDate);
  const [filterEndDate, setFilterEndDate] = useState<string | null>(defaultView.endDate);

  // Filter start/end time
  const [filterStartTime, setFilterStartTime] = useState<string | null>(defaultView.startTime);
  const [filterEndTime, setFilterEndTime] = useState<string | null>(defaultView.endTime);

  const handleStartDateChange = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    setFilterStartDate(e.target.value as string);
  };

  const handleEndDateChange = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    setFilterEndDate(e.target.value as string);
  };

  const handleTimeChange = (type: "start" | "end") => (date: MaterialUiPickersDate, value?: string | null | undefined) => {
    if (type === "start") {
      setFilterStartTime(value + ":00");
    } else if (type === "end") {
      setFilterEndTime(value + ":00");
    }
  };

  /**
   * Reset the date filter to its default values
   */
  const handleResetView = () => {
    // Change the state to default
    setFilterStartDate(defaultView.startDate);
    setFilterEndDate(defaultView.endDate);
    setFilterStartTime(defaultView.startTime);
    setFilterEndTime(defaultView.endTime);

    // Send changes to parent
    onChange(defaultView.startDate + " " + defaultView.startTime, defaultView.endDate + " " + defaultView.endTime);
  };

  /**
   * Check if the end date is later or equal to the start date
   */
  const validateDates = (): boolean => {
    if (filterEndDate && filterStartDate) {
      if (filterEndDate < filterStartDate) {
        return false;
      }
    }

    if (filterStartTime && filterStartTime.includes("_")) {
      return false;
    }

    if (filterEndTime && filterEndTime.includes("_")) {
      return false;
    }

    return true;
  };

  /**
   * When user clicks submit button: format both dates+times to a string and propagate to parent
   */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onChange(filterStartDate + " " + filterStartTime, filterEndDate + " " + filterEndTime);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "stretch" }}>
      <FormControl variant="outlined" size="small">
        <InputLabel>Start</InputLabel>
        <Select value={filterStartDate} onChange={handleStartDateChange} label="Start">
          {dates.map((date) => (
            <MenuItem key={date} value={date}>
              {moment(date).format("MMMM Do")}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div style={{ width: 10 }}></div>

      <KeyboardTimePicker
        ampm={false}
        label="Start"
        inputVariant="outlined"
        value={new Date(`2020-01-01T${filterStartTime}`)}
        onChange={handleTimeChange("start")}
        style={{ width: 130 }}
        size="small"
      />

      <div style={{ width: 10 }}></div>

      <FormControl variant="outlined" size="small">
        <InputLabel>End</InputLabel>
        <Select value={filterEndDate} onChange={handleEndDateChange} label="End">
          {dates.map((date) => (
            <MenuItem key={date} value={date}>
              {moment(date).format("MMMM Do")}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div style={{ width: 10 }}></div>

      <KeyboardTimePicker
        ampm={false}
        label="End"
        value={new Date(`2020-01-01T${filterEndTime}`)}
        onChange={handleTimeChange("end")}
        inputVariant="outlined"
        style={{ width: 130 }}
        size="small"
      />

      <div style={{ width: 10 }}></div>

      <Button variant="contained" disabled={!validateDates()} type="submit" size="small">
        Apply
      </Button>

      <div style={{ width: 10 }}></div>

      <Button variant="contained" onClick={handleResetView} size="small">
        Reset
      </Button>
    </form>
  );
};

export default DateFilter;
