import { ActionIcon, Button, Modal, Text } from '@mantine/core'
import { t } from 'utils/i18nextFix'
import React, { useState } from 'react'

interface WalletModalProps {
  balance: number
}

const WalletModal: React.FC<WalletModalProps> = ({ balance }) => {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <>hello</>
      </Modal>
      <Button
        onClick={() => {
          setOpened(true)
        }}
      >
        {`${t('Wallet')} : ${balance}`}
      </Button>
      {/* <ActionIcon
        sx={{
          width: 'fit-content',
        }}
        onClick={() => setOpened(true)}
      >
        <Text>{`${t('Balance')} : ${balance}`}</Text>
      </ActionIcon> */}
    </>
  )
}

export default WalletModal
