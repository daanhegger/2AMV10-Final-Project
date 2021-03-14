import React, {useCallback, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {Button, Card, Chip, DialogActions, TextField} from "@material-ui/core";
import Chart from "./makeChart";
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from "@material-ui/lab/Autocomplete";

type dataProps = {
  data: any;
  words: string[];
}

export const SetUpPopUp = (props: dataProps) => {
  const {words, data} = props
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const dataForScatter = data.map((row: any[]) => ({
    x: parseFloat(row[0]),
    y: parseFloat(row[1]),
  }));

  const [topicsList, setTopicList] = useState( JSON.parse(localStorage.getItem('topicsList')||'[]'));
  const handleChange = useCallback((e, newValue) => {
        window.localStorage.setItem('topicsList', JSON.stringify(newValue));
    setTopicList(newValue)
    }, [setTopicList]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    handleClose();
  },[])

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        disableBackdropClick
      >
        <DialogTitle id="alert-dialog-title">{"Select words for future investigation"}</DialogTitle>
        <DialogContent>
              <div>
                <Card className="vectorized-words-charts">
                  <Chart
                    labels={words}
                    type={"scatter"}
                    ctx={"scatterChart"}
                    chartData={dataForScatter}
                    backgroundColor={"#AEBBFF"}
                    chartLabel={"occurance"}
                  />
                </Card>
              </div>
        </DialogContent>
        <Card className="set-words-topics" style={{marginTop: "3em"}}>
         <DialogActions>
           <Autocomplete
               id="select-list"
               multiple
               freeSolo
               options={words}
               value={topicsList}
               renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
               }
               style={{padding: "0em 0em 1em 1em", width: "90%"}}
               onChange={(e, newValue) => handleChange(e, newValue)}
               renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Select words or input the one you want to investigate"
                />)}
           />
           <Button variant="contained" color="primary" onClick={handleSubmit}  style={{marginLeft: '1em', marginBottom: '1em'}}> Submit</Button>
           </DialogActions>
       </Card>
      </Dialog>
    </div>
  );
}
