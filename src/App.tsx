import { ShowContent } from "./components/ShowContent";

function App() {
  return (
    <>
      <div>
        <h1 className="text-3xl">Mia Claude</h1>
        <p>Initialisation du projet avec TS React et Tailwind</p>
      </div>
      <div>
        <ShowContent title={"Bonjour"} content={"Hello World"} />
      </div>
    </>
  );
}

export default App;
