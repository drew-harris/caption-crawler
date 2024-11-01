import { Link } from "@tanstack/react-router";
import { useContext } from "react";
import { UserContext } from "~/client/context/UserContext";

export const Navbar = () => {
  const user = useContext(UserContext);
  return (
    <div className="flex gap-6">
      <Link to="/" className="text-navy font-bold md:text-lg">
        Caption Crawler
      </Link>
      {user && (
        <Link to="/playlists" className="text-navy md:text-lg">
          Playlists
        </Link>
      )}
    </div>
  );
};
