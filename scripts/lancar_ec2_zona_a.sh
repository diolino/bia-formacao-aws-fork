#Parâmetros para criação da instância EC2
vpc_id=$1
#vpc-0f615c3491c1ec286
subnet_id=$2
#subnet-0d67fed54556307a5
image_id=$3
#ami-0f3caa1cf4417e51b
security_group_id=$( aws ec2 describe-security-groups --filters Name=vpc-id,Values=$vpc_id Name=group-name,Values=bia-dev --query "SecurityGroups[0].GroupId" --output text 2>/dev/null)

if [ -z "$security_group_id" ]; then
    echo ">[ERRO] Security group bia-dev não foi criado na VPC $vpc_id"
    exit 1
fi

aws ec2 run-instances --image-id $image_id --count 1 --instance-type t3.micro \
--security-group-ids $security_group_id --subnet-id $subnet_id --associate-public-ip-address \
--block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":15,"VolumeType":"gp2"}}]' \
--tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=bia-dev}]' \
--iam-instance-profile Name=role-acesso-ssm --user-data file://user_data_ec2_zona_a.sh
