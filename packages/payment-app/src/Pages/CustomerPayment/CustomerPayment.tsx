import React from "react";
import Pay from "../../components/Pay";
import { useValidateTransaction } from "../../hooks/useValidateTransaction";
import { useLocation } from "react-router";

interface CustomerPaymentProps {}

const CustomerPayment: React.FC<CustomerPaymentProps> = ({}) => {
  const location = useLocation();

  const configurationObject = JSON.parse(
    '{"' +
      decodeURI(
        location.search.slice(1).replace(/&/g, '","').replace(/=/g, '":"')
      ) +
      '"}'
  );

  const url = configurationObject.url;
  const { mutate } = useValidateTransaction({
    url,
    transactionId: configurationObject.transactionId,
  });
  return <></>;
};

export default CustomerPayment;
