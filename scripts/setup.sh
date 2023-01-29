cd "$(dirname "$0")/.."

aws iam create-role --role-name logtail-watch-role --assume-role-policy-document file://role.json
roleArn = $(aws iam list-roles --query 'Roles[?RoleName==`logtail-watch-role`][].[Arn]' --output text)

aws iam create-policy --policy-name logtail-watch-policy --policy-document file://policy.json
policyArn = $(aws iam list-policies --query 'Policies[?PolicyName==`logtail-watch-policy`][].[Arn]' --output text)

aws iam attach-role-policy --policy-arn $policyArn --role-name logtail-watch-role
aws lambda create-function --function-name logtail-watch \
  --runtime nodejs18.x \
  --zip-file fileb://lambda.zip \
  --handler src/router.handler \
  --role $roleArn
aws s3 mb s3://logtail-watch