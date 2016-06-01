'use strict';

let aws = require('aws-sdk');
let cp = require('child_process');
let fs = require('fs');
let iconv = require('iconv').Iconv;
let conv = new iconv('UTF-8', 'Shift_JIS');

const DOMAIN = '<your-subdomain>.cybozu.com';
const APP_ID = '<your-app-id>';
const API_TOKEN = '<your-api-token>';

let getRecords = function(callback) {
    return new Promise(function(resolve, reject) {
        cp.exec(
            'cp ./cli-kintone /tmp/; chmod 755 /tmp/cli-kintone;',
            function(error, stdout, stderr) {
                if (error) {
                    callback(error);
                } else {
                    let proc = cp.execFile(
                        '/tmp/cli-kintone',
                        [
                            '-d', DOMAIN,
                            '-a', APP_ID,
                            '-t', API_TOKEN,
                        ],
                        {},
                        function(error, stdout, stderr) {
                            if (error) {
                                callback(new Error("cli-kintone failed."));
                            }
                            //convert to sjis from utf8
                            resolve(conv.convert(stdout));
                        }
                    );
                }
            }
        );
    });
};

let uploadS3 = function(data) {
    return new Promise(function(resolve, reject) {
        aws.config.update({
            accessKeyId: '<your-access-key-id>',
            secretAccessKey: '<your-secret-access-key>'
        });
        
        let s3 = new aws.S3();
        let params = {
            Bucket: '<your-backet-name>',
            Key: '<your-filename>',
            ACL:'public-read',
            ContentType: 'text/csv; charset=Shift_JIS',
            Body: data
        };
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log('Err:\r\n' + err);
            } else {
                console.log('Success:\r\n' + JSON.stringify(data));
            }
            resolve();
        });
    });
};

exports.handler = function (event, context, callback) {
    getRecords(callback).then(uploadS3).then(function() {
        callback(null);
    });
};
