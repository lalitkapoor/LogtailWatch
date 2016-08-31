# PaperWatch
A tool for automatically forwarding CloudWatch logs from your lambda functions to Papertrail.

## Setup

Follow these steps to set up and deploy PaperWatch to AWS:

#### 1. Configure
The two lambda functions reads the following configuration information from `config/papertrail.json`

| Key | Required | Type | Description |
| ----- | ----- | ---------- |
| `host` | Yes  | _String_ | The paper trail endpoint's address |
| `port` | Yes | _Number_ | The paper trail endpoint's port |
| `consumer` | Yes | _String_ | The name of the consumer function.  Used by the Subscribe function to avoid subscribing the consumer to itself.  Do not change unless you are modifying the CFN template.|
| `retentionPeriod` | No | _Number_ | If included, updates the CloudWatch log group's retention period (in days) |
| `exclude` | No | _Array_ of _Strings_ | List of lambda function names that the Subscribe function should ignore |

*Example config:*
```
{
  "host": "samplehost.papertrailapp.com",
  "port": 12345,
  "retentionPeriod": 3
  "consumer": "PaperWatchConsumer",
  "exclude": [
    "TestFunction",
    "LoudFunction"
  ]
}
```

#### 2. Build
Running the _build_ script will install dependencies and create the .zip deployment package (as lambda.zip)
```
paperwatch $ npm run build
```

#### 3. Deploy
First, upload the deployment package to an s3 bucket.  Take note of the bucket name, you will need this later.
This can be done with the aws-cli as follows:
```
paperwatch $ aws s3 cp ./lambda.zip s3://<BUCKET_NAME>
```

Next, create a new cloudformation stack using from the template at ```cfn/deploy.cfn.json```.  
Enter a stack name.  You will also be prompted to enter the following parameters:
- SourceBucket - the name of the s3 bucket you uploaded the deployment package to
- SourceKey - name of the deployment package in the s3 bucket (lambda.zip), including any prefixes if applicable

Once deployed, logs will be forwarded to papertrail for all new lambda functions.  
Existing functions must be subscribed manually.  


### Manual Subscription
To manually subscribe a function, navigate to the CloudWatch console and follow these steps:  
1. Locate the log group for the function you wish to subscribe, selecting it by checking the box on the left  
2. Open the _Actions_ dropdown and choose _Stream to AWS Lambda_  
3. From the Lambda Function dropdown, select _PaperWatchConsumer_ and click next  
4. From the Log Format dropdown, select _Other_ and click next  
4. Click _Start Streaming_  

PaperWatch will now begin forwarding the functions logs to Papertrail