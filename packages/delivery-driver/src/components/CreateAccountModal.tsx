import { Modal } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useUser } from 'contexts/userContext/User'
import { useCreateDriver } from 'hooks/useCreateDriver'
import React, { useEffect, useState } from 'react'

import { Button, Card, Container, FileInput, Group, NativeSelect, Paper, Stack, TextInput, Title } from '@mantine/core'

import { t } from 'utils/i18nextFix'

import { useNavigate } from 'react-router'

interface CreateAccountModalProps {
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ opened, setOpened }) => {
  const { mutate } = useCreateDriver()
  const navigate = useNavigate()
  const form = useForm({
    initialValues: {
      driverName: '',

      driverPhone: '',

      passportNumber: '',
      tarnsportationMethod: 'car',
    },
  })
  const { loggedIn, userDocument } = useUser()

  useEffect(() => {
    if (loggedIn) {
      if (typeof userDocument === 'object') {
        if (Object.keys(userDocument).length > 0) {
          navigate('/', { replace: true })
        }
      }
    }
    if (!loggedIn) {
      navigate('/signup', { replace: true })
    }
  }, [loggedIn, userDocument])

  const [passportPic, setPassportPic] = useState<File | null>(null)
  const [passportAndFacePic, setPassportAndFacePic] = useState<File | null>(null)
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false)
        }}
      >
        <Container>
          <form
            onSubmit={form.onSubmit(async (values) => {
              try {
                console.log(values)

                mutate({ ...values, passportPic, passportAndFacePic })
              } catch (e) {
                console.error(e)
              }
            })}
          >
            <Title order={3} mb={8}>
              {t('Personal Info')}
            </Title>
            <Stack>
              <TextInput
                type="text"
                // required
                label={t('Full name')}
                {...form.getInputProps('driverName')}
              />

              {/* <Group grow>
            <TextInput
            type="text"
            // required
            label={t('Last Name')}
            {...form.getInputProps('lastName')}
            />
          </Group> */}

              <TextInput
                type="number"
                // required
                label={t('driverPhone')}
                {...form.getInputProps('driverPhone')}
              />
              <TextInput
                type="text"
                // required
                label={t('Passport number')}
                {...form.getInputProps('passportNumber')}
              />

              <FileInput required value={passportPic} onChange={setPassportPic} label={t('Passport Picture')} />
              <FileInput
                required
                value={passportAndFacePic}
                onChange={setPassportAndFacePic}
                label={t('Passport and face pic')}
              />
            </Stack>
            {/* <Group
                grow
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Input.Wrapper label={t("Personal Picture")}>
                  <Input
                    type={"file"}
                    title={t("Personal Picture")}
                    onChange={(e) =>
                      form.setFieldValue("personalImageObj", [
                        ...e.target.files,
                      ])
                    }
                  />
                </Input.Wrapper>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={`${import.meta.env.VITE_APP_BUCKETURL}/${data?.personlImage[0]}`}
                    width={100}
                    height={100}
                    radius={6}
                    mt={6}
                  />
                </Box>
              </Group> */}

            <Title order={3} mb={8}>
              Transportaion Info
            </Title>

            <NativeSelect
              label={t('Transprotaion method')}
              data={[
                { value: 'car', label: t('Car') },
                { value: 'motorcycle', label: t('Motorcycle') },
                { value: 'truck', label: t('Truck') },
                { value: 'van', label: t('Van') },
              ]}
              onChange={(e) => {
                console.log(e)
                console.log('hshsh')

                form.setFieldValue('tarnsportationMethod', e.target.value)
              }}
              value={form.values.tarnsportationMethod}
            />
            {/* <Select
                  label={t("vehicle Brand")}
                  data={[
                    { value: "Car", label: t("Car") },
                    { value: "Car", label: t("Car") },
                    { value: "Car", label: t("Car") },
                    { value: "Car", label: t("Car") },
                    { value: "Car", label: t("Car") },
                    { value: "Car", label: t("Car") },
                  ]}
                  {...form.getInputProps("vehicleBrand")}
                /> */}

            {/*<Group grow>
                 <Input.Wrapper label={t("vehicle picture")}>
                  <Input
                    type={"file"}
                    title={t("vehicle picture")}
                    onChange={(e) =>
                      form.setFieldValue("vehicleImageObj", [...e.target.files])
                    }
                  />
                </Input.Wrapper>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={`${import.meta.env.VITE_APP_BUCKETURL}/${data?.vehicleImage[0]}`}
                    width={100}
                    height={100}
                    radius={6}
                    mt={6}
                  />
                </Box>
              </Group> */}

            <Group mt={24}>
              <Button
                fullWidth
                sx={{
                  maxWidth: '450px',
                }}
                m={'0px auto'}
                type="submit"
              >
                {t('Create Account')}
              </Button>
            </Group>
          </form>
        </Container>
      </Modal>
    </>
  )
}

export default CreateAccountModal
