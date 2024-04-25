export const PlayListSubmitInput = () => {
  return (
    <form hx-post="/hx/playlist" hx-swap="none">
      <div class="bg-gray-50 p-4 border-gray-500 border">
        <input
          name="url"
          class="p-2 px-4 min-w-80"
          type="text"
          placeholder="Enter Playlist URL"
        />
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};
