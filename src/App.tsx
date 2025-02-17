import { ShowContent } from "./components/ShowContent";
import CustomHeader from "./components/CustomHeader";
import { useState } from "react";

function App() {
  const [isShow, setIsShow] = useState<boolean>(false);
  return (
    <>
      <CustomHeader isShow={isShow} setIsShow={() => setIsShow(!isShow)} />
      <ShowContent content="Hello World" isShow={isShow} />
    </>
  );
}

export default App;
