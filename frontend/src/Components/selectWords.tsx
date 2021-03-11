import { Card, CardHeader, Chip, TextField } from "@material-ui/core";
import React, {useCallback, useState} from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';

export const SelectWordsCard = (props: any) => {
    const { words } = props
    const [topicsList, setTopicList] = useState<string[]>([]);
    const handleChange = useCallback((e, newValue) => setTopicList(newValue), [setTopicList, topicsList]);

   return (
       <Card className="set-words-topics" style={{marginTop: "3em"}}>
           <CardHeader title="Select words for future investigation"/>
           <Autocomplete
               id="select-list"
               multiple
               freeSolo
               options={words}
               renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
               }
               style={{padding: "0em 0em 1em 1em", width: "90%"}}
               onChange={handleChange}
               renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Select words or input the one you want to investigate"
                />)}
           />
       </Card>
   )
}