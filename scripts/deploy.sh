npm run build
aws s3 cp lambda.zip s3://logtailwatch/
aws lambda update-function-code --function-name logtail-watch --s3-bucket logtailwatch --s3-key lambda.zip
