cd "$(dirname "$0")/.."

npm run build
aws s3 cp lambda.zip s3://logtail-watch/
aws lambda update-function-code --function-name logtail-watch --s3-bucket logtail-watch --s3-key lambda.zip
