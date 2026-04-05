import { PropsWithChildren } from 'react'
<<<<<<< HEAD
import { Flex, FlexProps } from '@l.x/ui/src'
=======
import { Flex, FlexProps } from 'ui/src'
>>>>>>> upstream/main

const Card = ({ children, ...rest }: PropsWithChildren<FlexProps>) => {
  return (
    <Flex width="100%" padding="1rem" borderRadius="$rounded12" {...rest}>
      {children}
    </Flex>
  )
}
export default Card

export const DarkGrayCard = ({ children, ...rest }: PropsWithChildren<FlexProps>) => {
  return (
    <Card backgroundColor="$surface3" {...rest}>
      {children}
    </Card>
  )
}
