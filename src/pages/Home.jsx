import React from "react";
import useData from "../useData";

export default function Home() {
  const data = useData("http://localhost:5000/iyar");
  console.log("Home");
  return (
    <>
      {data && <p> {data}</p>}
      <div>Home</div>
    </>
  );
}
