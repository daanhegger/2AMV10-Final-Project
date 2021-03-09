import {Card, CardHeader, MenuItem, Select, Typography} from "@material-ui/core";
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
           <Typography style={{marginLeft: "1em"}} gutterBottom>Top 20 words</Typography>
           <Select
               id="select-list"
               multiple
               value={topicsList}
               onChange={handleChange}
               MenuProps={MenuProps}
               placeholder='Select words from the top lis'
               style={{padding: "0em 0em 1em 1em", width: "90%"}}
           >
               {props.words.map((name: any) => (
                   <MenuItem key={name} value={name}>{name}</MenuItem>
               ))}
           </Select>
       </Card>
   )
}