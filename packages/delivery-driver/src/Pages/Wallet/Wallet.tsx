import { Box, Card, Container, Group, Select, SelectItemProps, Text, Title } from '@mantine/core'

import { t } from 'utils/i18nextFix'
import React, { forwardRef, useState } from 'react'

import { paymentMethods } from 'config/data'

import { PayWithLocalCard } from './components/PayWithLocalCard'
interface WalletProps {}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(({ label, ...others }: SelectItemProps, ref) => (
  <div ref={ref} {...others}>
    <Group noWrap>
      <div>
        <Text size="sm">{label}</Text>
      </div>
    </Group>
  </div>
))

const Wallet: React.FC<WalletProps> = () => {
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value)

  return (
    <Card title={t('Account wallet')} shadow={'md'}>
      <Title order={3} mb={8}>
        {t('Account wallet')}
      </Title>
      <Box
        sx={(theme) => ({
          [theme.fn.smallerThan('md')]: {
            flexDirection: 'column-reverse',
          },
          display: 'flex',
          justifyContent: 'space-between',
        })}
      >
        {/* {paymentMethod === paymentMethods[0].value && <PayWithSadad />} */}
        {paymentMethod === paymentMethods[0].value && <PayWithLocalCard />}
        <Box>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e)}
            data={paymentMethods}
            label={t('choose a payment method')}
            itemComponent={SelectItem}
          />
        </Box>
      </Box>
    </Card>
  )
}

export default Wallet
