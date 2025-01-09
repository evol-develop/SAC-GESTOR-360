import { LuLoaderCircle } from "react-icons/lu";

function SuspenseLoader() {
  return (
    <div className="size-full flex items-center justify-center">
      <LuLoaderCircle className="animate-spin" />
    </div>
  );
}

export default SuspenseLoader;
