import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { HomeInputForm } from "~/client/components/HomeInputForm";
import { trpc } from "~/internal/trpc";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <>
      <div className="mt-7 flex justify-center flex-col">
        <div className="text-3xl md:text-5xl max-w-[343px] text-balance md:text-wrap py-4 text-navy m-auto text-center font-semibold">
          Search. Every. Last. Word.
        </div>
        <div className="mx-auto opacity-80 max-w-[500px] pt-4 text-center">
          Caption Crawler scans Youtube videos by their transcripts so that you
          can find the exact moment you’re looking for.
        </div>
      </div>
      <HomeInputForm />
      <div className="mx-auto fixed bottom-0 left-0 right-0 text-xs opacity-70 pb-4 text-center md:text-sm w-full">
        Support for entire channels and single videos coming soon!
      </div>
    </>
  );
}
