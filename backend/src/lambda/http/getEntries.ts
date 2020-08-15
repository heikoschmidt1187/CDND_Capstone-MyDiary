import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger} from '../../utils/logger'
import { getAllEntries } from '../../businessLogic/diaryentry'
import { getUserId } from '../utils'

// instantiate logger
const logger = createLogger('getEntries')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event getEntries', {event})

  // retrieve the userID
  const userId = getUserId(event)
  console.log('did get user id ', userId)

  // retrieve the diary entries
  const items = await getAllEntries(userId)
  console.log('did get entries')

  // form the response header
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
