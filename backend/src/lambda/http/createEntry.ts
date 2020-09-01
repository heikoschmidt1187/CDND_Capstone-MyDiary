import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createEntry } from '../../businessLogic/diaryentry'
import { CreateEntryRequest } from '../../requests/CreateEntryRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

// instantiate logger
const logger = createLogger('createEntry')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event to create new diary entry', {event})

  // retrieve user ID
  const userId = getUserId(event)

  // create diary entry request
  const newDiaryEntry: CreateEntryRequest = JSON.parse(event.body)

  // create the item 
  const newItem = await createEntry(userId, newDiaryEntry)

  // respond
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
