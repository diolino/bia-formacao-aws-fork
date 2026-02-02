#!/bin/sh

# Solicita entradas do usuário
read -p "Informe a região de origem (ex: us-east-1): " SRC_REGION
read -p "Informe a região de destino (ex: us-west-2): " DST_REGION
read -p "Informe o repositório de origem: " SRC_REPO
read -p "Informe o repositório de destino: " DST_REPO
read -p "Informe a tag da imagem (ex: latest): " IMAGE_TAG
read -p "Informe o ID da conta AWS: " ACCOUNT_ID

# Login no ECR origem
aws ecr get-login-password --region $SRC_REGION | \
docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$SRC_REGION.amazonaws.com

# Login no ECR destino
aws ecr get-login-password --region $DST_REGION | \
docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$DST_REGION.amazonaws.com

# Pull da imagem da origem
docker pull $ACCOUNT_ID.dkr.ecr.$SRC_REGION.amazonaws.com/$SRC_REPO:$IMAGE_TAG

# Retag para destino
docker tag $ACCOUNT_ID.dkr.ecr.$SRC_REGION.amazonaws.com/$SRC_REPO:$IMAGE_TAG \
           $ACCOUNT_ID.dkr.ecr.$DST_REGION.amazonaws.com/$DST_REPO:$IMAGE_TAG

# Push para destino
docker push $ACCOUNT_ID.dkr.ecr.$DST_REGION.amazonaws.com/$DST_REPO:$IMAGE_TAG

echo "✅ Imagem $IMAGE_TAG copiada de $SRC_REGION/$SRC_REPO para $DST_REGION/$DST_REPO"
