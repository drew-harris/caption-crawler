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
        <div className="text-3xl md:text-5xl max-w-[343px] py-4 text-navy m-auto text-center font-semibold">
          Search. Every. Last. Word.
        </div>
        <div className="mx-auto opacity-80 max-w-[500px] pt-4 text-center">
          Caption Crawler scans Youtube videos by their transcripts so that you
          can find the exact moment you’re looking for.
        </div>
      </div>
      <HomeInputForm />
    </>
  );
}
