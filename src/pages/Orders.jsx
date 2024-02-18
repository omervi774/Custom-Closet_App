import React, { useEffect } from "react";

function Orders(props) {
  useEffect(() => {
    fetch("http://localhost:5000/").then((res) => {
      res.json().then((data) => console.log(data));
    });
  }, []); // Empty dependency array to run effect only once

  return <div>Orders</div>;
}

export default Orders;
