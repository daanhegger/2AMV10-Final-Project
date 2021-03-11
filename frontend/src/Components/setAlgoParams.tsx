import {Button, Card, CardContent, CardHeader, MenuItem, Select, Slider, Typography} from "@material-ui/core";
import React, {useCallback, useMemo, useState} from "react";

export const SetAlgoParamsCard = (props: any) => {
    const { algoChoices } = props
    const [vectorization, setVectorApproach] = useState('k-NN');
    const selectAlgorithm = useCallback((e) => setVectorApproach(e.target.value as string), [setVectorApproach])


    const [numberOfNeighbors, setNumOfNeighbors] = useState(4)
    const setNumberOfNeighbors = useCallback((e) => setNumOfNeighbors(e.target.value as number), [setNumOfNeighbors]);
    const knnParamsOn = useMemo(() => vectorization === 'k-NN' ? 'block' : 'none', [vectorization])

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ algorithm: vectorization, params: [numberOfNeighbors] })
        };
        fetch('http://localhost:5000/word2vec', requestOptions)
            .then(response => response.json())
    }, [])


    return(
        <Card className="set-vectorized-parameters">
            <CardHeader title="Select algorithm for vectorization"/>
            <CardContent>
                <Typography gutterBottom>Algorithm</Typography>
                <Select
                    id="select-algo"
                    value={vectorization}
                    onChange={selectAlgorithm}
                    style={{width: "100%", marginRight: '2em'}}
                >
                    {algoChoices.map((choice: any) => <MenuItem value={choice}>{choice}</MenuItem>)}
                </Select>
                <div style={{marginTop: '3em'}}>
                    <Typography style={{display: knnParamsOn}} gutterBottom>Number of neighbors</Typography>
                    <Slider
                        id="set-kNN-params"
                        defaultValue={numberOfNeighbors}
                        step={1}
                        min={2}
                        max={10}
                        style={{width: "100%", display: knnParamsOn}}
                        valueLabelDisplay="auto"
                        onChange={setNumberOfNeighbors}
                    />
                </div>
                <Button variant="contained" color="primary" onSubmit={handleSubmit}> Re-generate</Button>
            </CardContent>
        </Card>
    )
}