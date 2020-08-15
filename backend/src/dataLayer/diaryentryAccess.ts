import * as AWS from 'aws-sdk'
import * as AWSXray from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'

import { DiaryEntry } from '../models/DiaryEntry'
import { DiaryUpdate } from '../models/DiaryUpdate'

const XAWS = AWSXray.captureAWS(AWS)
const logger = createLogger('diaryentryAccess')

export class DiaryEntryAccess {
    constructor(
        // the document client to access the concrete DynamoDB database
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),

        // the table containing all diary entries in the database
        private readonly diaryTable = process.env.DIARY_TABLE,

        // index to proAWSXRayject all diaries for a specific user
        private readonly diaryForUserIndex = process.env.DIARY_FOR_USER_INDEX,

        // obect to access s3 bucket
        private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),

        // name of the S3 bucket 
        private readonly bucketName = process.env.ATTACHMENTS_S3_BUCKET,

        // expiration time for signed URL
        private readonly expTime = process.env.SIGNED_URL_EXP
    ) {}

    // operation to get all groups for a specific user
    async getAllEntries(userId: string): Promise<DiaryEntry[]> {

        logger.info(`Data access getting all diary entries for user ${userId}`, {userId})

        const result = await this.docClient.query({
            TableName: this.diaryTable,
            IndexName: this.diaryForUserIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        return result.Items as DiaryEntry[]
    }

    // operation to create a diary entry
    async createDiaryEntry(diaryEntry: DiaryEntry) {
        logger.info(`Data access creating diary entry ${diaryEntry}`, {diaryEntry})

        await this.docClient.put({
            TableName: this.diaryTable,
            Item: diaryEntry
        }).promise()
    }

    // helper to check if diary entry is present
    async entryPresent(userId: string, diaryEntryId: string): Promise<boolean> {

        logger.info(`Data access for checking diary entry ${diaryEntryId} presence`, {diaryEntryId})

        const entry = await this.getDiaryEntry(userId, diaryEntryId)
        return !!entry
    }

    // helper to get a specific diary entry by id 
    async getDiaryEntry(userId: string, diaryEntryId: string): Promise<DiaryEntry> {

        logger.info(`Data access for getting diary entry ${diaryEntryId} presence`, {diaryEntryId})

        // get the entry from the database
        const result = await this.docClient.get({
            TableName: this.diaryTable,
            Key: { userId, diaryEntryId }
        }).promise()

        return result.Item as DiaryEntry
    }

    // operation to update an existing diary entry
    async updateDiaryEntry(userId: string, diaryEntryId: string, diaryEntryUpdate: DiaryUpdate) {

        logger.info(`Data access for updating diary entry ${diaryEntryId} for user ${userId} with update ${diaryEntryUpdate}`, {diaryEntryId,userId, diaryEntryUpdate})

        await this.docClient.update({
            TableName: this.diaryTable,
            Key: { userId, diaryEntryId },
            UpdateExpression: 'set #title = :title, #content = :content',
            ExpressionAttributeNames: {
                "#title": "title",
                "#content": "content"
            },
            ExpressionAttributeValues: {
                ":title": diaryEntryUpdate.title,
                ":content": diaryEntryUpdate.content,
            }
        }).promise()   
    }

  
    // operation to delete a diary entry
    async deleteDiaryEntry(userId: string, diaryEntryId: string) {

        logger.info(`Data access for deleting diary entry ${diaryEntryId} for user ${userId}`, {diaryEntryId, userId})

        await this.docClient.delete({
            TableName: this.diaryTable,
            Key: { userId, diaryEntryId }
        }).promise()
    }

    // getter opteration for attachment url
    async getAttachUrl(attId: string): Promise<string> {

        logger.info(`Data access for getting upload URL for id ${attId}`, {attId})

        const attUrl = `https://${this.bucketName}.s3.amazonaws.com/${attId}`
        return attUrl
    }

    // getter for upload url
    async getUploadUrl(attId: string): Promise<string> {

        logger.info(`Data access for generating upload URL for id ${attId}`, {attId})

        const upUrl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: attId,
            Expires: this.expTime
        })

        return upUrl
    }

    // update function for attachments
    async updateAttachmentUrl(userId: string, diaryEntryId: string, attachUrl: string) {

        logger.info(`Data access for updating the attachment URL for diary entry ${diaryEntryId} for user ${userId} and URL ${attachUrl}`, {diaryEntryId, userId, attachUrl})

        await this.docClient.update({
            TableName: this.diaryTable,
            Key: { userId, diaryEntryId },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachUrl
            }
        }).promise()
    }
}