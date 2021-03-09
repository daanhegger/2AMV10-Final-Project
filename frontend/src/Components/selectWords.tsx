import {Card, CardHeader, Input, InputLabel, MenuItem, Select} from "@material-ui/core";
import React, {useCallback, useState} from "react";

export const SelectWordsCard = (props: any) => {
    const [topicsList, setTopicList] = useState([]);
    const handleChange = useCallback((e) => setTopicList(e.target.value), [setTopicList]);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
   return (
       <Card className="set-words-topics" style={{marginTop: "3em"}}>
           <CardHeader title="Select words for future investigation"/>
           <InputLabel id="dselect-topics-list" style={{marginLeft: "1em"}}>Topics</InputLabel>
           <Select
               labelId="demo-mutiple-name-label"
               id="demo-mutiple-name"
               multiple
               value={topicsList}
               onChange={handleChange}
               input={<Input />}
               MenuProps={MenuProps}
               style={{marginLeft: "1em", marginBottom: "2em"}}
           >
               {props.words.map((name: any) => (
                   <MenuItem key={name} value={name}>{name}</MenuItem>
               ))}
           </Select>
       </Card>
   )
}