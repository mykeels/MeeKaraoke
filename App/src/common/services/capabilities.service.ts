export type SystemCapabilities = {
  nodeJS: string;
  ffmpeg: string;
};

export async function getSystemCapabilities({
  root = process.env.REACT_APP_API_ROOT
} = {}): Promise<SystemCapabilities> {
  return fetch(`${root}/info`).then((res) => res.json());
}
