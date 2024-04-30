#!/bin/bash

# 빌드된 파일을 S3 버킷으로 업로드합니다.
aws s3 sync build/ s3://${{ secrets.AWS_S3_BUCKET }}/ --acl public-read

# CloudFront 캐시를 갱신합니다.
aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --paths "/*"

echo "Deployment completed successfully."



