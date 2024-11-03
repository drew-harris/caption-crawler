import { Link, useRouter } from "@tanstack/react-router";
import { useContext } from "react";
import { UserContext } from "~/client/context/UserContext";
import { trpc } from "~/internal/trpc";

export const Navbar = () => {
  const { data: collections } = trpc.collections.getAllCollections.useQuery();
  const user = useContext(UserContext);
  const route = useRouter();

  return (
    <div className="flex justify-between gap-6">
      <Link to="/" className="text-navy font-bold md:text-lg">
        Caption Crawler
      </Link>
      {user && collections && collections.length > 0 && (
        <>
          {route.state.location.pathname === "/playlists" ? (
            <Link to="/account" className="text-navy md:text-lg">
              Account
            </Link>
          ) : (
            <Link to="/playlists" className="text-navy md:text-lg">
              My Playlists
            </Link>
          )}
        </>
      )}
    </div>
  );
};
