import { onMount, type Component } from "solid-js";
import { Route, Router, Routes } from "@solidjs/router";
import { Settings } from "./components/pages/Settings";
import { SignIn } from "./components/pages/SignIn";
import { SignUp } from "./components/pages/SignUp";
import { useUserId } from "./states/useUser";
import { serverUrl } from "./lib/serverUrl";
import { Nav } from "./components/Nav";
import { Collections } from "./components/pages/Collections";

const postUserSignIn = async () => {
  const response = await fetch(serverUrl + "/auth/validate-session", {
    mode: "cors",
    method: "get",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const App: Component = () => {
  const [userId, setUserId] = useUserId();

  onMount(() => {
    if (!userId("")) {
      postUserSignIn()
        .then((res) => setUserId(res.data.id))
        .catch((err) => console.log(err));
    }
  });

  return (
    <>
      <Router>
        <header>
          <Nav />
        </header>
        <Routes>
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/settings" component={Settings} />
          <Route path="/collections" component={Collections} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
