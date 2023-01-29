cd "$(dirname "$0")/.."

aws iam create-role --role-name logtail-watch-role --assume-role-policy-document file://role.json
aws iam create-policy --policy-name logtail-watch-policy --policy-document file://policy.json
aws iam attach-role-policy --policy-arn "<TBD-TO-FILL-HERE>" --role-name logtail-watch-role
aws lambda create-function --function-name logtail-watch \
  --runtime nodejs18.x \
  --zip-file fileb://lambda.zip \
  --handler src/router.handler \
  --role "<TBD-TO-FILL-HERE>"