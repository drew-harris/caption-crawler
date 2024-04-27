export const PlayListSubmitInput = () => {
  return (
    <form hx-post="/hx/playlistInput" hx-swap="outerHTML">
      <div class="bg-gray-50 flex gap-2 p-4 border-gray-500 border">
        <input
          name="url"
          class="p-2 bg-gray-50 px-4 min-w-80"
          type="text"
          placeholder="Enter Playlist URL"
        />
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};
