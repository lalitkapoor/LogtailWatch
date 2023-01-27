aws logs describe-log-groups | jq '.logGroups[].logGroupName' | xargs -L1 echo | xargs -L1 -I % aws logs delete-subscription-filter --log-group-name % --filter-name logtail-watch
