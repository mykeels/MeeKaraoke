type AudioDownload = {
  youtubeUrl: string;
  title: string;
  author: string;
  url: string;
};

/** @param {string} youtubeUrl */
export async function getAudioUrl(
  youtubeUrl: string,
  { root = process.env.REACT_APP_API_ROOT } = {}
): Promise<AudioDownload> {
  return fetch(`${root}/download?url=${encodeURIComponent(youtubeUrl)}`).then(
    (res) => res.json()
  );
}
