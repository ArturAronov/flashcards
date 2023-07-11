import { createSignal } from "solid-js";
import { serverUrl } from "../../lib/serverUrl";

type InputT = {
  email: string;
  password: string;
};

const initialInput = {
  email: "",
  password: "",
};

type DataT = {
  email: string;
  password: string;
};

const postUserSignIn = async (data: DataT) => {
  const response = await fetch(serverUrl + "/auth/sign-in", {
    mode: "cors",
    method: "post",
    credentials: "include",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  console.log(response);

  return await response.json();
};

export const SignIn = () => {
  const [input, setInput] = createSignal<InputT>(initialInput);
  const [formError, setFormError] = createSignal<string>("");

  const submitForm = (e: any) => {
    e.preventDefault();
    if (!input().email) setFormError("Please enter valid email");
    else if (!input().password) setFormError("Please enter valid password");
    else postUserSignIn(input());
  };

  return (
    <section class="hero mt-8">
      <div class="sm:m-8 shadow-xl sm:p-8 p-5 rounded-md sm:w-96 w-80">
        <h1 class="text-3xl text-center font-bold font-primary text-primary">
          Sign In
        </h1>
        <div class="mt-3">
          <label class="label -mb-1.5">
            <span class="label-text">Email</span>
          </label>
          <input
            type="text"
            autocomplete="off"
            value={input().email}
            class="input input-bordered w-full"
            onInput={(e) =>
              setInput({ ...input(), email: e.currentTarget.value })
            }
          />
        </div>
        <div class="mt-3">
          <label class="label -mb-1.5">
            <span class="label-text">Password</span>
          </label>
          <input
            type="password"
            class="input input-bordered w-full"
            onInput={(e) =>
              setInput({ ...input(), password: e.currentTarget.value })
            }
          />
        </div>
        <div class="text-error text-sm text-center mt-3">{formError()}</div>
        <div class="mt-5 flex justify-center">
          <button
            type="submit"
            class="btn btn-ghost no-animation"
            onClick={(e) => submitForm(e)}
          >
            Submit
          </button>
        </div>
      </div>
    </section>
  );
};
