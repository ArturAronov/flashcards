export const NavNoAuth = () => {
  return (
    <div class="navbar bg-base-100 shadow-lg">
      <div class="mx-3 flex justify-between w-full">
        <p class="normal-case text-xl select-none">Hello World</p>
        <div>
          <a class="btn-square btn no-animation w-28 btn-ghost">Sign In</a>
          <a class="btn-square btn no-animation w-28 btn-ghost">Sign Up</a>
        </div>
      </div>
    </div>
  );
};
