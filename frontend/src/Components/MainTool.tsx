import React from "react";
import VolumePlot from "./volume/VolumePlot";
import useAxios from "axios-hooks";
import {SetUpPopUp} from "./setUpPopUp";

const MainTool: React.FC = () => {

  const [{ data, loading, error }] = useAxios("http://localhost:5000/word2vec");

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error!</p>;



  const words = data.map((row: any[]) => row[2]);
  return (
    <>
      <VolumePlot></VolumePlot>
      <SetUpPopUp data={data} words={words}/>
    </>
  );
};

export default MainTool;
