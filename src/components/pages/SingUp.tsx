import { createSignal } from "solid-js";

type InputT = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

const initialInput = {
  email: "",
  password: "",
  passwordConfirmation: "",
};

export const SignUp = () => {
  const [input, setInput] = createSignal<InputT>(initialInput);
  const [query, setQuery] = createSignal<InputT>(initialInput);
  const [error, setError] = createSignal<string>("");

  const submitForm = (e: any) => {
    e.preventDefault();
    if (!input().email) setError("Please enter valid email");
    else if (!input().password) setError("Please enter valid password");
    else if (!input().passwordConfirmation)
      setError("Please enter valid password confirmation");
    else if (input().password !== input().passwordConfirmation)
      setError("Passwords don't match");
    else setQuery(input());
  };

  return (
    <section class="hero mt-8">
      <div class="sm:m-8 shadow-xl sm:p-8 p-5 rounded-md sm:w-96 w-80">
        <h1 class="text-3xl text-center font-bold font-primary text-primary">
          Sign Up
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
        <div class="mt-3">
          <label class="label -mb-1.5">
            <span class="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            class="input input-bordered w-full"
            onInput={(e) => {
              if (error().length) setError("");
              setInput({
                ...input(),
                passwordConfirmation: e.currentTarget.value,
              });
            }}
          />
        </div>
        <div class="text-error text-sm text-center mt-3">{error()}</div>
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
