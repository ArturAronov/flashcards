type PropsT = {
  size: "default" | "large";
};

const LoadingSpinner = ({ size }: PropsT) => {
  if (size === "large") {
    return <span class="loading loading-spinner loading-lg my-10"></span>;
  } else {
    return <span class="loading loading-spinner"></span>;
  }
};

export default LoadingSpinner;
