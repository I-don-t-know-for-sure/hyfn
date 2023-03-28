BUCKET_NAME=$1
DISTRIBUTION_ID=$2


# echo *-- Install --*
# yarn --production


echo *-- build --*
yarn build

E2EPS2WW3YLKSR

echo *--deploy --*
aws s3 sync build s3://$BUCKET_NAME
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" --no-cli-pager