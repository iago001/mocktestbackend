const examCategoryFieldType = {
    title: 'required',
    description: 'required',
    icon: 'required'
};

function validateExamCategory(examCategory) {
    for (const field in examCategoryFieldType) {
        const type = examCategoryFieldType[field];
        if (!type) {
			delete examCategory[field];
        } else if (type === 'required' && !examCategory[field]) {
            return `${field} is required.`;
        }
    }
    return null;
}

module.exports.validateExamCategory = validateExamCategory;