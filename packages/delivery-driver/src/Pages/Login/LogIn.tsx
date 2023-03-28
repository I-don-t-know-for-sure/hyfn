import { Alert, Box, Button, Card, Container, Group, Stack, TextInput, UnstyledButton } from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId, useLocalStorage } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { lngs } from 'components/Menu/config'
import { t } from 'utils/i18nextFix'

// import { useCustomerData } from "contexts/customerData/CustomerDataProvider";
import React, { useEffect, useState } from 'react'
import Translation from 'components/Translation'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'

import { useGetCurrentSession } from 'hooks/useGetCurrentSession'
import { Auth } from 'aws-amplify'
import { useQueryClient } from 'react-query'
import { useUser } from 'contexts/userContext/User'

interface LogInProps {}

const LogIn: React.FC<LogInProps> = () => {
  const initialValues: { email: string; password: string } = {
    email: '',
    password: '',
  }

  const form = useForm({
    initialValues: initialValues,
  })
  const {
    signIn,
    loggedIn,
    resendConfirmationEmail,
    confirmSignUp,
    sendPasswordChangeConfirmationCode,
    changePasswordAndConfirmCode,
  } = useUser()
  const [changingPassword, setChangingPassword] = useState(false)

  const [verificationCode, setVerificationCode] = useState('')
  const [exception, setException] = useState({ exception: false, message: '', code: '' })

  const navigate = useNavigate()
  const location = useLocation()
  const [confirmed, setConfirmed] = useState(true)
  // const [email, setEmail] = useState('')
  const locationState = location.state as { firstTimer: boolean }
  const queryClient = useQueryClient()
  // useEffect(() => {
  //   if (user?.isLoggedIn) {
  //     if (locationState?.firstTimer) {
  //       showNotification({
  //         id: randomId(),
  //         title: t('signup successful'),
  //         message: t('just login now'),
  //         autoClose: 4000,
  //       })
  //       navigate('/createaccount', { replace: true })
  //       return
  //     }
  //     navigate('/', { replace: true })
  //   }
  // }, [user])

  useEffect(() => {
    if (loggedIn) {
      console.log(loggedIn)

      navigate('/', { replace: true })
    }
  }, [loggedIn])

  const changePasswordForm = useForm({
    initialValues: {
      confirmationCode: '',
      newPassword: '',
    },
  })
  // const { refetch } = useCustomerData();

  // useEffect(() => {
  //   if (user && user?.app?.currentUser?.providerType !== "anon-user") {
  //   }
  //   if (user && user?.app?.currentUser?.providerType === "anon-user") {
  //     user.logOut();
  //   }
  // });

  return (
    <Container
      sx={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
      }}
    >
      {exception.exception && (
        <Alert title={t(exception.code)} color={'red'}>
          {t(exception.message)}
        </Alert>
      )}
      <Card
        shadow={'md'}
        m={'auto'}
        sx={{
          width: '100%',
          maxWidth: '500px',
        }}
      >
        {changingPassword && (
          <Container>
            <form
              onSubmit={changePasswordForm.onSubmit(async (values) => {
                try {
                  if (
                    !String(form.values.email).match(
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    )
                  ) {
                    showNotification({
                      message: t('does not match email pattern'),
                      color: 'red',
                    })
                    return
                  }
                  await changePasswordAndConfirmCode({
                    email: form.values.email,
                    newPassword: values.newPassword,
                    code: values.confirmationCode,
                  })
                  setChangingPassword(false)
                } catch (error) {
                  console.log('🚀 ~ file: LogIn.tsx:113 ~ onSubmit={changePasswordForm.onSubmit ~ error', error)
                }
              })}
            >
              <Stack>
                <TextInput label={t('Confirmation code')} {...changePasswordForm.getInputProps('confirmationCode')} />
                <TextInput label={t('New Password')} {...changePasswordForm.getInputProps('newPassword')} />
                <Button type="submit">{t('Change')}</Button>
              </Stack>
            </form>
          </Container>
        )}
        {!confirmed && !changingPassword && (
          <Container
            sx={{
              flexDirection: 'column',
              width: '100%',
            }}
            mb={16}
          >
            <form
              onSubmit={async (e) => {
                try {
                  e.preventDefault()
                  await confirmSignUp({ email: form.values.email, code: verificationCode, navigate })
                } catch (error) {
                  const { code, message } = error as { code: string; message: string }
                  console.log(message, 'shshshsh')
                  setException({ exception: true, message, code })
                }
              }}
            >
              <TextInput
                mb={16}
                sx={{ width: '100%' }}
                label={t('Confirmation code')}
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value)
                }}
              />
              <Button fullWidth type="submit">
                {t('Confirm account')}
              </Button>
            </form>
            <Button
              fullWidth
              mt={4}
              onClick={async () => {
                const id = randomId()
                try {
                  showNotification({
                    message: t('sending confirmation email'),
                    autoClose: false,
                    id,
                  })
                  resendConfirmationEmail({ username: form.values.email })
                  updateNotification({
                    message: t('email was sent'),
                    id,
                    autoClose: true,
                    color: 'green',
                  })
                } catch (error) {
                  console.log('🚀 ~ file: LogIn.tsx:149 ~ onClick={ ~ error', error)
                  const { status, message, name, code } = error as {
                    message: string
                    status: any
                    code: string
                    name: string
                  }

                  setException({ exception: true, code, message })

                  updateNotification({
                    message: t('an error occured'),
                    id,
                    autoClose: true,
                    color: 'red',
                  })
                }
              }}
            >
              {t('Resend Confirmation email')}
            </Button>
          </Container>
        )}
        {confirmed && !changingPassword && (
          <form
            onSubmit={form.onSubmit(async (values) => {
              const id = randomId()
              try {
                showNotification({
                  title: t('In progress'),
                  message: t('Logging in'),
                  loading: true,
                  autoClose: false,
                  id,
                })
                const trimmedEmail = values.email.trim()
                // await logIn(trimmedEmail, values.password)
                // await user?.refreshCustomData()
                await signIn({ email: trimmedEmail, password: values.password })

                updateNotification({
                  message: t('Login Successful'),
                  id,
                  color: 'green',
                  loading: false,
                  autoClose: true,
                })
              } catch (e) {
                updateNotification({
                  message: t('An Error occurred'),
                  id,
                  color: 'red',
                  loading: false,
                  autoClose: true,
                })
                const { status, message, name, code } = e as {
                  message: string
                  status: any
                  code: string
                  name: string
                }
                if (code.includes('UserNotConfirmedException')) {
                  setConfirmed(false)
                  // setEmail(form.values.email)
                }
                setException({ exception: true, code, message })

                console.error(e)
              }
            })}
          >
            <TextInput label="Email" required {...form.getInputProps('email')} />
            <TextInput label="Password" required type="password" {...form.getInputProps('password')} />
            <Group
              mb={2}
              m={'12px auto'}
              position="center"
              grow
              sx={{
                maxWidth: '400px',
              }}
            >
              <Button type="submit">{t('LogIn')}</Button>
            </Group>
          </form>
        )}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Group>
            <Link to="/signup">{t('Signup')}</Link>
            <UnstyledButton
              onClick={async () => {
                console.log(form.values.email)

                const validated = String(form.values.email).match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                )
                if (!validated) {
                  showNotification({
                    message: t('Not email pattern'),
                    color: 'red',
                  })
                  return
                }
                try {
                  await sendPasswordChangeConfirmationCode({ email: form.values.email })
                  setChangingPassword(true)
                } catch (error) {
                  console.log('🚀 ~ file: LogIn.tsx:259 ~ error', error)
                }
              }}
            >
              {t('Forgot password')}
            </UnstyledButton>
          </Group>

          <Translation lngs={lngs} />
        </Box>
      </Card>
    </Container>
  )
}
export default LogIn
