import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateEntryRequest } from '../../requests/UpdateEntryRequest'
import { updateDiaryEntry } from '../../businessLogic/diaryentry'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateEntry')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event to update a diary entry', {event})

  // get the user ID and parameters
  const userId = await getUserId(event)

  const diaryEntryId = event.pathParameters.diaryEntryId
  const updatedEntry: UpdateEntryRequest = JSON.parse(event.body)

  await updateDiaryEntry(userId, diaryEntryId, updatedEntry)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
