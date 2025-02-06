import { ShowContent } from "./components/ShowContent";

function App() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold justify-center">Chat with Mia Claude</h1>
        <p>Initialisation du projet avec TS React et Tailwind</p>
      </div>
      <div>
        <ShowContent />
      </div>
    </>
  );
}

export default App;
