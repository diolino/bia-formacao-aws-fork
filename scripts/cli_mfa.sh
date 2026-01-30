#!/bin/bash
MFA_ARN="arn:aws:iam::941377159222:mfa/tamadmin941377159222"
read -p "Digite o código MFA: " TOKEN

CREDS=$(aws sts get-session-token \
  --serial-number $MFA_ARN \
  --token-code $TOKEN \
  --duration-seconds 3600)

aws_access_key_id=$(echo $CREDS | jq -r '.Credentials.AccessKeyId')
aws_secret_access_key=$(echo $CREDS | jq -r '.Credentials.SecretAccessKey')
aws_session_token=$(echo $CREDS | jq -r '.Credentials.SessionToken')

aws configure set aws_access_key_id $aws_access_key_id --profile default
aws configure set aws_secret_access_key $aws_secret_access_key --profile default
aws configure set aws_session_token $aws_session_token --profile default

