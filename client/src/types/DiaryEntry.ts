export interface DiaryEntry {
  userId: string
  entryId: string
  createdAt: string
  attachmentUrl?: string
  title: string
  content: string
}