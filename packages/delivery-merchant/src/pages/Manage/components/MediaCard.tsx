import { Badge, Box, Button, Card, Image, Input, Paper, Text, Title } from '@mantine/core'
import { t } from 'utils/i18nextFix'

import { ProductsCard } from '../types'
interface MediaCardProps extends ProductsCard {
  currentImages?: string[]
}
const MediaCard: React.FC<MediaCardProps> = ({ onChangeHandler, productInfo, currentImages }) => {
  const { files } = productInfo

  return (
    <Paper shadow={'sm'} p={'md'} sx={{ margin: 'auto', marginBlock: 10 }}>
      <Title>{t('Product Images')}</Title>
      <Box>
        {files?.map((file, number) => {
          return (
            <Badge
              rightSection={
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => {
                    onChangeHandler(
                      files.filter((oldFiles, index) => number !== index),
                      'files',
                    )
                  }}
                >
                  X
                </Button>
              }
              key={file.name}
              size={'md'}
            >
              <Text>{file?.name}</Text>
            </Badge>
          )
        })}

        <Input
          type={'file'}
          multiple
          onChange={(event) => {
            const uploadedFiles = files?.length > 0 ? [...files, ...event.target.files] : [...event.target.files]
            onChangeHandler(uploadedFiles, 'files')
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {currentImages?.map((imageName, number) => {
            return (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: '4px',
                }}
              >
                <Image
                  mb={4}
                  radius={6}
                  width={70}
                  height={70}
                  src={`${import.meta.env.VITE_APP_BUCKET_URL}/tablet/${imageName}`}
                  alt={t('product image')}
                />
                <Button
                  onClick={() => {
                    const newImages = currentImages.filter((image) => image !== imageName)
                    if (productInfo?.deletedImages?.length > 0) {
                      const updatedDeletedImages = [...productInfo?.deletedImages, imageName]
                      onChangeHandler(updatedDeletedImages, 'deletedImages')
                    } else {
                      onChangeHandler([imageName], 'deletedImages')
                    }
                    onChangeHandler(newImages, 'images')
                  }}
                  variant="outline"
                  size="xs"
                >
                  {t('Delete')}
                </Button>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Paper>
  )
}

export default MediaCard
