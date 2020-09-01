import { apiEndpoint } from '../config'
import { DiaryEntry } from '../types/DiaryEntry';
import { CreateEntryRequest } from '../types/CreateEntryRequest';
import Axios from 'axios'
import { UpdateEntryRequest } from '../types/UpdateEntryRequest';

export async function getDiaryEntries(idToken: string): Promise<DiaryEntry[]> {
  console.log('Fetching diary entries')

  const response = await Axios.get(`${apiEndpoint}/entries`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Diary entries:', response.data)
  return response.data.items
}

export async function createDiaryEntry(
  idToken: string,
  newDiaryEntry: CreateEntryRequest
): Promise<DiaryEntry> {
  const response = await Axios.post(`${apiEndpoint}/entries`,  JSON.stringify(newDiaryEntry), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchDiaryEntry(
  idToken: string,
  diaryEntryId: string,
  updatedDiaryEntry: UpdateEntryRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/entries/${diaryEntryId}`, JSON.stringify(updatedDiaryEntry), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteDiaryEntry(
  idToken: string,
  entryId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/entries/${entryId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  diaryEntryId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/entries/${diaryEntryId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
