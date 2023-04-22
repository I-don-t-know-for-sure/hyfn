import { useImage } from "contexts/imageContext/ImageProvider";
import React from "react";
import { Image as BaseImage, ImageProps } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface ImageProp extends ImageProps {
  imageName: string;
}

const Image: React.FC<ImageProp> = ({ imageName, ...rest }) => {
  const { url, screenSizes } = useImage();

  const laptop = useMediaQuery("(min-width: 920px)");
  const tablet = useMediaQuery("(max-width: 920px)");
  const mobile = useMediaQuery("(max-width: 430px)");
  // console.log(`${url}${screenSizes[1]}/${imageName}`);
  // console.log(`${url}${screenSizes[2]}/${imageName}`);
  // console.log(`${url}${screenSizes[0]}/${imageName}`);
  if (mobile) {
    return <BaseImage src={`${url}${screenSizes[0]}/${imageName}`} {...rest} />;
  }
  if (tablet) {
    return <BaseImage src={`${url}${screenSizes[1]}/${imageName}`} {...rest} />;
  }
  if (laptop) {
    return <BaseImage src={`${url}${screenSizes[1]}/${imageName}`} {...rest} />;
  }
};

export default Image;
