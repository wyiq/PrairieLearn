const util = require('util');
const assert = require('chai').assert;
const { step } = require('mocha-steps');

const config = require('../lib/config');
const sqldb = require('@prairielearn/prairielib/sql-db');
const sqlLoader = require('@prairielearn/prairielib/sql-loader');
const sql = sqlLoader.loadSqlEquiv(__filename);

const helperServer = require('./helperServer');
const helperClient = require('./helperClient');

const getMGTableData = ($) => {
    const mgHeaders = {};
    const mgHeadersArr = [];
    $('#manualGradingQueueTable > thead > tr > th').each((i, elem) => {
        // console.log(elem.firstChild ? elem.firstChild.data : null);
        if (elem.firstChild) {
            mgHeaders[elem.firstChild ? elem.firstChild.data : null] = i;
        }
        mgHeadersArr.push(elem.firstChild ? elem.firstChild.data : null);
    });


    // Turn rows of data into arrays
    const tdRows = [];
    $('#manualGradingQueueTable > tbody > tr').each((i, row) => {
        const tdRow = row.children.filter(child => child.type == 'tag')
            .map(tdElem => $(tdElem).text().trim());
        tdRows.push(tdRow);
    });

    // Reassemble rows into testable structure {qid: {column: x}}
    const mgQids = [];
    tdRows.forEach(row => mgQids.push(row[mgHeaders.QID]))
    console.log(mgQids);

    const columnData = {};
    const tableJSON = {};

    tdRows.forEach(row => {
        row.forEach((val, i) => {
            console.log(val, i);
            return columnData[mgHeadersArr[i]] = val
        });
    });
    
    mgQids.forEach(qid => {
        tableJSON[qid] = {...columnData};
    });

    // var tableJSON = tableArr.reduce(function(acc, cur, i) {
    //     acc[i] = cur;
    //     return acc;
    //   }, {});

    return tableJSON;
    // console.log('mg', mgQids);
    // console.log(mgHeaders);

    // // Print the full HTML
    // console.log(`Site HTML: ${$.html()}\n\n`)

    // // Print some specific page content
    // console.log(`First h1 tag: ${$('h1').text()}`)
};

// helperClient.extractAndSaveCSRFToken(context, res.$, 'form');
describe('Manual grading', function() {
    this.timeout(60000);
    const siteUrl = `http://localhost:${config.serverPort}/pl`;
    const courseInstanceBaseUrl = `${siteUrl}/course_instance/1`;
    let assessmentUrl, assessmentManualGradingUrl, assessmentId;

    before('set up testing server', async () => {
        await util.promisify(helperServer.before().bind(this))();
        const results = await sqldb.queryOneRowAsync(sql.get_assessment_hw1, []);
        assessmentId = results.rows[0].id;
        assessmentUrl = `${courseInstanceBaseUrl}/instructor/assessment/${assessmentId}`;
        assessmentManualGradingUrl = `${assessmentUrl}/manual_grading`;
    });

    describe('Homework assessment: hw1-automaticTestSuite', () => {
        step('Load assessment and Manual Grading Queue table should exist with 0 default values', async () => {
            // want to go here and assert that all values are zero
            // http://localhost:3000/pl/course_instance/1/instructor/assessment/19/manual_grading
            const res = await helperClient.fetchCheerio(assessmentManualGradingUrl, {ignoreWhiteSpace: true});
            const mgQueueTable = res.$('#manualGradingQueueContainer');
            assert.isTrue(res.ok);
            assert.equal(mgQueueTable.text().trim(), 'Homework 1: Manual Grading Queue');

            const mgTableData = getMGTableData(res.$);
            assert(mgTableData.equal({}));
        });

        // step('Load assessment and Manual Grading Queue table should exist with 0 default values', async () => {
        //     // want to go here and assert that all values are zero
        //     // http://localhost:3000/pl/course_instance/1/instructor/assessment/19/manual_grading
        //     const res = await helperClient.fetchCheerio(assessmentManualGradingUrl, {ignoreWhiteSpace: true});
        //     const mgQueueTable = page.$('#manualGradingQueueTable')
        //     assert.isTrue(res.ok);
        //     assert.equal(mgQueueTable.text().trim(), 'Homework 1: Manual Grading Queue');
        //     const mgTable = loadTable();

        //     // res.$('.manualGradingQueueContainer');
        // });


    });

    describe('Exam assessment: to do', () => {

    });

});
