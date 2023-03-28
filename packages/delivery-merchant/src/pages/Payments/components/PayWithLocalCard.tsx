import { Box, Button, Center, Group, NumberInput, Text, useMantineColorScheme } from '@mantine/core'
import { monthlySubscriptionCost } from 'config/constants'
import { usePayWithLocalCard } from 'hooks/usePayWithLocalCard'
import { t } from 'utils/i18nextFix'
import { useEffect, useState } from 'react'

import { useCreateLocalCatdTransaction } from '../hooks/payWithLocalCard/useCreateLocalCardTransaction'
import { useLocation } from 'react-router'

export const PayWithLocalCard: React.FC = () => {
  const {
    mutate: createLocalCardTransaction,
    isLoading,
    isError,
    isSuccess,
    data,
    isIdle,
  } = useCreateLocalCatdTransaction()
  const [numberOfMonths, setNumberOfMonths] = useState(0)
  const [paying, setPaying] = useState(false)
  usePayWithLocalCard()
  useEffect(() => {
    if (isError) {
      setPaying(false)
    }
  })
  const { colorScheme } = useMantineColorScheme()

  const location = useLocation()
  console.log('🚀 ~ file: PayWithLocalCard.tsx:28 ~ location', location)
  useEffect(() => {
    if (!isLoading && isSuccess && data && !isIdle) {
      const { configurationObject } = data

      const queryString =
        '?' +
        new URLSearchParams({
          ...configurationObject,
          url: `${import.meta.env.VITE_APP_BASE_URL}/validateLocalCardTransaction`,
          colorScheme,
        }).toString()
      window.open(import.meta.env.VITE_APP_PAYMENT_APP_URL + queryString)
      // window.location.href = 'http://localhost:4001' + queryString

      // console.log('🚀 ~ file: PayWithLocalCard.tsx ~ line 20 ~ useEffect ~ configurationObject', configurationObject)

      // window.Lightbox.Checkout.configure = {
      //   ...configurationObject,

      //   completeCallback: function (data) {
      //     console.log('🚀 ~ file: usePayWithLocalCard.ts ~ line 63 ~ useEffect ~ data success', data)
      //   },
      //   errorCallback: function (error) {
      //     console.log(error)
      //   },
      //   cancelCallback: function () {
      //     setPaying(false)
      //   },
      // }
      // window.Lightbox.Checkout.showLightbox()
    }
  }, [data, isLoading, isSuccess])

  return (
    <Box>
      <Group>
        <Text weight={700}>{t('Cost')}</Text> :<Text>{numberOfMonths * monthlySubscriptionCost}</Text>
      </Group>
      <NumberInput value={numberOfMonths} onChange={(e) => setNumberOfMonths(e)} label={t('Number of months')} />
      <Center>
        <Button
          mt={12}
          sx={{ margin: '0px auto' }}
          disabled={isLoading || paying}
          onClick={() => {
            // TODO add transaction before opening the payment gateway
            createLocalCardTransaction({ numberOfMonths })
            setPaying(true)
          }}
        >
          {t('Show payment gateway')}
        </Button>
      </Center>
    </Box>
  )
}
