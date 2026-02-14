import axios from "axios"

export async function fetchFile(url: string) {
  const response = await axios.get(url)
  return response.data
}