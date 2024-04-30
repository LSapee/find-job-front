#!/bin/bash

# S3 버킷 이름과 CloudFront 배포 ID를 설정합니다.
S3_BUCKET=${{ secrets.AWS_S3_BUCKET }}
DISTRIBUTION_ID=${{ secrets.AWS_DISTRIBUTION_ID }}

# 빌드된 파일을 S3 버킷으로 업로드합니다.
aws s3 sync build/ s3://$S3_BUCKET/ --acl public-read

# CloudFront 캐시를 갱신합니다.
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "Deployment completed successfully."



