export const SignUp = () => {
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
          <input type="text" class="input input-bordered w-full" />
        </div>
        <div class="mt-3">
          <label class="label -mb-1.5">
            <span class="label-text">Password</span>
          </label>
          <input type="password" class="input input-bordered w-full" />
        </div>
        <div class="mt-3">
          <label class="label -mb-1.5">
            <span class="label-text">Confirm Password</span>
          </label>
          <input type="password" class="input input-bordered w-full" />
        </div>
        <div class="mt-5 flex justify-center">
          <button class="btn btn-ghost no-animation">Submit</button>
        </div>
      </div>
    </section>
  );
};
