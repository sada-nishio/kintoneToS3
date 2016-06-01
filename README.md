# kintoneToS3
Amazon Lambda 上で実行され kintone のレコードデータを CSV形式で S3 にアップロードするツール(Power BI 解析用)

##Usage
1. `$ git clone https://github.com/sada-nishio/kintoneToS3.git`
2. `$ npm install`
3. index.js の<>内を環境に合わせて編集する
4. `$ zip -r kintoneToS3.zip cli-kintone index.js node_modules/`
5. Lambdaにzipファイルをアップロードして実行する
