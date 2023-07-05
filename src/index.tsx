/* @refresh reload */
import "./index.css";
import App from "./App";
import { render } from "solid-js/web";
import { Route, Router, Routes } from "@solidjs/router";
import { Nav } from "./components/Nav";
import { SignIn } from "./components/pages/SignIn";
import { SignUp } from "./components/pages/SingUp";
import { Settings } from "./components/pages/Settings";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <Router>
      <header>
        <Nav />
      </header>
      <Routes>
        <Route path="/" component={App} />
        <Route path="/settings" component={Settings} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
      </Routes>
    </Router>
  ),
  root!
);
