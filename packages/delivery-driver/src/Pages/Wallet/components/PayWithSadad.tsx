import { Box, Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

import { t } from 'utils/i18nextFix'
import { useState } from 'react'
import { useAddToTopUp } from '../hooks/useAddToTopUp'
import { useResendOTP } from '../hooks/useResendOTP'
import { useSendOTP } from '../hooks/useSendOTP'

export const PayWithSadad: React.FC = () => {
  const { mutate: sendOTP } = useSendOTP()
  const { mutate: resendOTP } = useResendOTP()
  const { mutate: addToTopUp } = useAddToTopUp()

  const [otpSent, setOtpSent] = useState(false)
  const paymentForm = useForm({
    initialValues: {
      amountToBeAdded: 0,
      OTP: '',
      customerPhone: '',
      birthYear: '',
    },
  })

  return (
    <Box>
      <Box
        sx={(theme) => ({
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'baseline',
          [theme.fn.smallerThan('md')]: {
            marginTop: 12,
          },
        })}
      >
        <Group grow m={'8px auto'}>
          <TextInput {...paymentForm.getInputProps('amountToBeAdded')} placeholder={t('edit if you want')} />
        </Group>
        <Group grow sx={{}} m={'auto'}>
          <TextInput {...paymentForm.getInputProps('customerPhone')} placeholder={t('write the paying phone number')} />
          <TextInput {...paymentForm.getInputProps('birthYear')} placeholder={t('write your birth year')} />
        </Group>
        <Group grow mt={12}>
          <Button
            onClick={() => {
              otpSent
                ? resendOTP()
                : sendOTP({
                    amountToBeAdded: paymentForm.values.amountToBeAdded,
                    customerPhone: paymentForm.values.customerPhone,
                    birthYear: paymentForm.values.birthYear,
                    OTPSent: setOtpSent,
                  })
            }}
          >
            {otpSent ? t('Resend OTP') : t('Send OTP')}
          </Button>
        </Group>
      </Box>
      <Group
        grow
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'baseline',
          [theme.fn.smallerThan('md')]: {
            marginTop: 12,
          },
        })}
      >
        <TextInput {...paymentForm.getInputProps('OTP')} placeholder={t('write the OTP here')} />
        <Button
          onClick={() => {
            addToTopUp({
              OTP: paymentForm.values.OTP,
              amountToBeAdded: paymentForm.values.amountToBeAdded,
            })
          }}
        >
          {t('Make payment')}
        </Button>
      </Group>
    </Box>
  )
}
