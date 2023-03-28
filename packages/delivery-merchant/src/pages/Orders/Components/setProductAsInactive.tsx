import { Box, Button } from '@mantine/core'
import { t } from 'utils/i18nextFix'

function SetProductAsInactiveButton({ product, updateProductState }: { product: any; updateProductState: any }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 'fit-content',
      }}
    >
      {((product?.pickup?.pickedUp && product?.pickup?.QTYFound < product.qty) ||
        product?.pickup?.pickedUp === false) && (
        <span
          style={{
            borderRadius: '50%',
            width: '10px',
            height: '10px',
            position: 'absolute',
            top: -4,
            right: -5,
            zIndex: 999,
            background: 'red',
            boxShadow: '-2px -2px 16px -3px rgba(0,0,0,0.75)',
          }}
        />
      )}
      <Button onClick={() => updateProductState(product._id)}>{t('Set product as inActive')}</Button>
    </Box>
  )
}

export default SetProductAsInactiveButton
