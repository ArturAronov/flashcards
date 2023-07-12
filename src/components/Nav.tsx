import { A } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { useUserId } from "../states/useUser";
import { serverUrl } from "../lib/serverUrl";

const postUserSignOut = async () => {
  const [_, setUserId] = useUserId();
  await fetch(serverUrl + "/auth/sign-out", {
    mode: "cors",
    method: "post",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  setUserId("");
};

export const Nav = () => {
  const [userId, _] = useUserId();

  return (
    <div class="navbar bg-base-100 shadow-lg">
      <div class="mx-3 flex justify-between w-full">
        <A href="/" class="normal-case text-xl select-none">
          Hello World
        </A>
        <Show
          when={!!userId("").length}
          fallback={
            <div>
              <A
                href="/sign-in"
                class="btn-square btn no-animation w-28 btn-ghost"
              >
                Sign In
              </A>
              <A
                href="/sign-up"
                class="btn-square btn no-animation w-28 btn-ghost"
              >
                Sign Up
              </A>
            </div>
          }
        >
          <div>
            <A
              href="/settings"
              class="btn-square btn no-animation w-28 btn-ghost"
            >
              Settings
            </A>
            <a
              class="btn-square btn no-animation w-28 btn-ghost text-error"
              onClick={() => postUserSignOut()}
            >
              Sign Out
            </a>
          </div>
        </Show>
      </div>
    </div>
  );
};
