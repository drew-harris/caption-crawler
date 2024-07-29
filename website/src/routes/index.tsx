import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { HomeInputForm } from "~/client/components/HomeInputForm";
import { trpc } from "~/internal/trpc";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const [input, setInput] = useState("");
  const submitPlaylistMutation = trpc.playlistQueue.queuePlaylist.useMutation({
    onSuccess(data, variables, context) {
      alert("JOB STARTED");
    },
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!input) {
      return;
    }
    console.log("running mutation");
    submitPlaylistMutation.mutate({
      url: input,
    });
  };

  return (
    <>
      <div className="mt-7 flex justify-center flex-col gap-7">
        <div className="text-3xl md:text-5xl max-w-[343px] text-navy m-auto text-center font-semibold">
          Search. Every. Last. Word.
        </div>
        <div className="mx-auto opacity-80 max-w-[500px] text-center">
          Caption Crawler scans Youtube videos by their transcripts so that you
          can find the exact moment you’re looking for.
        </div>
        {/* <form onSubmit={submit}> */}
        {/*   <input */}
        {/*     value={input} */}
        {/*     onChange={(e) => setInput(e.target.value)} */}
        {/*     className="border block" */}
        {/*   /> */}
        {/*   <button type="submit">Submit</button> */}
        {/* </form> */}
      </div>
      <HomeInputForm />
    </>
  );
}
