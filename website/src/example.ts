import { TypesenseMoment } from "../db/algolia";

export default function Moment({ moment }: { moment: TypesenseMoment }) {
  return (
    <div class="text-center border border-black rounded-md bg-white p-2">
      <div class="flex flex-col md:flex-row md:items-start items-center gap-4">
        {moment.thumbnailUrl && (
          <img class="rounded-md md:w-56 w-48" src={moment.thumbnailUrl} />
        )}
        <div class="w-full">
          <div class="text-xl mb-2 font-bold">{moment.videoTitle}</div>
          <div>...{moment.content}...</div>
          <details>
            <summary class="my-2 cursor-pointer text-lg">
              View Quote In Video
            </summary>
            <center>
              <iframe
                loading="lazy"
                class="rounded-md md:w-[560px] md:h-[315px]"
                src={`https://www.youtube.com/embed/${moment.youtubeVideoId}?start=${moment.start}`}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </center>
          </details>
        </div>
      </div>
    </div>
  );
}
