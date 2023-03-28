import { Badge, Button, Modal, Table } from '@mantine/core';
import { t } from 'util/i18nextFix';;

import { useState } from 'react';

interface TransactionModalProps {
  transactions: any[];
  validateTransaction: any;
}
const TransactionModal: React.FC<TransactionModalProps> = ({ transactions, validateTransaction }) => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Table>
          <thead>
            <tr>
              {/* <th>{t('ID')}</th> */}
              <th>{t('Payment method')}</th>
              <th>{t('Amount')}</th>
              <th>{t('Validated')}</th>
            </tr>
          </thead>
          <tbody
            style={{
              width: '100%',
            }}
          >
            {transactions.map((transaction) => {
              return (
                <tr key={transaction._id}>
                  {/* <td>{transaction._id}</td> */}
                  <td>{transaction.paymentMethod}</td>
                  <td>{transaction.amount}</td>
                  <td>
                    {transaction.validated ? (
                      <Badge color={'green'}>{t('Validated')}</Badge>
                    ) : (
                      <Button onClick={() => validateTransaction({ transactionId: transaction._id })}>
                        {t('Validate')}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Modal>
      <Button
        onClick={() => {
          setOpened(true);
        }}
      >
        {t('Transactions')}
      </Button>
    </>
  );
};

export default TransactionModal;
