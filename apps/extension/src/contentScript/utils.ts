import { contentScriptUtilityMessageChannel } from 'src/background/messagePassing/messageChannels'
import { ContentScriptUtilityMessageType, ErrorLog } from 'src/background/messagePassing/types/requests'
<<<<<<< HEAD
import { logger } from '@l.x/utils/src/logger/logger'
=======
import { logger } from 'utilities/src/logger/logger'
>>>>>>> upstream/main

export async function logContentScriptError({
  errorMessage,
  fileName,
  functionName,
  tags,
  extra,
}: {
  errorMessage: string
  fileName: string
  functionName: string
  tags?: Record<string, string>
  extra?: Record<string, unknown>
}): Promise<void> {
  const message: ErrorLog = {
    type: ContentScriptUtilityMessageType.ErrorLog,
    message: errorMessage,
    fileName,
    functionName,
    tags,
    extra,
  }

  if (__DEV__) {
<<<<<<< HEAD
    // eslint-disable-next-line no-restricted-syntax
=======
    // oxlint-disable-next-line no-restricted-syntax
>>>>>>> upstream/main
    logger.error(new Error(errorMessage), {
      tags: {
        file: fileName,
        function: functionName,
        ...tags,
      },
      extra,
    })
  }

  await contentScriptUtilityMessageChannel.sendMessage(message)
}
