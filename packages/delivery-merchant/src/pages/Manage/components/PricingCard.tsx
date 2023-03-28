import { Box, Card, CardSection, Divider, Group, Select, Skeleton, Text, TextInput } from '@mantine/core'
import { t } from 'utils/i18nextFix'
import React from 'react'
import { ProductInfo, ProductsCard } from '../types'

interface AppProps {
  onChangeHandler: (value: any, firstChangedKey: string, chengedKey: string) => void
  productInfo: ProductInfo
}

const PricingCard: React.FC<ProductsCard> = ({ onChangeHandler, productInfo, isLoading }) => {
  return (
    <Card shadow={'sm'} p={'md'} sx={{ margin: 'auto', marginBlock: 10 }}>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            padding: '18px 32px',
            justifyContent: 'space-between',
          }}
        >
          <Group
            grow
            position="center"
            sx={{
              width: '100%',
            }}
          >
            <Box>
              <Text>{t('Pricing')}</Text>
              <Skeleton height={30} />
            </Box>
            <Box>
              <Text>{t('Currency')}</Text>
              <Skeleton height={30} />
            </Box>
          </Group>
        </Box>
      ) : (
        <CardSection
          sx={{
            display: 'flex',
            flexDirection: 'row',
            padding: '18px 32px',
            justifyContent: 'space-between',
          }}
        >
          <Group
            grow
            position="center"
            sx={{
              width: '100%',
            }}
          >
            <TextInput
              type="number"
              label={t('Pricing')}
              required
              placeholder={t(`${productInfo.pricing.currency} 10.00 Per ${productInfo.measurementSystem}`)}
              value={`${productInfo?.pricing?.price || ''}`}
              onChange={(e) => {
                onChangeHandler(e.target.value, 'pricing', 'price')
              }}
            />

            <Select
              style={{
                minWidth: '80px',
              }}
              required
              label={t('Currency')}
              data={[
                { label: 'LYD', value: 'LYD' },
                // { label: 'USD', value: 'USD' },
              ]}
              value={productInfo.pricing.currency}
              // onChange={(e) => {
              //   onChangeHandler(e, "pricing", "currency");
              // }}
            />
          </Group>
        </CardSection>
      )}
      <Divider />
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            padding: '18px 32px',
            justifyContent: 'space-between',
          }}
        >
          <Group
            grow
            position="center"
            sx={{
              width: '100%',
            }}
          >
            <Box>
              <Text>{t('Compare at Price')}</Text>
              <Skeleton height={30} />
            </Box>
            <Box>
              <Text>{t('Cost Per Item')}</Text>
              <Skeleton height={30} />
            </Box>
          </Group>
        </Box>
      ) : (
        <CardSection
          sx={{
            display: 'flex',
            flexDirection: 'row',
            padding: '18px 32px',
            justifyContent: 'space-between',
          }}
        >
          <Group
            grow
            position="center"
            sx={{
              width: '100%',
            }}
          >
            <TextInput
              type="number"
              required
              label={t('Compare at Price')}
              placeholder={`${productInfo.pricing.currency} 20.00 Per ${productInfo.measurementSystem}`}
              value={`${productInfo?.pricing?.prevPrice || ''}`}
              onChange={(e) => {
                onChangeHandler(e.target.value, 'pricing', 'prevPrice')
              }}
            />
            <TextInput
              type="number"
              required
              label={t('Cost Per Item')}
              placeholder={`${productInfo.pricing.currency} 6.00 Per ${productInfo.measurementSystem}`}
              value={`${productInfo?.pricing?.costPerItem || ''}`}
              onChange={(e) => {
                onChangeHandler(e.target.value, 'pricing', 'costPerItem')
              }}
            />
          </Group>
        </CardSection>
      )}
    </Card>
  )
}

export default PricingCard
