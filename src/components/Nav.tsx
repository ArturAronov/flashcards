import { A } from "@solidjs/router";
import { Show, createSignal } from "solid-js";

export const Nav = () => {
  const [userId, setUserId] = createSignal<string | null>(null);
  return (
    <div class="navbar bg-base-100 shadow-lg">
      <div class="mx-3 flex justify-between w-full">
        <A href="/" class="normal-case text-xl select-none">
          Hello World
        </A>
        <Show
          when={userId()}
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
            <a class="btn-square btn no-animation w-28 btn-ghost text-error">
              Sign Out
            </a>
          </div>
        </Show>
      </div>
    </div>
  );
};
