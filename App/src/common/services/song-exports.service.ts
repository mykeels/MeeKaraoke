export async function getExports({
  root = process.env.REACT_APP_API_ROOT
} = {}) {
  return fetch(`${root}/video-builds`).then((res) => res.json());
}

export async function getExportsById(
  id: string,
  { root = process.env.REACT_APP_API_ROOT } = {}
) {
  return fetch(`${root}/video-builds/${id}`).then((res) => res.json());
}
