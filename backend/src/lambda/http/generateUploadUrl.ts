import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { genUploadUrl, updAttachmentUrl } from '../../businessLogic/diaryentry'
import { getUserId } from '../utils'
import * as uuid from 'uuid'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event to generate an upload url', {event})

  // extract user and diary entry id
  const diaryEntryId = event.pathParameters.diaryEntryId
  const userId = getUserId(event)
  const attId = uuid.v4();
  
  // genenerate an uload url
  const uploadUrl = await genUploadUrl(attId)

  // update with the new url
  await updAttachmentUrl(userId, diaryEntryId, attId)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}