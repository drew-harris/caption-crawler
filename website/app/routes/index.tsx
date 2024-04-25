import { createRoute } from "honox/factory";
import { PlayListSubmitInput } from "../components/PlaylistSubmitInput";

export default createRoute(async (c) => {
  return c.render(
    <div class="p-3 grid place-items-center min-h-screen">
      <PlayListSubmitInput />
    </div>,
  );
});
