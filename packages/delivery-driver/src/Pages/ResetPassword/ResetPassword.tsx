import { Button, Card, Container, Group, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
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
            const id = randomId()
            try {
              showNotification({
                title: t('In progress'),
                message: t('Processing'),
                loading: true,
                autoClose: false,
                id,
              })
              // await resetPassword(token, tokenId, newPassword);
              updateNotification({
                message: t('Success'),
                id,
                color: 'green',
                loading: false,
                autoClose: true,
              })
              navigate('/accountsettings', { replace: true })
            } catch (error) {
              updateNotification({
                message: t('An Error occurred'),
                id,
                color: 'red',
                loading: false,
                autoClose: true,
              })
            }
          })}
        >
          <Title>{t('Reset password')}</Title>
          <Group grow>
            <TextInput type="password" label={t('New password')} {...passwordForm.getInputProps('newPassword')} />
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
