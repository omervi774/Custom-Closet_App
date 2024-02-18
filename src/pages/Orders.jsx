import React from "react";
import useData from "../useData";

function Orders(props) {
  const data = useData("http://localhost:5000/");

  return (
    <>
      {data && <p>{data}</p>}
      <div>Orders</div>
    </>
  );
}

export default Orders;
