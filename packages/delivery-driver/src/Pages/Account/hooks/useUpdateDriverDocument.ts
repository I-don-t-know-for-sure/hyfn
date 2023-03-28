import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useUser } from 'contexts/userContext/User'

import useUploadImage from 'hooks/useUploadImage'
import { t } from 'utils/i18nextFix'
import { useMutation, useQuery } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useUpdateDriverDocument = () => {
  const { userDocument: user } = useUser()
  const uploadImage = useUploadImage()

  const id = randomId()
  // const uploadImage = useUploadImage();
  return useMutation(async (driverInfo: any) => {
    try {
      showNotification({
        title: t('In Progress'),
        message: t('Updating Your Info'),
        id,
        loading: true,
        autoClose: false,
      })
      console.log('🚀 ~ file: useUpdateDriverDocument.ts:18 ~ returnuseMutation ~ driverInfo', driverInfo)

      const passportPicKey = Array.isArray(driverInfo.passportPic)
        ? driverInfo.passportPic
        : await uploadImage([driverInfo.passportPic])
      const passportAndFacePicKey = Array.isArray(driverInfo.passportAndFacePic)
        ? driverInfo.passportAndFacePic
        : await uploadImage([driverInfo.passportAndFacePic])

      const result = await fetchUtil({
        reqData: [user?._id, { ...driverInfo, passportAndFacePic: passportAndFacePicKey, passportPic: passportPicKey }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/updateDriverDocument`,
      })

      updateNotification({
        title: t('Successful'),
        message: t('Your Info was updated successfully'),
        id,
        loading: false,
        autoClose: true,
        color: 'green',
      })
      return result
    } catch (error) {
      updateNotification({
        title: t('Error'),
        message: t('An Error occurred'),
        id,
        loading: false,
        autoClose: true,
        color: 'red',
      })
    }
  })
}
