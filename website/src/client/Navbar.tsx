import { useContext } from "react";
import { UserContext } from "~/client/context/UserContext";

export const Navbar = () => {
  const user = useContext(UserContext);
  return (
    <div className="flex">
      <div className="text-navy font-bold md:text-lg">Caption Crawler</div>
    </div>
  );
};
