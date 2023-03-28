import {
  Button,
  Card,
  Container,
  FileInput,
  Group,
  Image,
  Loader,
  NativeSelect,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'

import { t } from '../../utils/i18nextFix'

import React, { useEffect, useState } from 'react'
import { useUpdateDriverDocument } from './hooks/useUpdateDriverDocument'

import Wallet from 'Pages/Wallet/Wallet'
import { useGetUserDocument } from 'hooks/useGetUserDocument'
import { useUser } from 'contexts/userContext/User'

interface AccountDetailsProps {}

const AccountDetails: React.FC<AccountDetailsProps> = () => {
  const { mutate } = useUpdateDriverDocument()
  const { userId } = useUser()
  const { data = {}, isLoading, isFetched, isSuccess } = useGetUserDocument({ userId })
  const form = useForm({
    initialValues: {
      driverName: '',

      phoneNumber: '',
      passportNumber: '',
      tarnsportationMethod: 'car',
    },
  })

  const [passportPic, setPassportPic] = useState<File | null>(null)
  const [passportAndFacePic, setPassportAndFacePic] = useState<File | null>(null)
  useEffect(() => {
    if (data && !isLoading) {
      form.setValues({
        ...form.values,
        ...data,
      })
      // setPassportAndFacePic(data?.passportAndFacePic[0])
      // setPassportPic(data?.passportPic[0])
    }
  }, [isFetched])

  return (
    <Container>
      <Stack spacing={20}>
        {isLoading ? (
          <Loader />
        ) : (
          isSuccess && (
            <form
              onSubmit={form.onSubmit(async (values) => {
                try {
                  console.log({
                    ...values,
                    passportPic: passportPic === null ? data?.passportPic : passportPic,
                    passportAndFacePic: passportAndFacePic === null ? data?.passportAndFacePic : passportAndFacePic,
                  })

                  mutate({
                    ...values,
                    passportPic: passportPic === null ? data?.passportPic : passportPic,
                    passportAndFacePic: passportAndFacePic === null ? data?.passportAndFacePic : passportAndFacePic,
                  })
                } catch (e) {
                  console.error(e)
                }
              })}
            >
              <Stack>
                <Card
                  shadow={'md'}
                  sx={{
                    marginTop: '6px',
                  }}
                >
                  <Title order={3} mb={8}>
                    {t('Personal Info')}
                  </Title>
                  <Stack>
                    <Group grow>
                      <TextInput
                        type="text"
                        // required
                        label={t('Full name')}
                        {...form.getInputProps('driverName')}
                      />
                    </Group>
                    <Group grow>
                      <TextInput
                        type="number"
                        // required
                        label={t('Phone number')}
                        {...form.getInputProps('phoneNumber')}
                      />

                      <TextInput
                        type="text"
                        // required
                        label={t('Passport number')}
                        {...form.getInputProps('passportNumber')}
                      />
                    </Group>
                    <Group grow>
                      <FileInput
                        placeholder={t('Pick a picture')}
                        required
                        value={passportPic}
                        onChange={setPassportPic}
                        label={t('Passport Picture')}
                      />
                      <Image src={`${import.meta.env.VITE_APP_BUCKET_URL}/driver-verification/${data?.passportPic[0]}`} />
                    </Group>
                    <Group grow>
                      <FileInput
                        placeholder={t('Pick a picture')}
                        required
                        value={passportAndFacePic}
                        onChange={setPassportAndFacePic}
                        label={t('Passport and face pic')}
                      />
                      <Image
                        src={`${import.meta.env.VITE_APP_BUCKET_URL}/driver-verification/${data?.passportAndFacePic[0]}`}
                      />
                    </Group>
                    {/* <TextInput
            type="tel"
            // required
            label={"sadad phone number"}
            placeholder={"0912345678"}
            {...form.getInputProps("sadadPhoneNumber")}
          /> */}

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
                  </Stack>
                </Card>

                <Card title={t('Transportaion Info')} shadow={'md'}>
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
                </Card>
                <Group mt={24}>
                  <Button
                    fullWidth
                    sx={{
                      maxWidth: '450px',
                    }}
                    m={'0px auto'}
                    type="submit"
                  >
                    {t('Update Account')}
                  </Button>
                </Group>
              </Stack>
            </form>
          )
        )}

        {/* <Wallet /> */}
      </Stack>
    </Container>
  )
}

export default AccountDetails
