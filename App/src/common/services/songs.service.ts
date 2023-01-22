import { assert } from "../utils";

const apiRootUrl = process.env.REACT_APP_API_ROOT;

export async function getSongById(id: string) {
  const song: SongFileContent & { song?: LyricLine[] } = await fetch(
    `${apiRootUrl}/songs/${id}`
  ).then((res) => res.json());
  song["song"] = song["lines"] || song["song"];
  song.lyrics = assert(song.lines)
    .map((l) => l.text)
    .join("\n");
  return song;
}

export async function saveSongFileContents(content: SongFileContent): Promise<SongFileContent> {
  if (content.id) {
    // existing record
    /** @type {SongRecord} */
    await fetch(`${apiRootUrl}/Songs/${content.id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Title: content.title,
        Id: content.id,
        Background: content.background
      })
    }).then((res) => res.json());
  } else {
    // new record
    /** @type {SongRecord} */
    const record = await fetch(`${apiRootUrl}/Songs`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Title: content.title,
        Background: content.background
      })
    }).then((res) => res.json());
    content.id = record.id;
  }

  // upload content
  await uploadSongFileContent(content);

  // upload audio
  await uploadAudioFile(content);
  return content;
}

export async function uploadSongFileContent(content: SongFileContent) {
  const str = JSON.stringify({
    ...content,
    audioUrl: `~/Static/${content?.id}/audio.mp3`
  });
  const blob = new Blob([str], {
    type: "application/json"
  });
  const formData = new FormData();
  formData.append("files", blob);
  await fetch(`${apiRootUrl}/Songs/${content.id}/Files`, {
    method: "post",
    body: formData
  });
}

async function uploadAudioFile(content: SongFileContent) {
  const blob = await fetch(content.audioUrl).then((res) => res.blob());
  const formData = new FormData();
  formData.append("files", blob);
  await fetch(`${apiRootUrl}/Songs/${content.id}/Audio-Files.mp3`, {
    method: "post",
    body: formData
  });
}

export async function getSongRecords(): Promise<SongRecord[]> {
  const apiRoot = process.env.REACT_APP_API_ROOT;
  return fetch(`${apiRoot}/Songs`).then((res) => res.json());
}

export async function deleteSong(id: string): Promise<void> {
  const apiRoot = process.env.REACT_APP_API_ROOT;
  return fetch(`${apiRoot}/Songs/${id}`, {
    method: "delete"
  }).then((res) => res.json());
}
