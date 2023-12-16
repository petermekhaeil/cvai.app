import { OPENAI_API_KEY } from '$env/static/private';

export const load = async (event) => {
  const useOwnKey = OPENAI_API_KEY === '';

  return { useOwnKey }
}
