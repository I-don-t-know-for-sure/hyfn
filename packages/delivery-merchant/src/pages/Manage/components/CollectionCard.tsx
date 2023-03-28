import {
  Badge,
  Box,
  Button,
  Card,
  CardSection,
  Checkbox,
  Container,
  Group,
  Header,
  Image,
  Loader,
  MultiSelect,
  Paper,
  Select,
  Skeleton,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { t } from 'utils/i18nextFix'
import { forwardRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useGetCollections from '../hooks/useGetCollections'
import { useGetProductsFromBarcode } from '../hooks/useGetProductFromBarcode'

import { ProductsCard } from '../types'
import Product from './Product'

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ label, ...others }: ItemProps, ref) => (
  <div ref={ref} {...others}>
    <Text size="md"> {label}</Text>
  </div>
))

interface CollectionCardProps extends ProductsCard {}

const CollectionCard: React.FC<CollectionCardProps> = ({ onChangeHandler, productInfo, isLoading }) => {
  const [searchedTag, setSearchedTag] = useState('')
  const [searchText, setSearchText] = useState(productInfo.barcode)
  const [debouncedValue] = useDebouncedValue(searchText, 500, {
    leading: true,
  })

  const {
    data: collections,
    refetch: refetchCollections,
    isLoading: areCollectoinsLoading,
    isFetched: areCollectionsFetched,
    error: collectionsError,
  } = useGetCollections()

  const { data: barcodeProducts = [], isLoading: areBarCodeProductsLoading } = useGetProductsFromBarcode({
    searchString: debouncedValue,
  })
  const [products, setProducts] = useState([])

  useEffect(() => {
    setProducts(barcodeProducts)
  }, [areBarCodeProductsLoading])
  console.log(barcodeProducts)

  return (
    <Container>
      {isLoading ? (
        <Paper
          // sx={{ margin: 'auto' }}
          shadow="sm"
        >
          <Skeleton
            height={30}
            radius={'md'}
            //  m={4}
          />
          <Skeleton
            height={30}
            radius={'md'}
            //  m={4}
          />
        </Paper>
      ) : (
        <Paper
          // sx={{ margin: 'auto' }}
          shadow="sm"
        >
          <Container>
            <Stack>
              <Box>
                <Header height={25} sx={{ marginBottom: 10 }}>
                  <Text>{t('Product status')}</Text>
                </Header>
                {isLoading ? (
                  <>
                    <Loader />
                  </>
                ) : (
                  <Group
                    sx={{ height: 100 }}
                    // direction="column"
                  >
                    <Checkbox
                      label={t('Active')}
                      checked={productInfo?.isActive || false}
                      onChange={(e) => {
                        const checked = e.currentTarget.checked
                        onChangeHandler(checked, 'isActive')
                      }}
                    />
                    <Checkbox
                      label={t('Draft or InActive')}
                      checked={!productInfo?.isActive || false}
                      onChange={(e) => {
                        const checked = !e.currentTarget.checked
                        onChangeHandler(checked, 'isActive')
                      }}
                    />
                  </Group>
                )}

                {isLoading ? (
                  <>
                    <Skeleton height={30} />
                  </>
                ) : (
                  <Select
                    itemComponent={SelectItem}
                    searchable
                    label={t('Collections')}
                    data={
                      collections?.length > 0 && areCollectionsFetched
                        ? collections?.filter((collection) => {
                            const isAlreadySelected = productInfo.collections?.find(
                              (selectedCollection) => collection.value === selectedCollection.value,
                            )

                            return !isAlreadySelected
                          })
                        : []
                    }
                    nothingFound={
                      <Button variant="outline" component={Link} to={'/createcollection'}>
                        {t('Add')} {searchedTag}
                      </Button>
                    }
                    placeholder={t('collection')}
                    onFocus={() => {
                      refetchCollections()
                    }}
                    maxDropdownHeight={400}
                    filter={(value, item) => {
                      setSearchedTag(value)
                      return item.label?.includes(value.toLowerCase().trim())
                    }}
                    onChange={(e) => {
                      const collection = collections?.find((collection) => {
                        return collection.value === e
                      })
                      const selectedCollections = productInfo.collections?.length > 0 ? productInfo.collections : []
                      onChangeHandler([...selectedCollections, collection], 'collections')
                    }}
                  />
                )}
                <Box>
                  {productInfo.collections?.map((collection) => {
                    return (
                      <Badge
                        rightSection={
                          <Button
                            size="xs"
                            variant="subtle"
                            onClick={() => {
                              const filteredCollections = productInfo.collections.filter((oldCollection) => {
                                return oldCollection.value !== collection.value
                              })
                              onChangeHandler(filteredCollections, 'collections')
                            }}
                          >
                            X
                          </Button>
                        }
                      >
                        {collection.label}
                      </Badge>
                    )
                  })}
                </Box>
              </Box>

              <Box
                sx={{
                  height: '300px',
                }}
              >
                <TextInput
                  value={searchText}
                  onChange={(e) => {
                    onChangeHandler(e.target.value, 'barcode')
                    setSearchText(e.target.value)
                  }}
                  label={t('Product barcode')}
                />
                {products.length > 0 && (
                  <Card
                    shadow={'lg'}
                    // mt={6}
                    // sx={{
                    //   maxHeight: '200px',
                    //   overflowY: 'auto',
                    //   display: 'flex',
                    //   flexDirection: 'column',
                    // }}
                  >
                    {products.map((product, index) => {
                      return (
                        <Box
                          key={index}
                          sx={(theme) => ({
                            borderRadius: '6px',

                            ['&:hover']: {
                              backgroundColor:
                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
                            },
                            cursor: 'pointer',
                          })}
                          mt={6}
                          onClick={() => {
                            onChangeHandler(product.images, 'images')
                            onChangeHandler(product.images, 'productLibraryImages')
                          }}
                        >
                          <Box
                            m={6}
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Image
                              withPlaceholder
                              width={'30px'}
                              height={'30px'}
                              src={`${import.meta.env.VITE_APP_BUCKET_URL}/tablet/${product.images[0]}`}
                            />
                            <Text>{product.textInfo.title}</Text>
                          </Box>
                        </Box>
                      )
                    })}
                  </Card>
                )}
                {/* <Select
              label={t("Product barcode")}
              data={products.map((product) => product)}
              searchable
              onSearchChange={(e) => {
                setSearchText(e);
              }}
              value={productInfo.barcode}
              filter={(value, item) => {
                return false;
              }}
            /> */}
                {/* {barcodeProducts.map((product) => {
              return <Text>{product.label}</Text>;
            })} */}
              </Box>
            </Stack>
          </Container>
        </Paper>
      )}
    </Container>
  )
}

export default CollectionCard
