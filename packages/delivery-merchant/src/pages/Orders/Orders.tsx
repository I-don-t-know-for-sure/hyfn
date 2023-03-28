import { Badge, Box, Button, Card, Container, Group, Image, Loader, Space, Table, Text } from '@mantine/core'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'

import React from 'react'
import ActiveOrders from './Components/ActiveOrders'
import { useGetActiveOrders } from './hooks/useGetActiveOrders'

import { useGetPendingOrders } from './hooks/useGetPendingOrders'
import { useOrderControlers } from './hooks/useOrderControlers'

interface OrdersProps {}

const Orders: React.FC<OrdersProps> = ({}) => {
  // const { data: orders, isLoading, isError, error, fetchNextPage } = useGetActiveOrders()

  // const { userId, userDocument } = useUser()

  // const { mutate } = useOrderControlers()
  // const { id: storeDocId } = userDocument.storeDoc as { id: string }

  return <></>
}

export default Orders
