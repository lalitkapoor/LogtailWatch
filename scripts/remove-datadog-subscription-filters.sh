cd "$(dirname "$0")/.."

logGroupNames=()

aws logs describe-log-groups \
  | jq '.logGroups[].logGroupName' \
  | xargs -L1 echo \
  | xargs -L2 -I % bash -c "echo % \$(aws logs describe-subscription-filters --log-group-name % | grep DD_LOG | cut -d '\"' -f4);" 2>/dev/null \
  | grep ' ' \
  | xargs -L1 printf 'aws logs delete-subscription-filter --log-group-name %s --filter-name %s\n' \
  | bash