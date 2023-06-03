import { Box, FileInputProps, Group, Image, Stack } from "hyfn-client";
import { useState } from "react";

function Value({ file }: { file: File }) {
  const reader = new FileReader();
  const [imageUrl, setImageUrl] = useState("");
  reader.onloadend = () => {
    const base64String = (reader.result as string)
      .replace("data:", "")
      .replace(/^.+,/, "");

    setImageUrl(`data:image/png;base64,${base64String}`);
  };

  reader.readAsDataURL(file);

  return (
    <Stack

    // sx={(theme) => ({
    //   backgroundColor:
    //     theme.colorScheme === "dark"
    //       ? theme.colors.dark[7]
    //       : theme.colors.gray[1],
    //   fontSize: theme.fontSizes.xs,
    //   padding: `${3} ${7}`,
    //   borderRadius: theme.radius.sm,
    // })}
    >
      <Box style={{ width: "150px" }}>
        <Image
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
          src={imageUrl}
        />
      </Box>

      <span
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          maxWidth: 200,
          display: "inline-block",
        }}
      >
        {file.name}
      </span>
    </Stack>
  );
}

const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
  if (Array.isArray(value)) {
    return (
      <Group spacing="sm" py="xs">
        {value.map((file, index) => (
          <Value file={file} key={index} />
        ))}
      </Group>
    );
  }

  return <Value file={value} />;
};

export default ValueComponent;
