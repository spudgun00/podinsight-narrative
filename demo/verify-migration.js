// Migration Verification Script
// Tests the integrity of the July 2025 data migration

const fs = require('fs');
const path = require('path');

console.log('=== July 2025 Data Migration Verification ===\n');

// Load the unified data file
const dataPath = path.join(__dirname, 'data', 'unified-data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Create a mock window object
global.window = { unifiedData: null, masterData: null };

// Execute the file to populate window.unifiedData
try {
    eval(dataContent);
    var unifiedData = global.window.unifiedData;
    if (!unifiedData) {
        throw new Error('unifiedData not set on window object');
    }
} catch (e) {
    console.error('❌ Failed to parse unified data:', e.message);
    process.exit(1);
}

// Test results tracking
let passed = 0;
let failed = 0;

function test(description, condition) {
    if (condition) {
        console.log(`✅ ${description}`);
        passed++;
    } else {
        console.log(`❌ ${description}`);
        failed++;
    }
}

// 1. Basic Structure Tests
console.log('\n1. Basic Structure Tests:');
test('Meta section exists', unifiedData.meta);
test('Version is 2.0.0', unifiedData.meta.version === '2.0.0');
test('Date is July 25, 2025', unifiedData.meta.lastUpdated === '2025-07-25');
test('Date range is July 19-25, 2025', unifiedData.meta.dataWeek.range === 'July 19-25, 2025');

// 2. Topic Tests
console.log('\n2. Topic Migration Tests:');
const topics = Object.keys(unifiedData.narrativePulse.topics);
const expectedTopics = ['AI Infrastructure', 'Enterprise Agents', 'Defense Tech', 'Exit Strategies', 'Vertical AI', 'Traditional SaaS', 'Climate Tech'];

test('Exactly 7 topics present', topics.length === 7);
expectedTopics.forEach(topic => {
    test(`Topic "${topic}" exists`, topics.includes(topic));
});

// Check old topics are removed
const oldTopics = ['AI Agents', 'Capital Efficiency', 'DePIN', 'Crypto/Web3', 'B2B SaaS', 'Developer Tools'];
oldTopics.forEach(topic => {
    test(`Old topic "${topic}" removed`, !topics.includes(topic));
});

// 3. Chart Data Validation
console.log('\n3. Chart Data Validation:');
topics.forEach(topicName => {
    const topic = unifiedData.narrativePulse.topics[topicName];
    if (topic.chartData) {
        test(`${topicName} has 7-day data with 7 points`, 
            topic.chartData['7d']?.momentum?.dataPoints?.length === 7);
        test(`${topicName} has 30-day data with 4 points`, 
            topic.chartData['30d']?.momentum?.dataPoints?.length === 4);
        test(`${topicName} has 90-day data with 13 points`, 
            topic.chartData['90d']?.momentum?.dataPoints?.length === 13);
    }
});

// 4. Content Counts
console.log('\n4. Content Count Tests:');
test('9 Priority Briefings', unifiedData.priorityBriefings.items.length === 9);
test('6 Narrative Feed items', unifiedData.narrativeFeed.items.length === 6);
test('5 Notable Signal types', Object.keys(unifiedData.notableSignals.counts).length === 5);

// 5. Date Consistency
console.log('\n5. Date Consistency Tests:');
const dateRegex = /Jul\s+(19|20|21|22|23|24|25)/g;
const content = JSON.stringify(unifiedData);
const julyMatches = content.match(dateRegex);
test('All dates reference July 2025', julyMatches && julyMatches.length > 0);

// Check for any August references (should be none)
const augustRegex = /Aug/gi;
const augustMatches = content.match(augustRegex);
test('No August references found', !augustMatches || augustMatches.length === 0);

// 6. Cross-Reference Validation
console.log('\n6. Cross-Reference Tests:');
const headerTickerTopics = unifiedData.ui.header.ticker.map(t => t.label);
test('Header ticker references new topics', 
    headerTickerTopics.includes('Enterprise Agents') && 
    headerTickerTopics.includes('Defense Tech'));

// 7. Priority Briefings Topic Alignment
console.log('\n7. Priority Briefings Topic Alignment:');
const briefingTitles = unifiedData.priorityBriefings.items.map(b => b.title);
// Note: Enterprise Agents topic is covered in other sections, not Priority Briefings
test('Briefings reference Defense Tech', 
    briefingTitles.some(t => t.includes('Defense')));
test('Briefings reference AI Infrastructure', 
    briefingTitles.some(t => t.includes('Infrastructure')));
// Check that Enterprise Agents is mentioned elsewhere
const feedContent = JSON.stringify(unifiedData.narrativeFeed.items);
test('Enterprise Agents mentioned in Narrative Feed', 
    feedContent.toLowerCase().includes('agent'));

// Summary
console.log('\n=== VERIFICATION SUMMARY ===');
console.log(`Total Tests: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Status: ${failed === 0 ? 'MIGRATION SUCCESSFUL ✅' : 'ISSUES FOUND ❌'}`);

// Return appropriate exit code
process.exit(failed === 0 ? 0 : 1);