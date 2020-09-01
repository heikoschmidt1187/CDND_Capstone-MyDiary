import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteDiaryEntry } from '../../businessLogic/diaryentry'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteEntry')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event to delete diary entry', {event})

  // get userid and diary entry id
  const entryId = event.pathParameters.diaryEntryId
  const userId = getUserId(event)

  // delete diary entry
  await deleteDiaryEntry(userId, entryId)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
