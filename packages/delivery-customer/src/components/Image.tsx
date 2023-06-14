import { useImage } from "contexts/imageContext/ImageProvider";
import React from "react";
import { Image as BaseImage, ImageProps } from "hyfn-client";
import { useMediaQuery } from "@mantine/hooks";

interface ImageProp extends ImageProps {
  imageName: string;
}

const Image: React.FC<ImageProp> = ({ imageName, ...rest }) => {
  const { url, screenSizes } = useImage();

  const laptop = useMediaQuery("(min-width: 920px)");
  const tablet = useMediaQuery("(max-width: 920px)");
  const mobile = useMediaQuery("(max-width: 430px)");
  if (mobile) {
    return <BaseImage src={`${url}${"preview"}/${imageName}`} {...rest} />;
  }
  if (tablet) {
    return <BaseImage src={`${url}${"preview"}/${imageName}`} {...rest} />;
  }
  if (laptop) {
    return <BaseImage src={`${url}${"preview"}/${imageName}`} {...rest} />;
  }
};

export default Image;
