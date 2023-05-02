import {
  Button,
  Card,
  Container,
  Group,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { t } from "../../util/i18nextFix";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ResetPasswordProps {}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");
  const tokenId = new URLSearchParams(search).get("tokenId");
  const navigate = useNavigate();

  const passwordForm = useForm({
    initialValues: {
      newPassword: "",
    },
  });
  return (
    <Container
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card shadow={"md"}>
        <form
          onSubmit={passwordForm.onSubmit(async ({ newPassword }) => {
            try {
              navigate("/accountsettings", { replace: true });
            } catch (error) {
              console.log(
                "🚀 ~ file: ResetPassword.tsx:44 ~ onSubmit={passwordForm.onSubmit ~ error:",
                error
              );
            }
          })}
        >
          <Title>{t("Reset password")}</Title>
          <Group grow>
            <TextInput
              type="password"
              label={t("New password")}
              {...passwordForm.getInputProps("newPassword")}
            />
          </Group>
          <Group mt={6} position="right">
            <Button type="submit">{t("Reset password")}</Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
};

export default ResetPassword;
