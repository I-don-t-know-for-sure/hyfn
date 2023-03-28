import { Alert, Box, Button, Card, Container, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId, useLocalStorage } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'

import { lngs } from 'components/Menu/config'
import Translation from 'components/Translation'
import { useUser } from 'contexts/userContext/User'
import { useGetCurrentSession } from 'hooks/useGetCurrentSession'
import { useGetUserDocument } from 'hooks/useGetUserDocument'
import { t } from 'utils/i18nextFix'
import { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

const SignUp: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // async function signUp({
  //   email,
  //   password,
  //   phone_number,
  //   username,
  // }: {
  //   username?: string
  //   password: string
  //   email: string
  //   phone_number?: string
  // }) {
  //   try {
  //     const { user } = await Auth.signUp({
  //       username: email,
  //       password,
  //       attributes: {
  //         email, // optional
  //         // phone_number,   // optional - E.164 number convention
  //         // other custom attributes
  //       },
  //       autoSignIn: {
  //         // optional - enables auto sign in after user is confirmed
  //         enabled: true,
  //       },
  //     })
  //     console.log(user)
  //   } catch (error) {
  //     console.log('error signing up:', error)
  //   }
  // }

  const [exception, setException] = useState({ exception: false, message: '', code: '' })
  const testingFile = import.meta.env.VITE_APP_Test
  console.log('🚀 ~ file: SignUp.tsx:53 ~ testingFile', testingFile)
  const { signUp, confirmSignUp, userId } = useUser()
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  })

  const [, setDriverInfo] = useLocalStorage<any>({
    key: 'driverInfo',
  })

  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')

  useGetUserDocument({ userId })
  const navigate = useNavigate()

  const { data } = useGetCurrentSession()

  useEffect(() => {
    if (data) {
      console.log(data)

      navigate('/', { replace: true })
    }
  }, [data])

  return (
    <Container
      sx={{
        height: '88vh',
        // width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // alignItems: 'center',
      }}
    >
      {exception.exception && (
        <Alert title={t('User Already Exists')} color={'red'}>
          {t('An account with this information already exists')}
        </Alert>
      )}
      <Card
        withBorder
        sx={{
          width: '90%',
          maxWidth: 500,
          margin: '20px auto',
        }}
      >
        {signUpSuccess ? (
          <Container
            sx={{
              flexDirection: 'column',
              width: '100%',
            }}
            mb={16}
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
            <Button
              fullWidth
              onClick={async () => {
                try {
                  await confirmSignUp({ email: form.values.email, code: verificationCode, navigate })
                } catch (error) {
                  const { status, message, name, code } = error as {
                    message: string
                    status: any
                    code: string
                    name: string
                  }
                  setException({ exception: true, code, message })
                }
              }}
            >
              {t('Confirm account')}
            </Button>
          </Container>
        ) : (
          <form
            onSubmit={form.onSubmit(async (values) => {
              const id = randomId()
              try {
                showNotification({
                  title: t('Signing up'),
                  message: t('In progress'),
                  loading: true,
                  autoClose: false,
                  id,
                })
                const { email, password } = values
                console.log(values)
                //await logOut();

                const trimmedEmail = email.trim()

                await signUp({ email: trimmedEmail, password })

                setSignUpSuccess(true)
                updateNotification({
                  title: t('Check your Email for confirmation Email'),
                  message: t('Signed up successfully'),
                  color: 'green',
                  loading: false,
                  autoClose: false,
                  id,
                })
                // await logIn(values.email, values.password);
              } catch (e) {
                const { status, message, name, code } = e as {
                  message: string
                  status: any
                  code: string
                  name: string
                }

                console.log('already in use')
                setException({ exception: true, code, message })
                updateNotification({
                  message: t('An Error occurred'),
                  id,
                  color: 'red',
                  loading: false,
                  autoClose: true,
                })
                console.error(e)
              }
              //  mutate(values);
            })}
          >
            <TextInput
              {...form.getInputProps('email')}
              label={'Email'}
              // required
            />
            <TextInput
              {...form.getInputProps('password')}
              label={'password'}
              type="password"
              // required
            />
            <Group
              mb={2}
              m={'12px auto'}
              position="center"
              grow
              sx={{
                maxWidth: '400px',
              }}
            >
              <Button mt={'6px'} type="submit">
                {t('Create Account')}
              </Button>
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
          <Box>
            {t('already have an account?')} <Link to={'/login'}>{t('Login')}</Link>{' '}
          </Box>

          <Translation lngs={lngs} />
        </Box>
      </Card>
    </Container>

    // <Card shadow={"sm"} p="lg" sx={{ maxWidth: 300 }} mx="auto">
    //   hi mom sign me up
    //
    //     <TextInput
    //       type="text"
    // //       required
    //       label={"Business Name"}
    //       {...form.getInputProps("businessName")}
    //     />
    //     <TextInput
    //       type="number"
    //       required
    //       label={"BusinessPhone"}
    //       {...form.getInputProps("businessPhone")}
    //     />

    //     <TextInput
    //       type="email"
    //       required
    //       label="email"
    //       {...form.getInputProps("email")}
    //     />
    //     <TextInput
    //       label="password"
    //       type="password"
    //       {...form.getInputProps("password")}
    //     />

    //     <Button type="submit">SignUp</Button>
    //   </form>
    // </Card>
  )
}

export default SignUp
