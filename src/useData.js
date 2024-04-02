import { useEffect, useState } from "react";

// custom hook for fetching the data from the server when the components in mount process
function useData(url) {
  const [data, setData] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.data);
        console.log(result.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [url]);

  if (error) {
    console.error("Error fetching data:", error);
    // You may choose to handle the error in a way that makes sense for your application
  }

  return [data, setData];
}

export default useData;
