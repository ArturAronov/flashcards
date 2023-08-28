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

const DesktopNav = () => {
  return (
    <div class="hidden md:block">
      <A href="/collections" class="btn-square btn no-animation w-28 btn-ghost">
        Collections
      </A>
      <A href="/settings" class="btn-square btn no-animation w-28 btn-ghost">
        Settings
      </A>
      <a
        class="btn-square btn no-animation w-28 btn-ghost text-error"
        onClick={() => postUserSignOut()}
      >
        Sign Out
      </a>
    </div>
  );
};

const MobileNav = () => {
  return (
    <div class="dropdown dropdown-end md:hidden">
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </label>
      <ul
        tabIndex={0}
        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-2.5"
      >
        <li class="mt-1">
          <A
            href="/collections"
            class="btn-square btn no-animation w-48 btn-ghost pt-4"
          >
            Collections
          </A>
        </li>
        <li class="mt-1">
          <A
            href="/settings"
            class="btn-square btn no-animation w-48 btn-ghost pt-4"
          >
            Settings
          </A>
        </li>
        <li class="mt-1">
          <a
            class="btn-square btn no-animation w-48 btn-ghost text-error pt-4"
            onClick={() => postUserSignOut()}
          >
            Sign Out
          </a>
        </li>
      </ul>
    </div>
  );
};

export const Nav = () => {
  const [userId, _] = useUserId();

  return (
    <div class="navbar bg-base-100 shadow-lg">
      <div class="mx-3 flex justify-between w-full">
        <A href="/" class="text-xl select-none font-bold uppercase">
          Savorim
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
            <DesktopNav />
            <MobileNav />
          </div>
        </Show>
      </div>
    </div>
  );
};
