import { AppProvider, useApp } from "./store";
import Landing from "./landing";
import Studio from "./studio";
import Admin from "./admin";
import { Toaster } from "./ui";

function Shell() {
  const { view } = useApp();
  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      {view === "home" && <Landing />}
      {view === "studio" && <Studio />}
      {view === "admin" && <Admin />}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
