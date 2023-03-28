import { Button, Modal, TextInput } from '@mantine/core'
import { FullTextEditor } from 'components/FullTextEditor'
import { t } from 'utils/i18nextFix'
import React, { useState } from 'react'

interface InstructionsModalProps {
  instructions: string
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ instructions }) => {
  const [opened, setOpened] = useState(false)
  const [value, setValue] = useState('')
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title={t('Instructions')}>
        <TextInput value={instructions} readOnly />
        {/* <FullTextEditor value={value} setValue={setValue} readOnly /> */}
      </Modal>
      <Button onClick={() => setOpened(true)}>{t('Instructions')}</Button>
    </>
  )
}

export default InstructionsModal
