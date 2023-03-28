import { Box, Image, ImageProps, Modal } from "@mantine/core";
interface ImageModalProps extends ImageProps {
  ImageComponent?: any;
}
// import { useState } from "react"
import React from "react";
const ImageModal: React.FC<ImageModalProps> = ({
  ImageComponent,
  ...props
}) => {
  const [opened, setOpened] = React.useState<boolean>(false);
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Image src={props.src} width={"100%"} height={"100%"} />
      </Modal>
      {ImageComponent ? (
        <Box onClick={() => setOpened(true)}>{ImageComponent}</Box>
      ) : (
        <Image {...props} onClick={() => setOpened(true)} />
      )}
    </>
  );
};

export default ImageModal;
