import 'source-map-support/register'

import * as uuid from 'uuid'

import { DiaryEntry } from '../models/DiaryEntry'
import { DiaryUpdate } from '../models/DiaryUpdate'
import { DiaryEntryAccess } from '../dataLayer/diaryentryAccess'
import { createLogger } from '../utils/logger'
import { CreateEntryRequest } from '../requests/CreateEntryRequest'
import { UpdateEntryRequest } from '../requests/UpdateEntryRequest'

// instantiate logger object
const logger = createLogger('diaryentryBusinessLogic')

// instantiate concrete data layer access 
const entriesAccess = new DiaryEntryAccess()

// operation to get all TODOs
export async function getAllEntries(userId: string): Promise<DiaryEntry[]> {
  logger.info(`Getting all diary entries for user ${userId}`, {userId})
  
  return await entriesAccess.getAllEntries(userId)
}
  
// operation to create a TODO
export async function createEntry(userId: string, createEntryRequest: CreateEntryRequest): Promise<DiaryEntry> {

    // get a uuid for the new TODO
    const entryId = uuid.v4()

    const newDiaryEntry: DiaryEntry = {
        userId,
        entryId,
        createdAt: new Date().toISOString(),
        attachmentUrl: null,
        ...createEntryRequest
    }

    logger.info(`Creating new diary entry ${entryId} for user ${userId}`, {userId, entryId, diaryEntry: newDiaryEntry})

    // check for string only containing spaces
    if(!createEntryRequest.title.replace(/\s/g, '').length)
        throw new Error('Title containing only spaces not allowed')
    if(!createEntryRequest.content.replace(/\s/g, '').length)
        throw new Error('Content containing only spaces not allowed')

    // put to data link
    await entriesAccess.createDiaryEntry(newDiaryEntry)

    return newDiaryEntry
}

// operation to update diary entries
export async function updateDiaryEntry(userId: string, diaryEntryId: string, updateEntryRequest: UpdateEntryRequest) {

    logger.info(`Updating diary entry ${diaryEntryId} for user ${userId}`, {diaryEntryId, userId})

    // get the diary entry to update
    const entry = await entriesAccess.getDiaryEntry(userId, diaryEntryId)

    // check if item is valid
    if(!entry)
        throw new Error('Missing diary entry')

    // check if item belongs to user
    if(entry.userId !== userId) 
        throw new Error('Trying to modify diary entry that does not belong to user')

    // check for string only containing spaces
    if(!updateEntryRequest.title.replace(/\s/g, '').length)
        throw new Error('Title containing only spaces not allowed')
    if(!updateEntryRequest.content.replace(/\s/g, '').length)
        throw new Error('Content containing only spaces not allowed')

    entriesAccess.updateDiaryEntry(userId, diaryEntryId, updateEntryRequest as DiaryUpdate)
}

// operation to delete diary entry
export async function deleteDiaryEntry(userId: string, entryId: string) {

    logger.info(`Deleting diary entry ${entryId} for user ${userId}`, {entryId, userId})

    // get the diary entry to delete
    const entry = await entriesAccess.getDiaryEntry(userId, entryId)

    // check if item is valid
    if(!entry)
        throw new Error('Missing diary entry')

    // check if item belongs to user
    if(entry.userId !== userId) 
        throw new Error('Trying to delete entry that does not belong to user')

    entriesAccess.deleteDiaryEntry(userId, entryId)
}

// operation to update the attachment URL of a diary entry
export async function updAttachmentUrl(userId: string, diaryEntryId: string, attachmentId: string) {

    logger.info(`Creating Attachment URL for diary entry ${diaryEntryId} for user ${userId} attachmentID ${attachmentId}`, {diaryEntryId, userId, attachmentId})

    // get the attachment URL of the diary entry
    const attUrl = await entriesAccess.getAttachUrl(attachmentId)
    const entry = await entriesAccess.getDiaryEntry(userId, diaryEntryId)

    // check if item is valid
    if(!entry)
        throw new Error('Missing diary entry')

    // check if entry belongs to user
    if(entry.userId !== userId) 
        throw new Error('Trying to modify diary entry that does not belong to user')

    // update the url
    await entriesAccess.updateAttachmentUrl(userId, diaryEntryId, attUrl)
}

// operation to generate an upload url
export async function genUploadUrl(attachmentId: string): Promise<string> {
    logger.info(`Generating upload URL for ${attachmentId}`, {attachmentId})

    return await entriesAccess.getUploadUrl(attachmentId)
}