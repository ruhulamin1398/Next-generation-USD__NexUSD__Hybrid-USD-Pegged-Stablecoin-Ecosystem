import { Avatar, Card, Text } from '@chakra-ui/react'
import {
  StructuredList,
  StructuredListButton,
  StructuredListCell,
  StructuredListHeader,
  StructuredListIcon,
  StructuredListItem,
} from '@saas-ui/react'

const BridgeListCard = () => {
  return (
    <Card width="320px">
      <StructuredList>
        <StructuredListHeader>Bridged Networks</StructuredListHeader>
     

        <Item />
        <Item />
        <Item />
        <Item />
      </StructuredList>
    </Card>
  )
}

export default BridgeListCard

const Item = () => {
  return (
    <>
      <StructuredListItem href="#">
        <StructuredListCell width="14">
          <Avatar name="Tyrell Wellick" size="sm" />
        </StructuredListCell>
        <StructuredListCell flex="1">
          <Text fontWeight="bold">Hi</Text>
          <Text fontSize="sm" color="muted" noOfLines={2}>
            <Text as="span" color="app-text">
              Tyrell Wellick
            </Text>{' '}
            — Unfortunately, we’re all human. Except me, of course.
          </Text>
        </StructuredListCell>
      </StructuredListItem>
    </>
  )
}
