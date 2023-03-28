import { Box, Button, Card, Container, Group, Select, TextInput, Title } from '@mantine/core';

import { t } from '../../util/i18nextFix';;
import React from 'react';

import useUpdateUSerDocument from './hooks/useUpdateUserDocument';
import { useForm } from '@mantine/form';

interface AccountSettingsProps {}

const AccountSettings: React.FC<AccountSettingsProps> = ({}) => {
  const form = useForm({
    initialValues: {
      name: '',
    },
  });
  const { mutate } = useUpdateUSerDocument();

  return (
    <Container>
      <Card shadow={'md'}>
        <form
          onSubmit={form.onSubmit(async (values) => {
            try {
              const { ...rest } = values;
              mutate({ newUserInfo: rest });
            } catch (e) {
              console.error(e);
            }
          })}
        >
          <Group spacing={'sm'} position={'center'} grow={true}>
            <TextInput type="text" required label={t('Name')} {...form.getInputProps('name')} />
          </Group>

          <Group position="apart" mt="xl">
            {/* <Button
              fullWidth
              variant="light"
              onClick={async () => {
                // await sendResetPasswordEmail();
              }}
            >
              {t('change password')}
            </Button> */}
            <Button fullWidth type="submit">
              {t('Set Account Info')}
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
};

export default AccountSettings;
