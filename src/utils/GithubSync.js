// File: D:/FedrixVision/src/utils/GithubSync.js

const GITHUB_REPO = 'sajal1405/AlNajah';
const BRANCH = 'main';
const FILE_PATH = 'data/blogs.json';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export const pushBlogUpdate = async (
  updatedContent,
  commitMessage = 'Update blog content from Fedrix Vision',
) => {
  const apiURL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;

  const getFileSHA = async () => {
    const res = await fetch(apiURL, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const json = await res.json();
    return json.sha;
  };

  const sha = await getFileSHA();
  const encoded = btoa(
    unescape(encodeURIComponent(JSON.stringify(updatedContent, null, 2))),
  );

  const res = await fetch(apiURL, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({
      message: commitMessage,
      content: encoded,
      branch: BRANCH,
      sha,
    }),
  });

  if (!res.ok) {
    throw new Error('GitHub push failed.');
  }

  return await res.json();
};
