import fetchUtil from 'utils/fetch'

const useUploadImage = () => {
  const uploadImage = async (files: any) => {
    if (files === '' || files === undefined || (Array.isArray(files) && !(files?.length > 0))) return []
    const { generatedURLs, generatedNames } = await fetchUtil({
      url: `${import.meta.env.VITE_APP_BASE_URL}/generateImageURL`,
      reqData: [files.length],
    })

    // await user.functions.uploadImages([data]);
    for (let i = 0; i < files.length; i++) {
      // await files?.forEach(async (file, index) => {
      const file = files[i]
      const generatedIndex = i

      const status = await fetch(generatedURLs[generatedIndex][0], {
        method: 'PUT',
        headers: {
          'content-Type': 'multipart/form',
        },
        body: file,
      })
    }

    return generatedNames
  }
  return uploadImage
}

export default useUploadImage