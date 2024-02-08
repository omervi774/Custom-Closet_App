import { useState } from "react";
export default function useLogIn() {
  const [inputsValues, setInputsValues] = useState({
    userName: "",
    password: "",
  });
  function handleChange(e) {
    const { value, name } = e.target;
    setInputsValues((prev) => {
      return { ...prev, [`${name}`]: value };
    });
  }
  return [inputsValues, handleChange];
}
