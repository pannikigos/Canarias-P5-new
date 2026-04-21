// Super prompt for IA 
const superPrompt = (input) => {
    // 1. Basic data
    const basicData = input.basicData;
    
    // 2. Open ended questions
    const openResponses = [input.question1, input.question2, input.question3, input.question4];
    
    // 3. JSON object structure for responses
    const jsonObject = {
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        field6: '',
        field7: '',
        field8: '',
        field9: '',
        field10: '',
        field11: '',
        field12: '',
        field13: '',
        field14: '',
        field15: '',
        field16: '',
        field17: '',
        field18: ''
    };
    
    // 4. Analysis and separation of responses into fields
    openResponses.forEach((response, index) => {
        // Analyze, expand, deduce and separate each response into target fields
        // Logic for analyzing the response should be implemented here
    });
    
    // 5. Include tables data with rows and columns
    jsonObject.tableData = [ 
        // Example structure for a table data representation
        { column1: 'Row1Col1', column2: 'Row1Col2' },
        { column1: 'Row2Col1', column2: 'Row2Col2' }
    ];
    
    return jsonObject;
};

// Example invocation of the superPrompt function
const result = superPrompt({
    basicData: 'exampleBasicData',
    question1: 'open response 1',
    question2: 'open response 2',
    question3: 'open response 3',
    question4: 'open response 4'
});
console.log(result);