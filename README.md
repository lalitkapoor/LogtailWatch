# LogtailWatch

A tool for automatically forwarding CloudWatch logs to Logtail.

## Setup

Ensure you have the following environment variables setup:

`AWS_ACCESS_KEY_ID`
`AWS_SECRET_ACCESS_KEY`
`AWS_DEFAULT_REGION`

Run the following:

```
sh scripts/setup.sh;
sh scripts/deploy.sh;
```

Navigate to the created lambda function and add your logtail source token as an environment variable named: `LOGTAIL_SOURCE_TOKEN`

Go [here](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:374852340823:applications~auto-subscribe-log-group-to-arn) and deploy the function.

1. Set the Applicationa nme to logtail-watch
2. Set the DestinationArn to the Arn of the lambda function that was deployed during setup
3. Set the FilterName to logtail-watch
4. Set the FilterPattern to `[event]`
5. Set any of the other attributes you wish to set to control which log groups to forward logs for vs not.
