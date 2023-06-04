import { Image, ImageProps, Modal } from "@mantine/core";
import { useState } from "react";

const ImageModal: React.FC<ImageProps> = (props) => {
  const [opened, setOpened] = useState<boolean>(false);
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Image src={props.src} width={"100%"} height={"100%"} />
      </Modal>
      <Image {...props} onClick={() => setOpened(true)} />
    </>
  );
};

export default ImageModal;
