import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Image,
  Loader,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { usePagination } from 'hooks/usePagination'

import { t } from 'utils/i18nextFix'
import React from 'react'
import { IoMdCopy } from 'react-icons/io'
import { useGetOrderHistory } from './hooks/useOrderHistory'

interface OrderHistoryProps {}

const OrderHistory: React.FC<OrderHistoryProps> = ({}) => {
  const { data: orders, isLoading, isFetched, fetchNextPage } = useGetOrderHistory()
  usePagination(fetchNextPage, orders)
  const clipboard = useClipboard({ timeout: 1500 })
  console.log(orders)

  return (
    <Container>
      <Group>
        <Title>{t('Orders History')}</Title>
      </Group>

      {isLoading ? (
        <Loader />
      ) : (
        orders &&
        orders.pages.map((page) => {
          return page.map((order) => {
            return (
              <Card key={order?._id?.toString()} m={'24px auto'}>
                <Group>
                  <Text>{order._id.toString()}</Text>
                  <Text>
                    {t('Duration')} : {(order.duration / 60).toFixed(1)} min
                  </Text>
                  <Text>
                    {t('Distance')} : {(order.distance / 1000).toFixed(1)} KM
                  </Text>
                </Group>

                {order.orders.map((store) => {
                  return (
                    <Box
                      key={store?._id?.toString()}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <Text
                          variant="text"
                          weight={600}
                          sx={{
                            fontSize: '24px',
                            margin: '4px auto',
                          }}
                        >
                          {store.storeName}
                        </Text>
                        <Group
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                          }}
                        >
                          <ActionIcon
                            onClick={() => {
                              clipboard.copy(`${order.buyerCoords[1]},${order.buyerCoords[0]}`)
                            }}
                          >
                            {clipboard.copied ? <Text color={'teal'}>{t('Copied')}</Text> : <IoMdCopy size={24} />}
                          </ActionIcon>
                          <Text>{`${order.buyerCoords[1]},${order.buyerCoords[0]}`}</Text>
                        </Group>
                      </Box>
                      <Table>
                        <thead>
                          <tr>
                            <th
                              style={{
                                margin: '0px auto',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Text sx={{}}>{t('Index')}</Text>
                            </th>
                            <th>{t('Name')}</th>
                            <th>{t('Quantity')}</th>
                            <th>{t('Image')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {store.addedProducts.map((product, index) => {
                            console.log(product)

                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <Text>{product.textInfo.title}</Text>
                                  {product.options?.length > 0 && (
                                    <Container>
                                      {product.options.map((option) => {
                                        return (
                                          <Box
                                            key={option?.key}
                                            sx={{
                                              display: 'flex',
                                            }}
                                          >
                                            <Text>{option.optionName}:</Text>
                                            {option.optionValues.map((value) => {
                                              return (
                                                <Badge key={value} m={'0px 6px'} size="md">
                                                  {value}
                                                </Badge>
                                              )
                                            })}
                                          </Box>
                                        )
                                      })}
                                    </Container>
                                  )}
                                </td>
                                <td>{product.qty}</td>
                                <td>
                                  <Image
                                    radius={4}
                                    sx={{
                                      width: '45px',
                                      height: '45px',
                                      maxWidth: '45px',
                                      maxHeight: '45px',
                                    }}
                                    src={`${import.meta.env.VITE_APP_BUCKET_URL}/tablet/${product.images[0]}`}
                                  />
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                    </Box>
                  )
                })}
              </Card>
            )
          })
        })
      )}
      <Center m={'12px auto'}>
        <Button
          sx={{
            width: '100%',
            maxWidth: '450px',
          }}
          onClick={() =>
            fetchNextPage({
              pageParam:
                orders?.pages[orders?.pages?.length - 1][orders?.pages[orders.pages?.length - 1]?.length - 1]?._id,
            })
          }
        >
          {t('Load more')}
        </Button>
      </Center>
    </Container>
  )
}

export default OrderHistory
