import {Card, CardContent, CardHeader, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import React, {useCallback, useMemo, useState} from "react";

export const SetAlgoParamsCard = (props: any) => {
    const { algoChoices } = props
    const [vectorization, setVectorApproach] = useState('k-NN');
    const selectAlgorithm = useCallback((e) => setVectorApproach(e.target.value as string), [setVectorApproach])


    const [numberOfNeighbors, setNumOfNeighbors] = useState(4)
    const setNumberOfNeighbors = useCallback((e) => setNumOfNeighbors(e.target.value as number), [setNumOfNeighbors]);
    const knnParamsOn = useMemo(() => vectorization === 'k-NN' ? 'inline' : 'none', [vectorization])

    return(
        <Card className="set-vectorized-parameters">
                <CardHeader title="Select algorithm for vectorization"/>
                <CardContent>
                 <InputLabel id="set-vectorized-approach">Algorithm</InputLabel>
                    <Select
                      labelId="set-vectorized-approach"
                      id="select-algo"
                      value={vectorization}
                      onChange={selectAlgorithm}
                      style={{width: "20%", marginRight: '2em'}}
                    >
                      {algoChoices.map((choice: any) => <MenuItem value={choice}>{choice}</MenuItem>)}
                    </Select>
                    <TextField id="set-kNN-params" value={numberOfNeighbors}
                               style={{width: "20%", display: knnParamsOn}} onChange={setNumberOfNeighbors}/>

                  </CardContent>
              </Card>
    )
}