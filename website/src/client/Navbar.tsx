import { Link } from "@tanstack/react-router";
import { useContext } from "react";
import { UserContext } from "~/client/context/UserContext";
import { trpc } from "~/internal/trpc";

export const Navbar = () => {
  const user = useContext(UserContext);
  const { data: collections } = trpc.collections.getAllCollections.useQuery();

  return (
    <div className="flex justify-between gap-6">
      <Link to="/" className="text-navy font-bold md:text-lg">
        Caption Crawler
      </Link>
      {user && collections && collections.length > 0 && (
        <Link to="/playlists" className="text-navy md:text-lg">
          My Playlists
        </Link>
      )}
    </div>
  );
};
