import { Button, Card, Container, Group, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'

import { showNotification } from '@mantine/notifications'
import { t } from 'utils/i18nextFix'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface ResetPasswordProps {}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const search = useLocation().search
  const token = new URLSearchParams(search).get('token')
  const tokenId = new URLSearchParams(search).get('tokenId')
  const navigate = useNavigate()

  const passwordForm = useForm({
    initialValues: {
      newPassword: '',
    },
  })
  return (
    <Container
      sx={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card shadow={'md'}>
        <form
          onSubmit={passwordForm.onSubmit(async ({ newPassword }) => {
            try {
              // await resetPassword(token, tokenId, newPassword);
              showNotification({
                title: t('password was reset successfully'),
                autoClose: true,
                message: 'Success',
              })
              navigate('/accountsettings', { replace: true })
            } catch (error) {
              showNotification({
                title: 'error',
                autoClose: true,
                message: 'error',
              })
            }
          })}
        >
          <Title>{t('Reset password')}</Title>
          <Group grow>
            <TextInput
              required
              type="password"
              label={t('New password')}
              {...passwordForm.getInputProps('newPassword')}
            />
          </Group>
          <Group mt={6} position="right">
            <Button type="submit">{t('Reset password')}</Button>
          </Group>
        </form>
      </Card>
    </Container>
  )
}

export default ResetPassword
